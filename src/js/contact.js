$("#form-contact").submit(function (e) {
  e.preventDefault();
  const serializedData = $(this).serialize();
  console.log(serializedData);

  $.post("./php/util/contactus.php", serializedData, null, "json")
    .done((data) => {
      alert("Merci de nous avoir contacté !");
      location.href = "index.html";
    })
    .fail((req, err) => alert(req.responseText));
});
