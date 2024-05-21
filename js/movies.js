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

const urlBestFilm = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
const urlCategory1 = "http://localhost:8000/api/v1/titles/?genre=drama&sort_by=-imdb_score";
const urlCategory2 = "http://localhost:8000/api/v1/titles/?genre=musical&sort_by=-imdb_score";
const urlCategory3 = "http://localhost:8000/api/v1/titles/?genre=sport&sort_by=-imdb_score";
const urlGenres = "http://localhost:8000/api/v1/genres/";
const template = document.querySelector("#film-item-template");


function modalInfos(modal, filmData) {
    const modalImage = modal.querySelector('.modal-film-image');
    modalImage.src = filmData.image_url || "images/default_image.jpg"; // image par défaut si absente
    modalImage.alt = `Affiche ${filmData.title}`;
    const modalTitle = modal.querySelector('.modal-film-title');
    modalTitle.textContent = filmData.title;
    const genresText = filmData.genres ? filmData.genres.join(', ') : "N/A";
    modal.querySelector('.modal-film-year-genres').textContent = `${filmData.year} - ${genresText}`;
    const ratedText = filmData.rated || "Non classé";
    const countriesText = filmData.countries ? filmData.countries.join(' / ') : "N/A";
    modal.querySelector('.modal-film-category-duration-countries').textContent = `${ratedText} - ${filmData.duration} minutes (${countriesText})`;
    modal.querySelector('.modal-film-imdb').textContent = `IMDB score : ${filmData.imdb_score}/10`;
    modal.querySelector('.modal-film-directors').textContent = filmData.directors.join(', ');

    const modalDescription = modal.querySelector('.modal-film-description');
    modalDescription.textContent = filmData.long_description;
    const modalActors = modal.querySelector('.modal-film-actors');
    modalActors.textContent = filmData.actors ? filmData.actors.join(', ') : "N/A";
}

async function fetchBestFilm(mainUrl, modal) {
    try {
        // récupération du meilleur film
        const bestFilmResponse = await fetch(mainUrl);
        if (!bestFilmResponse.ok) {
            throw new Error(`Erreur lors de la récupération des films : ${bestFilmResponse.status}`);
        }
        const films = await bestFilmResponse.json();
        const bestFilmUrl = films.results[0].url;

        // récupération des détails du meilleur film
        const detailsResponse = await fetch(bestFilmUrl);
        if (!detailsResponse.ok) {
            throw new Error(`Erreur lors de la récupération des détails du film : ${detailsResponse.status}`);
        }
        const filmDetails = await detailsResponse.json();

        // MAJ du modal avec les détails
        modalInfos(modal, filmDetails);
        return filmDetails;
    } catch (error) {
        console.error('Erreur : ', error);
    }
}

async function fetchFilmDetails(filmUrl, modal) {
    try {
        const response = await fetch(filmUrl);
        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }
        const filmDetails = await response.json();
        modalInfos(modal, filmDetails);
    } catch (error) {
        console.error('Erreur ', error);
    }
}

// chargement de la liste des genres
async function fetchGenres() {
    let url = urlGenres;
    let defaultGenreCat4 = "Crime";
    let defaultGenreCat5 = "Family";
  
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
            });
  
            url = data.next;
        }
        // Sélectionner les genres par défaut ou le premier disponible si non existants
        genreSelectCat4.value = defaultGenreCat4
        genreSelectCat5.value = defaultGenreCat5
  
        // Chargez les films pour les genres sélectionnés
        loadCategory(genreSelectCat4.value, category4);
        loadCategory(genreSelectCat5.value, category5);
    } catch (error) {
        console.error('Erreur lors du chargement des genres : ', error);
    }
  }
  
async function bestFilm(urlBestFilm) {
    // chargement du modal best film
    const filmBestInfo = document.querySelector('.film-best-info .modal-container');
    const modalTemplate = document.getElementById('film-modal-template').content.cloneNode(true);
    // Ajouter un identifiant ou une classe unique au modal
    const modal = modalTemplate.firstElementChild; // Supposons que le modal est le premier élément enfant du template cloné
    filmBestInfo.appendChild(modal);

    // TODO récupérer le modal du best film et le passer en paramètre de fetchBestFilm

    try {
        const filmDetails = await fetchBestFilm(urlBestFilm, modal);
        const filmImage = document.getElementById('best-film-image');
        filmImage.src = filmDetails.image_url;
        filmImage.alt = `Affiche ${filmDetails.title}`;
        const filmTitle = document.getElementById('best-film-title');
        filmTitle.textContent = filmDetails.title;

        const filmDescription = document.getElementById('best-film-description');
        filmDescription.textContent = filmDetails.long_description;
    } catch (error) {
        console.error('Erreur : ', error);
    }
}

function displayFilm(filmData, container){
    // clone le template + peuple les infos de base + et stock ID+url pour futur chargement modal
    const template = document.getElementById('film-item-template');
    const clone = document.importNode(template.content, true);
    const filmTitle = clone.querySelector(".film-title");
    const filmImg = clone.querySelector(".film-img");
    const filmItem = clone.querySelector(".film-item");

    filmTitle.textContent = filmData.title;
    filmImg.src = filmData.image_url;
    filmItem.dataset.filmId = filmData.id; // Stocker l'ID du film
    filmItem.dataset.url = filmData.url; // Stocker l'URL du film
    filmImg.onerror = function() {
        this.src = "images/image_non_dispo.jpg";
        this.alt = "Image non disponible";
    };
    container.appendChild(clone);
}

async function fetchFilmListByCategory(container, url) {
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

            films.results.forEach(filmData => {
                if (filmsLoaded < maxFilmsShow) {
                    displayFilm(filmData, container);
                    filmsLoaded++;
                }
            });
            if (!films.next) break; // break si aucune autre page
            currentPage++;
        } catch (error) {
            console.error('Erreur : ', error);
            break;
        }
    }

    while (filmsLoaded < maxFilmsShow) {
        const emptyItem = document.createElement("div");
        emptyItem.className = "film-item empty";
        emptyItem.innerHTML = "<div class='empty-content'>Contenu non disponible</div>";
        container.appendChild(emptyItem);
        filmsLoaded++;
    }

    updateDisplay();
    insertDetailsModal(container); // réinitialisation des événements après l'actualisation du contenu
}

function updateDisplay() {
    // récupère la largeur de l'écran
    const screenWidth = window.innerWidth;
  
    categoryContainers.forEach((container, index) => {
        let maxItems = screenWidth >= 1024 ? container.querySelectorAll('.film-item').length :
                       screenWidth >= 600 ? maxItemsTablette :
                       maxItemsSmartphone;
  
        showItems(container, maxItems);
        const totalItems = container.querySelectorAll('.film-item').length;
        const visibleItems = container.querySelectorAll('.film-item.show').length;
        const btn = btnSeeMore[index];
        btn.textContent = visibleItems < totalItems ? "Voir plus" : "Voir moins";
        btn.style.display = visibleItems < totalItems ? 'block' : 'none'; // cache le bouton si tous les items sont visibles
    });
  }

function showItems(container, numItems) {
    const filmItems = container.querySelectorAll('.film-item');
    filmItems.forEach((item, index) => {
        if (index < numItems) {
            item.classList.add('show');
        } else {
            item.classList.remove('show');
        }
    });
}

function showMoreItems(container, button) {
    const currentVisibleItems = container.querySelectorAll('.film-item.show').length;
    const totalItems = container.querySelectorAll('.film-item').length;
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

async function loadCategory(genre, container) {
    const url = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${genre}`; // mettre dans variable
    container.innerHTML = '';
    await fetchFilmListByCategory(container, url);
}

function updateListSelection(){
    const selectElements = document.querySelectorAll('#genre-select-cat4, #genre-select-cat5');

    selectElements.forEach(select => {
        Array.from(select.options).forEach(option => {
            if (!option.hasAttribute('data-original-text')) {
                option.setAttribute('data-original-text', option.text);
            }
        });

        // Ajouter le symbole flèche vers le bas a la cat selectionnée par défaut a l'ouverture
        const selectedOption = select.options[select.selectedIndex];
        selectedOption.text = selectedOption.getAttribute('data-original-text') + " \u25BC";

        select.addEventListener('focus', function() {
            const selectedOption = this.options[this.selectedIndex];
            selectedOption.text = selectedOption.getAttribute('data-original-text') + " \u2705";
        });
        select.addEventListener('blur', function() {
            Array.from(this.options).forEach(option => {
                option.text = option.getAttribute('data-original-text');
                if (option.value === this.value)
                    option.text = option.getAttribute('data-original-text') + " \u25BC";
            });
        });
        select.addEventListener('change', function() {
            Array.from(this.options).forEach(option => {
                option.text = option.getAttribute('data-original-text');
                if (option.value === this.value)
                    option.text = option.getAttribute('data-original-text') + " \u2705";
            });
        });
        select.addEventListener('select', function() {
            Array.from(this.options).forEach(option => {
                option.text = option.getAttribute('data-original-text');
                if (option.value === e.currentTarget.value)
                    option.text = option.getAttribute('data-original-text') + "   \u2705";
            });
        });
    });
}


function insertDetailsModal() {
    const filmItems = document.querySelectorAll('.film-item', '.film-best');
    const modalTemplate = document.getElementById('film-modal-template').content;

    filmItems.forEach(item => {
        const modalContainer = item.querySelector('.modal-container');
        const clone = document.importNode(modalTemplate, true);
        if (modalContainer) {
            modalContainer.appendChild(clone);
        }

    });
}

function initFilmModalEvents() {
    document.body.addEventListener('click', function(event) {
        if (event.target.matches('.film-button') || event.target.closest('.film-button')) {
            const filmItem = event.target.closest('.film-item');
            if (filmItem) {
                const modal = filmItem.querySelector('.modal');
                const filmUrl = filmItem.dataset.url; // on récupère l'url stockée dans le dataset

                if (filmUrl && modal) {
                    fetchFilmDetails(filmUrl, modal).then(() => {
                        modal.style.display = 'block'; // Affiche le modal une fois les données chargées
                    });
                }
            }
        }
        setupEvents(); // on actualise le comportement des nouveaux modals
    });
}

function setupEvents() {
    // on récupère le modal
    const modals = document.querySelectorAll(".modal");
    // boutons qui ouvrent le modal
    const btns = document.querySelectorAll(".film-button, .film-best-button");
    // boutons qui ferment le modal
    const closeModalCrosses = document.querySelectorAll('.close-modal-cross');
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');

    btns.forEach(btn => {
        btn.addEventListener('click', function() {
            // trouve le modal le plus proche en fonction du contexte du bouton cliqué
            let modal;
            if (this.classList.contains('film-best-button')) {
                // Si c'est un bouton dans la section du meilleur film
                modal = this.closest('.film-best-info').querySelector('.modal-container .modal');
            } else {
                // Pour les autres boutons
                modal = this.closest('.content').querySelector('.modal-container .modal');
            }
            if (modal) {
                modal.style.display = "block";
            }
        });
    });

    // fermeture du modal avec la croix
    closeModalCrosses.forEach(cross => {
        cross.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    // fermeture du modal avec le bouton
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.style.display = 'none';
        });
    });
    // fermeture du modal si click a l'extérieur
    window.addEventListener('click', (event) => {
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    // ajout du meilleur film
    await bestFilm(urlBestFilm);
    // ajout des films des catégories 1 à 3
    await fetchFilmListByCategory(category1, urlCategory1);
    await fetchFilmListByCategory(category2, urlCategory2);
    await fetchFilmListByCategory(category3, urlCategory3);
    // ajout des films des categories 4 et 5
    await fetchGenres();
    // actualise la liste avec la case cochée
    updateListSelection();
    // ajout des modals des films a partir du template
    insertDetailsModal();
    // TODO a refacto avec setupEvents
    initFilmModalEvents();

});

window.addEventListener('resize', updateDisplay);

// TODO a déplacer dans une fonction
const genreSelectCat4 = document.getElementById('genre-select-cat4');
const genreSelectCat5 = document.getElementById('genre-select-cat5');

genreSelectCat4.addEventListener('change', () => {
    const selectedGenre = genreSelectCat4.value;
    loadCategory(selectedGenre, category4);
});

genreSelectCat5.addEventListener('change', () => {
    const selectedGenre = genreSelectCat5.value;
    loadCategory(selectedGenre, category5);
});

btnSeeMore.forEach((button, index) => {
    button.addEventListener('click', () => {
        const container = categoryContainers[index];
        showMoreItems(container, button);
    });
});

// initialisation des évenements des modaux
setupEvents();

// actualisation en fonction de l'affichage
updateDisplay();