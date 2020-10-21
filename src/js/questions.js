// NEW Version
$.get(
  "./php/select/selectQuestions.php",
  () => {
    $(".lds-roller").remove();
    $(`<div class="lds-roller"></div>`)
      .html(
        `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
      )
      .appendTo("#questions-container");
  },
  "json"
).done((data) => {
  $(".lds-roller").remove();

  if (data.length === 0) {
    document.querySelector("#questions-container").innerHTML +=
      '<div class="u-warning u-mt-md">Aucune question.</div>';
    return;
  }

  data.forEach((question) => {
    $(`<div class="card" id=${question.idQuestion} data-question-card></div>`)
      .html(
        `
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
        `
      )
      .appendTo("#questions-container");
  });

  // VARIABLES
  const questionCards = document.querySelectorAll("[data-question-card]");

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
});
