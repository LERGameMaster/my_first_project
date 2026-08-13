/* Tunnel de commande : validation du formulaire, recapitulatif et
   generation d'une reference. Rien n'est envoye, la commande est simplement
   confirmee cote navigateur puis le panier est vide. */

const SUPPLEMENT_EXPRESS = 9.9;

const blocCommande = document.querySelector("#commande");
const blocVide = document.querySelector("#commande-vide");
const formulaire = document.querySelector("#formulaire");
const blocErreurs = document.querySelector("#erreurs");
const recapArticles = document.querySelector("#recap-articles");

function modeExpedition() {
  const choix = formulaire.querySelector('input[name="expedition"]:checked');
  return choix ? choix.value : "standard";
}

function fraisExpedition() {
  return modeExpedition() === "express" ? SUPPLEMENT_EXPRESS : fraisDePort();
}

function afficherRecapitulatif() {
  const lignes = lignesDetaillees();

  recapArticles.innerHTML = lignes.map(function (ligne) {
    return `
      <div class="recap__article">
        <span>${ligne.quantite} x ${ligne.carte.nom}</span>
        <span>${formaterPrix(ligne.total)}</span>
      </div>
    `;
  }).join("");

  const port = fraisExpedition();
  document.querySelector("#recap-sous-total").textContent = formaterPrix(sousTotal());
  document.querySelector("#recap-port").textContent = port === 0 ? "Offerte" : formaterPrix(port);
  document.querySelector("#recap-total").textContent = formaterPrix(sousTotal() + port);
}

function valeur(id) {
  return document.querySelector("#" + id).value.trim();
}

function erreursDeSaisie() {
  const erreurs = [];

  if (!valeur("prenom")) {
    erreurs.push("le prenom");
  }
  if (!valeur("nom")) {
    erreurs.push("le nom");
  }
  if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(valeur("email"))) {
    erreurs.push("une adresse e-mail valide");
  }
  if (!valeur("adresse")) {
    erreurs.push("l'adresse");
  }
  if (!/^\d{4,5}$/.test(valeur("codePostal"))) {
    erreurs.push("un code postal valide");
  }
  if (!valeur("ville")) {
    erreurs.push("la ville");
  }

  return erreurs;
}

function referenceCommande() {
  const suffixe = Date.now().toString(36).toUpperCase().slice(-6);
  return "GM-" + suffixe;
}

formulaire.addEventListener("change", function (evenement) {
  if (evenement.target.name === "expedition") {
    afficherRecapitulatif();
  }
});

formulaire.addEventListener("submit", function (evenement) {
  evenement.preventDefault();

  const erreurs = erreursDeSaisie();
  if (erreurs.length) {
    blocErreurs.hidden = false;
    blocErreurs.textContent = "Merci de renseigner " + erreurs.join(", ") + ".";
    return;
  }

  const reference = referenceCommande();
  const total = sousTotal() + fraisExpedition();
  viderPanier();

  window.location.href = "confirmation.html?ref=" + encodeURIComponent(reference)
    + "&total=" + total.toFixed(2);
});

document.addEventListener("DOMContentLoaded", function () {
  const lignes = lignesDetaillees();
  blocVide.hidden = lignes.length > 0;
  blocCommande.hidden = lignes.length === 0;

  if (lignes.length) {
    afficherRecapitulatif();
  }
});
