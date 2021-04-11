import * as THREE from './three.module.js';

export default class Picker {
    constructor(canvas, scene, camera) {
        this.canvas = canvas;
        this.scene = scene;
        this.camera = camera;
        this.raycaster = new THREE.Raycaster();
    }

    getCanvasRelativePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * this.canvas.width / rect.width,
            y: (event.clientY - rect.top) * this.canvas.height / rect.height,
        };
    }
    
    getPickPosition(event) {
        let pos = this.getCanvasRelativePosition(event);
        return {
            x: (pos.x / this.canvas.width) * 2 - 1,
            y: (pos.y / this.canvas.height) * -2 + 1  // note we flip Y
        }
    }
    
    pick(normalizedPosition) {
        if (this.pickedObject) {
            this.pickedObject = undefined;
        }

        let meshes = null;

        this.scene.children.some(child => {
            if(!child.children || child.children.length < 1) {
                return false;
            }

            meshes = child.children;

            return true;
        });

        if(!meshes) {
            return;
        }
    
        this.raycaster.setFromCamera(normalizedPosition, this.camera);
        const intersectedObjects = this.raycaster.intersectObjects(meshes);
        if (intersectedObjects.length) {
            this.pickedObject = intersectedObjects[0];
            return this.pickedObject;
        }
    }
}
