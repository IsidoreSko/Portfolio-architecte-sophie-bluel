// Création de listes:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

const allWorks = new Set();
const allCategories = new Set();

// Fonction "init"::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

async function init() {
  // Pour récupérer les données des "travaux":
  const works = await getAlldatabaseInfo("works");
  for (const work of works) {
    allWorks.add(work);
  }
  // Pour récupérer les données des "catégories":
  const categories = await getAlldatabaseInfo("categories");

  for (const category of categories) {
    allCategories.add(category);
  }
  displayWorks();
  displayFiltres();
  editMode();
  displayWorksModal();
}

init();

// Fonction pour les bases de données::::::::::::::::::::::::::::::::::::::::::::::

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
async function displayWorks(id = "0") {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFigures = document.querySelector(".gallery");
  // Et effacer son contenu du fichier HTML:
  allFigures.innerHTML = "";
  for (const work of allWorks) {
    if (id == work.categoryId || id == "0") {
      // Création d’une balise dédiée chaque travail:
      let figureElement = document.createElement("figure");
      // On crée l’élément img. :
      let imageElement = document.createElement("img");
      // On crée l’élément "figcaption" :
      let figcaptionElement = document.createElement("figcaption");
      // Ajout d'un "id" suivant la catégorie:
      figureElement.setAttribute("id", `${work.categoryId}`);
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
}

// Récupération de l'élément du DOM qui accueillera les boutons:
const allFilters = document.querySelector(".allFilters");
// Fonction pour l'affichage des boutons filtres:
async function displayFiltres() {
  // Créaion du bouton "Tous":
  const allBtn = document.createElement("button");
  // Ajout des "class" sur le bouton:
  allBtn.classList.add("buttonCategory", "filter", "active");
  // Ajout du texte du bouton:
  allBtn.textContent = "Tous";
  // Ajout d'un "id" pour le bouton:
  allBtn.dataset.id = "0";

  const fragment = document.createDocumentFragment();
  fragment.appendChild(allBtn);
  for (const category of allCategories) {
    // // Création d’une balise dédiée chaque bouton:
    const buttonCategory = document.createElement("button");
    // Ajout des "class" des boutons:
    buttonCategory.classList.add("buttonCategory", "filter");
    // Ajout des "id" des boutons:
    buttonCategory.dataset.id = category.id;
    // Ajout du nom de la catégorie des boutons:
    buttonCategory.textContent = category.name;
    // Ratachement des balises "buton" au parent:
    fragment.appendChild(buttonCategory);
  }
  allFilters.appendChild(fragment);
  createFilterListener();
}

// Fonction pour la réalisation des filtres:
function createFilterListener() {
  // Crétion d'une constante qui récupère tous les boutons:
  const allBtns = document.querySelectorAll(".filter");

  for (const buttonCategory of allBtns) {
    buttonCategory.addEventListener("click", (e) => {
      // Création d'une constante pour l'événement sur le bouton cliqué:
      const clickedBtn = e.target;
      // Création d'une constante pour le bouton cliqué:
      const selectedId = clickedBtn.dataset.id;
      // Supréssion de la "class" "active" du bouton:
      document.querySelector(".active").classList.remove("active");
      // Ajout de la "class" "active" sur le bouton cliqué:
      clickedBtn.classList.add("active");

      switch (selectedId) {
        case "1":
          displayWorks(1);
          break;
        case "2":
          displayWorks(2);
          break;
        case "3":
          displayWorks(3);
          break;
        default:
          displayWorks();
      }
    });
  }
}

async function editMode() {
  let token = sessionStorage.getItem("token");
  const loginOrLogout = document.querySelector(".loginOrLogout");
  const topBar = document.querySelector(".topBar");
  const changeOne = document.querySelector(".changeOne");
  const changeTwo = document.querySelector(".changeTwo");
  const changeThree = document.querySelector(".changeThree");

  if (token) {
    // Supression de la barre des filtres:
    allFilters.style.display = "none";

    // Changement du lien "Login" en lien "Logout":::::::::::::::::::::::::::::::::::::

    loginOrLogout.innerText = "logout";

    loginOrLogout.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.href = "./login.html";
    });
  } else {
    topBar.style.display = "none";
    allFilters.style.display = "flex";
    loginOrLogout.innerText = "login";
    changeOne.style.display = "none";
    changeTwo.style.display = "none";
    changeThree.style.display = "none";
  }
}

// Au sujet de la modal::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Pour l'ouverture de la Modal:
let modal = null;
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  modal.addEventListener("click", closeModal);
};

document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// Pour la fermeture de la Modal:
const cross = document.querySelector(".cross");
const closeModal = function (e) {
  e.preventDefault();
  modal.style.display = "none";
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal = null;
};

// Fermeture en cliquant sur la croix:
cross.addEventListener("click", closeModal);

// Afficher les travaux dans la modal::::::::::::::::::::::::::::::::::::::::::::::::::

// Fonction pour l'affichage des travaux:
async function displayWorksModal(id = "0") {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFiguresModal = document.querySelector(".galleryModal");
  // Et effacer son contenu du fichier HTML:
  allFiguresModal.innerHTML = "";
  for (const work of allWorks) {
    if (id == work.categoryId || id == "0") {
      // Création d’une balise dédiée chaque travail:
      let figureElement = document.createElement("figure");
      // Création d'une "class" pour les figures:
      figureElement.classList.add("figureModal");
      // On crée l’élément img. :
      let imageElement = document.createElement("img");
      // On crée l’élément "figcaption" :
      let figcaptionElement = document.createElement("figcaption");
      // Ajout d'un "id" suivant la catégorie:
      figureElement.setAttribute("id", `${work.categoryId}`);
      // On accède à l’indice i de la liste des travaux pour configurer la source de l’image.
      imageElement.src = work.imageUrl;
      // // Et la balise "figcation":
      figcaptionElement.innerText = "éditer";
      // On rattache la balise "figure" à la section "allFigure":
      allFiguresModal.appendChild(figureElement);
      // On rattache l’image à l'élément "figure":
      figureElement.appendChild(imageElement);
      // On rattache l’image à l'élément "figcation":
      figureElement.appendChild(figcaptionElement);
    }
  }
}
