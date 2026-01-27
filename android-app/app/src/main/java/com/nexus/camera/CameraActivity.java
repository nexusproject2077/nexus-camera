package com.nexus.camera;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.*;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.Image;
import android.media.ImageReader;
import android.media.MediaRecorder;
import android.os.Bundle;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class CameraActivity extends AppCompatActivity {

    private static final String TAG = "NexusCamera";
    private static final int PERMISSION_REQUEST_CODE = 100;

    // UI Elements
    private TextureView textureView;
    private ImageButton captureButton;
    private ImageButton switchCameraButton;
    private ImageButton flashButton;
    private ImageButton settingsButton;
    private TextView modeText;

    // Camera
    private CameraDevice cameraDevice;
    private CameraCaptureSession captureSession;
    private CaptureRequest.Builder captureRequestBuilder;
    private Size imageDimension;
    private ImageReader imageReader;
    private Handler backgroundHandler;
    private HandlerThread backgroundThread;

    // Camera state
    private String cameraId;
    private boolean isFrontCamera = false;
    private boolean isFlashOn = false;
    private int currentZoom = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Log.d(TAG, "onCreate started");

        try {
            setContentView(R.layout.activity_camera);

            // Start background thread first
            startBackgroundThread();

            initViews();
            setupListeners();

            if (checkPermissions()) {
                Log.d(TAG, "Permissions granted, setting up camera");
                setupCamera();
            } else {
                Log.d(TAG, "Requesting permissions");
                requestPermissions();
            }
        } catch (Exception e) {
            Log.e(TAG, "Error in onCreate", e);
            Toast.makeText(this, "Erreur d'initialisation: " + e.getMessage(), Toast.LENGTH_LONG).show();
            finish();
        }
    }

    private void initViews() {
        textureView = findViewById(R.id.texture_view);
        captureButton = findViewById(R.id.btn_capture);
        switchCameraButton = findViewById(R.id.btn_switch_camera);
        flashButton = findViewById(R.id.btn_flash);
        settingsButton = findViewById(R.id.btn_settings);
        modeText = findViewById(R.id.tv_mode);

        // Verify critical views
        if (textureView == null) {
            throw new RuntimeException("TextureView not found in layout");
        }
        if (captureButton == null) {
            throw new RuntimeException("Capture button not found in layout");
        }

        Log.d(TAG, "All views initialized successfully");
    }

    private void setupListeners() {
        captureButton.setOnClickListener(v -> takePicture());

        if (switchCameraButton != null) {
            switchCameraButton.setOnClickListener(v -> switchCamera());
        }

        if (flashButton != null) {
            flashButton.setOnClickListener(v -> toggleFlash());
        }

        if (settingsButton != null) {
            settingsButton.setOnClickListener(v -> openSettings());
        }

        textureView.setSurfaceTextureListener(textureListener);

        Log.d(TAG, "Listeners setup complete");
    }

    private final TextureView.SurfaceTextureListener textureListener = new TextureView.SurfaceTextureListener() {
        @Override
        public void onSurfaceTextureAvailable(SurfaceTexture surface, int width, int height) {
            openCamera();
        }

        @Override
        public void onSurfaceTextureSizeChanged(SurfaceTexture surface, int width, int height) {}

        @Override
        public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
            return false;
        }

        @Override
        public void onSurfaceTextureUpdated(SurfaceTexture surface) {}
    };

    private boolean checkPermissions() {
        return ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) == PackageManager.PERMISSION_GRANTED &&
               ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED &&
               ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestPermissions() {
        ActivityCompat.requestPermissions(this, new String[]{
            Manifest.permission.CAMERA,
            Manifest.permission.WRITE_EXTERNAL_STORAGE,
            Manifest.permission.RECORD_AUDIO
        }, PERMISSION_REQUEST_CODE);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == PERMISSION_REQUEST_CODE) {
            if (checkPermissions()) {
                setupCamera();
            } else {
                Toast.makeText(this, "Permissions requises pour utiliser la caméra", Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    private void setupCamera() {
        if (textureView.isAvailable()) {
            openCamera();
        }
    }

    @SuppressLint("MissingPermission")
    private void openCamera() {
        CameraManager manager = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
        if (manager == null) {
            Log.e(TAG, "CameraManager is null");
            runOnUiThread(() -> Toast.makeText(this, "Service caméra indisponible", Toast.LENGTH_SHORT).show());
            return;
        }

        try {
            Log.d(TAG, "Opening camera...");
            cameraId = getCameraId(manager);
            Log.d(TAG, "Camera ID: " + cameraId);

            CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);
            StreamConfigurationMap map = characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);

            if (map == null) {
                Log.e(TAG, "StreamConfigurationMap is null");
                return;
            }

            Size[] sizes = map.getOutputSizes(SurfaceTexture.class);
            if (sizes == null || sizes.length == 0) {
                Log.e(TAG, "No output sizes available");
                return;
            }

            imageDimension = sizes[0];
            Log.d(TAG, "Image dimension: " + imageDimension.getWidth() + "x" + imageDimension.getHeight());

            // ImageReader for capturing photos
            imageReader = ImageReader.newInstance(imageDimension.getWidth(), imageDimension.getHeight(),
                    ImageFormat.JPEG, 1);
            imageReader.setOnImageAvailableListener(onImageAvailableListener, backgroundHandler);

            manager.openCamera(cameraId, stateCallback, backgroundHandler);
            Log.d(TAG, "Camera open request sent");
        } catch (CameraAccessException e) {
            Log.e(TAG, "Camera access error", e);
            runOnUiThread(() -> Toast.makeText(this, "Erreur d'accès caméra: " + e.getMessage(), Toast.LENGTH_SHORT).show());
        } catch (SecurityException e) {
            Log.e(TAG, "Camera permission error", e);
            runOnUiThread(() -> Toast.makeText(this, "Permission caméra refusée", Toast.LENGTH_SHORT).show());
        }
    }

    private String getCameraId(CameraManager manager) throws CameraAccessException {
        String[] cameraIdList = manager.getCameraIdList();
        for (String id : cameraIdList) {
            CameraCharacteristics characteristics = manager.getCameraCharacteristics(id);
            Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
            if (isFrontCamera) {
                if (facing != null && facing == CameraCharacteristics.LENS_FACING_FRONT) {
                    return id;
                }
            } else {
                if (facing != null && facing == CameraCharacteristics.LENS_FACING_BACK) {
                    return id;
                }
            }
        }
        return cameraIdList[0];
    }

    private final CameraDevice.StateCallback stateCallback = new CameraDevice.StateCallback() {
        @Override
        public void onOpened(@NonNull CameraDevice camera) {
            cameraDevice = camera;
            createCameraPreview();
        }

        @Override
        public void onDisconnected(@NonNull CameraDevice camera) {
            cameraDevice.close();
        }

        @Override
        public void onError(@NonNull CameraDevice camera, int error) {
            cameraDevice.close();
            cameraDevice = null;
        }
    };

    private void createCameraPreview() {
        try {
            SurfaceTexture texture = textureView.getSurfaceTexture();
            assert texture != null;
            texture.setDefaultBufferSize(imageDimension.getWidth(), imageDimension.getHeight());
            Surface surface = new Surface(texture);

            captureRequestBuilder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
            captureRequestBuilder.addTarget(surface);

            cameraDevice.createCaptureSession(Arrays.asList(surface, imageReader.getSurface()),
                    new CameraCaptureSession.StateCallback() {
                        @Override
                        public void onConfigured(@NonNull CameraCaptureSession session) {
                            if (cameraDevice == null) return;
                            captureSession = session;
                            updatePreview();
                        }

                        @Override
                        public void onConfigureFailed(@NonNull CameraCaptureSession session) {
                            Toast.makeText(CameraActivity.this, "Configuration failed", Toast.LENGTH_SHORT).show();
                        }
                    }, null);
        } catch (CameraAccessException e) {
            Log.e(TAG, "Camera preview error", e);
        }
    }

    private void updatePreview() {
        if (cameraDevice == null) return;
        captureRequestBuilder.set(CaptureRequest.CONTROL_MODE, CameraMetadata.CONTROL_MODE_AUTO);

        // Apply flash setting
        if (isFlashOn) {
            captureRequestBuilder.set(CaptureRequest.FLASH_MODE, CameraMetadata.FLASH_MODE_TORCH);
        } else {
            captureRequestBuilder.set(CaptureRequest.FLASH_MODE, CameraMetadata.FLASH_MODE_OFF);
        }

        try {
            captureSession.setRepeatingRequest(captureRequestBuilder.build(), null, backgroundHandler);
        } catch (CameraAccessException e) {
            Log.e(TAG, "Update preview error", e);
        }
    }

    private void takePicture() {
        if (cameraDevice == null) return;
        try {
            CaptureRequest.Builder captureBuilder = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_STILL_CAPTURE);
            captureBuilder.addTarget(imageReader.getSurface());
            captureBuilder.set(CaptureRequest.CONTROL_MODE, CameraMetadata.CONTROL_MODE_AUTO);

            // Flash for capture
            if (isFlashOn) {
                captureBuilder.set(CaptureRequest.FLASH_MODE, CameraMetadata.FLASH_MODE_SINGLE);
            }

            captureSession.capture(captureBuilder.build(), null, backgroundHandler);
        } catch (CameraAccessException e) {
            Log.e(TAG, "Capture error", e);
        }
    }

    private final ImageReader.OnImageAvailableListener onImageAvailableListener = new ImageReader.OnImageAvailableListener() {
        @Override
        public void onImageAvailable(ImageReader reader) {
            Image image = null;
            try {
                image = reader.acquireLatestImage();
                ByteBuffer buffer = image.getPlanes()[0].getBuffer();
                byte[] bytes = new byte[buffer.capacity()];
                buffer.get(bytes);
                saveImage(bytes);
            } finally {
                if (image != null) {
                    image.close();
                }
            }
        }
    };

    private void saveImage(byte[] bytes) {
        try {
            File picturesDir = new File(getExternalFilesDir(null), "NexusCamera");
            if (!picturesDir.exists()) {
                picturesDir.mkdirs();
            }

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(new Date());
            File file = new File(picturesDir, "NEXUS_" + timestamp + ".jpg");

            FileOutputStream output = new FileOutputStream(file);
            output.write(bytes);
            output.close();

            runOnUiThread(() -> Toast.makeText(CameraActivity.this, "Photo saved: " + file.getName(), Toast.LENGTH_SHORT).show());
        } catch (IOException e) {
            Log.e(TAG, "Save image error", e);
        }
    }

    private void switchCamera() {
        closeCamera();
        isFrontCamera = !isFrontCamera;
        openCamera();
    }

    private void toggleFlash() {
        isFlashOn = !isFlashOn;
        if (flashButton != null) {
            flashButton.setAlpha(isFlashOn ? 1.0f : 0.5f);
        }
        updatePreview();
        Log.d(TAG, "Flash " + (isFlashOn ? "ON" : "OFF"));
    }

    private void openSettings() {
        // TODO: Implement settings
        Toast.makeText(this, "Paramètres (à venir)", Toast.LENGTH_SHORT).show();
    }

    private void closeCamera() {
        if (captureSession != null) {
            captureSession.close();
            captureSession = null;
        }
        if (cameraDevice != null) {
            cameraDevice.close();
            cameraDevice = null;
        }
        if (imageReader != null) {
            imageReader.close();
            imageReader = null;
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        Log.d(TAG, "onResume");

        // Make sure background thread is running
        if (backgroundThread == null) {
            startBackgroundThread();
        }

        // Only open camera if we have permissions
        if (checkPermissions()) {
            if (textureView != null && textureView.isAvailable()) {
                openCamera();
            } else if (textureView != null) {
                textureView.setSurfaceTextureListener(textureListener);
            }
        }
    }

    @Override
    protected void onPause() {
        closeCamera();
        stopBackgroundThread();
        super.onPause();
    }

    private void startBackgroundThread() {
        try {
            if (backgroundThread == null || !backgroundThread.isAlive()) {
                Log.d(TAG, "Starting background thread");
                backgroundThread = new HandlerThread("Camera Background");
                backgroundThread.start();
                backgroundHandler = new Handler(backgroundThread.getLooper());
                Log.d(TAG, "Background thread started");
            }
        } catch (Exception e) {
            Log.e(TAG, "Error starting background thread", e);
        }
    }

    private void stopBackgroundThread() {
        if (backgroundThread != null) {
            backgroundThread.quitSafely();
            try {
                backgroundThread.join();
                backgroundThread = null;
                backgroundHandler = null;
            } catch (InterruptedException e) {
                Log.e(TAG, "Background thread error", e);
            }
        }
    }
}
