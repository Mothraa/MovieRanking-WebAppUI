document.addEventListener("DOMContentLoaded", function() {
    var selectElement = document.getElementById("genre-select");
    var checkboxElement = document.getElementById("checkbox-action");
  
    // Mettre à jour la checkbox lorsque l'élément sélectionné dans le menu déroulant change
    selectElement.addEventListener("change", function() {
      var selectedValue = selectElement.value;
      checkboxElement.value = selectedValue;
    });
  });


// var text = document.getElementById('name')
// var drop = document.getElementById('dropdown')
// drop.addEventListener('change', function(e) {
//   text.textContent = 'Product Name: ' + e.target.value
// })

// $(function () {
//     $("#dropdown a").click(function () {
//         $("#AdvancedSearch .selection").text('Advanced:'+$(this).text());
//     });
// });