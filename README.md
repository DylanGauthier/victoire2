# Victoire 2 — démo « site vivant »

Maquette **non officielle** : la page d'accueil réelle de [victoire2.com](https://www.victoire2.com/) à l'identique, avec une couche de petites animations par-dessus, pour en discuter. Aucun contenu n'est modifié ; images et liens pointent vers le vrai site.

- `fx/v2-vivant.css` + `fx/v2-vivant.js` : les effets seuls (à coller dans le code personnalisé du WordPress).
- `fx/panneau-demo.js` : panneau pour activer/désactiver chaque effet (démo uniquement).
- `build.py` : régénère `index.html` depuis la page réelle (`--fetch` pour la retélécharger, `--local` pour le serveur de dev).
- `assets/` : copies des polices d'icônes et de « miso », que le navigateur refuse de charger hors du domaine victoire2.com.
