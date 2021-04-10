function navigateToElement(elementID) {
    document.getElementById(elementID).scrollIntoView({ behavior: 'smooth', block: 'center' });
    closeMenu();
}

function toggleMenu() {
    document.querySelector("nav").classList.toggle('hidden');
}

function closeMenu() {
    document.querySelector("nav").classList.add('hidden');
}