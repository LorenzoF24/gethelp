$.get("./php/select/selectNotifications.php", null, null, "json")
  .done((data) => {
    if (data.length > 0) {
      data.forEach((notification) => {
        $(`<div class="notification" id=${notification.id}></div>`)
          .html(
            `
            <div class="notification__card notification__card--not-read" data-notifIdquestion=${notification.idquestion} data-notifId=${notification.id}>
                <h2 class="heading-secondary">Vous avez une nouvelle réponse!</h2>
                <p class="paragraph">Cliquez pour consulter</p>
                <span class="notification__date">
                    ${notification.datenotif}
                </span>
            </div>
            <div class="notification__action">
                <span class="notification__dismiss" data-dismissId=${notification.id} title="Supprimer notification">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </span>
            </div>
        `
          )
          .appendTo(".section-notifications");
      });

      const notificationCard = document.querySelectorAll(".notification__card");
      notificationCard.forEach((card) => {
        const idnotif = card.getAttribute("data-notifId");
        const idquestion = card.getAttribute("data-notifIdquestion");

        // Checked si vu ou non
        $.get(
          "./php/select/checkSeenStatusNotification.php",
          { idnotif: idnotif },
          null,
          "json"
        )
          .done((data) => {
            const status = data[0].vu;

            if (status === 1) {
              card.classList.remove("notification__card--not-read");
            }
          })
          .fail((request, error) => {
            document.querySelector(
              ".section-notifications"
            ).innerHTML += `<div class="u-warning u-mt-md u-center-text">${request.responseText}</div>`;
          });

        // Aller à la question quand on clique + mettre vu
        card.addEventListener("click", (e) => {
          location.href = `#${idnotif}`;
          // Envoi de la question puis redirection vers la page de la question.
          $.post(
            "./php/select/selectOneQuestion.php",
            { id: idquestion },
            null,
            "text"
          )
            .done(() => {
              // Mettre la notification en 'vu'
              $.post(
                "./php/update/vuNotification.php",
                { id: idnotif },
                null,
                "text"
              )
                .done((data) => {
                  location.href = "question.html";
                })
                .fail((request, error) => console.log(request.responseText));
            })
            .fail((request, error) => console.log("Erreur"));
        });
      });

      // Dismiss d'une notification
      const btnDismiss = document.querySelectorAll("[data-dismissId]");

      btnDismiss.forEach((btn) => {
        btn.addEventListener("click", function (e) {
          e.preventDefault();

          if (
            window.confirm(
              "Êtes-vous sûr de vouloir supprimer cette notification?"
            )
          ) {
            const notifId = btn.getAttribute("data-dismissId");

            $.post(
              "./php/delete/dismissNotification.php",
              { id: notifId },
              null,
              "json"
            )
              .done((data) => location.reload())
              .fail((req, err) => console.log(req.responseText));
          }
        });
      });
    } else {
      document.querySelector(".section-notifications").innerHTML +=
        '<div class="u-warning u-mt-md u-center-text">Aucune notification.</div>';
    }
  })
  .fail((request, error) => {
    document.querySelector(
      ".section-notifications"
    ).innerHTML += `<div class="u-warning u-mt-md u-center-text">${request.responseText}</div>`;
  });
