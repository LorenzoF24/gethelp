/////////////////////////////
// Questions de l'utilisateur
/////////////////////////////

$.get("./php/select/selectProfileQuestions.php", () => {}, "json").done(
  (questions) => {
    if (questions.length === 0) {
      document.querySelector("#profile-questions").innerHTML +=
        '<div class="u-warning u-mt-md">Aucune question.</div>';
      return;
    }

    questions.forEach((question) => {
      $(`<div class="row"></div>`)
        .html(
          `
          <div class="card" id=${question.idQuestion} data-question-card>
            <div class="card__language">
                <h2 class="heading-secondary u-invert-color">${question.langage}</h2>
            </div>
            <div class="card__question-container">
                <div class="card__question">
                <h1 class="heading-secondary">${question.topic}</h1>
                </div>
                <div class="card__user">
                <p class="paragraph">${question.userPseudo}</p>
                </div>
                <div class="card__date">
                <p class="paragraph">${question.dateq}</p>
                </div>
            </div>
            <div class="card__info-container">
                <div class="card__status-answers" title="Réponses">
                    <div class="card__img-answer">
                        <i class="fa fa-comment" aria-hidden="true"></i>
                    </div>
                    <span>${question.nbreponse}</span>
                    </div>
                    <div class="card__status-votes" title="Votes">
                    <i class="fa fa-angle-double-up" aria-hidden="true"></i>
                    <span>${question.upVotes}</span>
                </div>
            </div>
          </div>
          <div class="modif-btn">
            <a href="#popup-modify-question" class="btn btn--primary" data-btn-modify-question=${question.idQuestion}>Modifier</a>
            <a href="#" class="btn btn--danger" data-btn-delete-question=${question.idQuestion} >Supprimer</a>
          </div>
        `
        )
        .appendTo("#profile-questions");
    });

    // VARIABLES
    const questionCards = document.querySelectorAll("[data-question-card]");
    const btnDeleteQuesion = document.querySelectorAll(
      "[data-btn-delete-question]"
    );

    // EVENT LISTENERS
    questionCards.forEach((question) => {
      question.addEventListener("click", function () {
        const questionId = this.getAttribute("id");
        location.href = `#${questionId}`;
        $.post(
          "./php/select/selectOneQuestion.php",
          { id: questionId },
          "text"
        ).done(() => (location.href = "question.html"));
      });
    });

    btnDeleteQuesion.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cette question?")
        ) {
          const questionId = this.getAttribute("id");
          location.href = `#${questionId}`;

          $.post(
            "./php/delete/deleteQuestion.php",
            { id_question: questionId },
            "json"
          )
            .done(() => location.reload())
            .fail((error) => console.log(error.responseText));
        }
      });
    });

    // Modification de la question
    const btnModifQuestion = document.querySelectorAll(
      "[data-btn-modify-question]"
    );

    btnModifQuestion.forEach((btn) => {
      const idquestion = btn.getAttribute("data-btn-modify-question");

      btn.addEventListener("click", (e) => {
        e.preventDefault();

        $.get(
          "./php/select/selectOneQuestion.php",
          { question_id_modification: idquestion },
          null,
          "json"
        )
          .done((data) => {
            document.querySelector(
              "#txt-modify-question"
            ).innerHTML = data[0].body.replace(/\n/g, "&#13;&#10;");
            location.href = "#popup-modify-question";

            // Submit de la modification
            $("#form_modify_question").submit(function (e) {
              e.preventDefault();
              const corps = $("#txt-modify-question").val();

              $.post(
                "./php/update/updateQuestion.php",
                { id: idquestion, corps: corps },
                null,
                "json"
              )
                .done((data) => (location.href = "profile.html"))
                .fail((req, err) => alert(req.responseText));
            });
          })
          .fail((req, err) => console.log("Erreur"));
      });
    });
  }
);

/////////////////////////////
// Réponses de l'utilisateur
/////////////////////////////
$.get("./php/select/selectProfileAnswers.php", () => {}, "json").done(
  (data) => {
    if (data.length === 0) {
      document.querySelector("#profile-replies").innerHTML +=
        '<div class="u-warning u-mt-md">Aucune réponse.</div>';
      return;
    }

    data.forEach((answer) => {
      $("#profile-replies").append(`
            <div class="row">
              <div class="topic__reply-container" data-answerId=${
                answer.idAnswer
              } id=${answer.idQuestion}>
                  <div class="topic__reply">
                      <p class="comment">${answer.body.replace(
                        /\n/g,
                        "<br />"
                      )}</p>
                  </div>
                  <div class="topic__user">
                      <p class="paragraph">${answer.pseudoUser}</p>
                      <p class="paragraph">${answer.dater}</p>
                  </div>
              </div>
              <div class="modif-btn">
                <a href="#popup-modify-question" class="btn btn--primary" data-btn-modify-answer=${
                  answer.idAnswer
                }>Modifier</a>
                <a href="#" class="btn btn--danger" data-btn-delete-answer=${
                  answer.idAnswer
                }>Supprimer</a>
              </div>
            </div>
            `);
    });

    const replyBox = document.querySelectorAll(".topic__reply-container");
    const btnDeleteAnswer = document.querySelectorAll(
      "[data-btn-delete-answer]"
    );
    const btnModifyAnswer = document.querySelectorAll(
      "[data-btn-modify-answer]"
    );

    replyBox.forEach((reply) => {
      reply.addEventListener("click", function (e) {
        const questionId = this.getAttribute("id");

        $.post(
          "./php/select/selectOneQuestion.php",
          { id: questionId },
          "text"
        ).done(() => (location.href = "question.html"));
      });
    });

    // Suppression réponse
    btnDeleteAnswer.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse?")
        ) {
          const answerId = this.getAttribute("data-btn-delete-answer");

          $.post(
            "./php/delete/deleteAnswer.php",
            { id_answer: answerId },
            "json"
          )
            .done(() => location.reload())
            .fail((error) => console.log(error.responseText));
        }
      });
    });

    // Modification réponse
    btnModifyAnswer.forEach((btn) => {
      const answerIdModif = btn.getAttribute("data-btn-modify-answer");

      btn.addEventListener("click", (e) => {
        e.preventDefault();

        $.get(
          "./php/select/selectOneAnswer.php",
          { id: answerIdModif },
          null,
          "json"
        )
          .done((data) => {
            document.querySelector(
              "#txt-modify-answer"
            ).innerHTML = data[0].body.replace(/\n/g, "&#13;&#10;");
            location.href = "#popup-modify-answer";

            // Submit de la modification
            $("#form_modify_answer").submit(function (e) {
              e.preventDefault();
              const corps = $("#txt-modify-answer").val();

              $.post(
                "./php/update/updateAnswer.php",
                { id: answerIdModif, corps: corps },
                null,
                "json"
              )
                .done((data) => (location.href = "profile.html"))
                .fail((req, err) => alert(req.responseText));
            });
          })
          .fail((req, err) => console.log(req.responseText));
      });
    });
  }
);

// ************** //
//  TABS PROFILE  //
// ************** //

// Variables
const tabcontent = document.querySelectorAll(".tab-content");
const tablinks = document.querySelectorAll(".tab__link");

// Afficher / masquer onglets
tablinks.forEach((link, i) => {
  link.addEventListener("click", () => {
    tabcontent.forEach((content) => {
      content.style.display = "none";
    });

    tablinks.forEach((link) => {
      link.classList.remove("tab__link--visited");
    });

    tabcontent[i].style.display = "flex";
    tablinks[i].classList.add("tab__link--visited");
  });
});

// Afficher premier onglet par défaut
tabcontent.forEach((content) => {
  content.style.display = "none";
});

tabcontent[0].style.display = "flex";
tablinks[0].classList.add("tab__link--visited");
