"use strict";

$("#search").submit(function (e) {
  e.preventDefault();
  var serializedData = $(this).serializeArray();

  $.post("./php/select/selectQuestions.php", serializedData).done(function () {
    $("[data-search-field]").val("");
    location.href = "index.html";
  }).fail(function (error) {
    return console.log(error.responseText);
  });
});