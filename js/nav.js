function navigateToElement(elementID) {
    document.getElementById(elementID).scrollIntoView({ behavior: 'smooth', block: 'center' });
    closeMenu();
}

function toggleMenu() {
    document.querySelector("#header nav").classList.toggle('hidden');
}

function closeMenu() {
    document.querySelector("#header nav").classList.add('hidden');
}