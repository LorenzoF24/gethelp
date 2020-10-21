const answerBox = document.querySelector("[data-answer-box]");
const historyBox = document.querySelector("[data-history-box]");

historyBox.style.marginTop = "2rem";

$.get(
  "./php/select/selectOneAnswer.php",
  null,
  () => {
    $(`<div class="lds-roller"></div>`)
      .html(
        `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`
      )
      .appendTo("[data-answer-box]");
  },
  "json"
)
  .done((data) => {
    $(".lds-roller").remove();
    const answer = data[0];
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
                `
      )
      .appendTo("[data-answer-box]");

    // Historique
    $.post(
      "./php/select/selectAnswerHistory.php",
      { id: answer.idAnswer },
      null,
      "json"
    )
      .done((data) => {
        // console.log(data);

        data.forEach((answer) => {
          $(`<div class="topic__container" id="r-${answer.idreponse}"></div>`)
            .html(
              `
                  <div class="topic__reply-container">
                    <div class="topic__reply">
                      <p class="comment">${answer.corps.replace(
                        /\n/g,
                        "<br />"
                      )}</p>
                    </div>
                    <div class="topic__user">
                      <p class="paragraph">${answer.datemodif}</p>
                    </div>
                  </div>
                `
            )
            .appendTo("[data-history-box]");
        });
      })
      .fail((req, err) => console.log(req.responseText));
  })
  .fail((req, err) => console.log(req.responseText));
