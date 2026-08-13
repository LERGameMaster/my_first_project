/* Affichage et edition du panier. */

const blocPanier = document.querySelector("#panier");
const blocVide = document.querySelector("#panier-vide");
const listeLignes = document.querySelector("#lignes-panier");
const recapSousTotal = document.querySelector("#recap-sous-total");
const recapPort = document.querySelector("#recap-port");
const recapTotal = document.querySelector("#recap-total");
const recapNote = document.querySelector("#recap-note");
const boutonVider = document.querySelector("#vider-panier");

function gabaritLigne(ligne) {
  const carte = ligne.carte;
  return `
    <article class="ligne" data-id="${carte.id}">
      <a href="produit.html?id=${carte.id}">
        <img class="ligne__visuel" src="${carte.image}" alt="Carte ${carte.nom}">
      </a>
      <div class="ligne__infos">
        <p class="ligne__nom"><a href="produit.html?id=${carte.id}">${carte.nom}</a></p>
        <p class="ligne__meta">No ${carte.numero} &middot; Essence ${carte.essence} &middot; ${carte.rarete}</p>
        <p class="ligne__unite">${formaterPrix(carte.prix)} l'unite</p>
      </div>
      <div class="ligne__quantite">
        <button type="button" class="quantite__bouton" data-action="moins" aria-label="Retirer un exemplaire">-</button>
        <span class="quantite__valeur">${ligne.quantite}</span>
        <button type="button" class="quantite__bouton" data-action="plus" aria-label="Ajouter un exemplaire">+</button>
      </div>
      <p class="ligne__total">${formaterPrix(ligne.total)}</p>
      <button type="button" class="ligne__retirer" data-action="retirer">Retirer</button>
    </article>
  `;
}

function afficherRecapitulatif() {
  const port = fraisDePort();
  recapSousTotal.textContent = formaterPrix(sousTotal());
  recapPort.textContent = port === 0 ? "Offerte" : formaterPrix(port);
  recapTotal.textContent = formaterPrix(totalPanier());

  const manquant = SEUIL_PORT_OFFERT - sousTotal();
  recapNote.textContent = manquant > 0
    ? "Plus que " + formaterPrix(manquant) + " pour la livraison offerte."
    : "Livraison offerte.";
}

function afficher() {
  const lignes = lignesDetaillees();

  blocVide.hidden = lignes.length > 0;
  blocPanier.hidden = lignes.length === 0;

  if (!lignes.length) {
    return;
  }

  listeLignes.innerHTML = lignes.map(gabaritLigne).join("");
  afficherRecapitulatif();
}

listeLignes.addEventListener("click", function (evenement) {
  const bouton = evenement.target.closest("[data-action]");
  if (!bouton) {
    return;
  }

  const id = bouton.closest(".ligne").dataset.id;
  const ligne = lignesDetaillees().find(function (item) {
    return item.carte.id === id;
  });
  if (!ligne) {
    return;
  }

  const action = bouton.dataset.action;
  if (action === "plus") {
    definirQuantite(id, ligne.quantite + 1);
  } else if (action === "moins") {
    definirQuantite(id, ligne.quantite - 1);
  } else if (action === "retirer") {
    retirerDuPanier(id);
  }

  afficher();
});

boutonVider.addEventListener("click", function () {
  viderPanier();
  afficher();
});

document.addEventListener("DOMContentLoaded", afficher);
