// JavaScript pour afficher les éléments supplémentaires lorsque le bouton est cliqué
const btnSeeMore = document.querySelectorAll('.btn-see-more');
const categoryContainers = document.querySelectorAll('.category_container');
const maxItemsTablet = 4;
const maxItemsMobile = 2;

// Fonction pour mettre à jour l'affichage en fonction de la taille de l'écran après un redimensionnement
function updateDisplay() {
    // récupère la largeur de l'ecran
    const screenWidth = window.innerWidth;

    // Déterminer le nombre maximum d'éléments à afficher en fonction de la taille de l'écran
    if (screenWidth >= 1024) {
        categoryContainers.forEach(container => {
            showItems(container, container.querySelectorAll('.film_item').length);
            container.nextElementSibling.style.display = 'none';
        });
    } else if (screenWidth >= 600 && screenWidth < 1024) {
        categoryContainers.forEach(container => {
            showItems(container, maxItemsTablet);
            container.nextElementSibling.style.display = 'block';
        });
    } else {
        categoryContainers.forEach(container => {
            showItems(container, maxItemsMobile);
            container.nextElementSibling.style.display = 'block';
        });
    }
}

// Fonction pour afficher un nombre spécifique d'éléments pour une catégorie donnée
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

// Écouter l'événement de redimensionnement de la fenêtre et mettre à jour l'affichage
window.addEventListener('resize', updateDisplay);

// Ajouter un écouteur d'événement aux boutons "Voir plus" de chaque catégorie pour afficher les éléments supplémentaires
btnSeeMore.forEach((button, index) => {
    button.addEventListener('click', () => {
        // Déterminer la catégorie en fonction de l'index du bouton
        const container = categoryContainers[index];
        // Afficher plus d'éléments pour cette catégorie
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
            showItems(container, maxItemsTablet); // Afficher le nombre maximum sur tablette
        } else {
            showItems(container, maxItemsMobile); // Afficher le nombre maximum sur smartphone
        }
        button.textContent = "Voir plus";
    }
}

// Appeler updateDisplay pour initialiser l'affichage
updateDisplay();
