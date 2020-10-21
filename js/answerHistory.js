"use strict";

var answerBox = document.querySelector("[data-answer-box]");
var historyBox = document.querySelector("[data-history-box]");

historyBox.style.marginTop = "2rem";

$.get("./php/select/selectOneAnswer.php", null, function () {
  $("<div class=\"lds-roller\"></div>").html("<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>").appendTo("[data-answer-box]");
}, "json").done(function (data) {
  $(".lds-roller").remove();
  var answer = data[0];
  $("<div class=\"topic__container\" id=\"r-" + answer.idAnswer + "\"></div>").html("\n                  <div class=\"topic__reply-container\">\n                    <div class=\"topic__reply\">\n                      <p class=\"comment\">" + answer.body.replace(/\n/g, "<br />") + "</p>\n                    </div>\n                    <div class=\"topic__user\">\n                      <p class=\"paragraph\">" + answer.pseudoUser + "</p>\n                      <p class=\"paragraph\">" + answer.dater + "</p>\n                    </div>\n                    <div class=\"topic__dropdown hidden\" data-answer-dropdown>\n                      <a href=\"#\" class=\"navigation__link\" data-historyAnswerBtn=" + answer.idAnswer + ">Historique de modification</a>\n                      <a href=\"#\" class=\"navigation__link\" data-answerId=" + answer.idAnswer + ">Supprimer</a>\n                  </div>\n                  </div>\n                ").appendTo("[data-answer-box]");

  // Historique
  $.post("./php/select/selectAnswerHistory.php", { id: answer.idAnswer }, null, "json").done(function (data) {
    // console.log(data);

    data.forEach(function (answer) {
      $("<div class=\"topic__container\" id=\"r-" + answer.idreponse + "\"></div>").html("\n                  <div class=\"topic__reply-container\">\n                    <div class=\"topic__reply\">\n                      <p class=\"comment\">" + answer.corps.replace(/\n/g, "<br />") + "</p>\n                    </div>\n                    <div class=\"topic__user\">\n                      <p class=\"paragraph\">" + answer.datemodif + "</p>\n                    </div>\n                  </div>\n                ").appendTo("[data-history-box]");
    });
  }).fail(function (req, err) {
    return console.log(req.responseText);
  });
}).fail(function (req, err) {
  return console.log(req.responseText);
});