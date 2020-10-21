const questionBox = document.querySelector("[data-question-box]");
const repliesBox = document.querySelector("[data-replies-box]");

$.get(
  "./php/select/selectOneQuestion.php",
  () => {
    $(`<div class="lds-roller"></div>`)
      .html(
        `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
      )
      .appendTo("[data-topic]");
  },
  "json"
).done((data) => {
  const questionId = data[0].idQuestion;

  $(".lds-roller").remove();
  $(`<div class="topic__title"></div>`)
    .html(
      `
          <div class="topic__language">
            <h1 class="heading-primary u-invert-color">${data[0].langage}</h1>
          </div>
          <h1 class="heading-primary">
            <i class="fa fa-chevron-right" aria-hidden="true"></i>
          </h1>
          <div class="topic__label">
            <h1 class="heading-primary">
              ${data[0].topic}
            </h1>
          </div>
        `
    )
    .appendTo("[data-question-box]");

  $(`<div class="topic__container"></div>`)
    .html(
      `
              <div class="topic__question-container">
                <div class="topic__question-context">
                  <p class="comment">${data[0].body.replace(
                    /\n/g,
                    "<br />"
                  )}</p>
                </div>
                <div class="topic__user">
                  <p class="paragraph">${data[0].userPseudo}</p>
                  <p class="paragraph">${data[0].dateq}</p>
                </div>
                <div class="topic__dropdown hidden" data-question-dropdown>
                  <a href="#" class="navigation__link" data-historyBtn>Historique de modification</a>
                  <a href="#" class="navigation__link" data-questionId=${
                    data[0].idQuestion
                  }>Supprimer</a>
                </div>
              </div>
              <div class="topic__votes">
                <div class="topic__votes-up" data-vote-up-question id=${
                  data[0].idQuestion
                }>
                  <i class="fa fa-angle-double-up" aria-hidden="true"></i>
                </div>
                <span>${data[0].upVotes}</span>
                <div class="topic__votes-down" data-vote-down-question id=${
                  data[0].idQuestion
                }>
                  <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                </div>
              </div>
              `
    )
    .appendTo("[data-question-box]");

  // Dropdown
  const dropdownQuestion = document.querySelector("[data-question-dropdown]");
  const questionContent = document.querySelector(".topic__question-container");

  questionContent.addEventListener("click", (e) => {
    dropdownQuestion.classList.toggle("hidden");
  });

  const questionHistoryBtn = document.querySelector("[data-historyBtn]");

  questionHistoryBtn.addEventListener("click", (e) => {
    e.preventDefault();
    location.href = "questionHistory.html";
  });

  // Suppression
  const deleteQuestion = document.querySelectorAll("[data-questionId]");

  deleteQuestion.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      if (
        window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")
      ) {
        const idquestion = btn.getAttribute("data-questionId");

        $.post(
          "./php/delete/deleteQuestionAdmin.php",
          { id_question: idquestion },
          null,
          "json"
        )
          .done((data) => {
            location.href = "index.html";
          })
          .fail((req, error) => alert(req.responseText));
      }
    });
  });

  // Vote question
  const upVoteQuestion = document.querySelector("[data-vote-up-question]");
  const downVoteQuestion = document.querySelector("[data-vote-down-question]");

  // Pré check si déjà voté par l'utilisateur
  $.get("./php/votes/voteQuestionStatus.php", () => {}, "json").done(
    (status) => {
      if (status.votestatus === 1) {
        upVoteQuestion.classList.add("topic__votes-up--voted");
      } else if (status.votestatus === -1) {
        downVoteQuestion.classList.add("topic__votes-down--voted");
      }
    }
  );

  upVoteQuestion.addEventListener("click", (e) => {
    $.post("./php/votes/voteUpQuestion.php", null, null, "json")
      .done((data) => {
        location.reload();
      })
      .fail((req, err) => alert(req.responseText));
  });

  downVoteQuestion.addEventListener("click", (e) => {
    $.post("./php/votes/voteDownQuestion.php", null, null, "json")
      .done((data) => {
        location.reload();
      })
      .fail((req, err) => alert(req.responseText));
  });

  displayAnswers();

  // Post de la réponse
  $("#reponse-question").submit(function (e) {
    e.preventDefault();
    let serializedData = $(this).serialize();
    serializedData += `&idQuestion=${questionId}`;

    // On poste la réponse
    $.post("./php/add/addAnswer.php", serializedData, null, "json")
      .done((data) => {
        repliesBox.innerHTML = "";
        $("#reponse-text").val("");

        // On regénère les réponses
        displayAnswers();
      })
      .fail((req, err) => alert(req.responseText));
  });
});

function displayAnswers() {
  // Réponses
  $.get(
    "./php/select/selectAnswers.php",
    () => {
      $(`<div class="lds-roller"></div>`)
        .html(
          `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
        )
        .appendTo("[data-replies-box]");
    },
    "json"
  ).done((data) => {
    $(".lds-roller").remove();

    data.forEach((answer) => {
      $(`<div class="topic__container" id="r-${answer.idAnswer}"></div>`)
        .html(
          `
                  <div class="topic__reply-container">
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
                    <div class="topic__dropdown hidden" data-answer-dropdown>
                      <a href="#" class="navigation__link" data-historyAnswerBtn=${
                        answer.idAnswer
                      }>Historique de modification</a>
                      <a href="#" class="navigation__link" data-answerId=${
                        answer.idAnswer
                      }>Supprimer</a>
                  </div>
                  </div>
                  <div class="topic__votes">
                    <div class="topic__votes-up" data-vote-up-answer id=${
                      answer.idAnswer
                    }>
                      <i class="fa fa-angle-double-up" aria-hidden="true"></i>
                    </div>
                    <span>${answer.upVotes}</span>
                    <div class="topic__votes-down" data-vote-down-answer id=${
                      answer.idAnswer
                    }>
                      <i class="fa fa-angle-double-down" aria-hidden="true"></i>
                    </div>
                  </div>
                `
        )
        .appendTo("[data-replies-box]");
    });

    // Dropdown
    const dropdownAnswser = document.querySelectorAll("[data-answer-dropdown]");
    const answerContent = document.querySelectorAll(".topic__reply-container");

    answerContent.forEach((elt, i) => {
      elt.addEventListener("click", (e) => {
        dropdownAnswser[i].classList.toggle("hidden");
      });
    });

    // Options
    const answerHistoryButton = document.querySelectorAll(
      "[data-historyAnswerBtn]"
    );

    answerHistoryButton.forEach((btn) => {
      const answerHistoryId = btn.getAttribute("data-historyAnswerBtn");
      btn.addEventListener("click", (e) => {
        $.post(
          "./php/select/selectOneAnswer.php",
          { id: answerHistoryId },
          null,
          "json"
        )
          .done((data) => {
            location.href = "answerHistory.html";
          })
          .fail((req, err) => console.log("Erreur"));
      });
    });

    // Suppression réponse
    const deleteAnswerUser = document.querySelectorAll("[data-answerId]");

    deleteAnswerUser.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cette réponse ?")
        ) {
          const idAnswerUser = btn.getAttribute("data-answerId");

          $.post(
            "./php/delete/deleteAnswerAdmin.php",
            { id_answer: idAnswerUser },
            null,
            "json"
          )
            .done((data) => location.reload())
            .fail((req, error) => alert(req.responseText));
        }
      });
    });

    // VOTES
    const upVoteRep = document.querySelectorAll("[data-vote-up-answer]");
    const downVoteRep = document.querySelectorAll("[data-vote-down-answer]");

    upVoteRep.forEach((upvote) => {
      const id = upvote.getAttribute("id");

      // Pré check du bouton si déjà upvote par l'utilisateur
      $.get(
        "./php/votes/voteAnswerStatus.php",
        { id_answer: id },
        null,
        "json"
      ).done((statusVote) => {
        const status = statusVote.votestatus;

        if (status === 1) {
          upvote.classList.add("topic__votes-up--voted");
        }
      });

      upvote.addEventListener("click", function (e) {
        const idRep = this.getAttribute("id");
        $.post(
          "./php/votes/voteUpAnswer.php",
          { id_reponse: idRep },
          null,
          "json"
        )
          .done((data) => {
            location.href = `#r-${idRep}`;
            location.reload(true);
          })
          .fail((req, err) => alert(req.responseText));
      });
    });

    downVoteRep.forEach((downvote) => {
      const id = downvote.getAttribute("id");

      // Pré check du bouton si déjà downvote par l'utilisateur
      $.get(
        "./php/votes/voteAnswerStatus.php",
        { id_answer: id },
        null,
        "json"
      ).done((statusVote) => {
        const status = statusVote.votestatus;

        if (status === -1) {
          downvote.classList.add("topic__votes-down--voted");
        }
      });

      downvote.addEventListener("click", function () {
        const idRep = this.getAttribute("id");
        $.post(
          "./php/votes/voteDownAnswer.php",
          { id_reponse: idRep },
          null,
          "json"
        )
          .done((data) => {
            location.href = `#r-${idRep}`;
            location.reload(true);
          })
          .fail((req, err) => alert(req.responseText));
      });
    });
  });
}
