/* Fiche d'une carte : le contenu est construit a partir du parametre ?id=
   de l'URL, ce qui evite d'avoir une page HTML par carte. */

const NOMBRE_SUGGESTIONS = 5;

function parametreId() {
  return new URLSearchParams(window.location.search).get("id");
}

function essenceParNom(nom) {
  return ESSENCES.find(function (essence) {
    return essence.nom === nom;
  }) || null;
}

function description(carte) {
  const origine = carte.essence === "Neutre"
    ? "sans essence"
    : "de l'essence " + carte.essence;

  return "Carte " + carte.rarete.toLowerCase() + " " + origine
    + ", numerotee " + carte.numero + " dans le set Blurness 3."
    + " Vendue a l'unite, etat verifie avant expedition.";
}

function libelleStock(carte) {
  if (carte.stock === 0) {
    return "Rupture de stock";
  }
  if (carte.stock <= 5) {
    return "Plus que " + carte.stock + " en stock";
  }
  return "En stock";
}

function gabaritSuggestion(carte) {
  return `
    <a class="carte" href="produit.html?id=${carte.id}">
      <div class="carte__visuel">
        <img src="${carte.image}" alt="Carte ${carte.nom}" loading="lazy">
      </div>
      <div class="carte__infos">
        <p class="carte__nom">${carte.nom}</p>
        <div class="carte__pied">
          <span class="carte__prix">${formaterPrix(carte.prix)}</span>
          <span class="badge badge--${carte.rarete.toLowerCase()}">${carte.rarete}</span>
        </div>
      </div>
    </a>
  `;
}

function afficherSuggestions(carte) {
  const memeEssence = CARTES.filter(function (autre) {
    return autre.essence === carte.essence && autre.id !== carte.id;
  }).slice(0, NOMBRE_SUGGESTIONS);

  if (!memeEssence.length) {
    return;
  }

  document.querySelector("#suggestions").innerHTML = memeEssence.map(gabaritSuggestion).join("");
  document.querySelector("#bloc-suggestions").hidden = false;
}

function afficherCarte(carte) {
  const essence = essenceParNom(carte.essence);

  document.title = carte.nom + " - GM TCG Shop";
  document.querySelector("#fil-nom").textContent = " / " + carte.nom;

  const image = document.querySelector("#produit-image");
  image.src = carte.image;
  image.alt = "Carte " + carte.nom;

  document.querySelector("#produit-nom").textContent = carte.nom;
  document.querySelector("#produit-meta").textContent = "Carte No " + carte.numero + " - set Blurness 3";
  document.querySelector("#produit-prix").textContent = formaterPrix(carte.prix);
  document.querySelector("#produit-description").textContent = description(carte);

  const badgeEssence = document.querySelector("#produit-essence");
  badgeEssence.textContent = essence && carte.essence !== "Neutre"
    ? "Essence " + carte.essence
    : "Sans essence";
  if (essence) {
    badgeEssence.style.borderColor = essence.couleur;
    badgeEssence.style.color = essence.couleur;
  }

  const badgeRarete = document.querySelector("#produit-rarete");
  badgeRarete.textContent = carte.rarete;
  badgeRarete.className = "badge badge--" + carte.rarete.toLowerCase();

  document.querySelector("#produit-stock").textContent = libelleStock(carte);

  const quantite = document.querySelector("#quantite");
  const bouton = document.querySelector("#ajouter");
  if (carte.stock === 0) {
    quantite.disabled = true;
    bouton.disabled = true;
    bouton.textContent = "Indisponible";
  } else {
    quantite.max = carte.stock;
  }

  document.querySelector("#produit").hidden = false;
  afficherSuggestions(carte);
}

function brancherAchat(carte) {
  const bouton = document.querySelector("#ajouter");
  const message = document.querySelector("#message");

  bouton.addEventListener("click", function () {
    const quantite = parseInt(document.querySelector("#quantite").value, 10) || 1;
    if (!ajouterAuPanier(carte.id, quantite)) {
      return;
    }
    message.hidden = false;
    message.textContent = quantite + " x " + carte.nom + " ajoute au panier.";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  const carte = carteParId(parametreId());

  if (!carte) {
    document.querySelector("#produit-introuvable").hidden = false;
    return;
  }

  afficherCarte(carte);
  brancherAchat(carte);
});
