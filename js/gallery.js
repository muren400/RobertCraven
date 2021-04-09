import * as THREE from './three.module.js';
import { OBJLoader } from './OBJLoader.js';
import { MTLLoader } from './MTLLoader.js';
import { OrbitControls } from './OrbitControls.js';

export default class Gallery {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
        this.camera.position.z = 300;
        this.camera.position.y = 100;
        
        this.scene = new THREE.Scene();

        let color = 0xFFFFFF;
        let intensity = 1;
        let light = new THREE.SpotLight(0xafafff, intensity);
        light.position.set(40000, 20000, 40000);
        this.scene.add(light);

        light = new THREE.SpotLight(0xffafaf, intensity);
        light.position.set(-40000, 20000, -40000);
        this.scene.add(light);

        light = new THREE.DirectionalLight(color, .2);
        light.position.set(0, -20000, 0);
        this.scene.add(light);

        this.objLoader = new OBJLoader();
        this.mtlLoader = new MTLLoader();

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", this.resize.bind(this));
        // this.renderer.domElement.addEventListener("wheel", mouseWheelEventListener);
        // this.renderer.domElement.addEventListener("mousemove", mouseMoveEventListener);
        // this.renderer.domElement.addEventListener("mouseup", mouseUpEventListener);
        this.renderer.domElement.addEventListener("mousedown", this.mouseDownEventListener.bind(this));
        // this.renderer.domElement.addEventListener("mouseleave", mouseLeaveEventListener);
        // this.renderer.domElement.addEventListener("click", mouseClickEventListener);

        document.getElementById("modelContainer").appendChild(this.renderer.domElement);
        this.canvas = this.renderer.domElement;

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.update();

        this.resize();

        this.initMenu();
    }

    initMenu() {
        const anchors = document.querySelectorAll(".modelAnchor");

        this.loadModel(anchors[0].href);

        anchors.forEach(anchor => {
            anchor.addEventListener("click", e => {
                e.preventDefault();
                navigateToElement('modelContainer');
                this.loadModel(anchor.href);
                return false;
            });
        });
    }

    resize() {
        var width = this.renderer.domElement.parentNode.offsetWidth;
        var height = this.renderer.domElement.parentNode.offsetHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, true);
    }

    mouseWheelEventListener(evt) {
        let speed = 0.01;
        this.camera.position.z -= evt.wheelDelta * speed;
    }

    mouseMoveEventListener(evt) {
        if (isRotate) {
            let speed = 0.005;
            let deltaX = evt.movementX * speed;
            let deltaY = evt.movementY * speed;

            // this.object.rotateX(deltaY);
            // this.object.rotateY(deltaX);

            if (picker.pickedthis.object && picker.pickedthis.object.point) {
                // rotateAroundPoint(this.camera, picker.pickedthis.object.point, deltaX, deltaY);
                rotateAroundPoint(this.camera, { x: 0, y: 0, z: 0 }, deltaX, deltaY);
            }
        }
        if (isMove) {
            let speed = 0.005;
            let deltaX = evt.movementX * speed;
            let deltaY = evt.movementY * speed;

            this.camera.translateX(-deltaX);
            this.camera.translateY(deltaY);
        }
    }

    rotateAroundPoint(object, point, deltaX, deltaY) {
        let moveDir = new THREE.Vector3(
            point.x - object.position.x,
            point.y - object.position.y,
            point.z - object.position.z,
        );

        moveDir.normalize();

        // let moveDir = new THREE.Vector3( 0, 0, - 1 );
        // moveDir.applyQuaternion(this.object.quaternion);

        let moveDist = object.position.distanceTo(point);
        console.log(moveDist);
        object.translateOnAxis(moveDir, moveDist);

        // this.object.translateX(translation.x);
        // this.object.translateY(translation.y);
        // this.object.translateZ(translation.z);

        // this.object.rotateX(-this.object.rotation.x)
        object.rotateY(deltaX);
        // this.object.rotateX(this.object.rotation.x)
        // this.object.rotateX(deltaY);

        // this.object.translateX(-translation.x);
        // this.object.translateY(-translation.y);
        // this.object.translateZ(-translation.z);

        // moveDist.multiplyScalar(-1);
        moveDir = new THREE.Vector3(0, 0, - 1);
        // moveDir.applyQuaternion(this.object.quaternion);
        object.translateOnAxis(moveDir, -moveDist);
    }

    mouseClickEventListener(evt) {
    }

    mouseUpEventListener(evt) {
        isRotate = false;
        isMove = false;

        // if (downTimestamp && evt.timeStamp - downTimestamp < 500) {
        //     if (picker.pickedthis.object) {
        //         picker.pickedthis.object.cube.slerp(picker.pickedthis.object.next.quaternionBase);
        //     }
        // }
    }

    mouseDownEventListener(evt) {
        downTimestamp = evt.timeStamp;
        switch (evt.which) {
            case 1:
                // picker.pick(picker.getPickPosition(evt));
                // if (picker.pickedthis.object) {
                //     this.controls.target = picker.pickedthis.object.point;
                // }
                // isRotate = true;
                // isMove = true;
                break;
            case 2:
                alert('Middle Mouse button pressed.');
                break;
            case 3:
                isMove = true;
                break;
            default:
                alert('You have a strange Mouse!');
        }
    }

    mouseLeaveEventListener(evt) {
        isRotate = false;
        isMove = false;
    }

    shuffle() {
        cubes.forEach(cube => {
            let rnd = Math.floor(Math.random() * 6);
            let plane = cube.planes[rnd];
            cube.slerp(plane.quaternionBase);
        });
    }

    render() {
        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

    fitCamera() {
        const bbox = new THREE.Box3().setFromObject(this.object);
        const modelWidth = bbox.max.x - bbox.min.x;
        const modelHeight = bbox.max.y - bbox.min.y;
        const cameraDistance = 2.5*Math.max(modelWidth, modelHeight)/0.85090352453;

         const target = new THREE.Vector3(
            (bbox.max.x + bbox.min.x) / 2,
            (bbox.max.y + bbox.min.y) / 2,
            (bbox.max.z + bbox.min.z) / 2,
        );

        this.camera.position.z = target.z + cameraDistance;
        this.camera.position.y = target.y;
        this.camera.position.x = target.x;

        this.controls.target = target;
    }

    loadModel(modelURL) {
        this.showLoadingAnimation(true);

        if (this.object) {
            this.scene.remove(this.object);
        }

        const splitIndex = modelURL.lastIndexOf("/") + 1;
        const path = modelURL.substring(0, splitIndex);
        let modelName = modelURL.substring(splitIndex).replace(".obj", "");

        var mtlLoader = new MTLLoader();
        mtlLoader.setPath(path);
        mtlLoader.load(modelName + ".mtl",
            materials => {

                materials.preload();

                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(path);
                objLoader.load(modelName + ".obj",
                    object => {
                        this.object = object;
                        this.scene.add(object);

                        this.fitCamera();

                        this.showLoadingAnimation(false);
                    },
                    xhr => {
                        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    },
                    error => {
                        console.log('An error happened');
                    }
                )
            },
            xhr => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            error => {
                console.log('An error happened');
            }
        );
    }

    showLoadingAnimation(show){
        if(show) {
            document.getElementById("loadingScreen").classList.remove("hidden");
        } else {
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    }
}

window.gallery = new Gallery();
window.gallery.render();
