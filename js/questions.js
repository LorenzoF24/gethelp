"use strict";

// NEW Version
$.get("./php/select/selectQuestions.php", function () {
  $(".lds-roller").remove();
  $("<div class=\"lds-roller\"></div>").html("<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>").appendTo("#questions-container");
}, "json").done(function (data) {
  $(".lds-roller").remove();

  if (data.length === 0) {
    document.querySelector("#questions-container").innerHTML += '<div class="u-warning u-mt-md">Aucune question.</div>';
    return;
  }

  data.forEach(function (question) {
    $("<div class=\"card\" id=" + question.idQuestion + " data-question-card></div>").html("\n          <div class=\"card__language\">\n              <h2 class=\"heading-secondary u-invert-color\">" + question.langage + "</h2>\n          </div>\n          <div class=\"card__question-container\">\n              <div class=\"card__question\">\n              <h1 class=\"heading-secondary\">" + question.topic + "</h1>\n              </div>\n              <div class=\"card__user\">\n              <p class=\"paragraph\">" + question.userPseudo + "</p>\n              </div>\n              <div class=\"card__date\">\n              <p class=\"paragraph\">" + question.dateq + "</p>\n              </div>\n          </div>\n          <div class=\"card__info-container\">\n              <div class=\"card__status-answers\" title=\"R\xE9ponses\">\n                  <div class=\"card__img-answer\">\n                      <i class=\"fa fa-comment\" aria-hidden=\"true\"></i>\n                  </div>\n                  <span>" + question.nbreponse + "</span>\n                  </div>\n                  <div class=\"card__status-votes\" title=\"Votes\">\n                  <i class=\"fa fa-angle-double-up\" aria-hidden=\"true\"></i>\n                  <span>" + question.upVotes + "</span>\n              </div>\n          </div>\n        ").appendTo("#questions-container");
  });

  // VARIABLES
  var questionCards = document.querySelectorAll("[data-question-card]");

  // EVENT LISTENERS
  questionCards.forEach(function (question) {
    question.addEventListener("click", function () {
      var questionId = this.getAttribute("id");
      location.href = "#" + questionId;
      $.post("./php/select/selectOneQuestion.php", { id: questionId }, "text").done(function () {
        return location.href = "question.html";
      });
    });
  });
});