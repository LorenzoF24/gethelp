"use strict";

var questionBox = document.querySelector("[data-question-box]");
var historyBox = document.querySelector("[data-history-box]");

$.get("./php/select/selectOneQuestion.php", function () {
  $("<div class=\"lds-roller\"></div>").html("<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>").appendTo("[data-question-box]");
}, "json").done(function (data) {
  var questionId = data[0].idQuestion;

  $(".lds-roller").remove();
  $("<div class=\"topic__title\"></div>").html("\n          <div class=\"topic__language\">\n            <h1 class=\"heading-primary u-invert-color\">" + data[0].langage + "</h1>\n          </div>\n          <h1 class=\"heading-primary\">\n            <i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i>\n          </h1>\n          <div class=\"topic__label\">\n            <h1 class=\"heading-primary\">\n              " + data[0].topic + "\n            </h1>\n          </div>\n        ").appendTo("[data-question-box]");

  $("<div class=\"topic__container\"></div>").html("\n              <div class=\"topic__question-container\">\n                <div class=\"topic__question-context\">\n                  <p class=\"comment\">" + data[0].body.replace(/\n/g, "<br />") + "</p>\n                </div>\n                <div class=\"topic__user\">\n                  <p class=\"paragraph\">" + data[0].userPseudo + "</p>\n                  <p class=\"paragraph\">" + data[0].dateq + "</p>\n                </div>\n              </div>\n              ").appendTo("[data-question-box]");

  // Historique
  $.post("./php/select/selectQuestionHistory.php", { id: questionId }, null, "json").done(function (data) {
    data.forEach(function (question) {
      $("<div class=\"topic__container\"></div>").html("\n              <div class=\"topic__question-container\">\n                <div class=\"topic__question-context\">\n                  <p class=\"comment\">" + question.corps.replace(/\n/g, "<br />") + "</p>\n                </div>\n                <div class=\"topic__user\">\n                  <p class=\"paragraph\">" + question.datemodif + "</p>\n                </div>\n              </div>\n              ").appendTo("[data-history-box]");
    });
  }).fail(function (req, err) {
    return console.log(req.responseText);
  });
});