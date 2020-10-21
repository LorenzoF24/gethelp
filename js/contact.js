"use strict";

$("#form-contact").submit(function (e) {
  e.preventDefault();
  var serializedData = $(this).serialize();
  console.log(serializedData);

  $.post("./php/util/contactus.php", serializedData, null, "json").done(function (data) {
    alert("Merci de nous avoir contacté !");
    location.href = "index.html";
  }).fail(function (req, err) {
    return alert(req.responseText);
  });
});