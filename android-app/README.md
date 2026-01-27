# 📱 Nexus Camera - Application Android

Application Android native qui enveloppe la PWA Nexus Camera dans une WebView.

## 🚀 Installation et Configuration

### Prérequis
1. **Android Studio** (dernière version)
   - Télécharger: https://developer.android.com/studio
2. **JDK 8+** (inclus avec Android Studio)
3. **Android SDK** (API 24+)

### Étapes d'Installation

#### 1. Ouvrir le Projet dans Android Studio
```bash
# 1. Lancez Android Studio
# 2. File → Open
# 3. Sélectionnez le dossier: /home/user/nexus-camera/android-app
# 4. Attendez que Gradle se synchronise (peut prendre 5-10 minutes)
```

#### 2. Configuration du SDK
1. **Tools → SDK Manager**
2. Cochez:
   - Android 14.0 (API 34)
   - Android SDK Build-Tools 34
   - Android SDK Platform-Tools
3. Cliquez **Apply** et attendez le téléchargement

#### 3. Synchroniser Gradle
```bash
# Dans Android Studio:
File → Sync Project with Gradle Files
```

#### 4. Connecter un Appareil

**Option A: Téléphone physique**
1. Activez **Mode Développeur** sur votre téléphone:
   - Paramètres → À propos → Appuyez 7× sur "Numéro de build"
2. Activez **Débogage USB**:
   - Paramètres → Options de développement → Débogage USB
3. Connectez via USB
4. Autorisez le débogage sur le téléphone

**Option B: Émulateur**
1. **Tools → Device Manager**
2. **Create Device**
3. Sélectionnez un appareil (ex: Pixel 6)
4. Sélectionnez une image système (ex: Android 14, API 34)
5. Cliquez **Finish**
6. Lancez l'émulateur avec ▶️

#### 5. Compiler et Installer
```bash
# Dans Android Studio:
Run → Run 'app' (Shift+F10)

# OU en ligne de commande:
cd /home/user/nexus-camera/android-app
./gradlew assembleDebug

# Le fichier APK sera dans:
# app/build/outputs/apk/debug/app-debug.apk
```

---

## 📦 Structure du Projet

```
android-app/
├── app/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/nexus/camera/
│   │       │   └── MainActivity.java       # Activité principale
│   │       ├── res/
│   │       │   ├── layout/
│   │       │   │   └── activity_main.xml   # Layout WebView
│   │       │   ├── values/
│   │       │   │   ├── strings.xml         # Nom de l'app
│   │       │   │   ├── colors.xml          # Couleurs (#00f3ff)
│   │       │   │   └── styles.xml          # Thème
│   │       │   ├── drawable/
│   │       │   │   ├── ic_launcher.xml     # Icône app
│   │       │   │   └── ic_launcher_round.xml
│   │       │   └── xml/
│   │       │       └── file_paths.xml      # FileProvider
│   │       ├── assets/                      # Fichiers web (PWA)
│   │       │   ├── index.html
│   │       │   ├── styles.css
│   │       │   ├── app.js
│   │       │   ├── manifest.json
│   │       │   ├── sw.js
│   │       │   ├── icon-192.svg
│   │       │   └── icon-512.svg
│   │       └── AndroidManifest.xml          # Permissions, activités
│   ├── build.gradle                         # Config app
│   └── proguard-rules.pro                   # Règles ProGuard
├── build.gradle                             # Config projet
├── settings.gradle                          # Modules
└── gradle.properties                        # Propriétés Gradle
```

---

## ⚙️ Configuration

### Permissions (AndroidManifest.xml)
L'app demande automatiquement:
- ✅ **CAMERA** - Accès caméra avant/arrière
- ✅ **RECORD_AUDIO** - Enregistrement audio/vidéo
- ✅ **INTERNET** - Chargement des ressources
- ✅ **WRITE_EXTERNAL_STORAGE** - Sauvegarde photos/vidéos
- ✅ **READ_EXTERNAL_STORAGE** - Lecture galerie

### Fonctionnalités WebView
- ✅ **JavaScript activé**
- ✅ **DOM Storage** (localStorage)
- ✅ **App Cache** pour offline
- ✅ **Accélération matérielle**
- ✅ **Permissions caméra/micro** via WebChromeClient
- ✅ **File access** pour assets

---

## 🔨 Commandes Gradle Utiles

```bash
# Build debug APK
./gradlew assembleDebug

# Build release APK (signé)
./gradlew assembleRelease

# Installer sur l'appareil connecté
./gradlew installDebug

# Nettoyer le build
./gradlew clean

# Lister toutes les tâches
./gradlew tasks

# Build avec logs
./gradlew assembleDebug --info
```

---

## 📝 Versions

- **minSdk**: 24 (Android 7.0+)
- **targetSdk**: 34 (Android 14)
- **versionCode**: 1
- **versionName**: 1.0

---

## 🐛 Dépannage

### Erreur: "SDK location not found"
```bash
# Créez local.properties:
echo "sdk.dir=/path/to/Android/Sdk" > local.properties
# Exemple Linux: sdk.dir=/home/user/Android/Sdk
# Exemple Windows: sdk.dir=C\:\\Users\\Username\\AppData\\Local\\Android\\Sdk
```

### Erreur: "Gradle sync failed"
1. **File → Invalidate Caches → Invalidate and Restart**
2. Supprimez `.gradle/` et `.idea/`
3. Re-synchronisez

### Caméra ne s'affiche pas
1. Vérifiez les permissions dans les paramètres Android
2. Testez sur un appareil physique (émulateur peut ne pas avoir de caméra)
3. Vérifiez les logs: **Logcat** (Alt+6)

### APK crash au lancement
```bash
# Vérifiez les logs:
adb logcat | grep NexusCamera
```

---

## 🚀 Publication sur Google Play

### 1. Générer une clé de signature
```bash
keytool -genkey -v -keystore nexus-camera.keystore \
  -alias nexus -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Configurer signing dans `app/build.gradle`
```gradle
android {
    signingConfigs {
        release {
            storeFile file("../nexus-camera.keystore")
            storePassword "votre_password"
            keyAlias "nexus"
            keyPassword "votre_password"
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Générer APK/AAB signé
```bash
# APK Release
./gradlew assembleRelease

# Android App Bundle (recommandé pour Play Store)
./gradlew bundleRelease
```

### 4. Tester le Release
```bash
adb install app/build/outputs/apk/release/app-release.apk
```

---

## 📱 Test sur Appareil Physique

### Via USB
```bash
# 1. Connectez le téléphone en USB
# 2. Vérifiez la connexion
adb devices

# 3. Installez l'APK
adb install app/build/outputs/apk/debug/app-debug.apk

# 4. Lancez l'app
adb shell am start -n com.nexus.camera/.MainActivity

# 5. Voir les logs en temps réel
adb logcat | grep -E "NexusCamera|WebView"
```

### Via WiFi (sans câble)
```bash
# 1. Connectez d'abord par USB
adb tcpip 5555

# 2. Trouvez l'IP du téléphone (Paramètres → À propos → État)
# 3. Connectez via WiFi
adb connect 192.168.x.x:5555

# 4. Débranchez l'USB
# 5. L'ADB fonctionne maintenant en WiFi!
```

---

## 🎨 Personnalisation

### Changer l'icône de l'app
1. Remplacez `res/drawable/ic_launcher.xml`
2. Ou ajoutez des PNG dans `res/mipmap-*/ic_launcher.png`

### Changer le nom de l'app
```xml
<!-- res/values/strings.xml -->
<string name="app_name">Votre Nom</string>
```

### Changer les couleurs
```xml
<!-- res/values/colors.xml -->
<color name="colorPrimary">#00f3ff</color>
```

### Modifier la WebView (MainActivity.java)
```java
// Ajouter des fonctionnalités:
- JavaScript interfaces
- Custom WebViewClient
- Gestion des téléchargements
- Partage natif
```

---

## 📊 Taille de l'APK

- **Debug APK**: ~2-3 MB
- **Release APK (minifié)**: ~1-2 MB
- **AAB (App Bundle)**: ~1 MB

---

## ✨ Prochaines Améliorations

- [ ] Ajouter une interface JavaScript native pour de meilleures performances caméra
- [ ] Implémenter Camera2 API native pour contrôles avancés
- [ ] Ajouter partage natif Android
- [ ] Notifications pour enregistrement vidéo en arrière-plan
- [ ] Widget écran d'accueil
- [ ] Shortcuts API Android
- [ ] Support tablettes avec layout adaptatif

---

## 📄 Licence

Même licence que le projet Nexus Camera principal.

**Bon développement! 🚀📱**
