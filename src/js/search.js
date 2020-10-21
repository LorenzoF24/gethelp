$("#search").submit(function (e) {
  e.preventDefault();
  let serializedData = $(this).serializeArray();

  $.post("./php/select/selectQuestions.php", serializedData)
    .done(() => {
      $("[data-search-field]").val("");
      location.href = "index.html";
    })
    .fail((error) => console.log(error.responseText));
});
