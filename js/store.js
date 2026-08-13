/* Panier de la boutique.

   Le panier est conserve dans le localStorage du navigateur : il n'y a pas
   de serveur, la commande n'est jamais envoyee nulle part. Si le stockage
   n'est pas disponible (navigation privee restrictive, fichier ouvert avec
   certains navigateurs), on retombe sur un panier en memoire valable le
   temps de la session. */

const CLE_PANIER = "gm-tcg-panier";
const FRAIS_DE_PORT = 4.9;
const SEUIL_PORT_OFFERT = 50;

let panierMemoire = [];

function stockageDisponible() {
  try {
    window.localStorage.setItem("gm-tcg-test", "1");
    window.localStorage.removeItem("gm-tcg-test");
    return true;
  } catch (erreur) {
    return false;
  }
}

function lirePanier() {
  if (!stockageDisponible()) {
    return panierMemoire.slice();
  }
  try {
    const brut = window.localStorage.getItem(CLE_PANIER);
    const lignes = brut ? JSON.parse(brut) : [];
    return Array.isArray(lignes) ? lignes : [];
  } catch (erreur) {
    return [];
  }
}

function ecrirePanier(lignes) {
  panierMemoire = lignes.slice();
  if (stockageDisponible()) {
    window.localStorage.setItem(CLE_PANIER, JSON.stringify(lignes));
  }
  majCompteurPanier();
}

function carteParId(id) {
  return CARTES.find(function (carte) {
    return carte.id === id;
  }) || null;
}

function ajouterAuPanier(id, quantite) {
  const carte = carteParId(id);
  if (!carte || carte.stock === 0) {
    return false;
  }

  quantite = Math.max(1, parseInt(quantite, 10) || 1);
  const lignes = lirePanier();
  const existante = lignes.find(function (ligne) {
    return ligne.id === id;
  });

  if (existante) {
    existante.quantite = Math.min(carte.stock, existante.quantite + quantite);
  } else {
    lignes.push({ id: id, quantite: Math.min(carte.stock, quantite) });
  }

  ecrirePanier(lignes);
  return true;
}

function definirQuantite(id, quantite) {
  const carte = carteParId(id);
  quantite = parseInt(quantite, 10) || 0;

  let lignes = lirePanier();
  if (quantite <= 0) {
    lignes = lignes.filter(function (ligne) {
      return ligne.id !== id;
    });
  } else {
    lignes.forEach(function (ligne) {
      if (ligne.id === id) {
        ligne.quantite = carte ? Math.min(carte.stock, quantite) : quantite;
      }
    });
  }
  ecrirePanier(lignes);
}

function retirerDuPanier(id) {
  definirQuantite(id, 0);
}

function viderPanier() {
  ecrirePanier([]);
}

function lignesDetaillees() {
  return lirePanier()
    .map(function (ligne) {
      const carte = carteParId(ligne.id);
      if (!carte) {
        return null;
      }
      return {
        carte: carte,
        quantite: ligne.quantite,
        total: carte.prix * ligne.quantite,
      };
    })
    .filter(Boolean);
}

function nombreArticles() {
  return lirePanier().reduce(function (total, ligne) {
    return total + ligne.quantite;
  }, 0);
}

function sousTotal() {
  return lignesDetaillees().reduce(function (total, ligne) {
    return total + ligne.total;
  }, 0);
}

function fraisDePort() {
  const montant = sousTotal();
  if (montant === 0 || montant >= SEUIL_PORT_OFFERT) {
    return 0;
  }
  return FRAIS_DE_PORT;
}

function totalPanier() {
  return sousTotal() + fraisDePort();
}

function formaterPrix(valeur) {
  return valeur.toFixed(2).replace(".", ",") + " EUR";
}

function majCompteurPanier() {
  const compteurs = document.querySelectorAll(".nav__compteur");
  const articles = nombreArticles();
  compteurs.forEach(function (compteur) {
    compteur.textContent = articles;
  });
}

document.addEventListener("DOMContentLoaded", majCompteurPanier);
