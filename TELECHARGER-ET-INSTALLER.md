# 📥 TÉLÉCHARGER ET INSTALLER - NEXUS CAMERA ANDROID

## 🎯 Vous avez 3 OPTIONS

---

## ✅ OPTION 1: Télécharger le Projet Complet (RECOMMANDÉ)

### 📦 Fichier à Télécharger
Le projet Android complet est dans:
```
/home/user/nexus-camera/nexus-camera-android-project.zip
```

**Taille**: ~1-2 MB (projet complet)

### 📥 Comment Télécharger

#### Méthode A: Depuis ce répertoire
```bash
# Si vous êtes sur la machine où le projet est
cp /home/user/nexus-camera/nexus-camera-android-project.zip ~/Downloads/

# Ou directement ouvrir le dossier
nautilus /home/user/nexus-camera/
```

#### Méthode B: Via Git
```bash
# Cloner le repo
git clone <votre-repo-url>
cd nexus-camera

# Le dossier android-app/ contient tout
```

#### Méthode C: Téléchargement Web
Si vous avez push sur GitHub:
1. Allez sur votre repo GitHub
2. Téléchargez le ZIP du repo
3. Ou naviguez vers le dossier `android-app/`

---

## 🚀 OPTION 2: Ouvrir dans Android Studio (SIMPLE)

### 📋 Étapes:

1. **Installez Android Studio**
   - Télécharger: https://developer.android.com/studio
   - Version recommandée: Latest Stable

2. **Décompressez le projet**
   ```bash
   unzip nexus-camera-android-project.zip
   cd android-app/
   ```

3. **Ouvrir dans Android Studio**
   ```
   Android Studio → File → Open
   Sélectionnez: android-app/
   ```

4. **Attendez Gradle Sync** (5-10 minutes la première fois)
   - Android Studio télécharge automatiquement toutes les dépendances
   - Vous verrez la progression en bas

5. **Connectez votre téléphone**
   - Branchez en USB
   - Activez le Mode Développeur:
     - Paramètres → À propos → Appuyez 7× sur "Numéro de build"
   - Activez Débogage USB:
     - Paramètres → Options pour développeurs → Débogage USB

6. **Lancez l'app**
   - Cliquez sur ▶️ (Run) en haut
   - Sélectionnez votre appareil
   - **L'app s'installe automatiquement!**

---

## 🔨 OPTION 3: Compiler l'APK (AVANCÉ)

### 📋 Prérequis
```bash
# Installez Java JDK 8+
java -version

# Ou installez:
sudo apt install openjdk-17-jdk  # Linux
# Ou téléchargez depuis: https://www.oracle.com/java/technologies/downloads/
```

### 🛠️ Compilation Automatique

```bash
# 1. Décompressez le projet
unzip nexus-camera-android-project.zip
cd android-app/

# 2. Lancez le script de build
./build-apk.sh

# 3. Attendez la compilation (2-5 minutes)

# 4. L'APK sera créé dans:
# app/build/outputs/apk/debug/app-debug.apk
```

### 🛠️ Compilation Manuelle

```bash
cd android-app/

# Option A: Si vous avez Gradle installé
gradle wrapper  # Génère gradlew
chmod +x gradlew
./gradlew assembleDebug

# Option B: Si vous avez Android Studio
# Le Gradle wrapper est déjà inclus
./gradlew assembleDebug

# Option C: Build complet
./gradlew clean assembleDebug

# APK final:
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

---

## 📱 INSTALLER L'APK SUR VOTRE TÉLÉPHONE

### Méthode 1: Via USB (ADB)

```bash
# 1. Vérifiez que le téléphone est connecté
adb devices

# 2. Installez l'APK
adb install app/build/outputs/apk/debug/app-debug.apk

# 3. Lancez l'app
adb shell am start -n com.nexus.camera/.MainActivity
```

### Méthode 2: Transfert Direct

```bash
# 1. Transférez l'APK sur le téléphone
adb push app/build/outputs/apk/debug/app-debug.apk /sdcard/Download/

# 2. Sur le téléphone:
# - Ouvrez "Fichiers" ou "Mes fichiers"
# - Allez dans "Téléchargements"
# - Tapez sur "app-debug.apk"
# - Autorisez l'installation depuis cette source
# - Installez
```

### Méthode 3: Sans Câble

```bash
# 1. Envoyez-vous l'APK par email ou cloud
# 2. Sur le téléphone, téléchargez l'APK
# 3. Tapez sur le fichier téléchargé
# 4. Autorisez "Sources inconnues" si demandé
# 5. Installez
```

---

## 🗂️ STRUCTURE DES FICHIERS

```
nexus-camera/
├── 📦 nexus-camera-android-project.zip  ← TÉLÉCHARGEZ CE FICHIER!
├── 📦 nexus-camera-android-project.tar.gz (alternative)
│
└── android-app/                         ← OU CE DOSSIER
    ├── 📄 build-apk.sh                  ← Script de build auto
    ├── 📄 README.md                     ← Guide complet
    ├── 📄 QUICK_START.md                ← Démarrage rapide
    ├── ⚙️ build.gradle
    ├── ⚙️ settings.gradle
    ├── ⚙️ gradle.properties
    │
    └── app/
        ├── 📄 build.gradle
        ├── 📂 src/main/
        │   ├── AndroidManifest.xml
        │   ├── java/com/nexus/camera/
        │   │   └── MainActivity.java
        │   ├── res/
        │   │   ├── layout/
        │   │   ├── values/
        │   │   ├── drawable/
        │   │   └── xml/
        │   └── assets/               ← VOTRE PWA
        │       ├── index.html
        │       ├── styles.css
        │       ├── app.js
        │       └── ...
        └── build/
            └── outputs/apk/debug/
                └── app-debug.apk     ← APK FINAL ICI!
```

---

## 🎯 RÉCAPITULATIF RAPIDE

### Pour Débutants (Android Studio):
```
1. Télécharger Android Studio
2. Ouvrir android-app/ dans Android Studio
3. Cliquer Run ▶️
✅ C'est tout!
```

### Pour Avancés (Ligne de commande):
```bash
cd android-app/
./build-apk.sh
adb install app/build/outputs/apk/debug/app-debug.apk
✅ App installée!
```

### Pour Test Rapide:
```bash
# Si APK déjà compilé:
adb install app-debug.apk
✅ Installé en 5 secondes!
```

---

## 🐛 PROBLÈMES COURANTS

### "Gradle sync failed"
```bash
# Solution 1: Créer local.properties
echo "sdk.dir=/home/user/Android/Sdk" > local.properties

# Solution 2: Régénérer gradle wrapper
gradle wrapper

# Solution 3: Nettoyer
./gradlew clean
```

### "adb: command not found"
```bash
# Linux/Mac:
sudo apt install android-tools-adb  # Ubuntu
brew install android-platform-tools  # Mac

# Windows: Installer Android Studio qui inclut ADB
```

### "Permission denied"
```bash
# Rendre les scripts exécutables:
chmod +x build-apk.sh
chmod +x gradlew
```

### APK ne s'installe pas
```
1. Activez "Sources inconnues":
   Paramètres → Sécurité → Sources inconnues

2. Ou pour Android 8+:
   Paramètres → Apps → Accès spécial →
   Installer apps inconnues → [Votre navigateur] → Autoriser
```

---

## 📊 TAILLES DE FICHIERS

| Fichier | Taille |
|---------|--------|
| nexus-camera-android-project.zip | ~1-2 MB |
| app-debug.apk | ~2-3 MB |
| app-release.apk (minifié) | ~1-2 MB |

---

## 🔗 LIENS UTILES

- **Android Studio**: https://developer.android.com/studio
- **ADB Setup**: https://developer.android.com/studio/command-line/adb
- **Java JDK**: https://www.oracle.com/java/technologies/downloads/
- **Gradle**: https://gradle.org/install/

---

## 📞 SUPPORT

Si vous avez des problèmes:

1. **Lisez README.md** dans android-app/
2. **Vérifiez QUICK_START.md** pour démarrage rapide
3. **Consultez les logs**:
   ```bash
   ./gradlew assembleDebug --info
   adb logcat | grep NexusCamera
   ```

---

## ✅ CHECKLIST AVANT DE COMMENCER

- [ ] Android Studio installé (OU Java JDK pour ligne de commande)
- [ ] Téléphone Android avec USB debugging activé
- [ ] Câble USB fonctionnel
- [ ] Fichier nexus-camera-android-project.zip téléchargé
- [ ] Espace disque: ~2 GB libre (pour Android SDK)
- [ ] Connexion internet (pour télécharger dépendances Gradle)

---

## 🎉 C'EST PARTI!

**Méthode Simple**: Ouvrez dans Android Studio → Cliquez Run
**Méthode Rapide**: `./build-apk.sh` → `adb install app-debug.apk`

**🚀 Votre app Nexus Camera sera installée en quelques minutes!**
