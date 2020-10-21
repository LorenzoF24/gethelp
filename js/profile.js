"use strict";

/////////////////////////////
// Questions de l'utilisateur
/////////////////////////////

$.get("./php/select/selectProfileQuestions.php", function () {}, "json").done(function (questions) {
  if (questions.length === 0) {
    document.querySelector("#profile-questions").innerHTML += '<div class="u-warning u-mt-md">Aucune question.</div>';
    return;
  }

  questions.forEach(function (question) {
    $("<div class=\"row\"></div>").html("\n          <div class=\"card\" id=" + question.idQuestion + " data-question-card>\n            <div class=\"card__language\">\n                <h2 class=\"heading-secondary u-invert-color\">" + question.langage + "</h2>\n            </div>\n            <div class=\"card__question-container\">\n                <div class=\"card__question\">\n                <h1 class=\"heading-secondary\">" + question.topic + "</h1>\n                </div>\n                <div class=\"card__user\">\n                <p class=\"paragraph\">" + question.userPseudo + "</p>\n                </div>\n                <div class=\"card__date\">\n                <p class=\"paragraph\">" + question.dateq + "</p>\n                </div>\n            </div>\n            <div class=\"card__info-container\">\n                <div class=\"card__status-answers\" title=\"R\xE9ponses\">\n                    <div class=\"card__img-answer\">\n                        <i class=\"fa fa-comment\" aria-hidden=\"true\"></i>\n                    </div>\n                    <span>" + question.nbreponse + "</span>\n                    </div>\n                    <div class=\"card__status-votes\" title=\"Votes\">\n                    <i class=\"fa fa-angle-double-up\" aria-hidden=\"true\"></i>\n                    <span>" + question.upVotes + "</span>\n                </div>\n            </div>\n          </div>\n          <div class=\"modif-btn\">\n            <a href=\"#popup-modify-question\" class=\"btn btn--primary\" data-btn-modify-question=" + question.idQuestion + ">Modifier</a>\n            <a href=\"#\" class=\"btn btn--danger\" data-btn-delete-question=" + question.idQuestion + " >Supprimer</a>\n          </div>\n        ").appendTo("#profile-questions");
  });

  // VARIABLES
  var questionCards = document.querySelectorAll("[data-question-card]");
  var btnDeleteQuesion = document.querySelectorAll("[data-btn-delete-question]");

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

  btnDeleteQuesion.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette question?")) {
        var questionId = this.getAttribute("id");
        location.href = "#" + questionId;

        $.post("./php/delete/deleteQuestion.php", { id_question: questionId }, "json").done(function () {
          return location.reload();
        }).fail(function (error) {
          return console.log(error.responseText);
        });
      }
    });
  });

  // Modification de la question
  var btnModifQuestion = document.querySelectorAll("[data-btn-modify-question]");

  btnModifQuestion.forEach(function (btn) {
    var idquestion = btn.getAttribute("data-btn-modify-question");

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      $.get("./php/select/selectOneQuestion.php", { question_id_modification: idquestion }, null, "json").done(function (data) {
        document.querySelector("#txt-modify-question").innerHTML = data[0].body.replace(/\n/g, "&#13;&#10;");
        location.href = "#popup-modify-question";

        // Submit de la modification
        $("#form_modify_question").submit(function (e) {
          e.preventDefault();
          var corps = $("#txt-modify-question").val();

          $.post("./php/update/updateQuestion.php", { id: idquestion, corps: corps }, null, "json").done(function (data) {
            return location.href = "profile.html";
          }).fail(function (req, err) {
            return alert(req.responseText);
          });
        });
      }).fail(function (req, err) {
        return console.log("Erreur");
      });
    });
  });
});

/////////////////////////////
// Réponses de l'utilisateur
/////////////////////////////
$.get("./php/select/selectProfileAnswers.php", function () {}, "json").done(function (data) {
  if (data.length === 0) {
    document.querySelector("#profile-replies").innerHTML += '<div class="u-warning u-mt-md">Aucune réponse.</div>';
    return;
  }

  data.forEach(function (answer) {
    $("#profile-replies").append("\n            <div class=\"row\">\n              <div class=\"topic__reply-container\" data-answerId=" + answer.idAnswer + " id=" + answer.idQuestion + ">\n                  <div class=\"topic__reply\">\n                      <p class=\"comment\">" + answer.body.replace(/\n/g, "<br />") + "</p>\n                  </div>\n                  <div class=\"topic__user\">\n                      <p class=\"paragraph\">" + answer.pseudoUser + "</p>\n                      <p class=\"paragraph\">" + answer.dater + "</p>\n                  </div>\n              </div>\n              <div class=\"modif-btn\">\n                <a href=\"#popup-modify-question\" class=\"btn btn--primary\" data-btn-modify-answer=" + answer.idAnswer + ">Modifier</a>\n                <a href=\"#\" class=\"btn btn--danger\" data-btn-delete-answer=" + answer.idAnswer + ">Supprimer</a>\n              </div>\n            </div>\n            ");
  });

  var replyBox = document.querySelectorAll(".topic__reply-container");
  var btnDeleteAnswer = document.querySelectorAll("[data-btn-delete-answer]");
  var btnModifyAnswer = document.querySelectorAll("[data-btn-modify-answer]");

  replyBox.forEach(function (reply) {
    reply.addEventListener("click", function (e) {
      var questionId = this.getAttribute("id");

      $.post("./php/select/selectOneQuestion.php", { id: questionId }, "text").done(function () {
        return location.href = "question.html";
      });
    });
  });

  // Suppression réponse
  btnDeleteAnswer.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse?")) {
        var answerId = this.getAttribute("data-btn-delete-answer");

        $.post("./php/delete/deleteAnswer.php", { id_answer: answerId }, "json").done(function () {
          return location.reload();
        }).fail(function (error) {
          return console.log(error.responseText);
        });
      }
    });
  });

  // Modification réponse
  btnModifyAnswer.forEach(function (btn) {
    var answerIdModif = btn.getAttribute("data-btn-modify-answer");

    btn.addEventListener("click", function (e) {
      e.preventDefault();

      $.get("./php/select/selectOneAnswer.php", { id: answerIdModif }, null, "json").done(function (data) {
        document.querySelector("#txt-modify-answer").innerHTML = data[0].body.replace(/\n/g, "&#13;&#10;");
        location.href = "#popup-modify-answer";

        // Submit de la modification
        $("#form_modify_answer").submit(function (e) {
          e.preventDefault();
          var corps = $("#txt-modify-answer").val();

          $.post("./php/update/updateAnswer.php", { id: answerIdModif, corps: corps }, null, "json").done(function (data) {
            return location.href = "profile.html";
          }).fail(function (req, err) {
            return alert(req.responseText);
          });
        });
      }).fail(function (req, err) {
        return console.log(req.responseText);
      });
    });
  });
});

// ************** //
//  TABS PROFILE  //
// ************** //

// Variables
var tabcontent = document.querySelectorAll(".tab-content");
var tablinks = document.querySelectorAll(".tab__link");

// Afficher / masquer onglets
tablinks.forEach(function (link, i) {
  link.addEventListener("click", function () {
    tabcontent.forEach(function (content) {
      content.style.display = "none";
    });

    tablinks.forEach(function (link) {
      link.classList.remove("tab__link--visited");
    });

    tabcontent[i].style.display = "flex";
    tablinks[i].classList.add("tab__link--visited");
  });
});

// Afficher premier onglet par défaut
tabcontent.forEach(function (content) {
  content.style.display = "none";
});

tabcontent[0].style.display = "flex";
tablinks[0].classList.add("tab__link--visited");