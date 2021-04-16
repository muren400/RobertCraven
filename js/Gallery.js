export default class Gallery {
    
    constructor() {
        this.gallery = document.querySelector("#gallery");
        this.imageLeft = this.gallery.querySelector(".galleryImageLeft");
        this.imageCenter = this.gallery.querySelector(".galleryImageCenter");
        this.imageRight = this.gallery.querySelector(".galleryImageRight");

        this.initButtons();

        this.setImages([
            "/res/teapot/1.png",
            "/res/teapot/2.png",
            "/res/teapot/3.png",
            "/res/teapot/4.png",
            "/res/teapot/5.png"
        ]);
    }

    hideElement(element) {
        if(!element) {
            return;
        }

        element.classList.add("hidden");
    }

    showElement(element) {
        if(!element) {
            return;
        }
        
        element.classList.remove("hidden");
    }

    setImages(images) {
        this.images = images;

        const openButton = document.querySelector(".showGallery");
        if(!this.images || this.images.length < 1) {
            this.hideElement(openButton);
            return;
        } else {
            this.showElement(openButton);
        }

        const nextButton = this.gallery.querySelector(".next");
        const prevButton = this.gallery.querySelector(".prev");
        if(this.images.length < 2) {
            this.hideElement(nextButton);
            this.hideElement(nextButton);
        } else {
            this.showElement(nextButton);
            this.showElement(prevButton);
        }

        this.imageLeft.src = this.images[this.images.length -1];
        this.imageCenter.src = this.images[0];
        this.imageRight.src = this.images[1] || this.images[this.images.length -1];
    }

    initButtons() {
        const openButton = document.querySelector(".showGallery");
        openButton.addEventListener("click", e => {
            this.showElement(this.gallery);
            this.hideElement(openButton);
        })

        const closeButton = this.gallery.querySelector(".close");
        closeButton.addEventListener("click", e => {
            this.hideElement(this.gallery);
            this.showElement(openButton);
        });

        const nextButton = this.gallery.querySelector(".next");
        nextButton.addEventListener("click", e => {
            if(this.images.length < 2) {
                return;
            }

            this.imageLeft.classList.remove("galleryImageLeft");
            this.imageLeft.classList.add("galleryImageRight");
            this.hideElement(this.imageLeft);

            this.imageCenter.classList.remove("galleryImageCenter");
            this.imageCenter.classList.add("galleryImageLeft");

            this.imageRight.classList.remove("galleryImageRight");
            this.imageRight.classList.add("galleryImageCenter");
            this.showElement(this.imageRight);

            const oldLeft = this.imageLeft;
            this.imageLeft = this.imageCenter;
            this.imageCenter = this.imageRight;
            this.imageRight = oldLeft;

            this.images.push(this.images.shift());
            this.imageLeft.src = this.images[this.images.length -1];
            this.imageRight.src = this.images[1];
        });

        const prevButton = this.gallery.querySelector(".prev");
        prevButton.addEventListener("click", e => {
            if(this.images.length < 2) {
                return;
            }

            this.imageLeft.classList.remove("galleryImageLeft");
            this.imageLeft.classList.add("galleryImageCenter");
            this.showElement(this.imageLeft);

            this.imageCenter.classList.remove("galleryImageCenter");
            this.imageCenter.classList.add("galleryImageRight");

            this.imageRight.classList.remove("galleryImageRight");
            this.imageRight.classList.add("galleryImageLeft");
            this.hideElement(this.imageRight);

            const oldCenter = this.imageCenter;
            this.imageCenter = this.imageLeft;
            this.imageLeft = this.imageRight;
            this.imageRight = oldCenter;

            this.images.unshift(this.images.pop());
            this.imageLeft.src = this.images[this.images.length -1];
            this.imageRight.src = this.images[1];
        });
    }
}
