"use strict";

// ****************** //
//    COLOR SCHEME    //
// ****************** //

// VARIABLES
var btnToggleScheme = document.querySelector("#btn-toggle-scheme");
var imgLogo = document.querySelector(".navigation__logo");

// EVENT LISTENERS
document.addEventListener("DOMContentLoaded", detectedColorScheme);

btnToggleScheme.addEventListener("click", function () {
  if (document.documentElement.getAttribute("data-scheme") === "dark") {
    localStorage.setItem("scheme", "light");
    document.documentElement.setAttribute("data-scheme", "light");

    btnToggleScheme.innerHTML = '<i class="fas fa-sun"></i>';
    imgLogo.src = "./img/logo_light.png";
  } else {
    localStorage.setItem("scheme", "dark");
    document.documentElement.setAttribute("data-scheme", "dark");

    btnToggleScheme.innerHTML = '<i class="fas fa-moon"></i>';
    imgLogo.src = "./img/logo_dark.png";
  }
});

// FUNCTIONS
function detectedColorScheme() {
  var theme = "light";

  if (localStorage.getItem("scheme") === null) {
    if (!window.matchMedia) {
      return false;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      theme = "dark";
    }
  } else {
    theme = localStorage.getItem("scheme");
  }

  if (theme === "dark") {
    document.documentElement.setAttribute("data-scheme", "dark");
    btnToggleScheme.innerHTML = '<i class="fas fa-moon"></i>';
    imgLogo.src = "./img/logo_dark.png";
  } else {
    document.documentElement.setAttribute("data-scheme", "light");
    btnToggleScheme.innerHTML = '<i class="fas fa-sun"></i>';
    imgLogo.src = "./img/logo_light.png";
  }
}