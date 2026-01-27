# 🐛 Debug Crash - Nexus Camera

## 🔍 Comment Débugger l'App

### Étape 1: Voir les Logs

```bash
# Connectez votre téléphone
adb devices

# Voir les logs en temps réel
adb logcat | grep -E "NexusCamera|AndroidRuntime"

# Ou filtrer seulement les erreurs
adb logcat *:E | grep NexusCamera

# Sauvegarder les logs dans un fichier
adb logcat -d > crash_log.txt
```

### Étape 2: Vérifier les Permissions

L'app demande ces permissions au lancement:
- ✅ `CAMERA`
- ✅ `WRITE_EXTERNAL_STORAGE`
- ✅ `RECORD_AUDIO`

**Si l'app crash au lancement:**
```bash
# Vérifier les permissions données
adb shell dumpsys package com.nexus.camera | grep permission

# Donner manuellement les permissions
adb shell pm grant com.nexus.camera android.permission.CAMERA
adb shell pm grant com.nexus.camera android.permission.WRITE_EXTERNAL_STORAGE
adb shell pm grant com.nexus.camera android.permission.RECORD_AUDIO
```

### Étape 3: Vérifier la Stack Trace

```bash
# Voir la dernière exception
adb logcat -d | grep -A 20 "FATAL EXCEPTION"

# Chercher NullPointerException
adb logcat -d | grep -A 10 "NullPointerException"

# Chercher CameraAccessException
adb logcat -d | grep -A 10 "CameraAccessException"
```

---

## 🔧 Corrections Appliquées

### ✅ 1. Gestion des Null Pointers
- Vérification de tous les views avant utilisation
- Vérification de `textureView`, `captureButton`, etc.

### ✅ 2. Background Thread
- Démarrage du background thread dans `onCreate()`
- Vérification que le thread existe avant utilisation
- Logs de debug ajoutés

### ✅ 3. Permissions
- Vérification des permissions avant d'ouvrir la caméra
- Messages d'erreur clairs
- Gestion des refus de permissions

### ✅ 4. Camera2 API
- Vérification de `CameraManager != null`
- Vérification de `StreamConfigurationMap != null`
- Try-catch sur toutes les opérations caméra
- Logs détaillés

### ✅ 5. Layout
- Layout simplifié avec tous les IDs corrects
- Pas de références manquantes
- Tous les drawables définis

---

## 🐛 Problèmes Courants et Solutions

### Crash au Lancement

**Symptôme:** L'app crash immédiatement

**Causes possibles:**
1. **Permissions refusées**
   ```bash
   # Solution: Donner permissions manuellement
   adb shell pm grant com.nexus.camera android.permission.CAMERA
   ```

2. **Layout resources manquants**
   ```bash
   # Vérifier dans les logs:
   adb logcat | grep "ResourceNotFoundException"

   # Solution: Rebuild
   ./gradlew clean assembleDebug
   ```

3. **API incompatible**
   ```bash
   # Vérifier la version Android
   adb shell getprop ro.build.version.sdk

   # Doit être >= 24 (Android 7.0)
   ```

### Crash à l'Ouverture de la Caméra

**Symptôme:** L'app démarre mais crash quand on ouvre la caméra

**Causes possibles:**
1. **Camera2 pas disponible**
   ```bash
   # Vérifier dans les logs:
   adb logcat -d | grep "CameraManager"

   # Solution: Tester sur un vrai téléphone (pas émulateur)
   ```

2. **Caméra déjà utilisée**
   ```bash
   # Fermer toutes les apps caméra
   adb shell am force-stop com.android.camera2

   # Redémarrer le téléphone
   adb reboot
   ```

3. **Permissions runtime**
   ```bash
   # L'app doit demander permissions au runtime
   # Si non, donner manuellement (voir Étape 2)
   ```

### Écran Noir

**Symptôme:** L'app s'ouvre mais écran reste noir

**Causes:**
1. **Preview pas initialisée**
   ```bash
   # Chercher dans les logs:
   adb logcat | grep "createCameraPreview"

   # Devrait afficher: "Preview created"
   ```

2. **TextureView pas prête**
   ```bash
   # Attendre 2-3 secondes
   # TextureView s'initialise de manière asynchrone
   ```

### Boutons Ne Répondent Pas

**Symptôme:** Interface affichée mais boutons ne font rien

**Solution:**
```bash
# Vérifier les logs quand on clique:
adb logcat | grep "onClick\|Button"

# Les listeners devraient être setup
# Chercher: "Listeners setup complete"
```

---

## 📋 Checklist de Debug

Avant de signaler un bug, vérifiez:

- [ ] **Permissions données** (`adb shell dumpsys package`)
- [ ] **Logs capturés** (`adb logcat -d > log.txt`)
- [ ] **Version Android >= 7.0** (`adb shell getprop ro.build.version.sdk`)
- [ ] **Testé sur vrai téléphone** (pas émulateur)
- [ ] **Rebuild propre** (`./gradlew clean assembleDebug`)
- [ ] **Caméra pas utilisée par autre app**
- [ ] **Espace disponible** (pour sauvegarder photos)

---

## 🔬 Logs de Debug Ajoutés

Dans le nouveau code, ces messages apparaissent:

```
D/NexusCamera: onCreate started
D/NexusCamera: Starting background thread
D/NexusCamera: Background thread started
D/NexusCamera: All views initialized successfully
D/NexusCamera: Listeners setup complete
D/NexusCamera: Permissions granted, setting up camera
D/NexusCamera: Opening camera...
D/NexusCamera: Camera ID: 0
D/NexusCamera: Image dimension: 1920x1080
D/NexusCamera: Camera open request sent
D/NexusCamera: Camera opened successfully
D/NexusCamera: Preview created
```

**Si un de ces messages manque, c'est là que ça plante!**

---

## 🚑 Actions Urgentes

### L'App Crash? Faites Ceci Immédiatement:

```bash
# 1. Capturer les logs
adb logcat -d > crash_$(date +%Y%m%d_%H%M%S).log

# 2. Chercher l'erreur
grep -A 20 "FATAL" crash_*.log

# 3. Désinstaller et réinstaller
adb uninstall com.nexus.camera
adb install app-debug.apk

# 4. Donner toutes les permissions
adb shell pm grant com.nexus.camera android.permission.CAMERA
adb shell pm grant com.nexus.camera android.permission.WRITE_EXTERNAL_STORAGE
adb shell pm grant com.nexus.camera android.permission.RECORD_AUDIO

# 5. Relancer
adb shell am start -n com.nexus.camera/.CameraActivity
```

---

## 📞 Informations à Fournir

Si le problème persiste, fournissez:

1. **Logs complets:**
   ```bash
   adb logcat -d > full_log.txt
   ```

2. **Info téléphone:**
   ```bash
   adb shell getprop | grep "ro.product\|ro.build.version"
   ```

3. **Permissions:**
   ```bash
   adb shell dumpsys package com.nexus.camera | grep permission
   ```

4. **Message d'erreur exact** de Android Studio

---

## ✅ Build Propre

Pour s'assurer que tout est à jour:

```bash
# 1. Nettoyer complètement
cd android-app
./gradlew clean

# 2. Supprimer les caches
rm -rf .gradle build app/build

# 3. Rebuilder
./gradlew assembleDebug

# 4. Désinstaller l'ancienne version
adb uninstall com.nexus.camera

# 5. Installer la nouvelle
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 🎯 Tests de Validation

Testez chaque fonction individuellement:

### Test 1: Lancement
```bash
adb shell am start -n com.nexus.camera/.CameraActivity
# Devrait ouvrir l'app sans crash
```

### Test 2: Permissions
```bash
# L'app devrait demander 3 permissions
# Acceptez toutes
```

### Test 3: Preview
```bash
# Après 2-3 secondes
# Preview caméra devrait apparaître
```

### Test 4: Capture
```bash
# Tapez le gros bouton blanc
# Photo devrait être sauvegardée
# Toast: "Photo saved: NEXUS_xxxxx.jpg"
```

### Test 5: Switch
```bash
# Tapez le bouton rotation
# Devrait basculer avant/arrière
```

---

**Si tous les tests passent, l'app fonctionne! 🎉**

**Si un test échoue, regardez les logs à cette étape précise.**
