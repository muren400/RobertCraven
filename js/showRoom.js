import * as THREE from "./three.module.js";
import { OBJLoader } from "./OBJLoader.js";
import { MTLLoader } from "./MTLLoader.js";
import CameraControl from "./CameraControl.js";
import { OrbitControls } from "./OrbitControls.js";

const models = {
  "teapot": {
    title: "Teapot",
    path: "./res/teapot/",
    name: "teapot"
  },
  "coke": {
    title: "Coke",
    path: "./res/coke/",
    name: "Diet Coke Can"
  },
  "capsule": {
    title: "Capsule",
    path: "./res/",
    name: "capsule"
  },
  "chair": {
    title: "Chair",
    path: "./res/chair/",
    name: "Chair Version 2 mm"
  },
  "female": {
    title: "Female",
    path: "./res/female02/",
    name: "female02"
  },
  "cottage": {
    title: "Cottage",
    path: "./res/",
    name: "cottage_obj"
  },
  "kackwurst": {
    title: "Kackwurst",
    path: "./res/",
    name: "lebendekackwurst"
  }
};

export default class ShowRoom {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.01,
      10000
    );

    this.scene = new THREE.Scene();

    let color = 0xffffff;
    let intensity = 1;
    let light = new THREE.SpotLight(0xafafff, intensity);
    light.position.set(40000, 20000, 40000);
    this.scene.add(light);

    light = new THREE.SpotLight(0xffafaf, intensity);
    light.position.set(-40000, 20000, -40000);
    this.scene.add(light);

    light = new THREE.DirectionalLight(color, 0.2);
    light.position.set(0, -20000, 0);
    this.scene.add(light);

    this.objLoader = new OBJLoader();
    this.mtlLoader = new MTLLoader();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });

    this.canvas = this.renderer.domElement;
    document.getElementById("showRoom").appendChild(this.canvas);

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    this.pivotControl = urlParams.get("pivotControl");

    if (this.isTouchDevice() || this.pivotControl !== "true") {
      this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
      this.orbitControls.enableDamping = true;
      this.orbitControls.update();
    } else {
      this.cameraControl = new CameraControl(this.canvas, this.camera, this.scene);
    }

    window.addEventListener("resize", this.resize.bind(this));
    this.resize();

    this.initMenu();
  }

  isTouchDevice() {
    if ("ontouchstart" in document.documentElement) {
      return true;
    }

    return false;
  }

  initMenu() {
    if (!models) {
      return;
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const target = urlParams.get("target");
    const value = urlParams.get("value");

    const modelMenu = document.getElementById("modelMenu");

    let initialModel = null;

    if(target === "showRoom" && models[value]) {
      initialModel = value;
    }

    for (let name in models) {
      const model = models[name];
      const li = document.createElement("li");
      modelMenu.appendChild(li);

      li.innerHTML = model.title;
      li.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        navigateToElement("showRoom", name);
        this.loadModel(name);
        return false;
      });

      if (initialModel === null) {
        initialModel = name;
      }
    }

    if(initialModel) {
      this.loadModel(initialModel);
    }
  }

  resize() {
    var width = this.renderer.domElement.parentNode.offsetWidth;
    var height = this.renderer.domElement.parentNode.offsetHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, true);
  }

  render() {
    if (this.orbitControls) {
      this.orbitControls.update();
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.render.bind(this));
  }

  fitCamera() {
    const bbox = new THREE.Box3().setFromObject(this.object);
    const modelWidth = bbox.max.x - bbox.min.x;
    const modelHeight = bbox.max.y - bbox.min.y;
    const cameraDistance =
      (2.5 * Math.max(modelWidth, modelHeight)) / 0.85090352453;

    const target = new THREE.Vector3(
      (bbox.max.x + bbox.min.x) / 2,
      (bbox.max.y + bbox.min.y) / 2,
      (bbox.max.z + bbox.min.z) / 2
    );

    this.camera.position.z = target.z + cameraDistance;
    this.camera.position.y = target.y;
    this.camera.position.x = target.x;

    this.camera.lookAt(target);

    if (this.cameraControl) {
      this.cameraControl.reset(target);
    }

    if (this.orbitControls) {
      this.orbitControls.target = target;
    }
  }

  loadModel(name) {
    this.showLoadingAnimation(true);

    const model = models[name];

    if (this.object) {
      this.scene.remove(this.object);
    }

    var mtlLoader = new MTLLoader();
    mtlLoader.setPath(model.path);
    mtlLoader.load(
      model.name + ".mtl",
      (materials) => {
        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath(model.path);
        objLoader.load(
          model.name + ".obj",
          (object) => {
            this.object = object;
            this.scene.add(object);
            this.fitCamera();
            this.showLoadingAnimation(false);
          },
          (xhr) => {
            this.setLoadingProgress((xhr.loaded / xhr.total) * 100);
          },
          (error) => {
            console.log("An error happened: " + error);
          }
        );
      },
      (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      (error) => {
        console.log("An error happened: " + error);
      }
    );
  }

  setLoadingProgress(progress) {
    if (!progress) {
      return;
    }

    document.getElementById("loadingProgress").innerHTML =
      progress.toFixed(0) + "%";
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

window.showRoom = new ShowRoom();
window.showRoom.render();
