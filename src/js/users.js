// ******************** //
//       REGISTER       //
// ******************** //

const registerPasswordField = document.querySelector("#registration-password");
const registerPasswordSwitch = document.querySelector(
  "#registration-display-password"
);

registerPasswordSwitch.addEventListener("click", function (e) {
  if (this.checked) {
    registerPasswordField.type = "text";
  } else {
    registerPasswordField.type = "password";
  }
});

$("#register").submit(function (event) {
  event.preventDefault();
  let serializedData = $(this).serialize();

  $.post("./php/util/register.php", serializedData, null, "json")
    .done((data) => {
      location.href = "./index.html";
      alert(
        "Dernière étape ! Veuillez confirmer votre email pour vous connecter. (Vérifiez les spams)"
      );
    })
    .fail((request, error) => {
      $("#registration-error .error-message").text(request.responseText);
      $("#registration-error").removeClass("hidden");
    });
});

$.get("./php/user/getUser.php", null, null, "json")
  .done((data) => {
    $("#nav-btn-login").addClass("hidden");

    $(".navigation__item--profile").removeClass("hidden");
    const linkProfile = document.querySelector(".navigation__item--profile")
      .firstElementChild;

    linkProfile.innerHTML += `<span>${data[0].pseudo}</span>`;
    linkProfile.addEventListener("click", (e) => e.preventDefault());

    if (data[0].role === "admin") {
      $(".navigation__item--profile .dropdown-content").append(`
        <a href="profile.html" class="navigation__link">Mes questions et réponses</a>
        <a href="tableUsers.html" class="navigation__link">Gestion des utilisateurs</a>
        <a href="notifications.html" class="navigation__link">Notifications</a>
        <a href="#" class="navigation__link" id="disconnect">Se déconnecter</a>
        <a href="#" class="navigation__link navigation__link--danger" id="delete-account">Supprimer mon compte</a>
      `);
    } else {
      $(".navigation__item--profile .dropdown-content").append(`
        <a href="profile.html" class="navigation__link">Mes questions et réponses</a>
        <a href="notifications.html" class="navigation__link">Notifications</a>
        <a href="#" class="navigation__link" id="disconnect">Se déconnecter</a>
        <a href="#" class="navigation__link navigation__link--danger" id="delete-account">Supprimer mon compte</a>
      `);
    }

    document.getElementById("disconnect").addEventListener("click", (e) => {
      e.preventDefault();

      $.post("php/util/disconnect.php")
        .done(() => (location.href = "index.html"))
        .fail(() => console.log("Erreur"));
    });

    document.getElementById("delete-account").addEventListener("click", (e) => {
      e.preventDefault();

      if (
        window.confirm(
          "Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible."
        )
      ) {
        $.post("./php/delete/deleteAccount.php")
          .done(() => (location.href = "index.html"))
          .fail(() => console.log("Erreur"));
      }
    });
  })
  .fail((req, err) => {
    console.log(req.responseText);
  });

// ***************** //
//       LOGIN       //
// ***************** //
const loginPasswordField = document.querySelector("#login-password");
const loginPasswordSwitch = document.querySelector("#login-display-password");

loginPasswordSwitch.addEventListener("click", function (e) {
  if (this.checked) {
    loginPasswordField.type = "text";
  } else {
    loginPasswordField.type = "password";
  }
});

$("#login").submit(function (e) {
  e.preventDefault();
  let serializedData = $(this).serialize();

  $.post("./php/util/connect.php", serializedData, null, "json")
    .done((data) => {
      $("#nav-btn-login").addClass("hidden");

      $(".navigation__item--profile").removeClass("hidden");
      const linkProfile = document.querySelector(".navigation__item--profile")
        .firstElementChild;

      linkProfile.innerHTML += `<span>${data[0].pseudo}</span>`;
      location.href = "";
    })
    .fail((request, error) => {
      $("#login-error .error-message").text(request.responseText);
      $("#login-error").removeClass("hidden");
    });
});
