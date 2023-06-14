// Création des constantes::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const allWorks = new Set();
const allCategories = new Set();

// Fonction "init"::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function init() {
  const works = await getAlldatabaseInfo("works");
  for (const work of works) {
    allWorks.add(work);
  }
  const categories = await getAlldatabaseInfo("categories");
  for (const category of categories) {
    allCategories.add(category);
  }
  displayWorks();
}

init();

// Fonction pour les base de données:::::::::::::::::::::::::::::::::::::::::::

// Pour récupérer les données selon leur type:
async function getAlldatabaseInfo(type) {
  const response = await fetch("http://localhost:5678/api/" + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
  }
}
// const monTableau = Array.from(allWorks);
// Fonction pour l'affichage des travaux:
function displayWorks() {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFigures = document.querySelector(".gallery");
  // Et effacer son contenu du fichier HTML:
  allFigures.innerHTML = "";
  // for (let i = 0; i < allWorks.size; i++)
  for (const work of allWorks) {
    console.log(allWorks);
    // Création d’une balise dédiée chaque travail:
    let figureElement = document.createElement("figure");
    // On crée l’élément img. :
    let imageElement = document.createElement("img");
    // On crée l’élément "figcaption" :
    let figcaptionElement = document.createElement("figcaption");
    // On accède à l’indice i de la liste des travaux pour configurer la source de l’image.
    imageElement.src = work.imageUrl;
    // // Et la balise "figcation":
    figcaptionElement.innerText = work.title;
    // On rattache la balise "figure" à la section "allFigure":
    allFigures.appendChild(figureElement);
    // On rattache l’image à l'élément "figure":
    figureElement.appendChild(imageElement);
    // On rattache l’image à l'élément "figcation":
    figureElement.appendChild(figcaptionElement);
  }
}
