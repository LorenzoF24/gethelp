"use strict";

$.get("./php/select/selectUsers.php", null, null, "json").done(function (data) {
  data.forEach(function (user) {
    $("tbody").append("\n            <tr>\n                <td class=\"td-col1\">" + user.id + "</td>\n                <td class=\"td-col2\">" + user.pseudo + "</td>\n                <td class=\"td-col3\">" + user.mail + "</td>\n                <td class=\"td-col4\">" + user.dateins + "</td>\n                <td class=\"td-col5\">" + (user.emailstatus == 1 ? "Oui" : "Non") + "</td>\n                <td class=\"td-col6\">\n                    <div class=\"role-container\">\n                        <div class=\"role-arrows\">\n                            <i data-user-arrow-up class=\"fa fa-caret-up\" aria-hidden=\"true\"></i>\n                            <br />\n                            <i data-user-arrow-down class=\"fa fa-caret-down\" aria-hidden=\"true\"></i>\n                        </div>\n                        <div class=\"role-name\">\n                            " + user.role + "\n                        </div>\n                        <div class=\"role-set\">\n                            <i class=\"fa fa-wrench\" aria-hidden=\"true\"></i>\n                        </div>\n                        <div class=\"role-check\">\n                            <i class=\"fa fa-check\" aria-hidden=\"true\"></i>\n                        </div>\n                    </div>\n                </td>\n                <td class=\"td-delete\"><i class=\"fa fa-times\" aria-hidden=\"true\" data-btn-delete-user=" + user.id + "></i></td>\n            </tr>\n        ");
  });

  //DELETE USER
  var btnDeleteUser = document.querySelectorAll("[data-btn-delete-user]");

  btnDeleteUser.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();

      if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        var iduser = this.getAttribute("data-btn-delete-user");

        $.post("./php/delete/deleteUser.php", { id_user: iduser }, "json").done(function (data) {
          return location.reload();
        }).fail(function (req, error) {
          return alert(req.responseText);
        });
      }
    });
  });

  ////////////////////
  // MODIFICATION MODE
  ////////////////////
  var wrenchs = document.querySelectorAll(".role-set i");
  var arrows = document.querySelectorAll(".role-arrows");
  var checks = document.querySelectorAll(".role-check");
  var deletes = document.querySelectorAll(".td-delete i");
  var roles = document.querySelectorAll(".role-name");

  wrenchs.forEach(function (w, i) {
    w.addEventListener("click", function (e) {
      e.preventDefault();

      wrenchs.forEach(function (wr, j) {
        wr.classList.add("hidden");
        deletes[j].classList.add("hidden");
      });
      arrows[i].style.display = "block";
      checks[i].style.display = "block";
    });
  });

  checks.forEach(function (c, i) {
    var role = [];
    role[i] = roles[i].innerText;

    c.addEventListener("click", function () {
      if (roles[i].innerText !== role[i]) {
        if (window.confirm("Voulez-vous sauvegardez les modifications ?")) {
          var idUser = deletes[i].getAttribute("data-btn-delete-user");
          var roleUser = roles[i].innerText;

          $.post("./php/update/updateUserRole.php", { id_user: idUser, role_user: roleUser }, "json").done(function (data) {
            return location.reload();
          }).fail(function (req, error) {
            return alert(req.responseText);
          });
        } else roles[i].innerText = role[i];
      }

      wrenchs.forEach(function (wr, j) {
        wr.classList.remove("hidden");
        deletes[j].classList.remove("hidden");
      });
      arrows[i].style.display = "none";
      c.style.display = "none";
    });
  });

  var arrowUp = document.querySelectorAll("[data-user-arrow-up]");
  var arrowDown = document.querySelectorAll("[data-user-arrow-down]");
  var tab = ["admin", "modo", "user"];

  arrowDown.forEach(function (a, i) {
    a.addEventListener("click", function () {
      switch (roles[i].innerText) {
        case tab[0]:
          roles[i].innerText = tab[1];
          break;
        case tab[1]:
          roles[i].innerText = tab[2];
          break;
        case tab[2]:
          roles[i].innerText = tab[0];
          break;
      }
    });
  });

  arrowUp.forEach(function (a, i) {
    a.addEventListener("click", function () {
      switch (roles[i].innerText) {
        case tab[0]:
          roles[i].innerText = tab[2];
          break;
        case tab[1]:
          roles[i].innerText = tab[0];
          break;
        case tab[2]:
          roles[i].innerText = tab[1];
          break;
      }
    });
  });

  //Rechercher
  document.querySelector("#tabFilter").addEventListener("keyup", searchFunction);

  function searchFunction() {
    var input = void 0,
        filter = void 0,
        table = void 0,
        tr = void 0,
        td = void 0,
        i = void 0,
        txtValue = void 0;
    input = document.querySelector("#tabFilter");
    filter = input.value.toUpperCase();
    table = document.querySelector("tbody");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[1];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}).fail(function (req, error) {
  alert("error:" + req.responseText);
});