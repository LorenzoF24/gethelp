// *************************************** //
//    CLOSING POPUP WHEN CLICKING ASIDE    //
// *************************************** //

// VARAIBLES
const popups = document.querySelectorAll(".popup");

// EVENT LISTENERS
popups.forEach((popup) => {
  popup.addEventListener("click", (e) => {
    if (e.target.classList[0] === "popup") {
      location.href = "#top-page";
    }
  });
});

// ***************************************** //
//    LOGIN/REGISTRATION POPUP TRANSITION    //
// ***************************************** //

// VARIABLES
const btnRegistration = document.querySelector("#btn-registration");
const popupLogin = document.querySelector("#popup-login .popup__content");
const popupRegister = document.querySelector(
  "#popup-registration .popup__content"
);

// EVENT LISTENERS
btnRegistration.addEventListener("click", (e) => {
  popupLogin.classList.add("u-moveOutLeft");
  popupRegister.classList.add("u-moveInRight");

  // On retire les classes après 1.5 sec (càd 0.5s après les animations)
  setTimeout(() => {
    popupLogin.classList.remove("u-moveOutLeft");
    popupRegister.classList.remove("u-moveInRight");
  }, 1500);
});
