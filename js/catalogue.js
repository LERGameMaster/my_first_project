/* Rendu de la grille du catalogue. */

const grille = document.querySelector("#grille");
const compteurResultats = document.querySelector("#compteur-resultats");

function formaterPrix(valeur) {
  return valeur.toFixed(2).replace(".", ",") + " EUR";
}

function classeRarete(rarete) {
  return "badge badge--" + rarete.toLowerCase();
}

function gabaritCarte(carte) {
  const rupture = carte.stock === 0
    ? '<span class="carte__rupture">Rupture</span>'
    : "";

  return `
    <article class="carte" data-id="${carte.id}">
      <div class="carte__visuel">
        <img src="${carte.image}" alt="Carte ${carte.nom}" loading="lazy">
        ${rupture}
      </div>
      <div class="carte__infos">
        <p class="carte__nom">${carte.nom}</p>
        <p class="carte__meta">No ${carte.numero} &middot; Essence ${carte.essence}</p>
        <div class="carte__pied">
          <span class="carte__prix">${formaterPrix(carte.prix)}</span>
          <span class="${classeRarete(carte.rarete)}">${carte.rarete}</span>
        </div>
      </div>
    </article>
  `;
}

function afficher(cartes) {
  grille.innerHTML = cartes.map(gabaritCarte).join("");
  compteurResultats.textContent = cartes.length + " cartes";
}

document.addEventListener("DOMContentLoaded", function () {
  afficher(CARTES);
});
