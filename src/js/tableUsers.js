$.get("./php/select/selectUsers.php", null, null, "json")
  .done((data) => {
    data.forEach((user) => {
      $("tbody").append(`
            <tr>
                <td class="td-col1">${user.id}</td>
                <td class="td-col2">${user.pseudo}</td>
                <td class="td-col3">${user.mail}</td>
                <td class="td-col4">${user.dateins}</td>
                <td class="td-col5">${
                  user.emailstatus == 1 ? "Oui" : "Non"
                }</td>
                <td class="td-col6">
                    <div class="role-container">
                        <div class="role-arrows">
                            <i data-user-arrow-up class="fa fa-caret-up" aria-hidden="true"></i>
                            <br />
                            <i data-user-arrow-down class="fa fa-caret-down" aria-hidden="true"></i>
                        </div>
                        <div class="role-name">
                            ${user.role}
                        </div>
                        <div class="role-set">
                            <i class="fa fa-wrench" aria-hidden="true"></i>
                        </div>
                        <div class="role-check">
                            <i class="fa fa-check" aria-hidden="true"></i>
                        </div>
                    </div>
                </td>
                <td class="td-delete"><i class="fa fa-times" aria-hidden="true" data-btn-delete-user=${
                  user.id
                }></i></td>
            </tr>
        `);
    });

    //DELETE USER
    const btnDeleteUser = document.querySelectorAll("[data-btn-delete-user]");

    btnDeleteUser.forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.preventDefault();

        if (
          window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
        ) {
          const iduser = this.getAttribute("data-btn-delete-user");

          $.post("./php/delete/deleteUser.php", { id_user: iduser }, "json")
            .done((data) => location.reload())
            .fail((req, error) => alert(req.responseText));
        }
      });
    });

    ////////////////////
    // MODIFICATION MODE
    ////////////////////
    const wrenchs = document.querySelectorAll(".role-set i");
    const arrows = document.querySelectorAll(".role-arrows");
    const checks = document.querySelectorAll(".role-check");
    const deletes = document.querySelectorAll(".td-delete i");
    const roles = document.querySelectorAll(".role-name");

    wrenchs.forEach((w, i) => {
      w.addEventListener("click", (e) => {
        e.preventDefault();

        wrenchs.forEach((wr, j) => {
          wr.classList.add("hidden");
          deletes[j].classList.add("hidden");
        });
        arrows[i].style.display = "block";
        checks[i].style.display = "block";
      });
    });

    checks.forEach((c, i) => {
      const role = [];
      role[i] = roles[i].innerText;

      c.addEventListener("click", () => {
        if (roles[i].innerText !== role[i]) {
          if (window.confirm("Voulez-vous sauvegardez les modifications ?")) {
            const idUser = deletes[i].getAttribute("data-btn-delete-user");
            const roleUser = roles[i].innerText;

            $.post(
              "./php/update/updateUserRole.php",
              { id_user: idUser, role_user: roleUser },
              "json"
            )
              .done((data) => location.reload())
              .fail((req, error) => alert(req.responseText));
          } else roles[i].innerText = role[i];
        }

        wrenchs.forEach((wr, j) => {
          wr.classList.remove("hidden");
          deletes[j].classList.remove("hidden");
        });
        arrows[i].style.display = "none";
        c.style.display = "none";
      });
    });

    const arrowUp = document.querySelectorAll("[data-user-arrow-up]");
    const arrowDown = document.querySelectorAll("[data-user-arrow-down]");
    const tab = ["admin", "modo", "user"];

    arrowDown.forEach((a, i) => {
      a.addEventListener("click", () => {
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

    arrowUp.forEach((a, i) => {
      a.addEventListener("click", () => {
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
    document
      .querySelector("#tabFilter")
      .addEventListener("keyup", searchFunction);

    function searchFunction() {
      let input, filter, table, tr, td, i, txtValue;
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
  })
  .fail((req, error) => {
    alert("error:" + req.responseText);
  });
