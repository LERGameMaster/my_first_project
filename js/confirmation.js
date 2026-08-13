/* Page de confirmation : la reference et le montant sont passes dans l'URL
   par la page de commande. */

document.addEventListener("DOMContentLoaded", function () {
  const parametres = new URLSearchParams(window.location.search);
  const reference = parametres.get("ref");
  const total = parseFloat(parametres.get("total"));

  if (reference) {
    document.querySelector("#reference").textContent = reference;
  }

  document.querySelector("#montant").textContent = isNaN(total)
    ? "-"
    : formaterPrix(total);
});
