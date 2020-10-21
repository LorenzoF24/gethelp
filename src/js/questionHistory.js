const questionBox = document.querySelector("[data-question-box]");
const historyBox = document.querySelector("[data-history-box]");

$.get(
  "./php/select/selectOneQuestion.php",
  () => {
    $(`<div class="lds-roller"></div>`)
      .html(
        `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
      )
      .appendTo("[data-question-box]");
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
              </div>
              `
    )
    .appendTo("[data-question-box]");

  // Historique
  $.post(
    "./php/select/selectQuestionHistory.php",
    { id: questionId },
    null,
    "json"
  )
    .done((data) => {
      data.forEach((question) => {
        $(`<div class="topic__container"></div>`)
          .html(
            `
              <div class="topic__question-container">
                <div class="topic__question-context">
                  <p class="comment">${question.corps.replace(
                    /\n/g,
                    "<br />"
                  )}</p>
                </div>
                <div class="topic__user">
                  <p class="paragraph">${question.datemodif}</p>
                </div>
              </div>
              `
          )
          .appendTo("[data-history-box]");
      });
    })
    .fail((req, err) => console.log(req.responseText));
});
