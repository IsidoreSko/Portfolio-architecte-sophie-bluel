const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
  // Empêche la soumission du formulaire par defaut:
  e.preventDefault();

  // Création des variables:
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const messageError = document.getElementById("error");

  // Envoi des valeurs à l'API:
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    // Récupération des valeurs email et mot de passe:
    body: JSON.stringify({
      email: email.value,
      password: password.value,
    }),
  });
  // Si la réponse est positive (status 200):
  if (response.ok) {
    // Récupération des données:
    const data = await response.json();
    // Récupération du "token" d'authentification:
    // const token = data.token;
    // Stockage du "token" dans le "localStorage":
    localStorage.setItem("token", data.token);
    // On redirige vers la page d'accueil:
    window.location.href = "./index.html";
  } else {
    // Sinon apparition du message d'erreur:
    messageError.textContent = "Erreur dans l’identifiant ou le mot de passe";
  }
});
