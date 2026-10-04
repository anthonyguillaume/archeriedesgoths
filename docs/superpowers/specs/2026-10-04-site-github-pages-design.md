# Archerie des Goths — port du design Claude Design vers GitHub Pages

Date : 2026-10-04

## Objectif

Publier sur GitHub Pages (`https://anthonyguillaume.github.io/archeriedesgoths/`) une version
**visuellement identique** de la page produite avec Claude Design (`Archerie des Goths.html`,
bundle de 17 Mo auto-extractible), sans dépendre du runtime Claude Design.

> **Note (branche `design-review`)** : la fidélité au pixel décrite ici vaut pour le port initial
> (`main`, commit 47ad84f). La branche `design-review` s'en écarte volontairement : contraste,
> cibles tactiles 44 px, focus clavier, reduced-motion, WebP via `<picture>`, regroupement des
> tarifs, barre collante JS, plan OpenStreetMap à la place de l'iframe Google, galerie 2 colonnes
> mobile. Le tableau de hauteurs ci-dessous ne s'y applique plus.

## Ce que contient la source

- Une seule page (one-page) : header hero, sections `#club`, `#horaires`, `#tarifs`,
  `#inscription`, `#galerie`, « Nous trouver » (iframe Google Maps), footer.
- Styles 100 % inline, plus un attribut propriétaire `style-hover="…"` (= règles `:hover`)
  et une balise `<helmet>` (= contenu à placer dans `<head>`). C'est tout ce que fait le runtime.
- Polices Google embarquées en woff2 : Barlow 400/500/600 et Barlow Condensed 600/700/800,
  chacune en 3 sous-ensembles (latin, latin-ext, vietnamese).
- 6 images JPEG (hero 2016×1512, blason 276×185, 4 photos galerie dont une 4032×3024 avec
  orientation EXIF 6 et une 3024×4032, à 4–6 Mo).
- Palette : fond `#221c22`, texte `#f5f1ea`, rouge `#d81e26`, ambre `#e8a33d`, cartes `#2e262e`,
  footer `#171217`.

## Décision d'architecture : site statique sans build

Pas de React ni d'outillage npm. Raisons :
- aucune interactivité au-delà des `:hover` et du scroll doux (CSS natif) ;
- zéro dépendance à installer, zéro étape de build, déploiement direct de la branche `main` ;
- plus simple à maintenir pour un club (modifier un tarif = éditer une ligne de HTML).

## Structure cible

```
index.html            page unique, HTML sémantique, classes CSS (plus de styles inline)
css/style.css         reset minimal, @font-face, variables de couleurs, composants, :hover
assets/fonts/*.woff2  polices renommées lisiblement (barlow-400-latin.woff2, …)
assets/img/*.jpg      images renommées (hero.jpg, blason.jpg, salle.jpg, terrain.jpg,
                      pas-de-tir.jpg, parcours-nature.jpg), redimensionnées (max 1600 px,
                      qualité 60) — même rendu à l'écran, poids divisé par 10
favicon.png           dérivé du blason
.nojekyll             évite le traitement Jekyll de GitHub Pages
README.md             comment publier / modifier
```

Le fichier `Archerie des Goths.html` d'origine n'est PAS versionné (17 Mo) : il est ajouté au
`.gitignore`, de même que `.playwright-mcp/`.

## Règles de fidélité visuelle

- Chaque valeur CSS inline de la source est reportée telle quelle (tailles `clamp()`, rayons,
  ombres, transitions, filtres, `backdrop-filter`, `text-wrap: balance`, `pointer-events`).
- Chaque `style-hover` devient une règle `.classe:hover { … }` identique.
- Le CSS global du `<helmet>` est conservé (`scroll-behavior: smooth`, couleurs des liens, etc.).
- Les `@font-face` sont conservés avec leurs `unicode-range` ; seules les URL changent.
- Textes, attributs `alt`, liens (`mailto:`, Facebook, Google Maps) et ordre des sections inchangés.
- Ajouts autorisés car invisibles : `<title>`, `<meta description>`, `lang="fr"`, favicon,
  `loading="lazy"` sur les images de la galerie, `width`/`height` sur les images.

## Critères d'acceptation (testés avec Playwright)

Référence : captures `.playwright-mcp/ref-desktop-1280.png` et `ref-mobile-390.png`,
hauteurs de sections mesurées sur la source :

| Vue        | Hauteur page | header | club | horaires | tarifs | inscription | galerie | carte | footer |
|------------|--------------|--------|------|----------|--------|-------------|---------|-------|--------|
| 1280×950   | 3711         | 681    | 502  | 332      | 612    | 276         | 495     | 601   | 215    |
| 390×844    | 6373         | 640    | 993  | 618      | 1319   | 402         | 1558    | 584   | 261    |

1. Hauteurs de sections identiques à ±2 px dans les deux vues.
2. Polices chargées : Barlow 400/600, Barlow Condensed 700/800 (via `document.fonts`).
3. Aucune erreur console (hors favicon), aucune ressource 404.
4. Chaque élément porteur d'un `style-hover` dans la source (23 au total) a ses déclarations
   dans une règle `:hover` qui s'applique à lui, avec les mêmes valeurs. Les règles peuvent
   être factorisées (plusieurs éléments partagent une classe), mais la couleur d'un lien dont
   la source fixe `color` inline doit être conservée au survol malgré le `a:hover` global.
5. Les ancres `#club #horaires #tarifs #inscription` existent et la nav pointe dessus.
6. Comparaison visuelle des captures full-page : pas de différence perceptible.

## Déploiement

GitHub Pages, source « Deploy from a branch », branche `main`, dossier `/` (racine).
Chemins relatifs uniquement (`css/style.css`, `assets/…`) pour fonctionner sous
`/archeriedesgoths/`.
