function hideElement(element) {
    if(!element) {
        return;
    }

    element.classList.add("hidden");
}

function showElement(element) {
    if(!element) {
        return;
    }
    
    element.classList.remove("hidden");
}

function navigateToElement(elementID, value) {
    document.getElementById(elementID).scrollIntoView({ behavior: "smooth", block: "center" });
    let path = "/?target=" + elementID;

    if (value) {
        path += "&value=" + value;
    }

    if (window.showRoom && window.showRoom.pivotControl) {
        path += "&pivotControl=" + true;
    }

    window.history.replaceState("elementID", "elementID", path);

    if (isTouchDevice()) {
        closeMenu();
    }
}

function toggleMenu() {
    document.querySelector("nav").classList.toggle("hidden");
}

function closeMenu() {
    hideElement(document.querySelector("nav"));
}

function isTouchDevice() {
    if ("ontouchstart" in document.documentElement) {
        return true;
    }

    return false;
}

window.addEventListener("load", e => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const target = urlParams.get("target");
    const value = urlParams.get("value");

    if (target) {
        navigateToElement(target, value);
    }

    const slideshow = document.querySelector("#slideshow");
    slideshow.addEventListener("keyup", e => {
        if(e.keyCode === 27) {
            toggleSlideshowButton.checked = false;
            hideElement(slideshow);
        }
    });

    const toggleSlideshowButton = document.querySelector("#toggleSlideshowButton");
    toggleSlideshowButton.addEventListener("change", e => {
        if(toggleSlideshowButton.checked) {
            showElement(slideshow);
            slideshow.focus();
        } else {
            hideElement(slideshow);
        }
    });

    const toggleAudioButton = document.querySelector("#toggleMusicButton");
    toggleAudioButton.addEventListener("change", e => {
        if(!window.showRoom || !window.showRoom.audio) {
            return;
        }

        if(toggleAudioButton.checked) {
            window.showRoom.audio.pause();
        } else {
            window.showRoom.audio.play();
        }
    });
});
