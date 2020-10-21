"use strict";

// ******************** //
//       REGISTER       //
// ******************** //

var registerPasswordField = document.querySelector("#registration-password");
var registerPasswordSwitch = document.querySelector("#registration-display-password");

registerPasswordSwitch.addEventListener("click", function (e) {
  if (this.checked) {
    registerPasswordField.type = "text";
  } else {
    registerPasswordField.type = "password";
  }
});

$("#register").submit(function (event) {
  event.preventDefault();
  var serializedData = $(this).serialize();

  $.post("./php/util/register.php", serializedData, null, "json").done(function (data) {
    location.href = "./index.html";
    alert("Dernière étape ! Veuillez confirmer votre email pour vous connecter. (Vérifiez les spams)");
  }).fail(function (request, error) {
    $("#registration-error .error-message").text(request.responseText);
    $("#registration-error").removeClass("hidden");
  });
});

$.get("./php/user/getUser.php", null, null, "json").done(function (data) {
  $("#nav-btn-login").addClass("hidden");

  $(".navigation__item--profile").removeClass("hidden");
  var linkProfile = document.querySelector(".navigation__item--profile").firstElementChild;

  linkProfile.innerHTML += "<span>" + data[0].pseudo + "</span>";
  linkProfile.addEventListener("click", function (e) {
    return e.preventDefault();
  });

  if (data[0].role === "admin") {
    $(".navigation__item--profile .dropdown-content").append("\n        <a href=\"profile.html\" class=\"navigation__link\">Mes questions et r\xE9ponses</a>\n        <a href=\"tableUsers.html\" class=\"navigation__link\">Gestion des utilisateurs</a>\n        <a href=\"notifications.html\" class=\"navigation__link\">Notifications</a>\n        <a href=\"#\" class=\"navigation__link\" id=\"disconnect\">Se d\xE9connecter</a>\n        <a href=\"#\" class=\"navigation__link navigation__link--danger\" id=\"delete-account\">Supprimer mon compte</a>\n      ");
  } else {
    $(".navigation__item--profile .dropdown-content").append("\n        <a href=\"profile.html\" class=\"navigation__link\">Mes questions et r\xE9ponses</a>\n        <a href=\"notifications.html\" class=\"navigation__link\">Notifications</a>\n        <a href=\"#\" class=\"navigation__link\" id=\"disconnect\">Se d\xE9connecter</a>\n        <a href=\"#\" class=\"navigation__link navigation__link--danger\" id=\"delete-account\">Supprimer mon compte</a>\n      ");
  }

  document.getElementById("disconnect").addEventListener("click", function (e) {
    e.preventDefault();

    $.post("php/util/disconnect.php").done(function () {
      return location.href = "index.html";
    }).fail(function () {
      return console.log("Erreur");
    });
  });

  document.getElementById("delete-account").addEventListener("click", function (e) {
    e.preventDefault();

    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.")) {
      $.post("./php/delete/deleteAccount.php").done(function () {
        return location.href = "index.html";
      }).fail(function () {
        return console.log("Erreur");
      });
    }
  });
}).fail(function (req, err) {
  console.log(req.responseText);
});

// ***************** //
//       LOGIN       //
// ***************** //
var loginPasswordField = document.querySelector("#login-password");
var loginPasswordSwitch = document.querySelector("#login-display-password");

loginPasswordSwitch.addEventListener("click", function (e) {
  if (this.checked) {
    loginPasswordField.type = "text";
  } else {
    loginPasswordField.type = "password";
  }
});

$("#login").submit(function (e) {
  e.preventDefault();
  var serializedData = $(this).serialize();

  $.post("./php/util/connect.php", serializedData, null, "json").done(function (data) {
    $("#nav-btn-login").addClass("hidden");

    $(".navigation__item--profile").removeClass("hidden");
    var linkProfile = document.querySelector(".navigation__item--profile").firstElementChild;

    linkProfile.innerHTML += "<span>" + data[0].pseudo + "</span>";
    location.href = "";
  }).fail(function (request, error) {
    $("#login-error .error-message").text(request.responseText);
    $("#login-error").removeClass("hidden");
  });
});