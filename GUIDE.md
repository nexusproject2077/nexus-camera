# 📸 Nexus Camera - Guide d'Utilisation

## 🚀 Démarrage Rapide

### Installation
1. Ouvrez `index.html` dans un navigateur moderne (Chrome, Firefox, Safari, Edge)
2. **Important**: Pour la PWA, utilisez HTTPS ou `localhost` (ex: `python3 -m http.server 8000`)
3. Autorisez l'accès à la caméra quand demandé

### Installation PWA
Pour installer comme application:
1. Sur **Chrome/Edge**: Cliquez sur l'icône d'installation dans la barre d'adresse
2. Sur **iOS Safari**: Partager → Ajouter à l'écran d'accueil
3. Sur **Android**: Menu → Installer l'application

---

## 🎮 Fonctionnalités

### 📷 Modes de Capture
Sélectionnez un mode en bas de l'écran:
- **PHOTO** - Capture photo standard
- **VIDÉO** - Enregistrement vidéo
- **PORTRAIT** - Mode portrait (effet bokeh simulé)
- **NUIT** - Mode nuit (exposition augmentée)
- **PRO** - Contrôles manuels complets (ISO, balance des blancs, focus)
- **TIME-LAPSE** - Vidéo accélérée
- **SLO-MO** - Ralenti
- **SINGLE TAKE** - Capture multiple automatique

### 🎨 Filtres Créatifs
**8 filtres disponibles** (panneau latéral):
- **Vintage** - Effet rétro chaud
- **Cyberpunk** - Tons cyan/magenta
- **Vaporwave** - Tons pastel
- **Noir** - Noir et blanc
- **Glitch** - Effet de distorsion
- **Neon** - Contours néon lumineux
- **Thermal** - Vision thermique simulée

### 📐 Styles Photographiques (iOS 18)
**6 styles** inspirés d'iOS 18:
- **Standard** - Rendu neutre
- **Vibrant** - Couleurs saturées (+30%)
- **Chaleureux** - Tons chauds (rouge/orange)
- **Froid** - Tons froids (bleu/cyan)
- **Dramatique** - Contraste élevé
- **Naturel** - Tons naturels doux

### 🔍 Zoom
**4 niveaux de zoom** (en bas de l'écran):
- **0.5×** - Grand angle
- **1×** - Normal
- **2×** - Téléobjectif
- **3×** - Super téléobjectif

Le zoom s'applique via CSS transform pour un effet immédiat.

### ⚙️ Mode PRO (Samsung One UI 8)
Activez le mode **PRO** pour accéder aux contrôles manuels:

#### ISO (100-3200)
- **100-200** - Faible lumière, moins de bruit
- **400** - Valeur par défaut équilibrée
- **800-1600** - Environnements sombres
- **3200** - Très sombre (plus de bruit)

#### Balance des Blancs
- **Auto** - Automatique
- **Daylight** (5500K) - Lumière du jour
- **Cloudy** (6500K) - Nuageux
- **Tungsten** (3200K) - Éclairage incandescent
- **Fluorescent** (4000K) - Néon
- **Shade** (7500K) - Ombre

#### Focus (0-100)
- **50** - Auto focus
- **< 50** - Focus proche (floute l'arrière-plan)
- **> 50** - Focus lointain (floute le premier plan)

#### Presets Pro
- **Sauvegarder** - Enregistre vos réglages actuels
- **Charger** - Restaure le dernier preset sauvegardé

### 🎚️ Contrôles Manuels
Dans le panneau latéral:
- **Luminosité** (-100 à +100)
- **Contraste** (0 à 200%)
- **Saturation** (0 à 200%)
- **Netteté** (0 à 10)
- **Flou** (0 à 10px)
- **Vignette** (0 à 100%)

### ☀️ Contrôle d'Exposition (iOS)
Cliquez sur l'écran pour afficher le curseur d'exposition:
- **-2.0 à +2.0 EV** - Ajuste l'exposition générale
- Disparaît automatiquement après 5 secondes

---

## 🎯 Contrôles

### Boutons Principaux
- **🔘 Bouton Capture** (centre) - Prendre photo/démarrer vidéo
- **🔄 Changer caméra** - Bascule avant/arrière
- **⚡ Flash** - Active/désactive le flash
- **⏱️ Timer** - 0s/3s/10s avant capture
- **🎨 Effets** - Ouvre le panneau latéral
- **🔳 Grille** - Affiche la grille de composition
- **📊 Histogramme** - Affiche l'histogramme RGB
- **🖼️ Galerie** - Ouvre la galerie de photos/vidéos
- **⚙️ Paramètres** - Configure l'application

### Raccourcis Tactiles
- **Double tap** - Ouvre/ferme le panneau latéral
- **Swipe droite** - Ferme le panneau latéral
- **Swipe bas** - Ferme les modales
- **Pinch-to-zoom** - Zoom gestuel (à venir)

---

## 📱 Optimisations

### Mobile
- **30 FPS** - Frame rate optimisé pour économiser la batterie
- **Résolution 1280×720** - Qualité/performance équilibrée
- **Contrôles tactiles** - Interface optimisée pour le toucher
- **Boutons flottants** - Flash/Timer/Caméra en haut à droite

### PC
- **60 FPS** - Fluidité maximale
- **Résolution 1920×1080** - Qualité maximale
- **Contrôles complets** - Tous les réglages accessibles
- **Hover effects** - Retours visuels au survol

---

## 🔧 Dépannage

### La caméra ne démarre pas
- Vérifiez les permissions de caméra dans le navigateur
- Assurez-vous d'utiliser HTTPS ou localhost
- Redémarrez le navigateur

### L'installation PWA ne fonctionne pas
- Vérifiez que vous utilisez HTTPS ou localhost
- Videz le cache du navigateur (Ctrl+Shift+Del)
- Réinstallezle service worker

### Les boutons ne réagissent pas
- Ouvrez la console (F12) pour voir les erreurs
- Rechargez la page (F5)
- Vérifiez que JavaScript est activé

### Les effets ne sont pas visibles
- Certains effets sont subtils (essayez plusieurs)
- En mode PRO, ajustez ISO/WB pour voir des changements
- Les styles photographiques fonctionnent mieux avec de bonnes conditions d'éclairage

---

## 💾 Stockage

- **Galerie** - Photos/vidéos stockées dans localStorage
- **Presets Pro** - Sauvegardés localement
- **Paramètres** - Persistants entre les sessions

**Note**: localStorage a une limite (~5-10MB). Les vidéos longues peuvent ne pas être sauvegardées.

---

## 🌟 Astuces

1. **Mode Portrait** - Fonctionne mieux avec un sujet net à 1-2m
2. **Mode Nuit** - Gardez la caméra stable (pas de stabilisation)
3. **Pro Mode ISO élevé** - Acceptez plus de grain pour plus de lumière
4. **Zoom numérique** - Peut réduire la qualité, préférez vous rapprocher
5. **Styles photographiques** - Testez plusieurs styles, ils sont cumulables avec les filtres

---

## 🆕 Nouveautés

### Version 1.0
- ✅ 8 modes de capture
- ✅ 8 filtres créatifs
- ✅ 6 styles photographiques (iOS 18)
- ✅ Mode Pro complet (Samsung One UI 8)
- ✅ Zoom 0.5-3×
- ✅ Contrôle d'exposition
- ✅ Multi-caméras
- ✅ PWA installable
- ✅ Optimisations PC/Mobile
- ✅ Galerie intégrée

---

## 📞 Support

Problème ou suggestion? Créez une issue sur le repo GitHub!

**Bon shooting! 📸✨**
