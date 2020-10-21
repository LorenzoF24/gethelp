"use strict";

// Remplir la liste déroulante
$.get("./php/select/selectLanguage.php", null, null, "json").done(function (data) {
  var selectAddLanguage = document.querySelector("[data-add-select-languages]");

  data.forEach(function (langage) {
    selectAddLanguage.innerHTML += "<option class=\"form__option\" value=\"" + langage.nomlangage + "\">" + langage.nomlangage + "</option>";
  });
});

// ******************** //
//     ADD QUESTION     //
// ******************** //
$("#addQuestion").submit(function (event) {
  event.preventDefault();
  var serializedData = $(this).serialize();

  $.post("./php/add/addQuestion.php", serializedData, null, "json").done(function (data) {
    return location.href = "./index.html";
  }).fail(function (req, err) {
    return alert(req.responseText);
  });
});