# Victoire 2 — petits détails visuels (démo)

Maquette **non officielle** : la page d'accueil réelle de [victoire2.com](https://www.victoire2.com/) à l'identique, avec trois petits détails visuels par-dessus. Aucun contenu, aucune typo, aucune couleur et aucune structure ne sont modifiés ; images et liens pointent vers le vrai site.

Un seul motif, le « mal repéré » de sérigraphie, en rouge V2 :

1. **Logo** : de temps en temps (toutes les 12 à 20 s), un fantôme rouge du logo apparaît décalé puis se recale. Le survol garde l'effet existant du site.
2. **Affiches et photo du prochain concert** : au survol (ou au centre de l'écran sur mobile), le même décalage rouge, bref.
3. **Petit égaliseur** de 6 barres à côté de « Prochain concert ».

Tout se coupe si le système demande moins d'animations (et l'égaliseur avec les modes contraste / niveaux de gris de la barre d'accessibilité).

- `fx/v2-details.css` + `fx/v2-details.js` : les détails seuls (à coller dans le code personnalisé du WordPress ; le masque du logo attend l'URL du SVG dans `--v2d-logo`).
- `fx/panneau-demo.js` : panneau pour activer/désactiver chaque détail (démo uniquement).
- `build.py` : régénère `index.html` depuis la page réelle (`--fetch` pour la retélécharger, `--local` pour le serveur de dev).
- `assets/` : copies des polices et du logo, que le navigateur refuse de charger hors du domaine victoire2.com.
- `archive/v1/` : la première exploration, plus fournie (non retenue).
