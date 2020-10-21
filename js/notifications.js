"use strict";

$.get("./php/select/selectNotifications.php", null, null, "json").done(function (data) {
  if (data.length > 0) {
    data.forEach(function (notification) {
      $("<div class=\"notification\" id=" + notification.id + "></div>").html("\n            <div class=\"notification__card notification__card--not-read\" data-notifIdquestion=" + notification.idquestion + " data-notifId=" + notification.id + ">\n                <h2 class=\"heading-secondary\">Vous avez une nouvelle r\xE9ponse!</h2>\n                <p class=\"paragraph\">Cliquez pour consulter</p>\n                <span class=\"notification__date\">\n                    " + notification.datenotif + "\n                </span>\n            </div>\n            <div class=\"notification__action\">\n                <span class=\"notification__dismiss\" data-dismissId=" + notification.id + " title=\"Supprimer notification\">\n                    <i class=\"fa fa-times\" aria-hidden=\"true\"></i>\n                </span>\n            </div>\n        ").appendTo(".section-notifications");
    });

    var notificationCard = document.querySelectorAll(".notification__card");
    notificationCard.forEach(function (card) {
      var idnotif = card.getAttribute("data-notifId");
      var idquestion = card.getAttribute("data-notifIdquestion");

      // Checked si vu ou non
      $.get("./php/select/checkSeenStatusNotification.php", { idnotif: idnotif }, null, "json").done(function (data) {
        var status = data[0].vu;

        if (status === 1) {
          card.classList.remove("notification__card--not-read");
        }
      }).fail(function (request, error) {
        document.querySelector(".section-notifications").innerHTML += "<div class=\"u-warning u-mt-md u-center-text\">" + request.responseText + "</div>";
      });

      // Aller à la question quand on clique + mettre vu
      card.addEventListener("click", function (e) {
        location.href = "#" + idnotif;
        // Envoi de la question puis redirection vers la page de la question.
        $.post("./php/select/selectOneQuestion.php", { id: idquestion }, null, "text").done(function () {
          // Mettre la notification en 'vu'
          $.post("./php/update/vuNotification.php", { id: idnotif }, null, "text").done(function (data) {
            location.href = "question.html";
          }).fail(function (request, error) {
            return console.log(request.responseText);
          });
        }).fail(function (request, error) {
          return console.log("Erreur");
        });
      });
    });

    // Dismiss d'une notification
    var btnDismiss = document.querySelectorAll("[data-dismissId]");

    btnDismiss.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette notification?")) {
          var notifId = btn.getAttribute("data-dismissId");

          $.post("./php/delete/dismissNotification.php", { id: notifId }, null, "json").done(function (data) {
            return location.reload();
          }).fail(function (req, err) {
            return console.log(req.responseText);
          });
        }
      });
    });
  } else {
    document.querySelector(".section-notifications").innerHTML += '<div class="u-warning u-mt-md u-center-text">Aucune notification.</div>';
  }
}).fail(function (request, error) {
  document.querySelector(".section-notifications").innerHTML += "<div class=\"u-warning u-mt-md u-center-text\">" + request.responseText + "</div>";
});