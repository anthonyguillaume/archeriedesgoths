# Archerie des Goths — site du club

Site vitrine du club de tir à l'arc de Gueux (Marne), publié sur GitHub Pages :
<https://anthonyguillaume.github.io/archeriedesgoths/>

## Contenu

Site statique, sans build ni dépendance :

- `index.html` — la page unique (textes, horaires, tarifs, galerie, plan d'accès)
- `css/style.css` — styles (couleurs, polices, composants)
- `assets/fonts/` — polices Barlow et Barlow Condensed (woff2, embarquées)
- `assets/img/` — photos et blason
- `mentions-legales.html` — mentions légales (éditeur, hébergeur, données, crédits) ; à mettre à jour si le siège ou le président change
- `assets/fonts/OFL.txt` — licence des polices Barlow (à conserver avec les fichiers)
- `robots.txt`, `sitemap.xml` — référencement ; les balises Open Graph et les données
  structurées (JSON-LD `SportsClub` : adresse, horaires) sont dans le `<head>` de `index.html`.
  Si un horaire change, le mettre à jour aux deux endroits (section Horaires et JSON-LD).

## Modifier le site

Éditer directement `index.html` (un tarif, un horaire, un texte) ou `css/style.css`,
puis committer sur `main`. Pour tester en local :

```sh
python3 -m http.server 8000
# puis ouvrir http://localhost:8000/
```

## Provenance

Le site est le port fidèle d'un design réalisé avec Claude Design (`Archerie des Goths.html`,
bundle auto-extractible de 17 Mo, volontairement non versionné). Les photos de `assets/img/`
sont les originaux redimensionnés à 1600 px côté long (JPEG qualité 60 via `sips`). Pour
remplacer une photo, garder le même nom de fichier et un côté long de 1600 px. Détails et
critères de fidélité : `docs/superpowers/specs/2026-10-04-site-github-pages-design.md`.

## Fonctionnement technique (branche design-review)

- `js/sticky.js` : barre collante (blason + bouton « Rejoindre le club ») révélée par un
  `IntersectionObserver` une fois le hero sorti de l'écran. Sans JavaScript, la barre n'apparaît
  pas et la navigation du hero reste disponible.
- Images : chaque photo est servie en WebP via `<picture>` avec le JPEG en repli. Suffixes à
  conserver : `hero-1000` / `hero-1600`, galerie `-450` / `-900` (côté large), `blason-96` / `-168`,
  `plan-gueux-1120` / `plan-gueux` (2240). Pour regénérer une variante (Pillow requis, non installé
  par le site) :
  `python3 -c "from PIL import Image; im=Image.open('assets/img/salle.jpg'); im.resize((450, round(im.height*450/im.width))).save('assets/img/salle-450.webp', quality=78, method=6)"`
- `assets/img/plan-gueux.jpg` : plan statique 2240×800 assemblé à partir des tuiles OpenStreetMap
  zoom 16 autour de 49.2507, 3.9184 (Rue du Moutier, Gueux), marqueur rouge/ambre au centre.
  Licence ODbL : l'attribution « © OpenStreetMap contributors » affichée dans la page est obligatoire.

## Déploiement

GitHub Pages est configuré en « Deploy from a branch » : branche `main`, dossier `/` (racine).
Chaque push sur `main` met le site en ligne en une à deux minutes. Le fichier `.nojekyll`
désactive le traitement Jekyll.
