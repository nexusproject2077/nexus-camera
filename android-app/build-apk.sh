#!/bin/bash

# ============================================
# Script de Build Automatique - Nexus Camera
# ============================================

echo "🚀 Build Automatique de Nexus Camera Android"
echo "============================================="
echo ""

# Vérifier si on est dans le bon dossier
if [ ! -f "settings.gradle" ]; then
    echo "❌ ERREUR: Ce script doit être exécuté depuis le dossier android-app/"
    echo "Usage: cd android-app && ./build-apk.sh"
    exit 1
fi

# Vérifier Gradle wrapper
if [ ! -f "gradlew" ]; then
    echo "⚠️  Gradle wrapper manquant, création..."
    gradle wrapper
fi

# Rendre gradlew exécutable
chmod +x gradlew

echo "📦 Nettoyage des anciens builds..."
./gradlew clean

echo ""
echo "🔨 Compilation de l'APK Debug..."
./gradlew assembleDebug

# Vérifier si la compilation a réussi
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ BUILD RÉUSSI!"
    echo ""
    echo "📱 APK créé:"
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

    if [ -f "$APK_PATH" ]; then
        ls -lh "$APK_PATH"
        echo ""
        echo "📍 Chemin complet:"
        readlink -f "$APK_PATH"
        echo ""

        # Calculer la taille
        SIZE=$(du -h "$APK_PATH" | cut -f1)
        echo "📊 Taille: $SIZE"
        echo ""

        # Vérifier si un téléphone est connecté
        if command -v adb &> /dev/null; then
            DEVICES=$(adb devices | grep -v "List" | grep "device$" | wc -l)
            if [ $DEVICES -gt 0 ]; then
                echo "📱 Téléphone Android détecté!"
                read -p "Installer maintenant? (o/n): " INSTALL
                if [ "$INSTALL" = "o" ] || [ "$INSTALL" = "O" ]; then
                    echo "📲 Installation en cours..."
                    adb install -r "$APK_PATH"
                    if [ $? -eq 0 ]; then
                        echo ""
                        echo "✅ APP INSTALLÉE!"
                        echo ""
                        read -p "Lancer l'app maintenant? (o/n): " LAUNCH
                        if [ "$LAUNCH" = "o" ] || [ "$LAUNCH" = "O" ]; then
                            adb shell am start -n com.nexus.camera/.MainActivity
                            echo "🚀 App lancée!"
                        fi
                    fi
                fi
            else
                echo "ℹ️  Aucun téléphone connecté"
                echo "   Pour installer: adb install $APK_PATH"
            fi
        fi

        echo ""
        echo "🎉 BUILD TERMINÉ!"
        echo ""
        echo "📋 Prochaines étapes:"
        echo "   1. Transférer l'APK sur votre téléphone"
        echo "   2. Activer 'Sources inconnues' dans les paramètres"
        echo "   3. Installer l'APK"
        echo ""
        echo "   OU avec ADB:"
        echo "   adb install $APK_PATH"

    else
        echo "❌ APK non trouvé à l'emplacement attendu"
        exit 1
    fi
else
    echo ""
    echo "❌ ERREUR DE COMPILATION"
    echo "Vérifiez les messages d'erreur ci-dessus"
    exit 1
fi
