
/*
Script pour récupérer la liste des films via l'API
adapte leur affichage en fonction du format (responsive)
*/
const btnSeeMore = document.querySelectorAll('.btn-see-more');
const categoryContainers = document.querySelectorAll('.category_container');
const maxItemsTablette = 4;
const maxItemsSmartphone = 2;
const maxFilmsShow = 6;
const category1 = document.querySelector('.categorie_1 .category_container');
const category2 = document.querySelector('.categorie_2 .category_container');
const category3 = document.querySelector('.categorie_3 .category_container');
const category4 = document.querySelector('.categorie_4 .category_container');
const category5 = document.querySelector('.categorie_5 .category_container');

const urlBestFilm = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
const urlCategory1 = "http://localhost:8000/api/v1/titles/?genre=drama&sort_by=-imdb_score";
const urlCategory2 = "http://localhost:8000/api/v1/titles/?genre=musical&sort_by=-imdb_score";
const urlCategory3 = "http://localhost:8000/api/v1/titles/?genre=sport&sort_by=-imdb_score";
const urlGenres = "http://localhost:8000/api/v1/genres/";
const template = document.querySelector("#film-item-template");

// charge une page de films

// async function loadPage(container, url) {
//     let currentPage = 1;
//     let filmsLoaded = 0;

//     while (filmsLoaded < maxFilmsShow) {
//         const currentUrl = `${url}&page=${currentPage}`;

//         try {
//             const response = await fetch(currentUrl);
//             if (!response.ok) {
//                 throw new Error(`Erreur : ${response.status}`);
//             }
//             const films = await response.json();

//             for (let film of films.results) {
//                 if (filmsLoaded < maxFilmsShow) { // Limite à maxFilmsShow films
//                     const clone = document.importNode(template.content, true);
//                     const baliseH2 = clone.querySelector(".film-title");
//                     const baliseImg = clone.querySelector(".film-img");
//                     baliseH2.textContent = film.title;
//                     baliseImg.src = film.image_url;

//                     // ajout d'un évenement onerror à l'image
//                     baliseImg.onerror = function() {
//                         // remplace l'URL de l'image absente
//                         this.src = "images/image_non_dispo.jpg";
//                         this.alt = "Image non disponible";
//                     };
//                     container.appendChild(clone);
//                     filmsLoaded++;
//                 } else {
//                     break;
//                 }
//             }
//             currentPage++;
//         } catch (error) {
//             console.error('Erreur : ', error);
//             break;
//         }
//     }
//     updateDisplay();
// }

function modalInfos(filmData) {
  // remplissage des infos du modal
  const modalImage = document.getElementById('modal-film-image');
  modalImage.src = filmData.image_url;
  modalImage.alt = `Affiche ${filmData.title}`;

  const modalTitle = document.getElementById('modal-film-title');
  modalTitle.textContent = filmData.title;

  document.getElementById('modal-film-year-genres').textContent = `${filmData.year} - ${filmData.genres.join(', ')}`;
//   document.getElementById('modal-film-genres').textContent = filmData.genres.join(', ');
  document.getElementById('modal-film-category-duration-contries').textContent = `${filmData.rated} - ${filmData.duration} minutes (${filmData.countries.join(' / ')})`;
//   document.getElementById('modal-film-duration').textContent = filmData.duration;
//   document.getElementById('modal-film-contries').textContent = filmData.countries.join(' / ');
  document.getElementById('modal-film-imdb').textContent = `IMDB score : ${filmData.imdb_score}/10`;
  document.getElementById('modal-film-directors').textContent = filmData.directors.join(', ');

  const modalDescription = document.getElementById('modal-film-description');
  modalDescription.textContent = filmData.long_description;

  const modalActors = document.getElementById('modal-film-actors');
  modalActors.textContent = filmData.actors.join(', ');
}

async function fetchBestFilm(mainUrl) {
  url = mainUrl;
  try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
    }
    const films = await response.json();
    // on récupère le premier film de la liste et le lien de sa fiche qu'on retourne
    return films.results[0].url
  } catch(error) {
    console.error('Erreur : ', error);
  }
}

async function bestFilm(urlBestFilm) {
  urlDetails = await fetchBestFilm(urlBestFilm);
  try {
    const response = await fetch(urlDetails);
    if (!response.ok) {
        throw new Error(`Erreur : ${response.status}`);
    }
    bestFilmDetails = await response.json();
    // remplissage des infos de l'entete
    const filmImage = document.getElementById('best-film-image');
    filmImage.src = bestFilmDetails.image_url;
    filmImage.alt = `Affiche ${bestFilmDetails.title}`;

    const filmTitle = document.getElementById('best-film-title');
    filmTitle.textContent = bestFilmDetails.title;

    const filmDescription = document.getElementById('best-film-description');
    filmDescription.textContent = bestFilmDetails.long_description;
    
    // remplissage des infos du modal
    modalInfos(bestFilmDetails);

  } catch (error) {
    console.error('Erreur : ', error);
    }
}


async function loadPage(container, url) {
  let currentPage = 1;
  let filmsLoaded = 0;
  // let continueLoading = true;

  while (filmsLoaded < maxFilmsShow) { //   while (filmsLoaded < maxFilmsShow && continueLoading) {
      const currentUrl = `${url}&page=${currentPage}`;

      try {
          const response = await fetch(currentUrl);
          if (!response.ok) {
              throw new Error(`Erreur : ${response.status}`);
          }
          const films = await response.json();

          films.results.forEach(film => {
              if (filmsLoaded < maxFilmsShow) {
                  const clone = document.importNode(template.content, true);
                  const baliseH2 = clone.querySelector(".film-title");
                  const baliseImg = clone.querySelector(".film-img");
                  baliseH2.textContent = film.title;
                  baliseImg.src = film.image_url;

                  baliseImg.onerror = function() {
                      this.src = "images/image_non_dispo.jpg";
                      this.alt = "Image non disponible";
                  };
                  container.appendChild(clone);
                  filmsLoaded++;
              }
          });
          // vérifie si il y a une autre page
          if (films.next === null) { // || films.results.length === 0
            // continueLoading = false;
            break
          } else {
              currentPage++;
          }
      } catch (error) {
          console.error('Erreur : ', error);
      }
  }

  while (filmsLoaded < maxFilmsShow) {
    const emptyItem = document.createElement("div");
    emptyItem.className = "film_item empty";
    emptyItem.innerHTML = "<div class='empty-content'>Contenu non disponible</div>";
    container.appendChild(emptyItem);
    filmsLoaded++;
  }

  // masquer le bouton voir plus... a revoir marche pas
  // if (filmsLoaded < maxFilmsShow) {
  //   btnSeeMore.forEach(btn => btn.style.display = 'none');
  // }
  updateDisplay();
}


  // // Ajout d'éléments vides si nécessaire
  // while (filmsLoaded < maxFilmsShow) {
  //     const emptyDiv = document.createElement("div");
  //     emptyDiv.className = "film_item empty";
  //     emptyDiv.style.backgroundColor = "#ccc";
  //     emptyDiv.style.height = "200px";
  //     container.appendChild(emptyDiv);
  //     filmsLoaded++;
  // }


// chargement de la liste des genres
async function loadGenres() {
  let url = urlGenres;
  let defaultGenreCat4 = "Crime";
  let defaultGenreCat5 = "Family";
  // let defaultGenreExistsCat4 = false;
  // let defaultGenreExistsCat5 = false;

  try {
      while (url) {
          const response = await fetch(url);
          if (!response.ok) {
              throw new Error(`Erreur HTTP : ${response.status}`);
          }
          const data = await response.json();

          const genreSelectCat4 = document.getElementById('genre-select-cat4');
          const genreSelectCat5 = document.getElementById('genre-select-cat5');

          // Ajoute les genres aux deux sélecteurs et vérifie les genres par défaut
          data.results.forEach((genre) => {
              let option4 = document.createElement('option');
              option4.textContent = genre.name;
              option4.value = genre.name;
              genreSelectCat4.appendChild(option4);

              let option5 = document.createElement('option');
              option5.textContent = genre.name;
              option5.value = genre.name;
              genreSelectCat5.appendChild(option5);

              // if (genre.name === defaultGenreCat4) {
              //     defaultGenreExistsCat4 = true;
              // }
              // if (genre.name === defaultGenreCat5) {
              //     defaultGenreExistsCat5 = true;
              // }
          });

          url = data.next;
      }

      // Sélectionner les genres par défaut ou le premier disponible si non existants
      // genreSelectCat4.value = defaultGenreExistsCat4 ? defaultGenreCat4 : genreSelectCat4.options[0].value;
      // genreSelectCat5.value = defaultGenreExistsCat5 ? defaultGenreCat5 : genreSelectCat5.options[0].value;
      genreSelectCat4.value = defaultGenreCat4
      genreSelectCat5.value = defaultGenreCat5

      // Chargez les films pour les genres sélectionnés
      loadCategory(genreSelectCat4.value, category4);
      loadCategory(genreSelectCat5.value, category5);
  } catch (error) {
      console.error('Erreur lors du chargement des genres : ', error);
  }
}

// Ecoute l'evenement de redimensionnement de la fenêtre
window.addEventListener('resize', updateDisplay);

// function updateDisplay() {
//   // récupère la largeur de l'écran
//   const screenWidth = window.innerWidth;

//   categoryContainers.forEach((container, index) => {
//       let maxItems = screenWidth >= 1024 ? container.querySelectorAll('.film_item').length :
//                      screenWidth >= 600 ? maxItemsTablette :
//                      maxItemsSmartphone;

//       showItems(container, maxItems);
//       const totalItems = container.querySelectorAll('.film_item').length;
//       const visibleItems = container.querySelectorAll('.film_item.show').length;
//       const btn = btnSeeMore[index];
//       btn.textContent = visibleItems < totalItems ? "Voir plus" : "Voir moins";
//       btn.style.display = visibleItems < totalItems ? 'block' : 'none'; // cache le bouton si tous les items sont visibles
//   });
// }

// function updateDisplay() {
//   const screenWidth = window.innerWidth;

//   categoryContainers.forEach((container, index) => {
//       const filmItems = container.querySelectorAll('.film_item');
//       let maxItems = screenWidth >= 1024 ? filmItems.length : // Si large écran, tous les éléments disponibles
//                      screenWidth >= 600 ? maxItemsTablette : // Si tablette, maximum pour tablette
//                      maxItemsSmartphone; // Si smartphone, maximum pour smartphone

//       maxItems = Math.min(maxItems, filmItems.length); // Ne pas dépasser le nombre réel de films disponibles

//       showItems(container, maxItems);

//       const totalItems = filmItems.length;
//       const visibleItems = container.querySelectorAll('.film_item.show').length;
//       const btn = btnSeeMore[index];

//       // Gérer l'affichage du bouton "Voir plus/Voir moins"
//       if (visibleItems < totalItems) {
//           btn.textContent = "Voir plus";
//           btn.style.display = 'block';
//       } else {
//           btn.textContent = "Voir moins";
//           btn.style.display = visibleItems > maxItemsSmartphone ? 'block' : 'none';
//       }

//       // Si pas assez d'éléments pour justifier "Voir plus", cacher le bouton
//       if (totalItems <= maxItems) {
//           btn.style.display = 'none';
//       }
//   });
// }

function updateDisplay() {
  // récupère la largeur de l'écran
  const screenWidth = window.innerWidth;

  categoryContainers.forEach((container, index) => {
      let maxItems = screenWidth >= 1024 ? container.querySelectorAll('.film_item').length :
                     screenWidth >= 600 ? maxItemsTablette :
                     maxItemsSmartphone;

      showItems(container, maxItems);
      const totalItems = container.querySelectorAll('.film_item').length;
      const visibleItems = container.querySelectorAll('.film_item.show').length;
      const btn = btnSeeMore[index];
      btn.textContent = visibleItems < totalItems ? "Voir plus" : "Voir moins";
      btn.style.display = visibleItems < totalItems ? 'block' : 'none'; // cache le bouton si tous les items sont visibles
  });
}

// Affichage du nombre d'elements souhaité
function showItems(container, numItems) {
    const filmItems = container.querySelectorAll('.film_item');
    filmItems.forEach((item, index) => {
        if (index < numItems) {
            item.classList.add('show');
        } else {
            item.classList.remove('show');
        }
    });
}

// ecouteur d'evenement pour les boutons "voir plus"
btnSeeMore.forEach((button, index) => {
    button.addEventListener('click', () => {
        // on récupère la catégorie dans laquelle est le bouton
        const container = categoryContainers[index];
        // on affiche les éléments supplémentaires de cette catégorie
        showMoreItems(container, button);
    });
});

// Fonction pour afficher plus d'éléments pour une catégorie donnée
function showMoreItems(container, button) {
    const currentVisibleItems = container.querySelectorAll('.film_item.show').length;
    const totalItems = container.querySelectorAll('.film_item').length;
    if (currentVisibleItems < totalItems) {
        showItems(container, totalItems);
        button.textContent = "Voir moins";
    } else {
        if (window.innerWidth >= 600 && window.innerWidth < 1024) {
            showItems(container, maxItemsTablette);
        } else {
            showItems(container, maxItemsSmartphone);
        }
        button.textContent = "Voir plus";
    }
}

// charge les films du genre sélectionné
async function loadCategory(genre, container) {
    // const container = document.querySelector('.categorie_3 .category_container');
    const url = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}`;
    container.innerHTML = ''; // Clear previous results
    await loadPage(container, url);
}


// écouteur d'événement pour la sélection du genre
const genreSelectCat4 = document.getElementById('genre-select-cat4');
const genreSelectCat5 = document.getElementById('genre-select-cat5');
// genreSelect.addEventListener('change', () => {
//     const selectedGenre = genreSelect.value;
//     loadCategory(selectedGenre, category4);
//     loadCategory(selectedGenre, category5);
// });

genreSelectCat4.addEventListener('change', () => {
  const selectedGenre = genreSelectCat4.value;
  loadCategory(selectedGenre, category4);
});

genreSelectCat5.addEventListener('change', () => {
  const selectedGenre = genreSelectCat5.value;
  loadCategory(selectedGenre, category5);
});

function updateListSelection(){

    // Sélectionnez les éléments select après leur possible population par loadGenres()
    const selectElements = document.querySelectorAll('#genre-select-cat4, #genre-select-cat5');

    selectElements.forEach(select => {
        // Stocker le texte original pour chaque option dès que le DOM est chargé et les selects sont remplis
        Array.from(select.options).forEach(option => {
            if (!option.hasAttribute('data-original-text')) {
                option.setAttribute('data-original-text', option.text); // Stockage du texte original
            }
        });

        select.addEventListener('focus', function() {
            // Ajouter l'emoji à l'option actuellement sélectionnée à l'ouverture
            var selectedOption = this.options[this.selectedIndex];
            selectedOption.text = selectedOption.getAttribute('data-original-text') + " \u2705";
        });

        select.addEventListener('blur', function() {
            // Retirer l'emoji et réinitialiser le texte à la fermeture
            Array.from(this.options).forEach(option => {
                option.text = option.getAttribute('data-original-text');
            });
        });

        select.addEventListener('change', function() {
            // Retirer l'emoji et réinitialiser le texte après un changement
            Array.from(this.options).forEach(option => {
                option.text = option.getAttribute('data-original-text');
            });
        });
    });
    
// TODO aligner ce caractère à droite de la liste, en laissant le texte aligné a gauche

}

// ouverture modal

function openModal() {
  document.querySelectorAll('.film-button').forEach(button => {
    button.addEventListener('click', function() {
        const modalNode = document.importNode(document.getElementById('modal-template').content, true);
        document.body.appendChild(modalNode);
        document.querySelector('.modal').style.display = 'block';

        document.querySelector('.close-modal-cross').addEventListener('click', function() {
            this.closest('.modal').remove();
        });

        document.querySelector('.close-modal-btn').addEventListener('click', function() {
            this.closest('.modal').remove();
        });
    });
  });
}

// chargement des films de la page
document.addEventListener("DOMContentLoaded", async () => {
  await bestFilm(urlBestFilm);
  await loadPage(category1, urlCategory1);
  await loadPage(category2, urlCategory2);
  await loadPage(category3, urlCategory3);
  await loadGenres(); // Charge la liste des genres de film, avec les valeurs par défaut pour les catégories
  updateListSelection();
  openModal()

  // const btnSeeMore = document.querySelector('.btn-see-more'); // Assurez-vous que ce sélecteur est correct
  // const container = document.querySelector('.categorie_3 .category_container'); // Ajustez selon la structure de votre HTML

  // btnSeeMore.addEventListener('click', () => {
  //     const template = document.getElementById('film-item-template');
  //     const clone = document.importNode(template.content, true);

  //     // Exemple de données qui pourraient être chargées dynamiquement
  //     clone.querySelector('.film-img').src = "path_to_image.jpg";
  //     clone.querySelector('.film-title').textContent = "Titre du Film";

  //     container.appendChild(clone);
  // });
});


//onload

//promise all > 6/7 requetes, renvoi les requetes avec les différentes parties
// https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Promise/all

updateDisplay();
