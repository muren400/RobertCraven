import * as THREE from "./three.module.js";
import Picker from "./picker.js";

export default class CameraControl {
  constructor(canvas, camera, scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;

    this.picker = new Picker(canvas, scene, camera);

    this.rotationMatrix = new THREE.Matrix4();

    this.canvas.addEventListener(
      "wheel",
      this.mouseWheelEventListener.bind(this)
    );
    this.canvas.addEventListener(
      "mousemove",
      this.mouseMoveEventListener.bind(this)
    );
    this.canvas.addEventListener(
      "mousedown",
      this.mouseDownEventListener.bind(this)
    );
  }

  /**
   * Resets the Controls
   * @param {Vector3} target
   */
  reset(target) {
    this.pivot = target;
  }

  /**
   * Get the current camera target
   * @returns Vector3
   */
  getTarget() {
    let target = new THREE.Vector3(0, 0, -1);
    target.applyQuaternion(this.camera.quaternion);
    target.add(this.camera.position);

    return target;
  }

  /**
   * Moves the camera to the pivot point
   */
  moveToPivot() {
    this.camera.position.sub(this.pivot);
  }

  /**
   * Moves the camera to back from the pivot point to its actual position
   */
  moveFromPivot() {
    this.camera.position.add(this.pivot);
  }

  /**
   * Rotates the camera around the Y-Axis around a given angle
   * @param {Vector3} target the current camera target
   * @param {Number} angle the given angle in radians
   */
  rotateCameraY(target, angle) {
    this.rotationMatrix.makeRotationY(angle);
    this.camera.position.applyMatrix4(this.rotationMatrix);

    target.applyMatrix4(this.rotationMatrix);
    this.camera.lookAt(target);
  }

  /**
   * Gets the current rotation angle around the Y-Axis
   * @returns The rotation angle around the Y-Axis
   */
  getRotationLeft() {
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(this.camera.quaternion);
    return -(Math.atan2(direction.z, direction.x) + Math.PI/2);
  }

  /**
   * Rotates the camera around the X-Axis around a given angle
   * @param {*} target the current camera target
   * @param {*} angle the given angle in radians
   */
  rotateCameraX(target, angle) {
    const rotationLeft = this.getRotationLeft();

    this.rotateCameraY(target, -rotationLeft);

    this.rotationMatrix.makeRotationX(angle);
    this.camera.position.applyMatrix4(this.rotationMatrix);

    target.applyMatrix4(this.rotationMatrix);
    this.camera.lookAt(target);

    this.rotateCameraY(target, rotationLeft);
  }

  /**
   * Yaws the camera around the the pivot point at a given angle
   * @param {*} angle the given angle in radians
   */
  rotateLeft(angle) {
    this.moveToPivot();
    this.rotateCameraY(this.getTarget(), angle);
    this.moveFromPivot();
  }

  /**
   * Pitches the camera around the pivot point at a given angle
   * @param {*} angle the given angle in radians
   */
  rotateUp(angle) {
    // Gimbal Lock
    const minXZ = 0.05;
    const direction = new THREE.Vector3(0, 0, -1);
    direction.applyQuaternion(this.camera.quaternion);
    if(angle < 0 && direction.y < 0 && direction.x < minXZ && direction.z < minXZ && direction.x > -minXZ && direction.z > -minXZ) {
        return;
    }

    if(angle > 0 && direction.y > 0 && direction.x < minXZ && direction.z < minXZ && direction.x > -minXZ && direction.z > -minXZ) {
        return;
    }

    this.moveToPivot();
    this.rotateCameraX(this.getTarget(), angle);
    this.moveFromPivot();
  }

  /**
   * Zoom in and out (dolly)
   * @param {*} evt 
   */
  mouseWheelEventListener(evt) {
    evt.preventDefault();
    let speed = 0.1 * evt.wheelDelta;
    this.camera.translateZ(speed);
  }

  /**
   * Pan or Orbit
   * @param {*} evt 
   */
  mouseMoveEventListener(evt) {
    evt.preventDefault();

    if (evt.which === 1) {
      let speed = 0.005;
      let deltaX = evt.movementX * speed;
      let deltaY = evt.movementY * speed;

      this.rotateLeft(-deltaX);
      this.rotateUp(-deltaY);
    }
    if (evt.which === 2 || evt.which === 3) {
      let speed = 0.2;
      let deltaX = evt.movementX * speed;
      let deltaY = evt.movementY * speed;

      this.camera.translateX(-deltaX);
      this.camera.translateY(deltaY);
    }
  }

  /**
   * Mouse down event
   * @param {*} evt 
   * @returns 
   */
  mouseDownEventListener(evt) {
    evt.preventDefault();

    this.downTimestamp = evt.timeStamp;
    switch (evt.which) {
      case 1:
        if (!this.picker) {
          return;
        }

        this.picker.pick(this.picker.getPickPosition(evt));
        if (this.picker.pickedObject) {
          this.pivot = this.picker.pickedObject.point;
        }

        break;
      case 2:
        break;
      case 3:
        break;
      default:
    }
  }
}
