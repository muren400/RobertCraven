function navigateToElement(elementID, value) {
    document.getElementById(elementID).scrollIntoView({ behavior: "smooth", block: "center" });
    let path = "/?target=" + elementID;

    if (value) {
        path += "&value=" + value;
    }

    if(window.showRoom && window.showRoom.pivotControl) {
        path += "&pivotControl=" + true;
    }

    window.history.replaceState("elementID", "elementID", path);
    closeMenu();
}

function toggleMenu() {
    document.querySelector("nav").classList.toggle("hidden");
}

function closeMenu() {
    document.querySelector("nav").classList.add("hidden");
}

window.addEventListener("load", e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const target = urlParams.get("target");
    const value = urlParams.get("value");

    if (target) {
        navigateToElement(target, value);
    }
});