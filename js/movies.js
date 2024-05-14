
//https://developer.mozilla.org/fr/docs/Web/API/Document/DOMContentLoaded_event
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed");
  });


const url_best = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
const url = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
const category_container = document.querySelector(".category_container");
// on récupère le template souhaité
const template = document.querySelector("#film-item-template");

fetch(url)
.then(response => response.json())
.then(films => {
    // console.log(films.results)
    for (let film of films.results){
        const clone = document.importNode(template.content, true);
        const baliseH2 = clone.querySelector(".film-title");
        const baliseImg = clone.querySelector(".film-img")
        baliseH2.textContent = film.title
        baliseImg.src = film.image_url;
        // Ajouter l'événement onerror à l'image
        baliseImg.onerror = function() {
          // Remplacer l'URL de l'image par une image de substitution
          this.src = "images/image_non_dispo.jpg";
          this.alt = "Image non disponible";
        };
        category_container.appendChild(clone)
    }
})