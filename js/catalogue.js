/* Rendu de la grille du catalogue, recherche et filtres. */

const grille = document.querySelector("#grille");
const compteurResultats = document.querySelector("#compteur-resultats");
const champRecherche = document.querySelector("#recherche");
const filtreEssence = document.querySelector("#filtre-essence");
const filtreRarete = document.querySelector("#filtre-rarete");
const boutonReinit = document.querySelector("#reinitialiser");
const selectTri = document.querySelector("#tri");

const etat = {
  recherche: "",
  essence: "",
  rarete: "",
  tri: "numero",
};

const TRIS = {
  numero: function (a, b) {
    return a.numero.localeCompare(b.numero);
  },
  "prix-croissant": function (a, b) {
    return a.prix - b.prix;
  },
  "prix-decroissant": function (a, b) {
    return b.prix - a.prix;
  },
  nom: function (a, b) {
    return a.nom.localeCompare(b.nom, "fr");
  },
};

function classeRarete(rarete) {
  return "badge badge--" + rarete.toLowerCase();
}

function normaliser(texte) {
  return texte
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
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

function filtrer() {
  const recherche = normaliser(etat.recherche.trim());

  return CARTES.filter(function (carte) {
    if (etat.essence && carte.essence !== etat.essence) {
      return false;
    }
    if (etat.rarete && carte.rarete !== etat.rarete) {
      return false;
    }
    if (!recherche) {
      return true;
    }
    return normaliser(carte.nom).indexOf(recherche) !== -1
      || carte.numero.indexOf(recherche) !== -1;
  });
}

function afficher(cartes) {
  if (!cartes.length) {
    grille.innerHTML = '<p class="vide">Aucune carte ne correspond a cette recherche.</p>';
  } else {
    grille.innerHTML = cartes.map(gabaritCarte).join("");
  }
  compteurResultats.textContent = cartes.length + " carte" + (cartes.length > 1 ? "s" : "");
}

function trier(cartes) {
  const comparateur = TRIS[etat.tri] || TRIS.numero;
  return cartes.slice().sort(comparateur);
}

function rafraichir() {
  afficher(trier(filtrer()));
}

function remplirFiltres() {
  ESSENCES.forEach(function (essence) {
    const option = document.createElement("option");
    option.value = essence.nom;
    option.textContent = "Essence " + essence.nom;
    filtreEssence.appendChild(option);
  });

  RARETES.forEach(function (rarete) {
    const option = document.createElement("option");
    option.value = rarete;
    option.textContent = rarete;
    filtreRarete.appendChild(option);
  });
}

function brancherFiltres() {
  champRecherche.addEventListener("input", function (event) {
    etat.recherche = event.target.value;
    rafraichir();
  });

  filtreEssence.addEventListener("change", function (event) {
    etat.essence = event.target.value;
    rafraichir();
  });

  filtreRarete.addEventListener("change", function (event) {
    etat.rarete = event.target.value;
    rafraichir();
  });

  selectTri.addEventListener("change", function (event) {
    etat.tri = event.target.value;
    rafraichir();
  });

  boutonReinit.addEventListener("click", function () {
    etat.recherche = "";
    etat.essence = "";
    etat.rarete = "";
    etat.tri = "numero";
    champRecherche.value = "";
    filtreEssence.value = "";
    filtreRarete.value = "";
    selectTri.value = "numero";
    rafraichir();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  remplirFiltres();
  brancherFiltres();
  rafraichir();
});
