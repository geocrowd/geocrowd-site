# geocrowd-site

Site de présentation et documentation de [geocrowd](https://github.com/geocrowd/geocrowd), logiciel libre de collecte et de publication d'informations géolocalisées.

- `index.html` : présentation
- `documentation.html` : installation, configuration, collections et éditeur de schéma, API publique, site public, back-office, double authentification, import OpenStreetMap
- `tailwind.css` : source des styles (Tailwind CSS 4 et son plugin typography, mode sombre suivant le système)
- `style.css` : feuille générée à partir de `tailwind.css`, à ne pas modifier à la main
- `site.js` : boutons de copie des blocs de code, onglets curl / JavaScript, sommaire de la documentation

HTML statique, publié sur https://geocrowd-api.org par GitHub Pages à chaque push sur `main` (racine du dépôt). `CNAME` porte le domaine ; `.nojekyll` désactive Jekyll. Le DNS du domaine est géré chez Infomaniak.

Après une modification des classes ou de `tailwind.css`, régénérer `style.css` avec l'[exécutable autonome de Tailwind](https://github.com/tailwindlabs/tailwindcss/releases/latest) (sans Node) et commiter le résultat :

```sh
tailwindcss -i tailwind.css -o style.css --minify
```

En local : ouvrir `index.html` dans un navigateur, ou `python3 -m http.server` puis http://localhost:8000.

Quand l'API ou la configuration de geocrowd change, mettre à jour `documentation.html` dans le même temps. Le ton reste neutre et descriptif.
