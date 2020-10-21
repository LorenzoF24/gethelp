// Remplir la liste déroulante
$.get("./php/select/selectLanguage.php", null, null, "json").done((data) => {
  const selectAddLanguage = document.querySelector(
    "[data-add-select-languages]"
  );

  data.forEach((langage) => {
    selectAddLanguage.innerHTML += `<option class="form__option" value="${langage.nomlangage}">${langage.nomlangage}</option>`;
  });
});

// ******************** //
//     ADD QUESTION     //
// ******************** //
$("#addQuestion").submit(function (event) {
  event.preventDefault();
  let serializedData = $(this).serialize();

  $.post("./php/add/addQuestion.php", serializedData, null, "json")
    .done((data) => (location.href = "./index.html"))
    .fail((req, err) => alert(req.responseText));
});
