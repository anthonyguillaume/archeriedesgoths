# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Ce qu'est ce dépôt

Site vitrine one-page du club de tir à l'arc **Archerie des Goths** (Gueux, Marne), servi par
GitHub Pages depuis la racine de `main` : <https://anthonyguillaume.github.io/archeriedesgoths/>.
HTML + CSS + un script de 10 lignes, **sans build, sans dépendance npm**. Décision prise le
2026-10-04 : pas de React, pas d'outillage ; un tarif ou un horaire se modifie dans `index.html`.

Le site est le port d'un design produit avec Claude Design. Le bundle d'origine
(`Archerie des Goths.html`, 17 Mo) reste à la racine du dossier local mais est **ignoré par git**.
La spec du port et ses critères de fidélité sont dans `docs/superpowers/specs/`.

## Commandes

```sh
# Prévisualiser (aucune installation) ; le site doit fonctionner servi sous /archeriedesgoths/,
# donc uniquement des chemins relatifs, jamais de "/" initial.
python3 -m http.server 8000           # http://127.0.0.1:8000/

# Détecteur de "slop" design (skill Impeccable, installé au niveau utilisateur) ; attendu : []
node ~/.agents/skills/impeccable/scripts/detect.mjs --json index.html mentions-legales.html

# Regénérer une variante WebP (Pillow est disponible sur ce poste, rien à installer)
python3 -c "from PIL import Image; im=Image.open('assets/img/salle.jpg'); im.resize((450, round(im.height*450/im.width))).save('assets/img/salle-450.webp', quality=78, method=6)"
```

Il n'y a pas de suite de tests. La vérification se fait en navigateur avec les outils Playwright
MCP (`browser_navigate`, `browser_evaluate`, `browser_resize`, captures sous `.playwright-mcp/`,
seul dossier où Playwright a le droit d'écrire ; `file://` est bloqué, passer par le serveur local).
Contrôles attendus avant de commiter un changement visuel : aucun débordement horizontal
(`scrollWidth === clientWidth`) à 320 / 390 / 768 / 1280 px, 0 erreur console, 0 ressource 404,
contraste ≥ 4,5:1 sur tout texte ajouté, cibles cliquables ≥ 44 px de haut, détecteur vide.

## Architecture et pièges

- **Deux pages** : `index.html` (tout le site) et `mentions-legales.html` (noindex, lien dans le
  footer). Les deux partagent `css/style.css` et le `.skip-link`.
- **`css/style.css`** : variables dans `:root`, 18 `@font-face` Barlow / Barlow Condensed en
  woff2 locaux avec `unicode-range` (seuls 4 à 5 fichiers sont réellement téléchargés), puis une
  classe par composant dans l'ordre de la page, puis les `@media` à la fin. Tout est en `px`
  (héritage du design d'origine). `--red` (#d81e26) sert aux boutons, `--red-deep` (#c41a20) au
  fond du bandeau horaires : c'est voulu, pour le contraste du texte blanc (5,3:1).
- **Doubles sources de vérité à maintenir ensemble** :
  - les horaires : section `#horaires` **et** le JSON-LD `SportsClub` dans le `<head>` ;
  - l'adresse : footer, panneau carte, JSON-LD, mentions légales ;
  - chaque photo : JPEG de repli + variantes WebP référencées dans `<picture>` avec des suffixes
    fixes (`hero-1000/-1600`, galerie `-450/-900`, `blason-96/-168`, `plan-gueux-1120` et
    `plan-gueux` 2240). Remplacer une photo = remplacer le JPEG **et** regénérer ses WebP.
- **Barre collante** (`js/sticky.js`) : `position: fixed`, cachée par défaut, révélée par un
  `IntersectionObserver` sur `.hero`. Sans JS elle n'existe pas visuellement. Si sa hauteur
  change, ajuster `scroll-padding-top` sur `html` et le `rootMargin` du script.
- **Plan d'accès** : image statique assemblée à partir des tuiles OpenStreetMap (zoom 16 autour de
  49.2507, 3.9184), pas d'iframe Google : le site n'émet **aucune requête tierce** et ne pose
  aucun cookie, ce que la page de mentions légales affirme. Ne pas réintroduire de service
  externe sans mettre cette page à jour. L'attribution « © OpenStreetMap contributors » est
  obligatoire (ODbL).
- **Accessibilité déjà en place, à ne pas casser** : `main`, `nav` en liste avec `aria-label`,
  `aria-labelledby` sur chaque section, hiérarchie h1 > h2 > h3, `:focus-visible` ambre,
  `prefers-reduced-motion`, liens `target="_blank"` accompagnés d'un `<span class="sr-only">
  (ouvre un nouvel onglet)</span>`, liens de nav et de footer à 44 px via marges négatives.
- **Référencement** : `robots.txt`, `sitemap.xml`, Open Graph / Twitter (image
  `assets/img/og-image.jpg` 1200×630), JSON-LD. Le `<title>` et la meta description sont
  dupliqués dans les balises OG.

## Git et déploiement

- Compte GitHub pour ce dépôt : `anthonyguillaume` (identité locale `anthony.guillaume@live.fr`
  déjà configurée). Le compte actif de `gh` est souvent celui de Getlink : faire
  `gh auth switch --user anthonyguillaume` avant un push ou une commande `gh`, puis revenir avec
  `gh auth switch --user anthony-guillaume_getlink`.
- Ne jamais pousser sans l'accord explicite de l'utilisateur (règle globale). Pas de mention de
  Claude dans les commits ni les PR.
- Déploiement automatique : tout push sur `main` est en ligne en une à deux minutes
  (`.nojekyll` présent). Vérifier avec `curl -s https://anthonyguillaume.github.io/archeriedesgoths/`.
- Historique utile : commit `47ad84f` = port pixel-identique du design ; PR #1 (branche
  `design-review`, conservée) = revue design en trois lots ; ensuite mentions légales.

## En attente d'informations du club

- Nom du président pour le « directeur de la publication » (mentions légales : actuellement
  « le président en exercice »).
- Numéro de téléphone de l'association (exigé par la LCEN, absent).
- Autorisations de droit à l'image pour les personnes visibles sur les photos.
