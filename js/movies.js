// requete pour récupérer la liste des films, et adapte leur affichage en fonction du format (responsive)

const btnSeeMore = document.querySelectorAll('.btn-see-more');
const categoryContainers = document.querySelectorAll('.category_container');
const maxItemsTablette = 4;
const maxItemsSmartphone = 2;
const maxFilmsShow = 6;
const category1 = document.querySelector('.categorie_1 .category_container');
const category2 = document.querySelector('.categorie_2 .category_container');
const category3 = document.querySelector('.categorie_3 .category_container');
const urlCategory1 = "http://localhost:8000/api/v1/titles/?genre=drama&sort_by=-imdb_score";
const urlCategory2 = "http://localhost:8000/api/v1/titles/?genre=musical&sort_by=-imdb_score";
const urlCategory3 = "http://localhost:8000/api/v1/titles/?genre=sport&sort_by=-imdb_score";
const urlGenres = "http://localhost:8000/api/v1/genres/";
const template = document.querySelector("#film-item-template");

// charge une page de films
async function loadPage(container, url) {
    let currentPage = 1;
    let filmsLoaded = 0;

    while (filmsLoaded < maxFilmsShow) {
        const currentUrl = `${url}&page=${currentPage}`;

        try {
            const response = await fetch(currentUrl);
            if (!response.ok) {
                throw new Error(`Erreur : ${response.status}`);
            }
            const films = await response.json();

            for (let film of films.results) {
                if (filmsLoaded < maxFilmsShow) { // Limite à maxFilmsShow films
                    const clone = document.importNode(template.content, true);
                    const baliseH2 = clone.querySelector(".film-title");
                    const baliseImg = clone.querySelector(".film-img");
                    baliseH2.textContent = film.title;
                    baliseImg.src = film.image_url;

                    // ajout d'un évenement onerror à l'image
                    baliseImg.onerror = function() {
                        // remplace l'URL de l'image absente
                        this.src = "images/image_non_dispo.jpg";
                        this.alt = "Image non disponible";
                    };

                    container.appendChild(clone);
                    filmsLoaded++;
                } else {
                    break;
                }
            }

            currentPage++;
        } catch (error) {
            console.error('Erreur : ', error);
            break;
        }
    }
    updateDisplay();
}

// Fonction pour charger les genres
async function loadGenres() {
    let url = urlGenres;
    const genres = [];

    while (url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erreur : ${response.status}`);
            }
            const data = await response.json();
            genres.push(...data.results);
            url = data.next;
        } catch (error) {
            console.error('Erreur : ', error);
            break;
        }
    }

    const genreSelect = document.getElementById('genre-select');
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.name.toLowerCase();
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });

    // Charge la catégorie 3 avec le genre initial
    loadCategory(genreSelect.value, category3);
}

// Ecoute l'evenement de redimensionnement de la fenêtre
window.addEventListener('resize', updateDisplay);

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

// Fonction pour charger les films basée sur le genre sélectionné
async function loadCategory(genre, container) {
    // const container = document.querySelector('.categorie_3 .category_container');
    const url = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}`;
    container.innerHTML = ''; // Clear previous results
    await loadPage(container, url);
}

// écouteur d'événement pour la sélection du genre
const genreSelect = document.getElementById('genre-select');  // a généraliser
genreSelect.addEventListener('change', () => {
    const selectedGenre = genreSelect.value;
    loadCategory(selectedGenre, category3);
});

// chargement des films de la page
document.addEventListener("DOMContentLoaded", async () => {
    await loadPage(category1, urlCategory1);
    await loadPage(category2, urlCategory2);
    await loadGenres(); // Charge la liste des genres de film, avec les valeurs par défaut pour les catégories
    
});

updateDisplay();
