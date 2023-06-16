// Création de listes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const allWorks = new Set();
const allCategories = new Set();

// Fonction "init"::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// création du bouton de toutes les catégories:
let buttonCategory = document.createElement("button");
let allFilters = document.querySelector(".allFilters");
buttonCategory.classList.add(`button`, "filter");
buttonCategory.setAttribute("id", "0");
buttonCategory.type = "button";
buttonCategory.innerHTML = "Tous";
allFilters.appendChild(buttonCategory);

async function init() {
  // Pour récupérer les données des "travaux":
  const works = await getAlldatabaseInfo("works");
  for (const work of works) {
    allWorks.add(work);
  }
  // Pour récupérer les données des "catégories":
  const categories = await getAlldatabaseInfo("categories");
  displayWorks();
  for (const category of categories) {
    allCategories.add(category);
    // console.log(category.id);
    allCategories.add("tous");
    console.log(allCategories);
    // Création des boutons pour les catégories:
    let buttonCategory = document.createElement("button");
    let allFilters = document.querySelector(".allFilters");
    buttonCategory.classList.add(`button`, "filter");
    buttonCategory.setAttribute("id", `${category.id}`);
    buttonCategory.type = "button";
    buttonCategory.innerHTML = category.name;
    allFilters.appendChild(buttonCategory);
  }
}
// ${category.name}
init();

// Fonction pour les base de données::::::::::::::::::::::::::::::::::::::::::::::

// Pour récupérer les données selon leur type:
async function getAlldatabaseInfo(type) {
  const response = await fetch("http://localhost:5678/api/" + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
  }
}

// Fonction pour l'affichage des travaux:
async function displayWorks() {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFigures = document.querySelector(".gallery");
  // Et effacer son contenu du fichier HTML:
  allFigures.innerHTML = "";
  // for (let i = 0; i < allWorks.size; i++)
  for (const work of allWorks) {
    // console.log(work.categoryId);
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

// Création de la "div" allFilters:
// let allFilters = document.createElement("div");
// let portfolio = document.getElementById("portfolio");
// allFilters.classList.add("allFilters");
// portfolio.appendChild(allFilters);
