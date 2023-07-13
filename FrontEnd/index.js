// Création de listes à eléments unique:::::::::::::::::::::::::::::::::::::::::::::::::::::

const allWorks = new Set();
const allCategories = new Set();

// Variables concernant l'ajout de travaux:

const submitForm = document.getElementById("buttonModalSubmit");
const buttonSearchPhoto = document.getElementById("buttonAddPhoto");

const addImage = document.getElementById("addPicture");
const selectFile = buttonSearchPhoto.files[0];
const errorForm = document.querySelector(".error2");

const addCategoryImage = document.getElementById("category");
const addTitleImage = document.getElementById("title");

// Variable pour le chnagement de Modal:

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

// Pour suprimer un travail de la galerie:
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
  }
}

// Fonction pour l'affichage les travaux dans la page d'accueil:::::::::::::::::::::::::::::::::

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

// Création des filtres pour sélectionner l'affichage des travaux::::::::::::::::::::::::::::

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

// Fonction pour le filtrage des travaux::::::::::::::::::::::::::::::::::::::::::::::::::::::

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

// Création de l'affichage en mode édition::::::::::::::::::::::::::::::::::::::::::::::::::::

let token = sessionStorage.getItem("token");
async function editMode() {
  const loginOrLogout = document.querySelector(".loginOrLogout");
  const topBar = document.querySelector(".topBar");
  const changeOne = document.querySelector(".changeOne");
  const changeTwo = document.querySelector(".changeTwo");
  const changeThree = document.querySelector(".changeThree");

  if (token) {
    // Supression de la barre des filtres:
    allFilters.style.display = "none";

    // Changement du lien "Login" en lien "Logout":::::::::::::::::::::::::::::::::::::::::
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

// Création de la modal pour la suppression des travaux :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Pour l'ouverture de la Modal:
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

// Pour la fermeture de la Modal:
const closeModal = function (e) {
  if (modal === null) return;
  e.preventDefault();
  // Pour permettre les animation à la fermeture de la modal:
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

// Pour éviter la fermeture de la modal au click sur son contenu:
const stopPropagation = function (e) {
  e.stopPropagation();
};

// Evenement d'ouverture de la modal sur chaque lien concerné:
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

// Fermeture de la modal en appuyant sur la touche "échape":
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
});

// Afficher les travaux dans la modal::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// Fonction pour l'affichage des travaux:
async function displayWorksModal() {
  // Récupération de l'élément du DOM qui accueillera les travaux:
  const allFiguresModal = document.querySelector(".galleryModal");
  // Et effacer son contenu du fichier HTML:
  allFiguresModal.innerHTML = "";
  // const buttonSearchPhoto = document.getElementById("buttonAddPhoto");
  for (const work of allWorks) {
    // Création d’une balise dédiée à chaque travail:
    let figureElement = document.createElement("figure");
    // Création d'une "class" pour les figures:
    figureElement.classList.add("figureModal");
    // Création d'une "class" par figures:
    figureElement.classList.add(`number${work.id}`);
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
    // Création de l'icône "supprimé":
    let iconFigure = document.createElement("i");
    // Ajout des "class" de l'icône:
    iconFigure.classList.add("fa-solid", "fa-trash-can");
    // Rattachement de l'icône à la "figure":
    figureElement.appendChild(iconFigure);

    // Supression d'un des travaux au click sur l'icône:
    iconFigure.addEventListener("click", async (e) => {
      e.preventDefault();

      const testDelete = await deleteWork(work.id);
      if (testDelete == "success") {
        figureElement.remove();
        allWorks.delete(work);
        displayWorks();
      }
    });

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

// Ajout des travaux:
submitForm.addEventListener("click", async (e) => {
  e.preventDefault();
  submitFunc();

  const formData = new FormData();
  formData.append("image", buttonSearchPhoto.files[0]);
  formData.append("title", addTitleImage.value);
  formData.append("category", addCategoryImage.value);

  if (addWork(formData)) {
    // displayWorksModal();
    allWorks.add();
    // displayWorks();
    resetForm(e);
  } else {
    console.log("error");
  }
});

// Pour le changement de modal::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

// const addButtonPhoto = document.querySelector(".buttonModal");
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

// Pour l'ajout d'une nouvelle photo:
buttonSearchPhoto.addEventListener("change", async (e) => {
  e.preventDefault();

  if (
    selectFile.size > 4 * 1024 * 1024 ||
    (selectFile.type !== "image/png" && selectFile.type !== "image/jpeg")
  ) {
    errorForm.innerHTML = "Mauvais format d'image";
    return false;
  } else {
    if (selectFile) {
      const imgUrl = URL.createObjectURL(selectFile);
      const img = document.createElement("img");
      img.src = imgUrl;
      addImage.innerHTML = "";
      addImage.appendChild(img);
    }
  }
});

// Fonction pour le remplissage du formulaire::::::::::::::::::::::::::::::::::::::::::::::::::

async function submitFunc() {
  // console.log(addCategoryImage.value);
  // console.log(addTitleImage.value);
  // console.log(buttonSearchPhoto.files[0]);

  // S'il n'y a pas de titre renseigné: //
  if (addTitleImage.value === "") {
    errorForm.innerHTML = "Veuillez renseigner le titre";
    return false;
  }
  if (addCategoryImage.value === "default") {
    errorForm.innerHTML = "Veuillez renseigner la catégorie";
    return false;
  }
  // Changement de couleur du bouton "valider" si le formulaire est rempli:
  submitForm.style.backgroundColor = "#1D6154";
}

// Fornction pour réinitialiser le formulaire::::::::::::::::::::::::::::::::::::::::::::::::
function resetForm(e) {
  e.preventDefault;
  // console.log(addTitleImage.value);
  // console.log(addCategoryImage.value);
  // console.log(addImage);
  addTitleImage.value = "";
  addCategoryImage.value = "";
  buttonSearchPhoto.files[0].value = "";
  addImage.remove(selectFile);
  // photoName.innerHTML = "";
  // buttonSearchPhoto.value = "";
  // console.log(buttonSearchPhoto.value);
  // addImage.value = "";
  // console.log(addImage.value);
  // selectFile.value = "";
  // console.log(selectFile.value);
  // addImage.display = "bloc";
  // buttonSearchPhoto.files[0].name.innerHTML = "";
  // console.log(photoName.name);
  // addImage.value=""
  // const imageNone = addImage.querySelector("img");
  // if (imageNone) {
  //   imageNone.src = "";
  //   selectFile.src = "";
  //   // addImage.remove("src");
  //   console.log(selectFile);
  // }
}
