document.addEventListener('DOMContentLoaded', function() {
    // Coordonnées arbitraires basées sur les dimensions de votre image de carte
    // Vous devrez ajuster ces valeurs en fonction de la taille réelle de votre image et
    // du système de coordonnées que vous choisirez (ex: [0,0] en bas à gauche).
    // Pour une image simple, on peut utiliser un CRS simple.
    const mapWidth = 3242;
    const mapHeight = 4233;

    // Créer une instance de carte Leaflet
    // On utilise L.CRS.Simple car ce n'est pas une carte géographique
    const map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -1, // Zoom minimum (peut nécessiter des ajustements)
        maxZoom: 2,  // Zoom maximum (peut nécessiter des ajustements)
        center: [mapHeight / 2, mapWidth / 2], // Centrer la carte initialement
        zoom: -1, // Niveau de zoom initial (peut nécessiter des ajustements)
        maxBoundsViscosity: 1.0 // Empêche le déplacement hors des limites
    });

    // Définir les limites de la carte pour qu'on ne puisse pas se déplacer hors de l'image
    const bounds = [[0, 0], [mapHeight, mapWidth]]; // [[ymin, xmin], [ymax, xmax]]
    map.setMaxBounds(bounds);

    // Ajouter l'image de la carte comme couche de fond
    // Assurez-vous que le chemin d'accès à l'image est correct
    const imageUrl = 'map/watchdogs2_map.png'; // Chemin vers votre image
    const imageOverlay = L.imageOverlay(imageUrl, bounds).addTo(map);

    const jumpIcon = L.icon({
        iconUrl: 'img/jump.png', // Chemin vers l'image de l'icône pour les jumps statiques
        iconSize: [50, 50], // Taille de l'icône [largeur, hauteur] en pixels
        iconAnchor: [25, 45], // Point de l'icône qui correspond à l'emplacement du marqueur [milieu_largeur, bas]
        popupAnchor: [0, -50] // Point d'où la popup s'ouvrira par rapport à l'iconAnchor
    });

    const jumpIconEasy = L.icon({
        iconUrl: 'img/jump-easy.png', // Chemin vers l'image de l'icône pour les jumps statiques
        iconSize: [50, 50], // Taille de l'icône [largeur, hauteur] en pixels
        iconAnchor: [25, 45], // Point de l'icône qui correspond à l'emplacement du marqueur [milieu_largeur, bas]
        popupAnchor: [0, -50] // Point d'où la popup s'ouvrira par rapport à l'iconAnchor
    });

    const jumpIconMedium = L.icon({
        iconUrl: 'img/jump-medium.png', // Chemin vers l'image de l'icône pour les jumps statiques
        iconSize: [50, 50], // Taille de l'icône [largeur, hauteur] en pixels
        iconAnchor: [25, 45], // Point de l'icône qui correspond à l'emplacement du marqueur [milieu_largeur, bas]
        popupAnchor: [0, -50] // Point d'où la popup s'ouvrira par rapport à l'iconAnchor
    });

    const jumpIconHard = L.icon({
        iconUrl: 'img/jump-hard.png', // Chemin vers l'image de l'icône pour les jumps statiques
        iconSize: [50, 50], // Taille de l'icône [largeur, hauteur] en pixels
        iconAnchor: [25, 45], // Point de l'icône qui correspond à l'emplacement du marqueur [milieu_largeur, bas]
        popupAnchor: [0, -50] // Point d'où la popup s'ouvrira par rapport à l'iconAnchor
    });

    /*let dynamicMarker = null;

    // Fonction pour ajouter un marqueur au clic
    function addOrReplaceMarkerOnClick(event) {
        // Supprimer le marqueur dynamique précédent s'il existe

        if (dynamicMarker) {
            map.removeLayer(dynamicMarker); // map.removeLayer() retire le marqueur de la carte
            dynamicMarker = null; // Réinitialiser la référence
        }

        // event.latlng contient les coordonnées du clic dans le système de Leaflet
        const leafletCoords = event.latlng;

        // Créer un NOUVEAU marqueur à l'endroit cliqué, en utilisant l'icône personnalisée 'clickedIcon'
        dynamicMarker = L.marker(leafletCoords).addTo(map);

        // Afficher les coordonnées dans une popup pour ce nouveau marqueur
        dynamicMarker.bindPopup(`
            <h3>Point Cliqué</h3>
            <p>X: ${event.latlng.lng.toFixed(2)}</p>
            <p>Y: ${event.latlng.lat.toFixed(2)}</p>
            `);

        // Ouvrir la popup immédiatement (optionnel)
        dynamicMarker.openPopup();

        // Si vous utilisez la console pour le débogage, affichez les coordonnées
        console.log(`Clic à X: ${leafletCoords.lng.toFixed(2)}, Y: ${leafletCoords.lat.toFixed(2)}`);
        console.log(`Possible coordonnées image (Top-Left, Y vers le bas): X: ${leafletCoords.lng.toFixed(0)}, Y: ${(mapHeight - leafletCoords.lat).toFixed(0)}`);

        // Note : leafletCoords.lng est la coordonnée X. leafletCoords.lat est la coordonnée Y dans le système L.CRS.Simple
        // Pour convertir en coordonnées image (Top-Left, Y vers le bas):
        // Image X = leafletCoords.lng
        // Image Y = mapHeight - leafletCoords.lat
    }

    // Ajouter l'écouteur d'événements pour les clics sur la CARTE (pas sur les marqueurs)
    map.on('click', addOrReplaceMarkerOnClick);*/

    // Charger les données des jumps (depuis le fichier JSON)
    fetch('data/jumps.json') // Assurez-vous que le chemin est correct
        .then(response => response.json())
        .then(jumps => {
            // Ajouter les marqueurs pour chaque jump
            jumps.forEach(jump => {
                // Les coordonnées du marqueur doivent correspondre au système de coordonnées de l'imageOverlay
                // Si vos coordonnées JSON sont [X, Y] où [0,0] est en haut à gauche de l'image
                // et que votre imageOverlay est basé sur bounds [[0,0], [mapHeight, mapWidth]]
                // où [0,0] est le coin en bas à gauche dans L.CRS.Simple, il faut convertir.
                // La conversion simple : [mapHeight - Y, X] si Y augmente vers le bas et X vers la droite dans votre JSON.
                const markerCoords = [jump.coords[1], jump.coords[0]]; // Exemple de conversion

                let icon;

                if (jump.difficulty > 6) {
                    icon = jumpIconHard;
                }
                else if (jump.difficulty > 3) {
                    icon = jumpIconMedium;
                }
                else {
                    icon = jumpIconEasy;
                }

                const marker = L.marker(markerCoords, {icon: icon}).addTo(map);

                // Affiche les coordonnées du marqueur dans la console
                console.log(`Marqueur ajouté pour ${jump.name} à :`, markerCoords);

                // On construit le contenu HTML de la popup dynamiquement
                let popupContent = `<h3>${jump.name}</h3>`;
                popupContent += `<p>${jump.description}</p>`;

                popupContent += `<p>Difficulté : ${jump.difficulty}/10</p>`;
                popupContent += `<img src="${jump.image}" alt="${jump.name}" style="width:100%; height:auto; border-radius:5px;">`;

                if (jump.ytvideo) {
                    popupContent += `<iframe width="100%" height="auto" src="${jump.ytvideo}" title="${jump.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
                }

                // Ajouter une popup au marqueur
                marker.bindPopup(popupContent);

                // Ajouter le marqueur à la carte
                marker.addTo(map);

                // Note : La popup ne s'ouvre pas automatiquement ici, elle s'ouvrira au clic de l'utilisateur
            });
        })
        .catch(error => {
            console.error('Erreur lors du chargement des données des jumps:', error);
        });

    // Optionnel : ajuster automatiquement le zoom pour afficher toute l'image au départ
    map.fitBounds(bounds);
});