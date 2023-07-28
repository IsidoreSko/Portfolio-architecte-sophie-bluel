// Création de listes à elément unique:

const allWorks = new Set();
const allCategories = new Set();

// Variables concernant l'ajout de travaux:

const submitForm = document.getElementById("uploadForm");
const buttonSearchPhoto = document.getElementById("buttonAddPhoto");

const addImage = document.getElementById("addPicture");
const errorForm = document.querySelector(".error2");

const addCategoryImage = document.getElementById("category");
const addTitleImage = document.getElementById("title");

const buttonToValidate = document.getElementById("buttonModalSubmit");

let image = "";

const viewPicture = document.getElementById("viewPicture");

const formPicture = document.getElementById("formPicture");

// Variable pour le changement de modale:

const addButtonPhoto = document.querySelector(".buttonModal");

// Fonction "init":::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

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

// Fonction pour les bases de données::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Pour récupérer les données selon leur type:
async function getAlldatabaseInfo(type) {
  const response = await fetch("http://localhost:5678/api/" + type);
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
  }
}

// Pour supprimer les travaux de la galerie:
async function deleteWork(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return "success";
  } else {
    return "error";
  }
}

// Pour ajouter des travaux dans la galerie:
async function addWork(formData) {
  const response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  if (response.ok) {
    return response.json();
  } else {
    console.log(response);
    return false;
  }
}

// Fonction pour l'affichage des travaux dans la page d'accueil:::::::::::::::::::::::::::::::::

async function displayWorks(id = "0") {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFigures = document.querySelector(".gallery");
  // Et effacer son contenu du fichier HTML:
  allFigures.innerHTML = "";
  for (const work of allWorks) {
    if (id == work.categoryId || id == "0") {
      // Création d’une balise dédiée à chaque travail:
      let figureElement = document.createElement("figure");
      // On crée l’élément "img":
      let imageElement = document.createElement("img");
      // On crée l’élément "figcaption":
      let figcaptionElement = document.createElement("figcaption");
      // Ajout d'un "id" suivant la catégorie:
      figureElement.setAttribute("id", `${work.categoryId}`);
      // On accède à l’indice de la liste des travaux pour configurer la source de l’image:
      imageElement.src = work.imageUrl;
      // On accède à l’indice de la liste des travaux pour configurer le titre des travaux:
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

// Création des filtres pour sélectionner l'affichage des travaux::::::::::::::::::::::::::::

// Récupération de l'élément du DOM qui accueillera les boutons:
const allFilters = document.querySelector(".allFilters");
// Fonction pour l'affichage des boutons filtres:
async function displayFiltres() {
  // Création du bouton "Tous":
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
    // // Création d’une balise dédiée à chaque bouton:
    const buttonCategory = document.createElement("button");
    // Ajout des "class" des boutons:
    buttonCategory.classList.add("buttonCategory", "filter");
    // Ajout des "id" des boutons:
    buttonCategory.dataset.id = category.id;
    // Ajout du nom de la catégorie des boutons:
    buttonCategory.textContent = category.name;
    // Ratachement des balises "button" au parent:
    fragment.appendChild(buttonCategory);
  }
  allFilters.appendChild(fragment);
  createFilterListener();
}

// Fonction pour le filtrage des travaux::::::::::::::::::::::::::::::::::::::::::::::::::::::

function createFilterListener() {
  // Création d'une constante qui récupère tous les boutons:
  const allBtns = document.querySelectorAll(".filter");

  for (const buttonCategory of allBtns) {
    buttonCategory.addEventListener("click", (e) => {
      // Création d'une constante pour l'événement sur le bouton cliqué:
      const clickedBtn = e.target;
      // Création d'une constante pour le bouton cliqué:
      const selectedId = clickedBtn.dataset.id;
      // Supression de la "class" "active" du bouton:
      document.querySelector(".active").classList.remove("active");
      // Ajout de la "class" "active" sur le bouton cliqué:
      clickedBtn.classList.add("active");
      // Action de selection selon le bouton cliqué:
      switch (selectedId) {
        // Objet:
        case "1":
          displayWorks(1);
          break;
        // Appartements:
        case "2":
          displayWorks(2);
          break;
        // Hotels & restaurants:
        case "3":
          displayWorks(3);
          break;
        // Tous:
        default:
          displayWorks();
      }
    });
  }
}

// Création de l'affichage en mode édition::::::::::::::::::::::::::::::::::::::::::::::::::::

let token = sessionStorage.getItem("token");
async function editMode() {
  const loginOrLogout = document.querySelector(".loginOrLogout");
  const topBar = document.querySelector(".topBar");
  const changeOne = document.getElementById("changeOne");
  const changeTwo = document.getElementById("changeTwo");
  const changeThree = document.getElementById("changeThree");

  if (token) {
    // Supression de la barre des filtres:
    allFilters.style.display = "none";

    // Changement du lien "Login" en lien "Logout":
    loginOrLogout.innerText = "logout";

    loginOrLogout.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      window.location.href = "./login.html";
    });
  }
  // On reste dans l'affichage de la page d'accueil:
  else {
    topBar.style.display = "none";
    allFilters.style.display = "flex";
    loginOrLogout.innerText = "login";
    changeOne.style.display = "none";
    changeTwo.style.display = "none";
    changeThree.style.display = "none";
  }
}

// Création de la modale pour la suppression des travaux :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Pour l'ouverture de la modale:
let modal = null;
const openModal = function (e) {
  e.preventDefault();
  const target = document.querySelector(e.target.getAttribute("href"));
  target.style.display = null;
  target.removeAttribute("aria-hidden");
  target.setAttribute("aria-modal", "true");
  modal = target;
  target.addEventListener("click", closeModal);
  // Fermeture en cliquant sur la croix:
  modal.querySelector(".cross").addEventListener("click", closeModal);
  modal.querySelector(".cross2").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  changeModal(false);
};

// Pour la fermeture de la modale:
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  // Pour permettre les animation à la fermeture de la modale:
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 500);
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal.querySelector(".cross").removeEventListener("click", closeModal);
  modal.querySelector(".cross2").removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
};

// Pour éviter la fermeture de la modale au click sur son contenu:
const stopPropagation = function (e) {
  e.stopPropagation();
};

// Evènement d'ouverture de la modale sur chaque lien concerné:
//  (seule la modification de la galerie est actif):
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// Fermeture de la modale en appuyant sur la touche "échape":
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// Pour le changement de modale::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

addButtonPhoto.addEventListener("click", function () {
  changeModal(true);
});

const backArrowModal = document.querySelector(".arrowBack");
backArrowModal.addEventListener("click", function () {
  changeModal(false);
});

function changeModal(view) {
  const modal1 = document.querySelector(".modal1");
  const modal2 = document.querySelector(".modal2");
  if (view) {
    modal2.style.display = "flex";
    modal1.style.display = "none";
  } else {
    modal2.style.display = "none";
    modal1.style.display = "flex";
  }
}

// Afficher les travaux dans la modale:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Fonction pour l'affichage des travaux:
async function displayWorksModal() {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFiguresModal = document.querySelector(".galleryModal");
  // Et effacer son contenu du fichier HTML:
  allFiguresModal.innerHTML = "";
  for (const work of allWorks) {
    // Création d’une balise dédiée à chaque travail:
    let figureElement = document.createElement("figure");
    // Création d'une "class" pour les figures:
    figureElement.classList.add("figureModal");
    // Création d'une "class" par figure:
    figureElement.classList.add(`number${work.id}`);
    // Création de l’élément "img" :
    let imageElement = document.createElement("img");
    // Création de l’élément "figcaption" :
    let figcaptionElement = document.createElement("figcaption");
    // Ajout d'un "id" suivant la catégorie:
    figureElement.setAttribute("id", `${work.categoryId}`);
    // On accède à l’indice de la liste des travaux pour configurer la source de l’image:
    imageElement.src = work.imageUrl;
    // Ajout du texte"éditer"dans la balise "figcation":
    figcaptionElement.innerText = "éditer";
    // On rattache la balise "figure" à la section "allFigure":
    allFiguresModal.appendChild(figureElement);
    // On rattache l’image à l'élément "figure":
    figureElement.appendChild(imageElement);
    // On rattache l’image à l'élément "figcation":
    figureElement.appendChild(figcaptionElement);
    // Création de l'icône "supprimer":
    let iconFigure = document.createElement("i");
    // Ajout des "class" de l'icône:
    iconFigure.classList.add("fa-solid", "fa-trash-can");
    // Rattachement de l'icône à la "figure":
    figureElement.appendChild(iconFigure);

    // Supression d'un des travaux au click sur l'icône dans la modale et dans l'API:::::::::::
    iconFigure.addEventListener("click", async (e) => {
      e.preventDefault();

      const testDelete = await deleteWork(work.id);
      if (testDelete == "success") {
        figureElement.remove();
        allWorks.delete(work);
        displayWorks();
      }
    });
    // Ajout de l'icône "déplacer" sur la première image dans la galerie de la modale:
    if (`number${work.id}` == "number1") {
      // Création de l'icône "déplacer":
      let iconFigureArrow = document.createElement("i");
      // Ajout des "class" de l'icône:
      iconFigureArrow.classList.add("fa-solid", "fa-arrows-up-down-left-right");
      // Rattachement de l'icône à la "figure":
      figureElement.appendChild(iconFigureArrow);
    }
  }
}

// Pour l'ajout d'une nouvelle photo dans la Modal:::::::::::::::::::::::::::::::::::::::::::::

buttonSearchPhoto.addEventListener("change", (e) => {
  e.preventDefault();
  // Récupérer le fichier sélectionné:
  const input = e.target;
  const selectFile = input.files[0];
  // Condition pour la taille du fichier:
  if (
    selectFile.size > 4 * 1024 * 1024 ||
    (selectFile.type !== "image/png" && selectFile.type !== "image/jpeg")
  ) {
    errorForm.innerHTML = "Mauvais format d'image";
    return false;
    // Ajout de l'image dans le formulaire:
  } else {
    input.src = "";
    image = selectFile;
    const imgUrl = URL.createObjectURL(image);
    const img = document.createElement("img");
    img.src = imgUrl;
    viewPicture.innerHTML = "";
    formPicture.style.display = "none";
    viewPicture.appendChild(img);
    return true;
  }
});

// Pour supprimer la photo ajoutée dans le formulaire:
const crossDeletePicture = document.querySelector(".cross3");
crossDeletePicture.addEventListener("click", function (e) {
  resetForm(e);
});

// Fonction pour le remplissage du formulaire::::::::::::::::::::::::::::::::::::::::::::::::::

function submitFunc() {
  // Si aucune photo n'a étée ajouté:
  if (image == "" || viewPicture.innerHTML == "") {
    console.log(image);
    errorForm.innerHTML = "Veuillez ajouter une photo";
    return false;
  }
  // S'il n'y a pas de titre renseigné:
  if (addTitleImage.value == "") {
    errorForm.innerHTML = "Veuillez renseigner le titre";
    return false;
  }
  // S'il n'y a pas de catégorie renseignée:
  if (addCategoryImage.value == "" || addCategoryImage.value == "default") {
    errorForm.innerHTML = "Veuillez renseigner la catégorie";
    return false;
  }

  // Changement de couleur du bouton "valider" si le formulaire est rempli:
  buttonToValidate.style.backgroundColor = "#1D6154";
  errorForm.innerHTML = "";
  return true;
}

// Ajout des travaux dans l'API::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

submitForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const test = submitFunc();
  if (!test) {
    return false;
  }
  // Création d'un nouvel objet formData:
  const formData = new FormData();
  formData.append("image", image);
  formData.append("title", addTitleImage.value);
  formData.append("category", addCategoryImage.value);
  // Ajout d'un nouveau travail et ses conséquences:
  const newWork = await addWork(formData);
  if (newWork) {
    allWorks.add(newWork);
    displayWorks();
    displayWorksModal();
    resetForm(e);
    closeModal(e);
  }
});

// // Fornction pour réinitialiser le formulaire::::::::::::::::::::::::::::::::::::::::::::::::::

function resetForm(e) {
  e.preventDefault();

  //  Vider l'emplacement de l'image ajoutée:
  const img = viewPicture.querySelector("img");
  if (img) {
    img.src == "";
    viewPicture.innerHTML = "";
  }

  // Pour vider les différents éléments du formulaire d'ajout:
  addTitleImage.value = "";
  addCategoryImage.value = "";
  errorForm.innerHTML = "";

  // Pour redonner la couleur d'origine au bouton "valider":
  buttonToValidate.style.backgroundColor = "#A7A7A7";

  // Pour faire réapparaître le formulaire pour l'ajout d'image:
  formPicture.style.display = "flex";
}
