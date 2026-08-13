# my_first_project

Boutique en ligne (fictive) dediee aux cartes du TCG Gentle Mates, set
Blurness 3. Site statique : HTML, CSS et JavaScript, sans framework, sans
backend et sans etape de build.

## Lancer le site

Ouvrez `index.html` dans un navigateur : double-clic sur le fichier, ou
clic droit puis "Ouvrir avec". Il n'y a rien a installer, rien a compiler
et aucun serveur a demarrer.

Si vous preferez passer par un serveur local (pas necessaire) :

```bash
python -m http.server 8000
```

puis rendez-vous sur <http://localhost:8000>.

## Pages

| Page | Role |
| --- | --- |
| `index.html` | accueil et catalogue complet, avec recherche, filtres et tri |
| `produit.html?id=...` | fiche d'une carte, ajout au panier et suggestions |
| `panier.html` | contenu du panier, quantites et recapitulatif |
| `commande.html` | coordonnees, mode d'expedition et validation |
| `confirmation.html` | reference de commande et message de fin |

Les fiches produit ne sont pas des fichiers separes : `produit.html` lit le
parametre `id` de l'URL et se remplit a partir du catalogue.

## Organisation

```text
assets/cards/    visuels des 98 cartes du set
assets/teams/    logos des essences
css/style.css    feuille de style unique
js/data.js       catalogue (nom, numero, essence, rarete, prix, stock)
js/store.js      panier, totaux et frais de port
js/catalogue.js  grille, recherche, filtres et tri
js/produit.js    fiche produit
js/panier.js     page panier
js/commande.js   tunnel de commande
```

## Fonctionnement du panier

Le panier est enregistre dans le `localStorage` du navigateur sous la cle
`gm-tcg-panier`. Il survit donc a un rechargement de page. Si le stockage
n'est pas accessible, le panier reste en memoire le temps de la visite.

La livraison standard coute 4,90 EUR et devient gratuite a partir de
50 EUR d'achat ; l'expedition express est facturee 9,90 EUR.

## Limites assumees

- Aucun paiement, aucun compte client, aucune donnee envoyee sur un serveur.
- Les stocks sont figes dans `js/data.js` et ne bougent pas apres une commande.
- Boutique de demonstration, sans lien officiel avec l'equipe Gentle Mates.
