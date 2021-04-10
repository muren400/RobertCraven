import * as THREE from './three.module.js';
import { OBJLoader } from './OBJLoader.js';
import { MTLLoader } from './MTLLoader.js';
import { OrbitControls } from './OrbitControls.js';

const models = [
    {
        title: "Coke",
        path: "./res/coke/",
        name: "Diet Coke Can"
    },
    {
        title: "Capsule",
        path: "./res/",
        name: "capsule"
    },
    {
        title: "Chair",
        path: "./res/chair/",
        name: "Chair Version 2 mm"
    },
    {
        title: "Female",
        path: "./res/female02/",
        name: "female02"
    },
    {
        title: "Cottage",
        path: "./res/",
        name: "cottage_obj"
    },
    {
        title: "Kackwurst",
        path: "./res/",
        name: "lebendekackwurst"
    }
]

export default class Gallery {
    constructor() {
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);

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

        // this.renderer.domElement.addEventListener("wheel", mouseWheelEventListener);
        // this.renderer.domElement.addEventListener("mousemove", mouseMoveEventListener);
        // this.renderer.domElement.addEventListener("mouseup", mouseUpEventListener);
        // this.renderer.domElement.addEventListener("mousedown", this.mouseDownEventListener.bind(this));
        // this.renderer.domElement.addEventListener("mouseleave", mouseLeaveEventListener);
        // this.renderer.domElement.addEventListener("click", mouseClickEventListener);

        this.canvas = this.renderer.domElement;
        document.getElementById("modelContainer").appendChild(this.canvas);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.update();

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();

        this.initMenu();
    }

    initMenu() {
        if(!models || models.length < 1) {
            return;
        }

        this.loadModel(models[0]);

        const modelMenu = document.getElementById("modelMenu");
        models.forEach(model => {
            const li = document.createElement("li");
            modelMenu.appendChild(li);

            const anchor = document.createElement("a");
            anchor.innerHTML = model.title;
            anchor.addEventListener("click", e => {
                e.preventDefault();
                navigateToElement('modelContainer');
                this.loadModel(model);
                return false;
            });
            li.appendChild(anchor);
        });
    }

    resize() {
        var width = this.renderer.domElement.parentNode.offsetWidth;
        var height = this.renderer.domElement.parentNode.offsetHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, true);
    }

    // mouseWheelEventListener(evt) {
    //     let speed = 0.01;
    //     this.camera.position.z -= evt.wheelDelta * speed;
    // }

    // mouseMoveEventListener(evt) {
    //     if (isRotate) {
    //         let speed = 0.005;
    //         let deltaX = evt.movementX * speed;
    //         let deltaY = evt.movementY * speed;

    //         // this.object.rotateX(deltaY);
    //         // this.object.rotateY(deltaX);

    //         if (picker.pickedthis.object && picker.pickedthis.object.point) {
    //             // rotateAroundPoint(this.camera, picker.pickedthis.object.point, deltaX, deltaY);
    //             rotateAroundPoint(this.camera, { x: 0, y: 0, z: 0 }, deltaX, deltaY);
    //         }
    //     }
    //     if (isMove) {
    //         let speed = 0.005;
    //         let deltaX = evt.movementX * speed;
    //         let deltaY = evt.movementY * speed;

    //         this.camera.translateX(-deltaX);
    //         this.camera.translateY(deltaY);
    //     }
    // }

    // rotateAroundPoint(object, point, deltaX, deltaY) {
    //     let moveDir = new THREE.Vector3(
    //         point.x - object.position.x,
    //         point.y - object.position.y,
    //         point.z - object.position.z,
    //     );

    //     moveDir.normalize();

    //     // let moveDir = new THREE.Vector3( 0, 0, - 1 );
    //     // moveDir.applyQuaternion(this.object.quaternion);

    //     let moveDist = object.position.distanceTo(point);
    //     console.log(moveDist);
    //     object.translateOnAxis(moveDir, moveDist);

    //     // this.object.translateX(translation.x);
    //     // this.object.translateY(translation.y);
    //     // this.object.translateZ(translation.z);

    //     // this.object.rotateX(-this.object.rotation.x)
    //     object.rotateY(deltaX);
    //     // this.object.rotateX(this.object.rotation.x)
    //     // this.object.rotateX(deltaY);

    //     // this.object.translateX(-translation.x);
    //     // this.object.translateY(-translation.y);
    //     // this.object.translateZ(-translation.z);

    //     // moveDist.multiplyScalar(-1);
    //     moveDir = new THREE.Vector3(0, 0, - 1);
    //     // moveDir.applyQuaternion(this.object.quaternion);
    //     object.translateOnAxis(moveDir, -moveDist);
    // }

    // mouseClickEventListener(evt) {
    // }

    // mouseUpEventListener(evt) {
    //     isRotate = false;
    //     isMove = false;

    //     // if (downTimestamp && evt.timeStamp - downTimestamp < 500) {
    //     //     if (picker.pickedthis.object) {
    //     //         picker.pickedthis.object.cube.slerp(picker.pickedthis.object.next.quaternionBase);
    //     //     }
    //     // }
    // }

    // mouseDownEventListener(evt) {
    //     downTimestamp = evt.timeStamp;
    //     switch (evt.which) {
    //         case 1:
    //             // picker.pick(picker.getPickPosition(evt));
    //             // if (picker.pickedthis.object) {
    //             //     this.controls.target = picker.pickedthis.object.point;
    //             // }
    //             // isRotate = true;
    //             // isMove = true;
    //             break;
    //         case 2:
    //             alert('Middle Mouse button pressed.');
    //             break;
    //         case 3:
    //             isMove = true;
    //             break;
    //         default:
    //             alert('You have a strange Mouse!');
    //     }
    // }

    // mouseLeaveEventListener(evt) {
    //     isRotate = false;
    //     isMove = false;
    // }

    render() {
        this.controls.update();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(this.render.bind(this));
    }

    fitCamera() {
        const bbox = new THREE.Box3().setFromObject(this.object);
        const modelWidth = bbox.max.x - bbox.min.x;
        const modelHeight = bbox.max.y - bbox.min.y;
        const cameraDistance = 2.5 * Math.max(modelWidth, modelHeight) / 0.85090352453;

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

    loadModel(model) {
        this.showLoadingAnimation(true);

        if (this.object) {
            this.scene.remove(this.object);
        }

        // const splitIndex = modelURL.lastIndexOf("/") + 1;
        // const path = modelURL.substring(0, splitIndex);
        // let modelName = modelURL.substring(splitIndex).replace(".obj", "");

        var mtlLoader = new MTLLoader();
        mtlLoader.setPath(model.path);
        mtlLoader.load(model.name + ".mtl",
            materials => {

                materials.preload();

                var objLoader = new OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.setPath(model.path);
                objLoader.load(model.name + ".obj",
                    object => {
                        this.object = object;

                        this.scene.add(object);

                        this.fitCamera();

                        this.showLoadingAnimation(false);
                    },
                    xhr => {
                        this.setLoadingProgress(xhr.loaded / xhr.total * 100);
                    },
                    error => {
                        console.log('An error happened: ' + error);
                    }
                )
            },
            xhr => {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            error => {
                console.log('An error happened: ' + error);
            }
        );
    }

    setLoadingProgress(progress) {
        if (!progress) {
            return;
        }

        document.getElementById("loadingProgress").innerHTML = progress.toFixed(0) + '%';
    }

    showLoadingAnimation(show) {
        if (show) {
            this.setLoadingProgress(0);
            document.getElementById("loadingScreen").classList.remove("hidden");
        } else {
            document.getElementById("loadingScreen").classList.add("hidden");
        }
    }
}

window.gallery = new Gallery();
window.gallery.render();
