"use strict";

var questionBox = document.querySelector("[data-question-box]");
var repliesBox = document.querySelector("[data-replies-box]");

$.get("./php/select/selectOneQuestion.php", function () {
  $("<div class=\"lds-roller\"></div>").html("<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>").appendTo("[data-topic]");
}, "json").done(function (data) {
  var questionId = data[0].idQuestion;

  $(".lds-roller").remove();
  $("<div class=\"topic__title\"></div>").html("\n          <div class=\"topic__language\">\n            <h1 class=\"heading-primary u-invert-color\">" + data[0].langage + "</h1>\n          </div>\n          <h1 class=\"heading-primary\">\n            <i class=\"fa fa-chevron-right\" aria-hidden=\"true\"></i>\n          </h1>\n          <div class=\"topic__label\">\n            <h1 class=\"heading-primary\">\n              " + data[0].topic + "\n            </h1>\n          </div>\n        ").appendTo("[data-question-box]");

  $("<div class=\"topic__container\"></div>").html("\n              <div class=\"topic__question-container\">\n                <div class=\"topic__question-context\">\n                  <p class=\"comment\">" + data[0].body.replace(/\n/g, "<br />") + "</p>\n                </div>\n                <div class=\"topic__user\">\n                  <p class=\"paragraph\">" + data[0].userPseudo + "</p>\n                  <p class=\"paragraph\">" + data[0].dateq + "</p>\n                </div>\n                <div class=\"topic__dropdown hidden\" data-question-dropdown>\n                  <a href=\"#\" class=\"navigation__link\" data-historyBtn>Historique de modification</a>\n                  <a href=\"#\" class=\"navigation__link\" data-questionId=" + data[0].idQuestion + ">Supprimer</a>\n                </div>\n              </div>\n              <div class=\"topic__votes\">\n                <div class=\"topic__votes-up\" data-vote-up-question id=" + data[0].idQuestion + ">\n                  <i class=\"fa fa-angle-double-up\" aria-hidden=\"true\"></i>\n                </div>\n                <span>" + data[0].upVotes + "</span>\n                <div class=\"topic__votes-down\" data-vote-down-question id=" + data[0].idQuestion + ">\n                  <i class=\"fa fa-angle-double-down\" aria-hidden=\"true\"></i>\n                </div>\n              </div>\n              ").appendTo("[data-question-box]");

  // Dropdown
  var dropdownQuestion = document.querySelector("[data-question-dropdown]");
  var questionContent = document.querySelector(".topic__question-container");

  questionContent.addEventListener("click", function (e) {
    dropdownQuestion.classList.toggle("hidden");
  });

  var questionHistoryBtn = document.querySelector("[data-historyBtn]");

  questionHistoryBtn.addEventListener("click", function (e) {
    e.preventDefault();
    location.href = "questionHistory.html";
  });

  // Suppression
  var deleteQuestion = document.querySelectorAll("[data-questionId]");

  deleteQuestion.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
        var idquestion = btn.getAttribute("data-questionId");

        $.post("./php/delete/deleteQuestionAdmin.php", { id_question: idquestion }, null, "json").done(function (data) {
          location.href = "index.html";
        }).fail(function (req, error) {
          return alert(req.responseText);
        });
      }
    });
  });

  // Vote question
  var upVoteQuestion = document.querySelector("[data-vote-up-question]");
  var downVoteQuestion = document.querySelector("[data-vote-down-question]");

  // Pré check si déjà voté par l'utilisateur
  $.get("./php/votes/voteQuestionStatus.php", function () {}, "json").done(function (status) {
    if (status.votestatus === 1) {
      upVoteQuestion.classList.add("topic__votes-up--voted");
    } else if (status.votestatus === -1) {
      downVoteQuestion.classList.add("topic__votes-down--voted");
    }
  });

  upVoteQuestion.addEventListener("click", function (e) {
    $.post("./php/votes/voteUpQuestion.php", null, null, "json").done(function (data) {
      location.reload();
    }).fail(function (req, err) {
      return alert(req.responseText);
    });
  });

  downVoteQuestion.addEventListener("click", function (e) {
    $.post("./php/votes/voteDownQuestion.php", null, null, "json").done(function (data) {
      location.reload();
    }).fail(function (req, err) {
      return alert(req.responseText);
    });
  });

  displayAnswers();

  // Post de la réponse
  $("#reponse-question").submit(function (e) {
    e.preventDefault();
    var serializedData = $(this).serialize();
    serializedData += "&idQuestion=" + questionId;

    // On poste la réponse
    $.post("./php/add/addAnswer.php", serializedData, null, "json").done(function (data) {
      repliesBox.innerHTML = "";
      $("#reponse-text").val("");

      // On regénère les réponses
      displayAnswers();
    }).fail(function (req, err) {
      return alert(req.responseText);
    });
  });
});

function displayAnswers() {
  // Réponses
  $.get("./php/select/selectAnswers.php", function () {
    $("<div class=\"lds-roller\"></div>").html("<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>").appendTo("[data-replies-box]");
  }, "json").done(function (data) {
    $(".lds-roller").remove();

    data.forEach(function (answer) {
      $("<div class=\"topic__container\" id=\"r-" + answer.idAnswer + "\"></div>").html("\n                  <div class=\"topic__reply-container\">\n                    <div class=\"topic__reply\">\n                      <p class=\"comment\">" + answer.body.replace(/\n/g, "<br />") + "</p>\n                    </div>\n                    <div class=\"topic__user\">\n                      <p class=\"paragraph\">" + answer.pseudoUser + "</p>\n                      <p class=\"paragraph\">" + answer.dater + "</p>\n                    </div>\n                    <div class=\"topic__dropdown hidden\" data-answer-dropdown>\n                      <a href=\"#\" class=\"navigation__link\" data-historyAnswerBtn=" + answer.idAnswer + ">Historique de modification</a>\n                      <a href=\"#\" class=\"navigation__link\" data-answerId=" + answer.idAnswer + ">Supprimer</a>\n                  </div>\n                  </div>\n                  <div class=\"topic__votes\">\n                    <div class=\"topic__votes-up\" data-vote-up-answer id=" + answer.idAnswer + ">\n                      <i class=\"fa fa-angle-double-up\" aria-hidden=\"true\"></i>\n                    </div>\n                    <span>" + answer.upVotes + "</span>\n                    <div class=\"topic__votes-down\" data-vote-down-answer id=" + answer.idAnswer + ">\n                      <i class=\"fa fa-angle-double-down\" aria-hidden=\"true\"></i>\n                    </div>\n                  </div>\n                ").appendTo("[data-replies-box]");
    });

    // Dropdown
    var dropdownAnswser = document.querySelectorAll("[data-answer-dropdown]");
    var answerContent = document.querySelectorAll(".topic__reply-container");

    answerContent.forEach(function (elt, i) {
      elt.addEventListener("click", function (e) {
        dropdownAnswser[i].classList.toggle("hidden");
      });
    });

    // Options
    var answerHistoryButton = document.querySelectorAll("[data-historyAnswerBtn]");

    answerHistoryButton.forEach(function (btn) {
      var answerHistoryId = btn.getAttribute("data-historyAnswerBtn");
      btn.addEventListener("click", function (e) {
        $.post("./php/select/selectOneAnswer.php", { id: answerHistoryId }, null, "json").done(function (data) {
          location.href = "answerHistory.html";
        }).fail(function (req, err) {
          return console.log("Erreur");
        });
      });
    });

    // Suppression réponse
    var deleteAnswerUser = document.querySelectorAll("[data-answerId]");

    deleteAnswerUser.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")) {
          var idAnswerUser = btn.getAttribute("data-answerId");

          $.post("./php/delete/deleteAnswerAdmin.php", { id_answer: idAnswerUser }, null, "json").done(function (data) {
            return location.reload();
          }).fail(function (req, error) {
            return alert(req.responseText);
          });
        }
      });
    });

    // VOTES
    var upVoteRep = document.querySelectorAll("[data-vote-up-answer]");
    var downVoteRep = document.querySelectorAll("[data-vote-down-answer]");

    upVoteRep.forEach(function (upvote) {
      var id = upvote.getAttribute("id");

      // Pré check du bouton si déjà upvote par l'utilisateur
      $.get("./php/votes/voteAnswerStatus.php", { id_answer: id }, null, "json").done(function (statusVote) {
        var status = statusVote.votestatus;

        if (status === 1) {
          upvote.classList.add("topic__votes-up--voted");
        }
      });

      upvote.addEventListener("click", function (e) {
        var idRep = this.getAttribute("id");
        $.post("./php/votes/voteUpAnswer.php", { id_reponse: idRep }, null, "json").done(function (data) {
          location.href = "#r-" + idRep;
          location.reload(true);
        }).fail(function (req, err) {
          return alert(req.responseText);
        });
      });
    });

    downVoteRep.forEach(function (downvote) {
      var id = downvote.getAttribute("id");

      // Pré check du bouton si déjà downvote par l'utilisateur
      $.get("./php/votes/voteAnswerStatus.php", { id_answer: id }, null, "json").done(function (statusVote) {
        var status = statusVote.votestatus;

        if (status === -1) {
          downvote.classList.add("topic__votes-down--voted");
        }
      });

      downvote.addEventListener("click", function () {
        var idRep = this.getAttribute("id");
        $.post("./php/votes/voteDownAnswer.php", { id_reponse: idRep }, null, "json").done(function (data) {
          location.href = "#r-" + idRep;
          location.reload(true);
        }).fail(function (req, err) {
          return alert(req.responseText);
        });
      });
    });
  });
}