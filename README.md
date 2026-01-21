# 📸 Nexus Camera - Application de Caméra Avancée

Une application de caméra web révolutionnaire avec des effets en temps réel et des fonctionnalités innovantes jamais vues auparavant.

![Nexus Camera](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Fonctionnalités Uniques

### 🎨 Filtres Cinématiques Avancés
- **Vintage** - Look rétro chaleureux
- **Cyberpunk** - Esthétique futuriste néon
- **Vaporwave** - Style années 80/90
- **Noir** - Noir et blanc cinématographique
- **Glitch** - Effets de distorsion numérique
- **Neon** - Couleurs éclatantes fluorescentes
- **Thermal** - Vision thermique simulée

### 🌟 Modes Créatifs Innovants
- **Particules** - Système de particules interactives en temps réel
- **Double Exposition** - Superposition artistique automatique
- **Mode Portrait** - Flou d'arrière-plan intelligent
- **Kaleidoscope** - Effets de miroir symétriques
- **Pixel Art** - Transformation en style rétro pixelisé
- **AR Visage** - Réalité augmentée (en développement)

### 🎥 Modes de Capture
- **Photo** - Capture haute résolution avec timer
- **Vidéo** - Enregistrement avec tous les effets appliqués
- **Time-lapse** - Capture d'images à intervalles

### ⚙️ Contrôles Manuels Pro
- Luminosité (±100)
- Contraste (0-200%)
- Saturation (0-200%)
- Netteté (0-100)
- Flou (0-20px)
- Vignette (0-100%)

### 🔧 Outils Avancés
- **Grille de composition** - Règle des tiers pour composition parfaite
- **Histogramme temps réel** - Analyse de l'exposition
- **Indicateur de focus** - Feedback visuel tactile
- **Timer** - 3s, 5s ou 10s
- **Changement de caméra** - Avant/Arrière

### 💾 Galerie Intégrée
- Stockage local des médias
- Prévisualisation rapide
- Téléchargement facile
- Métadonnées préservées

## 🚀 Installation

### Méthode 1 : Directement dans le navigateur
1. Clonez ce repository
```bash
git clone https://github.com/nexusproject2077/nexus-camera.git
cd nexus-camera
```

2. Ouvrez `index.html` dans votre navigateur moderne (Chrome, Firefox, Edge, Safari)

### Méthode 2 : Avec un serveur local
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis ouvrez http://localhost:8000 dans votre navigateur.

## 🎮 Utilisation

### Capture Photo
1. Sélectionnez le mode **PHOTO**
2. Appliquez des filtres depuis le panneau latéral
3. Ajustez les contrôles manuels si nécessaire
4. Cliquez sur le bouton de capture (grand cercle blanc)
5. Votre photo est automatiquement sauvegardée dans la galerie

### Enregistrement Vidéo
1. Sélectionnez le mode **VIDÉO**
2. Configurez vos effets
3. Cliquez sur le bouton de capture pour démarrer
4. Cliquez à nouveau pour arrêter
5. La vidéo est sauvegardée automatiquement

### Modes Créatifs
1. Ouvrez le panneau d'effets (icône à droite)
2. Choisissez un mode créatif
3. Les effets s'appliquent en temps réel
4. Combinez avec des filtres pour des résultats uniques

### Réglages Avancés
- **Timer** : Cliquez sur l'icône horloge pour cycler entre 0s/3s/5s/10s
- **Grille** : Activez la grille de composition pour respecter la règle des tiers
- **Histogramme** : Visualisez la distribution des tons
- **Changer de caméra** : Basculez entre caméra avant et arrière

## 💡 Fonctionnalités Techniques

### Architecture
- **Vanilla JavaScript** - Aucune dépendance externe
- **Canvas API** - Traitement d'image en temps réel
- **MediaRecorder API** - Enregistrement vidéo haute qualité
- **getUserMedia API** - Accès caméra
- **LocalStorage** - Persistance des données

### Performance
- Traitement optimisé avec `requestAnimationFrame`
- Canvas avec `willReadFrequently` pour lectures fréquentes
- Gestion efficace de la mémoire
- Animations fluides 60 FPS

### Compatibilité
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Responsive
- Design adaptatif pour desktop, tablette et mobile
- Interface tactile optimisée
- Contrôles accessibles

## 🎨 Personnalisation

### Variables CSS
Personnalisez les couleurs dans `styles.css` :
```css
:root {
    --primary: #00f3ff;      /* Couleur principale */
    --secondary: #ff00ff;    /* Couleur secondaire */
    --accent: #ffff00;       /* Couleur d'accent */
    --bg-dark: #0a0a0f;      /* Fond sombre */
}
```

### Ajout de Filtres
Ajoutez vos propres filtres dans `app.js` :
```javascript
case 'monfiltre':
    for (let i = 0; i < data.length; i += 4) {
        // Votre logique de transformation
        data[i] = /* Rouge */;
        data[i + 1] = /* Vert */;
        data[i + 2] = /* Bleu */;
    }
    break;
```

## 🔒 Sécurité & Confidentialité

- ✅ Toutes les données restent **locales** (aucun serveur externe)
- ✅ Aucune photo/vidéo n'est uploadée
- ✅ Pas de tracking ou analytics
- ✅ Code source ouvert et vérifiable
- ✅ Demande de permission pour accès caméra/micro

## 🐛 Problèmes Connus

- Les effets AR nécessitent une bibliothèque de détection faciale (en développement)
- Safari peut avoir des limitations avec certains codecs vidéo
- L'accès caméra nécessite HTTPS en production

## 🛠️ Développement

### Structure du Projet
```
nexus-camera/
├── index.html       # Structure HTML
├── styles.css       # Styles et animations
├── app.js          # Logique applicative
└── README.md       # Documentation
```

### Roadmap
- [ ] Détection faciale avec TensorFlow.js
- [ ] Effets AR avancés (lunettes, chapeaux)
- [ ] Export en différents formats (PNG, JPG, GIF)
- [ ] Éditeur d'images intégré
- [ ] Partage sur réseaux sociaux
- [ ] Mode panorama
- [ ] Mode macro
- [ ] Stabilisation vidéo
- [ ] Slow motion avancé
- [ ] Mode RAW/ProRAW

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Forker le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Add AmazingFeature'`)
4. Pusher vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Design inspiré par les meilleures applications de caméra mobile
- Effets créatifs inspirés par la communauté des créateurs
- Merci à tous les contributeurs open-source

## 📧 Contact

Pour toute question ou suggestion, n'hésitez pas à ouvrir une issue sur GitHub.

---

**Fait avec ❤️ par Nexus Project**

*Nexus Camera - Capturez l'extraordinaire*