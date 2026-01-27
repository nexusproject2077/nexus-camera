# 🚀 Démarrage Rapide - 5 Minutes

## Méthode 1: Android Studio (Recommandé)

### Étape 1: Installer Android Studio
Télécharger: https://developer.android.com/studio

### Étape 2: Ouvrir le Projet
```
1. Lancez Android Studio
2. File → Open
3. Sélectionnez le dossier: android-app/
4. Attendez Gradle sync (5-10 min)
```

### Étape 3: Lancer l'App
```
1. Connectez votre téléphone Android en USB
   OU
   Créez un émulateur (Tools → Device Manager → Create Device)

2. Cliquez sur le bouton ▶️ (Run)
3. Sélectionnez votre appareil
4. L'app s'installe et se lance automatiquement!
```

✅ **C'est tout! L'app tourne!**

---

## Méthode 2: Ligne de Commande (Avancé)

### Prérequis
```bash
# 1. Installez Android SDK
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools

# 2. Vérifiez
android --version
adb version
```

### Build & Install
```bash
cd android-app

# Build Debug APK
./gradlew assembleDebug

# L'APK est ici:
ls -lh app/build/outputs/apk/debug/app-debug.apk

# Installer sur téléphone connecté
adb install app/build/outputs/apk/debug/app-debug.apk

# Lancer
adb shell am start -n com.nexus.camera/.MainActivity
```

---

## Méthode 3: APK Direct (Sans Build)

Si vous avez déjà l'APK compilé:

```bash
# 1. Activez "Sources inconnues" sur votre Android
# 2. Transférez l'APK sur le téléphone
adb push app-debug.apk /sdcard/Download/

# 3. Installez depuis Fichiers
# Ou directement:
adb install app-debug.apk
```

---

## 🐛 Problèmes Courants

### "No devices found"
```bash
# Vérifiez la connexion USB:
adb devices

# Si vide, vérifiez:
# 1. Mode Développeur activé sur le téléphone
# 2. Débogage USB activé
# 3. Autorisez le débogage (popup sur le téléphone)
```

### "Gradle sync failed"
```bash
# Dans Android Studio:
File → Invalidate Caches → Invalidate and Restart
```

### Caméra ne marche pas
```bash
# 1. Donnez les permissions dans Paramètres Android
# 2. Testez sur un vrai téléphone (pas émulateur)
```

---

## 📱 Première Utilisation

1. **Lancez l'app** - L'icône cyan apparaît
2. **Autorisez caméra/micro** - Popup de permissions
3. **Testez les modes**:
   - Cliquez MODE en bas
   - Essayez PHOTO, VIDÉO, PRO
4. **Testez le zoom** - Boutons 0.5×, 1×, 2×, 3×
5. **Ouvrez le panneau** - Icône 🎨 pour filtres

**Ça marche! 🎉**

---

## 🔥 Tips

- **Mode PRO**: Les meilleurs contrôles (ISO, Balance blancs, Focus)
- **Zoom 3×**: Pour portraits
- **Filtre Cyberpunk**: Effet cyan/magenta stylé
- **Style Vibrant**: Couleurs saturées +30%

---

**Questions? Voir README.md complet**
