"use strict";

// *************************************** //
//    CLOSING POPUP WHEN CLICKING ASIDE    //
// *************************************** //

// VARAIBLES
var popups = document.querySelectorAll(".popup");

// EVENT LISTENERS
popups.forEach(function (popup) {
  popup.addEventListener("click", function (e) {
    if (e.target.classList[0] === "popup") {
      location.href = "#top-page";
    }
  });
});

// ***************************************** //
//    LOGIN/REGISTRATION POPUP TRANSITION    //
// ***************************************** //

// VARIABLES
var btnRegistration = document.querySelector("#btn-registration");
var popupLogin = document.querySelector("#popup-login .popup__content");
var popupRegister = document.querySelector("#popup-registration .popup__content");

// EVENT LISTENERS
btnRegistration.addEventListener("click", function (e) {
  popupLogin.classList.add("u-moveOutLeft");
  popupRegister.classList.add("u-moveInRight");

  // On retire les classes après 1.5 sec (càd 0.5s après les animations)
  setTimeout(function () {
    popupLogin.classList.remove("u-moveOutLeft");
    popupRegister.classList.remove("u-moveInRight");
  }, 1500);
});