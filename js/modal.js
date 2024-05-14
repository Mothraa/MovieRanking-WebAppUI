// on récupère le modal
const modals = document.querySelectorAll(".modal");

// boutons qui ouvrent le modal
const btns = document.querySelectorAll(".film-best__button");
// + autres boutons détails

// boutons qui ferment le modal
const closeModalCrosses = document.querySelectorAll('.close-modal-cross');
const closeModalButtons = document.querySelectorAll('.close-modal-btn');

// ouverture du modal
function openModal() {
  const modal = this.closest('.film-best__info').querySelector('.modal');
  modal.style.display = "block";
}

// fermeture du modal
function closeModal() {
  const modal = this.closest('.modal');
  modal.style.display = 'none';
}

// event listeners
btns.forEach(btn => btn.addEventListener('click', openModal));

closeModalCrosses.forEach(cross => cross.addEventListener('click', closeModal));
closeModalButtons.forEach(button => button.addEventListener('click', closeModal));

// fermeture du modal si clic a l'exterieur
window.addEventListener('click', (event) => {
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
