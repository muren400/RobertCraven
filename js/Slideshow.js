export default class Slideshow {

    constructor() {
        this.slideshow = document.querySelector("#slideshow");
        
        this.left = this.slideshow.querySelector(".slideshowLeft");
        this.center = this.slideshow.querySelector(".slideshowCenter");
        this.right = this.slideshow.querySelector(".slideshowRight");

        this.left.img = this.left.querySelector("img");
        this.center.img = this.center.querySelector("img");
        this.right.img = this.right.querySelector("img");

        this.left.span = this.left.querySelector("span");
        this.center.span = this.center.querySelector("span");
        this.right.span = this.right.querySelector("span");

        this.toggleSlideshow = document.querySelector("#toggleSlideshow");
        this.nextButton = this.slideshow.querySelector(".next");
        this.prevButton = this.slideshow.querySelector(".prev");

        this.initButtons();
        this.initKeys();
    }

    hideElement(element) {
        if (!element) {
            return;
        }

        element.classList.add("slideshowHidden");
    }

    showElement(element) {
        if (!element) {
            return;
        }

        element.classList.remove("slideshowHidden");
    }

    setImages(images) {
        this.images = images;

        if (!this.images || this.images.length < 1) {
            this.hideElement(this.toggleSlideshow);
            return;
        } else {
            this.showElement(this.toggleSlideshow);
        }

        if (this.images.length < 2) {
            this.hideElement(this.nextButton);
            this.hideElement(this.nextButton);
        } else {
            this.showElement(this.nextButton);
            this.showElement(this.prevButton);
        }

        this.setImage(this.left, this.images[this.images.length - 1]);
        this.setImage(this.center, this.images[0]);
        this.setImage(this.right, this.images[1] || this.images[this.images.length - 1]);
    }

    setImage(imageContainer, image) {
        if (typeof image === "string") {
            imageContainer.img.src = image;
        }

        if (image.path) {
            imageContainer.img.src = image.path;
        }

        if(image.title) {
            imageContainer.img.title = image.title;
        }

        if(image.name) {
            imageContainer.span.innerHTML = image.name;
        } else {
            imageContainer.span.innerHTML = "";
        }

        if(image.alt) {
            imageContainer.img.alt = image.alt;
        }

        if(!image.path && !image.alt) {
            imageContainer.img.alt = "nothing found...";
        }
    }

    initKeys() {
        this.slideshow.addEventListener("keyup", e => {
            switch (e.keyCode) {
                case 39:
                    this.next();
                    return;
                case 37:
                    this.prev();
                    return;
                default:
                    return;
            }
        });
    }

    initButtons() {
        this.nextButton.addEventListener("click", e => {
            this.next();
        });

        this.prevButton.addEventListener("click", e => {
            this.prev();
        });
    }

    next() {
        if (this.images.length < 2) {
            return;
        }

        this.left.classList.remove("slideshowLeft");
        this.left.classList.add("slideshowRight");
        this.hideElement(this.left);

        this.center.classList.remove("slideshowCenter");
        this.center.classList.add("slideshowLeft");

        this.right.classList.remove("slideshowRight");
        this.right.classList.add("slideshowCenter");
        this.showElement(this.right);

        const oldLeft = this.left;
        this.left = this.center;
        this.center = this.right;
        this.right = oldLeft;

        this.images.push(this.images.shift());
        this.setImage(this.left, this.images[this.images.length - 1]);
        this.setImage(this.right, this.images[1]);
    }

    prev() {
        if (this.images.length < 2) {
            return;
        }

        this.left.classList.remove("slideshowLeft");
        this.left.classList.add("slideshowCenter");
        this.showElement(this.left);

        this.center.classList.remove("slideshowCenter");
        this.center.classList.add("slideshowRight");

        this.right.classList.remove("slideshowRight");
        this.right.classList.add("slideshowLeft");
        this.hideElement(this.right);

        const oldCenter = this.center;
        this.center = this.left;
        this.left = this.right;
        this.right = oldCenter;

        this.images.unshift(this.images.pop());
        this.setImage(this.left, this.images[this.images.length - 1]);
        this.setImage(this.right, this.images[1]);
    }
}
