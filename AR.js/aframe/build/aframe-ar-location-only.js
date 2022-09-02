(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("aframe"), require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["aframe", "three"], factory);
	else if(typeof exports === 'object')
		exports["ARjs"] = factory(require("aframe"), require("three"));
	else
		root["ARjs"] = factory(root["AFRAME"], root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_aframe__, __WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./aframe/src/location-based/ArjsDeviceOrientationControls.js":
/*!********************************************************************!*\
  !*** ./aframe/src/location-based/ArjsDeviceOrientationControls.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

/* NOTE that this is a modified version of THREE.DeviceOrientationControls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */



const ArjsDeviceOrientationControls = function (object) {
  var scope = this;

  this.object = object;
  this.object.rotation.reorder("YXZ");

  this.enabled = true;

  this.deviceOrientation = {};
  this.screenOrientation = 0;

  this.alphaOffset = 0; // radians

  this.smoothingFactor = 1;

  this.TWO_PI = 2 * Math.PI;
  this.HALF_PI = 0.5 * Math.PI;

  var onDeviceOrientationChangeEvent = function (event) {
    scope.deviceOrientation = event;
  };

  var onScreenOrientationChangeEvent = function () {
    scope.screenOrientation = window.orientation || 0;
  };

  // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

  var setObjectQuaternion = (function () {
    var zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);

    var euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();

    var q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    var q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return function (quaternion, alpha, beta, gamma, orient) {
      euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

  this.connect = function () {
    onScreenOrientationChangeEvent();

    window.addEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.addEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = true;
  };

  this.disconnect = function () {
    window.removeEventListener(
      "orientationchange",
      onScreenOrientationChangeEvent,
      false
    );
    window.removeEventListener(
      "deviceorientation",
      onDeviceOrientationChangeEvent,
      false
    );

    scope.enabled = false;
  };

  this.update = function () {
    if (scope.enabled === false) return;

    var device = scope.deviceOrientation;

    if (device) {
      var alpha = device.alpha
        ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.alpha) + scope.alphaOffset
        : 0; // Z

      var beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.beta) : 0; // X'

      var gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.gamma) : 0; // Y''

      var orient = scope.screenOrientation
        ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(scope.screenOrientation)
        : 0; // O

      // NW Added smoothing code
      var k = this.smoothingFactor;

      if (this.lastOrientation) {
        alpha = this._getSmoothedAngle(alpha, this.lastOrientation.alpha, k);
        beta = this._getSmoothedAngle(
          beta + Math.PI,
          this.lastOrientation.beta,
          k
        );
        gamma = this._getSmoothedAngle(
          gamma + this.HALF_PI,
          this.lastOrientation.gamma,
          k,
          Math.PI
        );
      } else {
        beta += Math.PI;
        gamma += this.HALF_PI;
      }

      this.lastOrientation = {
        alpha: alpha,
        beta: beta,
        gamma: gamma,
      };
      setObjectQuaternion(
        scope.object.quaternion,
        alpha,
        beta - Math.PI,
        gamma - this.HALF_PI,
        orient
      );
    }
  };

  // NW Added
  this._orderAngle = function (a, b, range = this.TWO_PI) {
    if (
      (b > a && Math.abs(b - a) < range / 2) ||
      (a > b && Math.abs(b - a) > range / 2)
    ) {
      return { left: a, right: b };
    } else {
      return { left: b, right: a };
    }
  };

  // NW Added
  this._getSmoothedAngle = function (a, b, k, range = this.TWO_PI) {
    const angles = this._orderAngle(a, b, range);
    const angleshift = angles.left;
    const origAnglesRight = angles.right;
    angles.left = 0;
    angles.right -= angleshift;
    if (angles.right < 0) angles.right += range;
    let newangle =
      origAnglesRight == b
        ? (1 - k) * angles.right + k * angles.left
        : k * angles.right + (1 - k) * angles.left;
    newangle += angleshift;
    if (newangle >= range) newangle -= range;
    return newangle;
  };

  this.dispose = function () {
    scope.disconnect();
  };

  this.connect();
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ArjsDeviceOrientationControls);


/***/ }),

/***/ "./aframe/src/location-based/arjs-look-controls.js":
/*!*********************************************************!*\
  !*** ./aframe/src/location-based/arjs-look-controls.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
// To avoid recalculation at every mouse movement tick
var PI_2 = Math.PI / 2;

/**
 * look-controls. Update entity pose, factoring mouse, touch, and WebVR API data.
 */

/* NOTE that this is a modified version of A-Frame's look-controls to
 * allow exponential smoothing, for use in AR.js.
 *
 * Modifications Nick Whitelegg (nickw1 github)
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-look-controls", {
  dependencies: ["position", "rotation"],

  schema: {
    enabled: { default: true },
    magicWindowTrackingEnabled: { default: true },
    pointerLockEnabled: { default: false },
    reverseMouseDrag: { default: false },
    reverseTouchDrag: { default: false },
    touchEnabled: { default: true },
    smoothingFactor: { type: "number", default: 1 },
  },

  init: function () {
    this.deltaYaw = 0;
    this.previousHMDPosition = new THREE.Vector3();
    this.hmdQuaternion = new THREE.Quaternion();
    this.magicWindowAbsoluteEuler = new THREE.Euler();
    this.magicWindowDeltaEuler = new THREE.Euler();
    this.position = new THREE.Vector3();
    this.magicWindowObject = new THREE.Object3D();
    this.rotation = {};
    this.deltaRotation = {};
    this.savedPose = null;
    this.pointerLocked = false;
    this.setupMouseControls();
    this.bindMethods();
    this.previousMouseEvent = {};

    this.setupMagicWindowControls();

    // To save / restore camera pose
    this.savedPose = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler(),
    };

    // Call enter VR handler if the scene has entered VR before the event listeners attached.
    if (this.el.sceneEl.is("vr-mode")) {
      this.onEnterVR();
    }
  },

  setupMagicWindowControls: function () {
    var magicWindowControls;
    var data = this.data;

    // Only on mobile devices and only enabled if DeviceOrientation permission has been granted.
    if (aframe__WEBPACK_IMPORTED_MODULE_0__.utils.device.isMobile()) {
      magicWindowControls = this.magicWindowControls =
        new _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_1__["default"](this.magicWindowObject);
      if (
        typeof DeviceOrientationEvent !== "undefined" &&
        DeviceOrientationEvent.requestPermission
      ) {
        magicWindowControls.enabled = false;
        if (
          this.el.sceneEl.components["device-orientation-permission-ui"]
            .permissionGranted
        ) {
          magicWindowControls.enabled = data.magicWindowTrackingEnabled;
        } else {
          this.el.sceneEl.addEventListener(
            "deviceorientationpermissiongranted",
            function () {
              magicWindowControls.enabled = data.magicWindowTrackingEnabled;
            }
          );
        }
      }
    }
  },

  update: function (oldData) {
    var data = this.data;

    // Disable grab cursor classes if no longer enabled.
    if (data.enabled !== oldData.enabled) {
      this.updateGrabCursor(data.enabled);
    }

    // Reset magic window eulers if tracking is disabled.
    if (
      oldData &&
      !data.magicWindowTrackingEnabled &&
      oldData.magicWindowTrackingEnabled
    ) {
      this.magicWindowAbsoluteEuler.set(0, 0, 0);
      this.magicWindowDeltaEuler.set(0, 0, 0);
    }

    // Pass on magic window tracking setting to magicWindowControls.
    if (this.magicWindowControls) {
      this.magicWindowControls.enabled = data.magicWindowTrackingEnabled;
      this.magicWindowControls.smoothingFactor = data.smoothingFactor;
    }

    if (oldData && !data.pointerLockEnabled !== oldData.pointerLockEnabled) {
      this.removeEventListeners();
      this.addEventListeners();
      if (this.pointerLocked) {
        this.exitPointerLock();
      }
    }
  },

  tick: function (t) {
    var data = this.data;
    if (!data.enabled) {
      return;
    }
    this.updateOrientation();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  remove: function () {
    this.removeEventListeners();
    if (this.pointerLocked) {
      this.exitPointerLock();
    }
  },

  bindMethods: function () {
    this.onMouseDown = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseDown, this);
    this.onMouseMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseMove, this);
    this.onMouseUp = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onMouseUp, this);
    this.onTouchStart = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchStart, this);
    this.onTouchMove = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchMove, this);
    this.onTouchEnd = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onTouchEnd, this);
    this.onEnterVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onEnterVR, this);
    this.onExitVR = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onExitVR, this);
    this.onPointerLockChange = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(
      this.onPointerLockChange,
      this
    );
    this.onPointerLockError = aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.onPointerLockError, this);
  },

  /**
   * Set up states and Object3Ds needed to store rotation data.
   */
  setupMouseControls: function () {
    this.mouseDown = false;
    this.pitchObject = new THREE.Object3D();
    this.yawObject = new THREE.Object3D();
    this.yawObject.position.y = 10;
    this.yawObject.add(this.pitchObject);
  },

  /**
   * Add mouse and touch event listeners to canvas.
   */
  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    // Wait for canvas to load.
    if (!canvasEl) {
      sceneEl.addEventListener(
        "render-target-loaded",
        aframe__WEBPACK_IMPORTED_MODULE_0__.utils.bind(this.addEventListeners, this)
      );
      return;
    }

    // Mouse events.
    canvasEl.addEventListener("mousedown", this.onMouseDown, false);
    window.addEventListener("mousemove", this.onMouseMove, false);
    window.addEventListener("mouseup", this.onMouseUp, false);

    // Touch events.
    canvasEl.addEventListener("touchstart", this.onTouchStart);
    window.addEventListener("touchmove", this.onTouchMove);
    window.addEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.addEventListener("enter-vr", this.onEnterVR);
    sceneEl.addEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    if (this.data.pointerLockEnabled) {
      document.addEventListener(
        "pointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "mozpointerlockchange",
        this.onPointerLockChange,
        false
      );
      document.addEventListener(
        "pointerlockerror",
        this.onPointerLockError,
        false
      );
    }
  },

  /**
   * Remove mouse and touch event listeners from canvas.
   */
  removeEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl && sceneEl.canvas;

    if (!canvasEl) {
      return;
    }

    // Mouse events.
    canvasEl.removeEventListener("mousedown", this.onMouseDown);
    window.removeEventListener("mousemove", this.onMouseMove);
    window.removeEventListener("mouseup", this.onMouseUp);

    // Touch events.
    canvasEl.removeEventListener("touchstart", this.onTouchStart);
    window.removeEventListener("touchmove", this.onTouchMove);
    window.removeEventListener("touchend", this.onTouchEnd);

    // sceneEl events.
    sceneEl.removeEventListener("enter-vr", this.onEnterVR);
    sceneEl.removeEventListener("exit-vr", this.onExitVR);

    // Pointer Lock events.
    document.removeEventListener(
      "pointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "mozpointerlockchange",
      this.onPointerLockChange,
      false
    );
    document.removeEventListener(
      "pointerlockerror",
      this.onPointerLockError,
      false
    );
  },

  /**
   * Update orientation for mobile, mouse drag, and headset.
   * Mouse-drag only enabled if HMD is not active.
   */
  updateOrientation: (function () {
    var poseMatrix = new THREE.Matrix4();

    return function () {
      var object3D = this.el.object3D;
      var pitchObject = this.pitchObject;
      var yawObject = this.yawObject;
      var pose;
      var sceneEl = this.el.sceneEl;

      // In VR mode, THREE is in charge of updating the camera pose.
      if (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected()) {
        // With WebXR THREE applies headset pose to the object3D matrixWorld internally.
        // Reflect values back on position, rotation, scale for getAttribute to return the expected values.
        if (sceneEl.hasWebXR) {
          pose = sceneEl.renderer.xr.getCameraPose();
          if (pose) {
            poseMatrix.elements = pose.transform.matrix;
            poseMatrix.decompose(
              object3D.position,
              object3D.rotation,
              object3D.scale
            );
          }
        }
        return;
      }

      this.updateMagicWindowOrientation();

      // On mobile, do camera rotation with touch events and sensors.
      object3D.rotation.x =
        this.magicWindowDeltaEuler.x + pitchObject.rotation.x;
      object3D.rotation.y = this.magicWindowDeltaEuler.y + yawObject.rotation.y;
      object3D.rotation.z = this.magicWindowDeltaEuler.z;
    };
  })(),

  updateMagicWindowOrientation: function () {
    var magicWindowAbsoluteEuler = this.magicWindowAbsoluteEuler;
    var magicWindowDeltaEuler = this.magicWindowDeltaEuler;
    // Calculate magic window HMD quaternion.
    if (this.magicWindowControls && this.magicWindowControls.enabled) {
      this.magicWindowControls.update();
      magicWindowAbsoluteEuler.setFromQuaternion(
        this.magicWindowObject.quaternion,
        "YXZ"
      );
      if (!this.previousMagicWindowYaw && magicWindowAbsoluteEuler.y !== 0) {
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
      if (this.previousMagicWindowYaw) {
        magicWindowDeltaEuler.x = magicWindowAbsoluteEuler.x;
        magicWindowDeltaEuler.y +=
          magicWindowAbsoluteEuler.y - this.previousMagicWindowYaw;
        magicWindowDeltaEuler.z = magicWindowAbsoluteEuler.z;
        this.previousMagicWindowYaw = magicWindowAbsoluteEuler.y;
      }
    }
  },

  /**
   * Translate mouse drag into rotation.
   *
   * Dragging up and down rotates the camera around the X-axis (yaw).
   * Dragging left and right rotates the camera around the Y-axis (pitch).
   */
  onMouseMove: function (evt) {
    var direction;
    var movementX;
    var movementY;
    var pitchObject = this.pitchObject;
    var previousMouseEvent = this.previousMouseEvent;
    var yawObject = this.yawObject;

    // Not dragging or not enabled.
    if (!this.data.enabled || (!this.mouseDown && !this.pointerLocked)) {
      return;
    }

    // Calculate delta.
    if (this.pointerLocked) {
      movementX = evt.movementX || evt.mozMovementX || 0;
      movementY = evt.movementY || evt.mozMovementY || 0;
    } else {
      movementX = evt.screenX - previousMouseEvent.screenX;
      movementY = evt.screenY - previousMouseEvent.screenY;
    }
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;

    // Calculate rotation.
    direction = this.data.reverseMouseDrag ? 1 : -1;
    yawObject.rotation.y += movementX * 0.002 * direction;
    pitchObject.rotation.x += movementY * 0.002 * direction;
    pitchObject.rotation.x = Math.max(
      -PI_2,
      Math.min(PI_2, pitchObject.rotation.x)
    );
  },

  /**
   * Register mouse down to detect mouse drag.
   */
  onMouseDown: function (evt) {
    var sceneEl = this.el.sceneEl;
    if (
      !this.data.enabled ||
      (sceneEl.is("vr-mode") && sceneEl.checkHeadsetConnected())
    ) {
      return;
    }
    // Handle only primary button.
    if (evt.button !== 0) {
      return;
    }

    var canvasEl = sceneEl && sceneEl.canvas;

    this.mouseDown = true;
    this.previousMouseEvent.screenX = evt.screenX;
    this.previousMouseEvent.screenY = evt.screenY;
    this.showGrabbingCursor();

    if (this.data.pointerLockEnabled && !this.pointerLocked) {
      if (canvasEl.requestPointerLock) {
        canvasEl.requestPointerLock();
      } else if (canvasEl.mozRequestPointerLock) {
        canvasEl.mozRequestPointerLock();
      }
    }
  },

  /**
   * Shows grabbing cursor on scene
   */
  showGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "grabbing";
  },

  /**
   * Hides grabbing cursor on scene
   */
  hideGrabbingCursor: function () {
    this.el.sceneEl.canvas.style.cursor = "";
  },

  /**
   * Register mouse up to detect release of mouse drag.
   */
  onMouseUp: function () {
    this.mouseDown = false;
    this.hideGrabbingCursor();
  },

  /**
   * Register touch down to detect touch drag.
   */
  onTouchStart: function (evt) {
    if (
      evt.touches.length !== 1 ||
      !this.data.touchEnabled ||
      this.el.sceneEl.is("vr-mode")
    ) {
      return;
    }
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
    this.touchStarted = true;
  },

  /**
   * Translate touch move to Y-axis rotation.
   */
  onTouchMove: function (evt) {
    var direction;
    var canvas = this.el.sceneEl.canvas;
    var deltaY;
    var yawObject = this.yawObject;

    if (!this.touchStarted || !this.data.touchEnabled) {
      return;
    }

    deltaY =
      (2 * Math.PI * (evt.touches[0].pageX - this.touchStart.x)) /
      canvas.clientWidth;

    direction = this.data.reverseTouchDrag ? 1 : -1;
    // Limit touch orientaion to to yaw (y axis).
    yawObject.rotation.y -= deltaY * 0.5 * direction;
    this.touchStart = {
      x: evt.touches[0].pageX,
      y: evt.touches[0].pageY,
    };
  },

  /**
   * Register touch end to detect release of touch drag.
   */
  onTouchEnd: function () {
    this.touchStarted = false;
  },

  /**
   * Save pose.
   */
  onEnterVR: function () {
    var sceneEl = this.el.sceneEl;
    if (!sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.saveCameraPose();
    this.el.object3D.position.set(0, 0, 0);
    this.el.object3D.rotation.set(0, 0, 0);
    if (sceneEl.hasWebXR) {
      this.el.object3D.matrixAutoUpdate = false;
      this.el.object3D.updateMatrix();
    }
  },

  /**
   * Restore the pose.
   */
  onExitVR: function () {
    if (!this.el.sceneEl.checkHeadsetConnected()) {
      return;
    }
    this.restoreCameraPose();
    this.previousHMDPosition.set(0, 0, 0);
    this.el.object3D.matrixAutoUpdate = true;
  },

  /**
   * Update Pointer Lock state.
   */
  onPointerLockChange: function () {
    this.pointerLocked = !!(
      document.pointerLockElement || document.mozPointerLockElement
    );
  },

  /**
   * Recover from Pointer Lock error.
   */
  onPointerLockError: function () {
    this.pointerLocked = false;
  },

  // Exits pointer-locked mode.
  exitPointerLock: function () {
    document.exitPointerLock();
    this.pointerLocked = false;
  },

  /**
   * Toggle the feature of showing/hiding the grab cursor.
   */
  updateGrabCursor: function (enabled) {
    var sceneEl = this.el.sceneEl;

    function enableGrabCursor() {
      sceneEl.canvas.classList.add("a-grab-cursor");
    }
    function disableGrabCursor() {
      sceneEl.canvas.classList.remove("a-grab-cursor");
    }

    if (!sceneEl.canvas) {
      if (enabled) {
        sceneEl.addEventListener("render-target-loaded", enableGrabCursor);
      } else {
        sceneEl.addEventListener("render-target-loaded", disableGrabCursor);
      }
      return;
    }

    if (enabled) {
      enableGrabCursor();
      return;
    }
    disableGrabCursor();
  },

  /**
   * Save camera pose before entering VR to restore later if exiting.
   */
  saveCameraPose: function () {
    var el = this.el;

    this.savedPose.position.copy(el.object3D.position);
    this.savedPose.rotation.copy(el.object3D.rotation);
    this.hasSavedPose = true;
  },

  /**
   * Reset camera pose to before entering VR.
   */
  restoreCameraPose: function () {
    var el = this.el;
    var savedPose = this.savedPose;

    if (!this.hasSavedPose) {
      return;
    }

    // Reset camera orientation.
    el.object3D.position.copy(savedPose.position);
    el.object3D.rotation.copy(savedPose.rotation);
    this.hasSavedPose = false;
  },
});


/***/ }),

/***/ "./aframe/src/location-based/arjs-webcam-texture.js":
/*!**********************************************************!*\
  !*** ./aframe/src/location-based/arjs-webcam-texture.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-webcam-texture", {
  init: function () {
    this.scene = this.el.sceneEl;
    this.texCamera = new three__WEBPACK_IMPORTED_MODULE_1__.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 10);
    this.texScene = new three__WEBPACK_IMPORTED_MODULE_1__.Scene();

    this.scene.renderer.autoClear = false;
    this.video = document.createElement("video");
    this.video.setAttribute("autoplay", true);
    this.video.setAttribute("playsinline", true);
    this.video.setAttribute("display", "none");
    document.body.appendChild(this.video);
    this.geom = new three__WEBPACK_IMPORTED_MODULE_1__.PlaneBufferGeometry(); //0.5, 0.5);
    this.texture = new three__WEBPACK_IMPORTED_MODULE_1__.VideoTexture(this.video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_1__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_1__.Mesh(this.geom, this.material);
    this.texScene.add(mesh);
  },

  play: function () {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          this.video.srcObject = stream;
          this.video.play();
        })
        .catch((e) => {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            `Webcam error: ${e}`
          );
        });
    } else {
      this.el.sceneEl.systems["arjs"]._displayErrorPopup(
        "sorry - media devices API not supported"
      );
    }
  },

  tick: function () {
    this.scene.renderer.clear();
    this.scene.renderer.render(this.texScene, this.texCamera);
    this.scene.renderer.clearDepth();
  },

  pause: function () {
    this.video.srcObject.getTracks().forEach((track) => {
      track.stop();
    });
  },

  remove: function () {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-camera.js":
/*!*************************************************!*\
  !*** ./aframe/src/location-based/gps-camera.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_1__);
/*
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */




aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-camera", {
  _watchPositionId: null,
  originCoords: null,
  currentCoords: null,
  lookControls: null,
  heading: null,
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0,
    },
    simulateLongitude: {
      type: "number",
      default: 0,
    },
    simulateAltitude: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    maxDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 5,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        var handler = function () {
          console.log("Requesting device orientation permissions...");
          DeviceOrientationEvent.requestPermission();
          document.removeEventListener("touchend", handler);
        };

        document.addEventListener(
          "touchend",
          function () {
            handler();
          },
          false
        );

        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "After camera permission prompt, please tap the screen to activate geolocation."
        );
      } else {
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);

    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      this.originCoords = this.currentCoords;
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    // compute position.x
    var dstCoords = {
      longitude: this.currentCoords.longitude,
      latitude: this.originCoords.latitude,
    };

    position.x = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.x *=
      this.currentCoords.longitude > this.originCoords.longitude ? 1 : -1;

    // compute position.z
    var dstCoords = {
      longitude: this.originCoords.longitude,
      latitude: this.currentCoords.latitude,
    };

    position.z = this.computeDistanceMeters(this.originCoords, dstCoords);
    position.z *=
      this.currentCoords.latitude > this.originCoords.latitude ? -1 : 1;

    // update position
    this.el.setAttribute("position", position);

    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between source and destination inputs.
   *
   *  Calculate distance, bearing and more between Latitude/Longitude points
   *  Details: https://www.movable-type.co.uk/scripts/latlong.html
   *
   * @param {Position} src
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (src, dest, isPlace) {
    var distance = this._haversineDist(src, dest);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    // if function has been called for a place, and if it's too far and a max distance has been set,
    // return max distance possible - to be handled by the caller
    if (
      isPlace &&
      this.data.maxDistance &&
      this.data.maxDistance > 0 &&
      distance > this.data.maxDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },

  _haversineDist: function (src, dest) {
    var dlongitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(src.latitude)) *
        Math.cos(three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = three__WEBPACK_IMPORTED_MODULE_1__.Math.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = three__WEBPACK_IMPORTED_MODULE_1__.Math.degToRad(offset);
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-entity-place.js":
/*!*******************************************************!*\
  !*** ./aframe/src/location-based/gps-entity-place.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-entity-place", {
  _cameraGps: null,
  schema: {
    longitude: {
      type: "number",
      default: 0,
    },
    latitude: {
      type: "number",
      default: 0,
    },
  },
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-camera]");
        if (!camera.components["gps-camera"]) {
          console.error("gps-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-camera"];
      }
      this._updatePosition();
    };

    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = {
        longitude: this.data.longitude,
        latitude: this.data.latitude,
      };

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      var distanceForMsg = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords
      );

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));
      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        ev.detail.position,
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */
  _updatePosition: function () {
    var position = { x: 0, y: this.el.getAttribute("position").y || 0, z: 0 };

    // update position.x
    var dstCoords = {
      longitude: this.data.longitude,
      latitude: this._cameraGps.originCoords.latitude,
    };

    position.x = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    this._positionXDebug = position.x;

    position.x *=
      this.data.longitude > this._cameraGps.originCoords.longitude ? 1 : -1;

    // update position.z
    var dstCoords = {
      longitude: this._cameraGps.originCoords.longitude,
      latitude: this.data.latitude,
    };

    position.z = this._cameraGps.computeDistanceMeters(
      this._cameraGps.originCoords,
      dstCoords
    );

    position.z *=
      this.data.latitude > this._cameraGps.originCoords.latitude ? -1 : 1;

    if (position.y !== 0) {
      var altitude =
        this._cameraGps.originCoords.altitude !== undefined
          ? this._cameraGps.originCoords.altitude
          : 0;
      position.y = position.y - altitude;
    }

    // update element's position in 3D world
    this.el.setAttribute("position", position);
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-camera.js":
/*!***********************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-camera.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-camera
 *
 * based on the original gps-camera, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original position (lat/lon) is projected into Spherical Mercator and
 * stored.
 *
 * Then, when we receive a new position (lat/lon), this new position is
 * projected into Spherical Mercator and then its world position calculated
 * by comparing against the original position.
 *
 * The same is also the case for 'entity-places'; when these are added, their
 * Spherical Mercator coords are calculated (see gps-projected-entity-place).
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 *
 * UPDATES 28/08/20:
 *
 * - add gpsMinDistance and gpsTimeInterval properties to control how
 * frequently GPS updates are processed. Aim is to prevent 'stuttering'
 * effects when close to AR content due to continuous small changes in
 * location.
 */



aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-camera", {
  _watchPositionId: null,
  originCoords: null, // original coords now in Spherical Mercator
  currentCoords: null,
  lookControls: null,
  heading: null,
  schema: {
    simulateLatitude: {
      type: "number",
      default: 0,
    },
    simulateLongitude: {
      type: "number",
      default: 0,
    },
    simulateAltitude: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "int",
      default: 100,
    },
    alert: {
      type: "boolean",
      default: false,
    },
    minDistance: {
      type: "int",
      default: 0,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    gpsTimeInterval: {
      type: "number",
      default: 0,
    },
  },
  update: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.longitude = this.data.simulateLongitude;
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.altitude = this.data.simulateAltitude;
      this.currentCoords = localPosition;

      // re-trigger initialization for new origin
      this.originCoords = null;
      this._updatePosition();
    }
  },
  init: function () {
    if (
      !this.el.components["arjs-look-controls"] &&
      !this.el.components["look-controls"]
    ) {
      return;
    }

    this.lastPosition = {
      latitude: 0,
      longitude: 0,
    };

    this.loader = document.createElement("DIV");
    this.loader.classList.add("arjs-loader");
    document.body.appendChild(this.loader);

    this.onGpsEntityPlaceAdded = this._onGpsEntityPlaceAdded.bind(this);
    window.addEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );

    this.lookControls =
      this.el.components["arjs-look-controls"] ||
      this.el.components["look-controls"];

    // listen to deviceorientation event
    var eventName = this._getDeviceOrientationEventName();
    this._onDeviceOrientation = this._onDeviceOrientation.bind(this);

    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      // iOS 13+
      if (typeof DeviceOrientationEvent.requestPermission === "function") {
        var handler = function () {
          console.log("Requesting device orientation permissions...");
          DeviceOrientationEvent.requestPermission();
          document.removeEventListener("touchend", handler);
        };

        document.addEventListener(
          "touchend",
          function () {
            handler();
          },
          false
        );

        this.el.sceneEl.systems["arjs"]._displayErrorPopup(
          "After camera permission prompt, please tap the screen to activate geolocation."
        );
      } else {
        var timeout = setTimeout(function () {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please enable device orientation in Settings > Safari > Motion & Orientation Access."
          );
        }, 750);
        window.addEventListener(eventName, function () {
          clearTimeout(timeout);
        });
      }
    }

    window.addEventListener(eventName, this._onDeviceOrientation, false);
  },

  play: function () {
    if (this.data.simulateLatitude !== 0 && this.data.simulateLongitude !== 0) {
      var localPosition = Object.assign({}, this.currentCoords || {});
      localPosition.latitude = this.data.simulateLatitude;
      localPosition.longitude = this.data.simulateLongitude;
      if (this.data.simulateAltitude !== 0) {
        localPosition.altitude = this.data.simulateAltitude;
      }
      this.currentCoords = localPosition;
      this._updatePosition();
    } else {
      this._watchPositionId = this._initWatchGPS(
        function (position) {
          var localPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            accuracy: position.coords.accuracy,
            altitudeAccuracy: position.coords.altitudeAccuracy,
          };

          if (this.data.simulateAltitude !== 0) {
            localPosition.altitude = this.data.simulateAltitude;
          }

          this.currentCoords = localPosition;
          var distMoved = this._haversineDist(
            this.lastPosition,
            this.currentCoords
          );

          if (distMoved >= this.data.gpsMinDistance || !this.originCoords) {
            this._updatePosition();
            this.lastPosition = {
              longitude: this.currentCoords.longitude,
              latitude: this.currentCoords.latitude,
            };
          }
        }.bind(this)
      );
    }
  },

  tick: function () {
    if (this.heading === null) {
      return;
    }
    this._updateRotation();
  },

  pause: function () {
    if (this._watchPositionId) {
      navigator.geolocation.clearWatch(this._watchPositionId);
    }
    this._watchPositionId = null;
  },

  remove: function () {
    var eventName = this._getDeviceOrientationEventName();
    window.removeEventListener(eventName, this._onDeviceOrientation, false);
    window.removeEventListener(
      "gps-entity-place-added",
      this.onGpsEntityPlaceAdded
    );
  },

  /**
   * Get device orientation event name, depends on browser implementation.
   * @returns {string} event name
   */
  _getDeviceOrientationEventName: function () {
    if ("ondeviceorientationabsolute" in window) {
      var eventName = "deviceorientationabsolute";
    } else if ("ondeviceorientation" in window) {
      var eventName = "deviceorientation";
    } else {
      var eventName = "";
      console.error("Compass not supported");
    }

    return eventName;
  },

  /**
   * Get current user position.
   *
   * @param {function} onSuccess
   * @param {function} onError
   * @returns {Promise}
   */
  _initWatchGPS: function (onSuccess, onError) {
    if (!onError) {
      onError = function (err) {
        console.warn("ERROR(" + err.code + "): " + err.message);

        if (err.code === 1) {
          // User denied GeoLocation, let their know that
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Please activate Geolocation and refresh the page. If it is already active, please check permissions for this website."
          );
          return;
        }

        if (err.code === 3) {
          this.el.sceneEl.systems["arjs"]._displayErrorPopup(
            "Cannot retrieve GPS position. Signal is absent."
          );
          return;
        }
      };
    }

    if ("geolocation" in navigator === false) {
      onError({
        code: 0,
        message: "Geolocation is not supported by your browser",
      });
      return Promise.resolve();
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition
    return navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: this.data.gpsTimeInterval,
      timeout: 27000,
    });
  },

  /**
   * Update user position.
   *
   * @returns {void}
   */
  _updatePosition: function () {
    // don't update if accuracy is not good enough
    if (this.currentCoords.accuracy > this.data.positionMinAccuracy) {
      if (this.data.alert && !document.getElementById("alert-popup")) {
        var popup = document.createElement("div");
        popup.innerHTML =
          "GPS signal is very poor. Try move outdoor or to an area with a better signal.";
        popup.setAttribute("id", "alert-popup");
        document.body.appendChild(popup);
      }
      return;
    }

    var alertPopup = document.getElementById("alert-popup");
    if (
      this.currentCoords.accuracy <= this.data.positionMinAccuracy &&
      alertPopup
    ) {
      document.body.removeChild(alertPopup);
    }

    if (!this.originCoords) {
      // first camera initialization
      // Now store originCoords as PROJECTED original lat/lon, so that
      // we can set the world origin to the original position in "metres"
      this.originCoords = this._project(
        this.currentCoords.latitude,
        this.currentCoords.longitude
      );
      this._setPosition();

      var loader = document.querySelector(".arjs-loader");
      if (loader) {
        loader.remove();
      }
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    } else {
      this._setPosition();
    }
  },
  /**
   * Set the current position (in world coords, based on Spherical Mercator)
   *
   * @returns {void}
   */
  _setPosition: function () {
    var position = this.el.getAttribute("position");

    var worldCoords = this.latLonToWorld(
      this.currentCoords.latitude,
      this.currentCoords.longitude
    );

    position.x = worldCoords[0];
    position.z = worldCoords[1];

    // update position
    this.el.setAttribute("position", position);

    // add the sphmerc position to the event (for testing only)
    window.dispatchEvent(
      new CustomEvent("gps-camera-update-position", {
        detail: { position: this.currentCoords, origin: this.originCoords },
      })
    );
  },
  /**
   * Returns distance in meters between camera and destination input.
   *
   * Assume we are using a metre-based projection. Not all 'metre-based'
   * projections give exact metres, e.g. Spherical Mercator, but it appears
   * close enough to be used for AR at least in middle temperate
   * latitudes (40 - 55). It is heavily distorted near the poles, however.
   *
   * @param {Position} dest
   * @param {Boolean} isPlace
   *
   * @returns {number} distance | Number.MAX_SAFE_INTEGER
   */
  computeDistanceMeters: function (dest, isPlace) {
    var src = this.el.getAttribute("position");
    var dx = dest.x - src.x;
    var dz = dest.z - src.z;
    var distance = Math.sqrt(dx * dx + dz * dz);

    // if function has been called for a place, and if it's too near and a min distance has been set,
    // return max distance possible - to be handled by the  method caller
    if (
      isPlace &&
      this.data.minDistance &&
      this.data.minDistance > 0 &&
      distance < this.data.minDistance
    ) {
      return Number.MAX_SAFE_INTEGER;
    }

    return distance;
  },
  /**
   * Converts latitude/longitude to OpenGL world coordinates.
   *
   * First projects lat/lon to absolute Spherical Mercator and then
   * calculates the world coordinates by comparing the Spherical Mercator
   * coordinates with the Spherical Mercator coordinates of the origin point.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} world coordinates
   */
  latLonToWorld: function (lat, lon) {
    var projected = this._project(lat, lon);
    // Sign of z needs to be reversed compared to projected coordinates
    return [
      projected[0] - this.originCoords[0],
      -(projected[1] - this.originCoords[1]),
    ];
  },
  /**
   * Converts latitude/longitude to Spherical Mercator coordinates.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} lat
   * @param {Number} lon
   *
   * @returns {array} Spherical Mercator coordinates
   */
  _project: function (lat, lon) {
    const HALF_EARTH = 20037508.34;

    // Convert the supplied coords to Spherical Mercator (EPSG:3857), also
    // known as 'Google Projection', using the algorithm used extensively
    // in various OpenStreetMap software.
    var y =
      Math.log(Math.tan(((90 + lat) * Math.PI) / 360.0)) / (Math.PI / 180.0);
    return [(lon / 180.0) * HALF_EARTH, (y * HALF_EARTH) / 180.0];
  },
  /**
   * Converts Spherical Mercator coordinates to latitude/longitude.
   * Algorithm is used in several OpenStreetMap-related applications.
   *
   * @param {Number} spherical mercator easting
   * @param {Number} spherical mercator northing
   *
   * @returns {object} lon/lat
   */
  _unproject: function (e, n) {
    const HALF_EARTH = 20037508.34;
    var yp = (n / HALF_EARTH) * 180.0;
    return {
      longitude: (e / HALF_EARTH) * 180.0,
      latitude:
        (180.0 / Math.PI) *
        (2 * Math.atan(Math.exp((yp * Math.PI) / 180.0)) - Math.PI / 2),
    };
  },
  /**
   * Compute compass heading.
   *
   * @param {number} alpha
   * @param {number} beta
   * @param {number} gamma
   *
   * @returns {number} compass heading
   */
  _computeCompassHeading: function (alpha, beta, gamma) {
    // Convert degrees to radians
    var alphaRad = alpha * (Math.PI / 180);
    var betaRad = beta * (Math.PI / 180);
    var gammaRad = gamma * (Math.PI / 180);

    // Calculate equation components
    var cA = Math.cos(alphaRad);
    var sA = Math.sin(alphaRad);
    var sB = Math.sin(betaRad);
    var cG = Math.cos(gammaRad);
    var sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
    var rA = -cA * sG - sA * sB * cG;
    var rB = -sA * sG + cA * sB * cG;

    // Calculate compass heading
    var compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
    if (rB < 0) {
      compassHeading += Math.PI;
    } else if (rA < 0) {
      compassHeading += 2 * Math.PI;
    }

    // Convert radians to degrees
    compassHeading *= 180 / Math.PI;

    return compassHeading;
  },

  /**
   * Handler for device orientation event.
   *
   * @param {Event} event
   * @returns {void}
   */
  _onDeviceOrientation: function (event) {
    if (event.webkitCompassHeading !== undefined) {
      if (event.webkitCompassAccuracy < 50) {
        this.heading = event.webkitCompassHeading;
      } else {
        console.warn("webkitCompassAccuracy is event.webkitCompassAccuracy");
      }
    } else if (event.alpha !== null) {
      if (event.absolute === true || event.absolute === undefined) {
        this.heading = this._computeCompassHeading(
          event.alpha,
          event.beta,
          event.gamma
        );
      } else {
        console.warn("event.absolute === false");
      }
    } else {
      console.warn("event.alpha === null");
    }
  },

  /**
   * Update user rotation data.
   *
   * @returns {void}
   */
  _updateRotation: function () {
    var heading = 360 - this.heading;
    var cameraRotation = this.el.getAttribute("rotation").y;
    var yawRotation = THREE.Math.radToDeg(
      this.lookControls.yawObject.rotation.y
    );
    var offset = (heading - (cameraRotation - yawRotation)) % 360;
    this.lookControls.yawObject.rotation.y = THREE.Math.degToRad(offset);
  },

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from gps-camera
   */
  _haversineDist: function (src, dest) {
    var dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    var dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    var a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.Math.degToRad(src.latitude)) *
        Math.cos(THREE.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    var angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  },

  _onGpsEntityPlaceAdded: function () {
    // if places are added after camera initialization is finished
    if (this.originCoords) {
      window.dispatchEvent(new CustomEvent("gps-camera-origin-coord-set"));
    }
    if (this.loader && this.loader.parentElement) {
      document.body.removeChild(this.loader);
    }
  },
});


/***/ }),

/***/ "./aframe/src/location-based/gps-projected-entity-place.js":
/*!*****************************************************************!*\
  !*** ./aframe/src/location-based/gps-projected-entity-place.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/** gps-projected-entity-place
 *
 * based on the original gps-entity-place, modified by nickw 02/04/20
 *
 * Rather than keeping track of position by calculating the distance of
 * entities or the current location to the original location, this version
 * makes use of the "Google" Spherical Mercactor projection, aka epsg:3857.
 *
 * The original location on startup (lat/lon) is projected into Spherical
 * Mercator and stored.
 *
 * When 'entity-places' are added, their Spherical Mercator coords are
 * calculated and converted into world coordinates, relative to the original
 * position, using the Spherical Mercator projection calculation in
 * gps-projected-camera.
 *
 * Spherical Mercator units are close to, but not exactly, metres, and are
 * heavily distorted near the poles. Nonetheless they are a good approximation
 * for many areas of the world and appear not to cause unacceptable distortions
 * when used as the units for AR apps.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-projected-entity-place", {
  _cameraGps: null,
  schema: {
    longitude: {
      type: "number",
      default: 0,
    },
    latitude: {
      type: "number",
      default: 0,
    },
  },
  remove: function () {
    // cleaning listeners when the entity is removed from the DOM
    window.removeEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );
  },
  init: function () {
    // Used now to get the GPS camera when it's been setup
    this.coordSetListener = () => {
      if (!this._cameraGps) {
        var camera = document.querySelector("[gps-projected-camera]");
        if (!camera.components["gps-projected-camera"]) {
          console.error("gps-projected-camera not initialized");
          return;
        }
        this._cameraGps = camera.components["gps-projected-camera"];
        this._updatePosition();
      }
    };

    // update position needs to worry about distance but nothing else?
    this.updatePositionListener = (ev) => {
      if (!this.data || !this._cameraGps) {
        return;
      }

      var dstCoords = this.el.getAttribute("position");

      // it's actually a 'distance place', but we don't call it with last param, because we want to retrieve distance even if it's < minDistance property
      // _computeDistanceMeters is now going to use the projected
      var distanceForMsg = this._cameraGps.computeDistanceMeters(dstCoords);

      this.el.setAttribute("distance", distanceForMsg);
      this.el.setAttribute("distanceMsg", this._formatDistance(distanceForMsg));

      this.el.dispatchEvent(
        new CustomEvent("gps-entity-place-update-position", {
          detail: { distance: distanceForMsg },
        })
      );

      var actualDistance = this._cameraGps.computeDistanceMeters(
        dstCoords,
        true
      );

      if (actualDistance === Number.MAX_SAFE_INTEGER) {
        this.hideForMinDistance(this.el, true);
      } else {
        this.hideForMinDistance(this.el, false);
      }
    };

    // Retain as this event is fired when the GPS camera is set up
    window.addEventListener(
      "gps-camera-origin-coord-set",
      this.coordSetListener
    );
    window.addEventListener(
      "gps-camera-update-position",
      this.updatePositionListener
    );

    this._positionXDebug = 0;

    window.dispatchEvent(
      new CustomEvent("gps-entity-place-added", {
        detail: { component: this.el },
      })
    );
  },
  /**
   * Hide entity according to minDistance property
   * @returns {void}
   */
  hideForMinDistance: function (el, hideEntity) {
    if (hideEntity) {
      el.setAttribute("visible", "false");
    } else {
      el.setAttribute("visible", "true");
    }
  },
  /**
   * Update place position
   * @returns {void}
   */

  // set position to world coords using the lat/lon
  _updatePosition: function () {
    var worldPos = this._cameraGps.latLonToWorld(
      this.data.latitude,
      this.data.longitude
    );
    var position = this.el.getAttribute("position");

    // update element's position in 3D world
    //this.el.setAttribute('position', position);
    this.el.setAttribute("position", {
      x: worldPos[0],
      y: position.y,
      z: worldPos[1],
    });
  },

  /**
   * Format distances string
   *
   * @param {String} distance
   */

  _formatDistance: function (distance) {
    distance = distance.toFixed(0);

    if (distance >= 1000) {
      return distance / 1000 + " kilometers";
    }

    return distance + " meters";
  },
});


/***/ }),

/***/ "aframe":
/*!******************************************************************************************!*\
  !*** external {"commonjs":"aframe","commonjs2":"aframe","amd":"aframe","root":"AFRAME"} ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_aframe__;

/***/ }),

/***/ "three":
/*!**************************************************************************************!*\
  !*** external {"commonjs":"three","commonjs2":"three","amd":"three","root":"THREE"} ***!
  \**************************************************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_three__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./aframe/src/location-based/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arjs_look_controls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arjs-look-controls */ "./aframe/src/location-based/arjs-look-controls.js");
/* harmony import */ var _arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _ArjsDeviceOrientationControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ArjsDeviceOrientationControls */ "./aframe/src/location-based/ArjsDeviceOrientationControls.js");
/* harmony import */ var _gps_camera__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./gps-camera */ "./aframe/src/location-based/gps-camera.js");
/* harmony import */ var _gps_entity_place__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./gps-entity-place */ "./aframe/src/location-based/gps-entity-place.js");
/* harmony import */ var _gps_projected_camera__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./gps-projected-camera */ "./aframe/src/location-based/gps-projected-camera.js");
/* harmony import */ var _gps_projected_entity_place__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./gps-projected-entity-place */ "./aframe/src/location-based/gps-projected-entity-place.js");








})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6a0JnQztBQUNGO0FBQy9CO0FBQ0EscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQSx5QkFBeUIscURBQXdCO0FBQ2pELHdCQUF3Qix3Q0FBVztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzREFBeUIsSUFBSTtBQUNqRCx1QkFBdUIsK0NBQWtCO0FBQ3pDLHdCQUF3QixvREFBdUIsR0FBRyxtQkFBbUI7QUFDckUscUJBQXFCLHVDQUFVO0FBQy9CO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLDZCQUE2QixFQUFFO0FBQy9CO0FBQ0EsU0FBUztBQUNULE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUNoRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2lDO0FBQ0Y7QUFDL0I7QUFDQSxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQSwwQ0FBMEMsMEJBQTBCO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFD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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUN2S0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNpQztBQUNqQztBQUNBLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0EsMENBQTBDLDBCQUEwQjtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTjhCO0FBQ0M7QUFDVTtBQUNuQjtBQUNNO0FBQ0k7QUFDTSIsInNvdXJjZXMiOlsid2VicGFjazovL0FSanMvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL0FyanNEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2FyanMtbG9vay1jb250cm9scy5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9hcmpzLXdlYmNhbS10ZXh0dXJlLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2dwcy1jYW1lcmEuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvZ3BzLWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtcHJvamVjdGVkLWNhbWVyYS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9sb2NhdGlvbi1iYXNlZC9ncHMtcHJvamVjdGVkLWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwiYWZyYW1lXCIsXCJjb21tb25qczJcIjpcImFmcmFtZVwiLFwiYW1kXCI6XCJhZnJhbWVcIixcInJvb3RcIjpcIkFGUkFNRVwifSIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL2xvY2F0aW9uLWJhc2VkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImFmcmFtZVwiKSwgcmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImFmcmFtZVwiLCBcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIkFSanNcIl0gPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2Vcblx0XHRyb290W1wiQVJqc1wiXSA9IGZhY3Rvcnkocm9vdFtcIkFGUkFNRVwiXSwgcm9vdFtcIlRIUkVFXCJdKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX18sIF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXykge1xucmV0dXJuICIsIi8qKlxyXG4gKiBAYXV0aG9yIHJpY2h0IC8gaHR0cDovL3JpY2h0Lm1lXHJcbiAqIEBhdXRob3IgV2VzdExhbmdsZXkgLyBodHRwOi8vZ2l0aHViLmNvbS9XZXN0TGFuZ2xleVxyXG4gKlxyXG4gKiBXM0MgRGV2aWNlIE9yaWVudGF0aW9uIGNvbnRyb2wgKGh0dHA6Ly93M2MuZ2l0aHViLmlvL2RldmljZW9yaWVudGF0aW9uL3NwZWMtc291cmNlLW9yaWVudGF0aW9uLmh0bWwpXHJcbiAqL1xyXG5cclxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdG9cclxuICogYWxsb3cgZXhwb25lbnRpYWwgc21vb3RoaW5nLCBmb3IgdXNlIGluIEFSLmpzLlxyXG4gKlxyXG4gKiBNb2RpZmljYXRpb25zIE5pY2sgV2hpdGVsZWdnIChuaWNrdzEgZ2l0aHViKVxyXG4gKi9cclxuXHJcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xyXG5cclxuY29uc3QgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XHJcbiAgdmFyIHNjb3BlID0gdGhpcztcclxuXHJcbiAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XHJcbiAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcclxuXHJcbiAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuXHJcbiAgdGhpcy5kZXZpY2VPcmllbnRhdGlvbiA9IHt9O1xyXG4gIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xyXG5cclxuICB0aGlzLmFscGhhT2Zmc2V0ID0gMDsgLy8gcmFkaWFuc1xyXG5cclxuICB0aGlzLnNtb290aGluZ0ZhY3RvciA9IDE7XHJcblxyXG4gIHRoaXMuVFdPX1BJID0gMiAqIE1hdGguUEk7XHJcbiAgdGhpcy5IQUxGX1BJID0gMC41ICogTWF0aC5QSTtcclxuXHJcbiAgdmFyIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgc2NvcGUuZGV2aWNlT3JpZW50YXRpb24gPSBldmVudDtcclxuICB9O1xyXG5cclxuICB2YXIgb25TY3JlZW5PcmllbnRhdGlvbkNoYW5nZUV2ZW50ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgc2NvcGUuc2NyZWVuT3JpZW50YXRpb24gPSB3aW5kb3cub3JpZW50YXRpb24gfHwgMDtcclxuICB9O1xyXG5cclxuICAvLyBUaGUgYW5nbGVzIGFscGhhLCBiZXRhIGFuZCBnYW1tYSBmb3JtIGEgc2V0IG9mIGludHJpbnNpYyBUYWl0LUJyeWFuIGFuZ2xlcyBvZiB0eXBlIFotWCctWScnXHJcblxyXG4gIHZhciBzZXRPYmplY3RRdWF0ZXJuaW9uID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciB6ZWUgPSBuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAxKTtcclxuXHJcbiAgICB2YXIgZXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcclxuXHJcbiAgICB2YXIgcTAgPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHZhciBxMSA9IG5ldyBUSFJFRS5RdWF0ZXJuaW9uKC1NYXRoLnNxcnQoMC41KSwgMCwgMCwgTWF0aC5zcXJ0KDAuNSkpOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKHF1YXRlcm5pb24sIGFscGhhLCBiZXRhLCBnYW1tYSwgb3JpZW50KSB7XHJcbiAgICAgIGV1bGVyLnNldChiZXRhLCBhbHBoYSwgLWdhbW1hLCBcIllYWlwiKTsgLy8gJ1pYWScgZm9yIHRoZSBkZXZpY2UsIGJ1dCAnWVhaJyBmb3IgdXNcclxuXHJcbiAgICAgIHF1YXRlcm5pb24uc2V0RnJvbUV1bGVyKGV1bGVyKTsgLy8gb3JpZW50IHRoZSBkZXZpY2VcclxuXHJcbiAgICAgIHF1YXRlcm5pb24ubXVsdGlwbHkocTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXHJcblxyXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KHEwLnNldEZyb21BeGlzQW5nbGUoemVlLCAtb3JpZW50KSk7IC8vIGFkanVzdCBmb3Igc2NyZWVuIG9yaWVudGF0aW9uXHJcbiAgICB9O1xyXG4gIH0pKCk7XHJcblxyXG4gIHRoaXMuY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCgpO1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXHJcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCxcclxuICAgICAgZmFsc2VcclxuICAgICk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxyXG4gICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXHJcbiAgICAgIGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIHNjb3BlLmVuYWJsZWQgPSB0cnVlO1xyXG4gIH07XHJcblxyXG4gIHRoaXMuZGlzY29ubmVjdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXHJcbiAgICAgIG9uU2NyZWVuT3JpZW50YXRpb25DaGFuZ2VFdmVudCxcclxuICAgICAgZmFsc2VcclxuICAgICk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJkZXZpY2VvcmllbnRhdGlvblwiLFxyXG4gICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnQsXHJcbiAgICAgIGZhbHNlXHJcbiAgICApO1xyXG5cclxuICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcclxuICB9O1xyXG5cclxuICB0aGlzLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgIHZhciBkZXZpY2UgPSBzY29wZS5kZXZpY2VPcmllbnRhdGlvbjtcclxuXHJcbiAgICBpZiAoZGV2aWNlKSB7XHJcbiAgICAgIHZhciBhbHBoYSA9IGRldmljZS5hbHBoYVxyXG4gICAgICAgID8gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXZpY2UuYWxwaGEpICsgc2NvcGUuYWxwaGFPZmZzZXRcclxuICAgICAgICA6IDA7IC8vIFpcclxuXHJcbiAgICAgIHZhciBiZXRhID0gZGV2aWNlLmJldGEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRldmljZS5iZXRhKSA6IDA7IC8vIFgnXHJcblxyXG4gICAgICB2YXIgZ2FtbWEgPSBkZXZpY2UuZ2FtbWEgPyBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRldmljZS5nYW1tYSkgOiAwOyAvLyBZJydcclxuXHJcbiAgICAgIHZhciBvcmllbnQgPSBzY29wZS5zY3JlZW5PcmllbnRhdGlvblxyXG4gICAgICAgID8gVEhSRUUuTWF0aC5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcclxuICAgICAgICA6IDA7IC8vIE9cclxuXHJcbiAgICAgIC8vIE5XIEFkZGVkIHNtb290aGluZyBjb2RlXHJcbiAgICAgIHZhciBrID0gdGhpcy5zbW9vdGhpbmdGYWN0b3I7XHJcblxyXG4gICAgICBpZiAodGhpcy5sYXN0T3JpZW50YXRpb24pIHtcclxuICAgICAgICBhbHBoYSA9IHRoaXMuX2dldFNtb290aGVkQW5nbGUoYWxwaGEsIHRoaXMubGFzdE9yaWVudGF0aW9uLmFscGhhLCBrKTtcclxuICAgICAgICBiZXRhID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcclxuICAgICAgICAgIGJldGEgKyBNYXRoLlBJLFxyXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uYmV0YSxcclxuICAgICAgICAgIGtcclxuICAgICAgICApO1xyXG4gICAgICAgIGdhbW1hID0gdGhpcy5fZ2V0U21vb3RoZWRBbmdsZShcclxuICAgICAgICAgIGdhbW1hICsgdGhpcy5IQUxGX1BJLFxyXG4gICAgICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24uZ2FtbWEsXHJcbiAgICAgICAgICBrLFxyXG4gICAgICAgICAgTWF0aC5QSVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgYmV0YSArPSBNYXRoLlBJO1xyXG4gICAgICAgIGdhbW1hICs9IHRoaXMuSEFMRl9QSTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5sYXN0T3JpZW50YXRpb24gPSB7XHJcbiAgICAgICAgYWxwaGE6IGFscGhhLFxyXG4gICAgICAgIGJldGE6IGJldGEsXHJcbiAgICAgICAgZ2FtbWE6IGdhbW1hLFxyXG4gICAgICB9O1xyXG4gICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxyXG4gICAgICAgIHNjb3BlLm9iamVjdC5xdWF0ZXJuaW9uLFxyXG4gICAgICAgIGFscGhhLFxyXG4gICAgICAgIGJldGEgLSBNYXRoLlBJLFxyXG4gICAgICAgIGdhbW1hIC0gdGhpcy5IQUxGX1BJLFxyXG4gICAgICAgIG9yaWVudFxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIC8vIE5XIEFkZGVkXHJcbiAgdGhpcy5fb3JkZXJBbmdsZSA9IGZ1bmN0aW9uIChhLCBiLCByYW5nZSA9IHRoaXMuVFdPX1BJKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgIChiID4gYSAmJiBNYXRoLmFicyhiIC0gYSkgPCByYW5nZSAvIDIpIHx8XHJcbiAgICAgIChhID4gYiAmJiBNYXRoLmFicyhiIC0gYSkgPiByYW5nZSAvIDIpXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIHsgbGVmdDogYSwgcmlnaHQ6IGIgfTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB7IGxlZnQ6IGIsIHJpZ2h0OiBhIH07XHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgLy8gTlcgQWRkZWRcclxuICB0aGlzLl9nZXRTbW9vdGhlZEFuZ2xlID0gZnVuY3Rpb24gKGEsIGIsIGssIHJhbmdlID0gdGhpcy5UV09fUEkpIHtcclxuICAgIGNvbnN0IGFuZ2xlcyA9IHRoaXMuX29yZGVyQW5nbGUoYSwgYiwgcmFuZ2UpO1xyXG4gICAgY29uc3QgYW5nbGVzaGlmdCA9IGFuZ2xlcy5sZWZ0O1xyXG4gICAgY29uc3Qgb3JpZ0FuZ2xlc1JpZ2h0ID0gYW5nbGVzLnJpZ2h0O1xyXG4gICAgYW5nbGVzLmxlZnQgPSAwO1xyXG4gICAgYW5nbGVzLnJpZ2h0IC09IGFuZ2xlc2hpZnQ7XHJcbiAgICBpZiAoYW5nbGVzLnJpZ2h0IDwgMCkgYW5nbGVzLnJpZ2h0ICs9IHJhbmdlO1xyXG4gICAgbGV0IG5ld2FuZ2xlID1cclxuICAgICAgb3JpZ0FuZ2xlc1JpZ2h0ID09IGJcclxuICAgICAgICA/ICgxIC0gaykgKiBhbmdsZXMucmlnaHQgKyBrICogYW5nbGVzLmxlZnRcclxuICAgICAgICA6IGsgKiBhbmdsZXMucmlnaHQgKyAoMSAtIGspICogYW5nbGVzLmxlZnQ7XHJcbiAgICBuZXdhbmdsZSArPSBhbmdsZXNoaWZ0O1xyXG4gICAgaWYgKG5ld2FuZ2xlID49IHJhbmdlKSBuZXdhbmdsZSAtPSByYW5nZTtcclxuICAgIHJldHVybiBuZXdhbmdsZTtcclxuICB9O1xyXG5cclxuICB0aGlzLmRpc3Bvc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBzY29wZS5kaXNjb25uZWN0KCk7XHJcbiAgfTtcclxuXHJcbiAgdGhpcy5jb25uZWN0KCk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scztcclxuIiwiLy8gVG8gYXZvaWQgcmVjYWxjdWxhdGlvbiBhdCBldmVyeSBtb3VzZSBtb3ZlbWVudCB0aWNrXHJcbnZhciBQSV8yID0gTWF0aC5QSSAvIDI7XHJcblxyXG4vKipcclxuICogbG9vay1jb250cm9scy4gVXBkYXRlIGVudGl0eSBwb3NlLCBmYWN0b3JpbmcgbW91c2UsIHRvdWNoLCBhbmQgV2ViVlIgQVBJIGRhdGEuXHJcbiAqL1xyXG5cclxuLyogTk9URSB0aGF0IHRoaXMgaXMgYSBtb2RpZmllZCB2ZXJzaW9uIG9mIEEtRnJhbWUncyBsb29rLWNvbnRyb2xzIHRvXHJcbiAqIGFsbG93IGV4cG9uZW50aWFsIHNtb290aGluZywgZm9yIHVzZSBpbiBBUi5qcy5cclxuICpcclxuICogTW9kaWZpY2F0aW9ucyBOaWNrIFdoaXRlbGVnZyAobmlja3cxIGdpdGh1YilcclxuICovXHJcblxyXG5pbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xyXG5pbXBvcnQgQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSBcIi4vQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHNcIjtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtbG9vay1jb250cm9sc1wiLCB7XHJcbiAgZGVwZW5kZW5jaWVzOiBbXCJwb3NpdGlvblwiLCBcInJvdGF0aW9uXCJdLFxyXG5cclxuICBzY2hlbWE6IHtcclxuICAgIGVuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgbWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgcG9pbnRlckxvY2tFbmFibGVkOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXHJcbiAgICByZXZlcnNlTW91c2VEcmFnOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXHJcbiAgICByZXZlcnNlVG91Y2hEcmFnOiB7IGRlZmF1bHQ6IGZhbHNlIH0sXHJcbiAgICB0b3VjaEVuYWJsZWQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxyXG4gICAgc21vb3RoaW5nRmFjdG9yOiB7IHR5cGU6IFwibnVtYmVyXCIsIGRlZmF1bHQ6IDEgfSxcclxuICB9LFxyXG5cclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmRlbHRhWWF3ID0gMDtcclxuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XHJcbiAgICB0aGlzLmhtZFF1YXRlcm5pb24gPSBuZXcgVEhSRUUuUXVhdGVybmlvbigpO1xyXG4gICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSBuZXcgVEhSRUUuRXVsZXIoKTtcclxuICAgIHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyID0gbmV3IFRIUkVFLkV1bGVyKCk7XHJcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcclxuICAgIHRoaXMubWFnaWNXaW5kb3dPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcclxuICAgIHRoaXMucm90YXRpb24gPSB7fTtcclxuICAgIHRoaXMuZGVsdGFSb3RhdGlvbiA9IHt9O1xyXG4gICAgdGhpcy5zYXZlZFBvc2UgPSBudWxsO1xyXG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gZmFsc2U7XHJcbiAgICB0aGlzLnNldHVwTW91c2VDb250cm9scygpO1xyXG4gICAgdGhpcy5iaW5kTWV0aG9kcygpO1xyXG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQgPSB7fTtcclxuXHJcbiAgICB0aGlzLnNldHVwTWFnaWNXaW5kb3dDb250cm9scygpO1xyXG5cclxuICAgIC8vIFRvIHNhdmUgLyByZXN0b3JlIGNhbWVyYSBwb3NlXHJcbiAgICB0aGlzLnNhdmVkUG9zZSA9IHtcclxuICAgICAgcG9zaXRpb246IG5ldyBUSFJFRS5WZWN0b3IzKCksXHJcbiAgICAgIHJvdGF0aW9uOiBuZXcgVEhSRUUuRXVsZXIoKSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gQ2FsbCBlbnRlciBWUiBoYW5kbGVyIGlmIHRoZSBzY2VuZSBoYXMgZW50ZXJlZCBWUiBiZWZvcmUgdGhlIGV2ZW50IGxpc3RlbmVycyBhdHRhY2hlZC5cclxuICAgIGlmICh0aGlzLmVsLnNjZW5lRWwuaXMoXCJ2ci1tb2RlXCIpKSB7XHJcbiAgICAgIHRoaXMub25FbnRlclZSKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgc2V0dXBNYWdpY1dpbmRvd0NvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgbWFnaWNXaW5kb3dDb250cm9scztcclxuICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xyXG5cclxuICAgIC8vIE9ubHkgb24gbW9iaWxlIGRldmljZXMgYW5kIG9ubHkgZW5hYmxlZCBpZiBEZXZpY2VPcmllbnRhdGlvbiBwZXJtaXNzaW9uIGhhcyBiZWVuIGdyYW50ZWQuXHJcbiAgICBpZiAoQUZSQU1FLnV0aWxzLmRldmljZS5pc01vYmlsZSgpKSB7XHJcbiAgICAgIG1hZ2ljV2luZG93Q29udHJvbHMgPSB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMgPVxyXG4gICAgICAgIG5ldyBBcmpzRGV2aWNlT3JpZW50YXRpb25Db250cm9scyh0aGlzLm1hZ2ljV2luZG93T2JqZWN0KTtcclxuICAgICAgaWYgKFxyXG4gICAgICAgIHR5cGVvZiBEZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSBcInVuZGVmaW5lZFwiICYmXHJcbiAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvblxyXG4gICAgICApIHtcclxuICAgICAgICBtYWdpY1dpbmRvd0NvbnRyb2xzLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICBpZiAoXHJcbiAgICAgICAgICB0aGlzLmVsLnNjZW5lRWwuY29tcG9uZW50c1tcImRldmljZS1vcmllbnRhdGlvbi1wZXJtaXNzaW9uLXVpXCJdXHJcbiAgICAgICAgICAgIC5wZXJtaXNzaW9uR3JhbnRlZFxyXG4gICAgICAgICkge1xyXG4gICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgIFwiZGV2aWNlb3JpZW50YXRpb25wZXJtaXNzaW9uZ3JhbnRlZFwiLFxyXG4gICAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgbWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkID0gZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICB1cGRhdGU6IGZ1bmN0aW9uIChvbGREYXRhKSB7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuXHJcbiAgICAvLyBEaXNhYmxlIGdyYWIgY3Vyc29yIGNsYXNzZXMgaWYgbm8gbG9uZ2VyIGVuYWJsZWQuXHJcbiAgICBpZiAoZGF0YS5lbmFibGVkICE9PSBvbGREYXRhLmVuYWJsZWQpIHtcclxuICAgICAgdGhpcy51cGRhdGVHcmFiQ3Vyc29yKGRhdGEuZW5hYmxlZCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVzZXQgbWFnaWMgd2luZG93IGV1bGVycyBpZiB0cmFja2luZyBpcyBkaXNhYmxlZC5cclxuICAgIGlmIChcclxuICAgICAgb2xkRGF0YSAmJlxyXG4gICAgICAhZGF0YS5tYWdpY1dpbmRvd1RyYWNraW5nRW5hYmxlZCAmJlxyXG4gICAgICBvbGREYXRhLm1hZ2ljV2luZG93VHJhY2tpbmdFbmFibGVkXHJcbiAgICApIHtcclxuICAgICAgdGhpcy5tYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIuc2V0KDAsIDAsIDApO1xyXG4gICAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci5zZXQoMCwgMCwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUGFzcyBvbiBtYWdpYyB3aW5kb3cgdHJhY2tpbmcgc2V0dGluZyB0byBtYWdpY1dpbmRvd0NvbnRyb2xzLlxyXG4gICAgaWYgKHRoaXMubWFnaWNXaW5kb3dDb250cm9scykge1xyXG4gICAgICB0aGlzLm1hZ2ljV2luZG93Q29udHJvbHMuZW5hYmxlZCA9IGRhdGEubWFnaWNXaW5kb3dUcmFja2luZ0VuYWJsZWQ7XHJcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5zbW9vdGhpbmdGYWN0b3IgPSBkYXRhLnNtb290aGluZ0ZhY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAob2xkRGF0YSAmJiAhZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgIT09IG9sZERhdGEucG9pbnRlckxvY2tFbmFibGVkKSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVycygpO1xyXG4gICAgICBpZiAodGhpcy5wb2ludGVyTG9ja2VkKSB7XHJcbiAgICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIHRpY2s6IGZ1bmN0aW9uICh0KSB7XHJcbiAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcclxuICAgIGlmICghZGF0YS5lbmFibGVkKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMudXBkYXRlT3JpZW50YXRpb24oKTtcclxuICB9LFxyXG5cclxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXJzKCk7XHJcbiAgfSxcclxuXHJcbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcclxuICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcnMoKTtcclxuICAgIGlmICh0aGlzLnBvaW50ZXJMb2NrZWQpIHtcclxuICAgICAgdGhpcy5leGl0UG9pbnRlckxvY2soKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBiaW5kTWV0aG9kczogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5vbk1vdXNlRG93biA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZURvd24sIHRoaXMpO1xyXG4gICAgdGhpcy5vbk1vdXNlTW92ZSA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Nb3VzZU1vdmUsIHRoaXMpO1xyXG4gICAgdGhpcy5vbk1vdXNlVXAgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uTW91c2VVcCwgdGhpcyk7XHJcbiAgICB0aGlzLm9uVG91Y2hTdGFydCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaFN0YXJ0LCB0aGlzKTtcclxuICAgIHRoaXMub25Ub3VjaE1vdmUgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uVG91Y2hNb3ZlLCB0aGlzKTtcclxuICAgIHRoaXMub25Ub3VjaEVuZCA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Ub3VjaEVuZCwgdGhpcyk7XHJcbiAgICB0aGlzLm9uRW50ZXJWUiA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25FbnRlclZSLCB0aGlzKTtcclxuICAgIHRoaXMub25FeGl0VlIgPSBBRlJBTUUudXRpbHMuYmluZCh0aGlzLm9uRXhpdFZSLCB0aGlzKTtcclxuICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSA9IEFGUkFNRS51dGlscy5iaW5kKFxyXG4gICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXHJcbiAgICAgIHRoaXNcclxuICAgICk7XHJcbiAgICB0aGlzLm9uUG9pbnRlckxvY2tFcnJvciA9IEFGUkFNRS51dGlscy5iaW5kKHRoaXMub25Qb2ludGVyTG9ja0Vycm9yLCB0aGlzKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTZXQgdXAgc3RhdGVzIGFuZCBPYmplY3QzRHMgbmVlZGVkIHRvIHN0b3JlIHJvdGF0aW9uIGRhdGEuXHJcbiAgICovXHJcbiAgc2V0dXBNb3VzZUNvbnRyb2xzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgdGhpcy5waXRjaE9iamVjdCA9IG5ldyBUSFJFRS5PYmplY3QzRCgpO1xyXG4gICAgdGhpcy55YXdPYmplY3QgPSBuZXcgVEhSRUUuT2JqZWN0M0QoKTtcclxuICAgIHRoaXMueWF3T2JqZWN0LnBvc2l0aW9uLnkgPSAxMDtcclxuICAgIHRoaXMueWF3T2JqZWN0LmFkZCh0aGlzLnBpdGNoT2JqZWN0KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBBZGQgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyB0byBjYW52YXMuXHJcbiAgICovXHJcbiAgYWRkRXZlbnRMaXN0ZW5lcnM6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xyXG4gICAgdmFyIGNhbnZhc0VsID0gc2NlbmVFbC5jYW52YXM7XHJcblxyXG4gICAgLy8gV2FpdCBmb3IgY2FudmFzIHRvIGxvYWQuXHJcbiAgICBpZiAoIWNhbnZhc0VsKSB7XHJcbiAgICAgIHNjZW5lRWwuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICBcInJlbmRlci10YXJnZXQtbG9hZGVkXCIsXHJcbiAgICAgICAgQUZSQU1FLnV0aWxzLmJpbmQodGhpcy5hZGRFdmVudExpc3RlbmVycywgdGhpcylcclxuICAgICAgKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vdXNlIGV2ZW50cy5cclxuICAgIGNhbnZhc0VsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93biwgZmFsc2UpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIiwgdGhpcy5vbk1vdXNlTW92ZSwgZmFsc2UpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIHRoaXMub25Nb3VzZVVwLCBmYWxzZSk7XHJcblxyXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxyXG4gICAgY2FudmFzRWwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblRvdWNoU3RhcnQpO1xyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25Ub3VjaEVuZCk7XHJcblxyXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXHJcbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJlbnRlci12clwiLCB0aGlzLm9uRW50ZXJWUik7XHJcbiAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJleGl0LXZyXCIsIHRoaXMub25FeGl0VlIpO1xyXG5cclxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXHJcbiAgICBpZiAodGhpcy5kYXRhLnBvaW50ZXJMb2NrRW5hYmxlZCkge1xyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwicG9pbnRlcmxvY2tjaGFuZ2VcIixcclxuICAgICAgICB0aGlzLm9uUG9pbnRlckxvY2tDaGFuZ2UsXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgICBcIm1venBvaW50ZXJsb2NrY2hhbmdlXCIsXHJcbiAgICAgICAgdGhpcy5vblBvaW50ZXJMb2NrQ2hhbmdlLFxyXG4gICAgICAgIGZhbHNlXHJcbiAgICAgICk7XHJcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgXCJwb2ludGVybG9ja2Vycm9yXCIsXHJcbiAgICAgICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsXHJcbiAgICAgICAgZmFsc2VcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmUgbW91c2UgYW5kIHRvdWNoIGV2ZW50IGxpc3RlbmVycyBmcm9tIGNhbnZhcy5cclxuICAgKi9cclxuICByZW1vdmVFdmVudExpc3RlbmVyczogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XHJcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xyXG5cclxuICAgIGlmICghY2FudmFzRWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIE1vdXNlIGV2ZW50cy5cclxuICAgIGNhbnZhc0VsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgdGhpcy5vbk1vdXNlRG93bik7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCB0aGlzLm9uTW91c2VNb3ZlKTtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLCB0aGlzLm9uTW91c2VVcCk7XHJcblxyXG4gICAgLy8gVG91Y2ggZXZlbnRzLlxyXG4gICAgY2FudmFzRWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgdGhpcy5vblRvdWNoU3RhcnQpO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgdGhpcy5vblRvdWNoTW92ZSk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIHRoaXMub25Ub3VjaEVuZCk7XHJcblxyXG4gICAgLy8gc2NlbmVFbCBldmVudHMuXHJcbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlbnRlci12clwiLCB0aGlzLm9uRW50ZXJWUik7XHJcbiAgICBzY2VuZUVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJleGl0LXZyXCIsIHRoaXMub25FeGl0VlIpO1xyXG5cclxuICAgIC8vIFBvaW50ZXIgTG9jayBldmVudHMuXHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcInBvaW50ZXJsb2NrY2hhbmdlXCIsXHJcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcclxuICAgICAgZmFsc2VcclxuICAgICk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcIm1venBvaW50ZXJsb2NrY2hhbmdlXCIsXHJcbiAgICAgIHRoaXMub25Qb2ludGVyTG9ja0NoYW5nZSxcclxuICAgICAgZmFsc2VcclxuICAgICk7XHJcbiAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcInBvaW50ZXJsb2NrZXJyb3JcIixcclxuICAgICAgdGhpcy5vblBvaW50ZXJMb2NrRXJyb3IsXHJcbiAgICAgIGZhbHNlXHJcbiAgICApO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBvcmllbnRhdGlvbiBmb3IgbW9iaWxlLCBtb3VzZSBkcmFnLCBhbmQgaGVhZHNldC5cclxuICAgKiBNb3VzZS1kcmFnIG9ubHkgZW5hYmxlZCBpZiBITUQgaXMgbm90IGFjdGl2ZS5cclxuICAgKi9cclxuICB1cGRhdGVPcmllbnRhdGlvbjogKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwb3NlTWF0cml4ID0gbmV3IFRIUkVFLk1hdHJpeDQoKTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xyXG4gICAgICB2YXIgb2JqZWN0M0QgPSB0aGlzLmVsLm9iamVjdDNEO1xyXG4gICAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xyXG4gICAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XHJcbiAgICAgIHZhciBwb3NlO1xyXG4gICAgICB2YXIgc2NlbmVFbCA9IHRoaXMuZWwuc2NlbmVFbDtcclxuXHJcbiAgICAgIC8vIEluIFZSIG1vZGUsIFRIUkVFIGlzIGluIGNoYXJnZSBvZiB1cGRhdGluZyB0aGUgY2FtZXJhIHBvc2UuXHJcbiAgICAgIGlmIChzY2VuZUVsLmlzKFwidnItbW9kZVwiKSAmJiBzY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XHJcbiAgICAgICAgLy8gV2l0aCBXZWJYUiBUSFJFRSBhcHBsaWVzIGhlYWRzZXQgcG9zZSB0byB0aGUgb2JqZWN0M0QgbWF0cml4V29ybGQgaW50ZXJuYWxseS5cclxuICAgICAgICAvLyBSZWZsZWN0IHZhbHVlcyBiYWNrIG9uIHBvc2l0aW9uLCByb3RhdGlvbiwgc2NhbGUgZm9yIGdldEF0dHJpYnV0ZSB0byByZXR1cm4gdGhlIGV4cGVjdGVkIHZhbHVlcy5cclxuICAgICAgICBpZiAoc2NlbmVFbC5oYXNXZWJYUikge1xyXG4gICAgICAgICAgcG9zZSA9IHNjZW5lRWwucmVuZGVyZXIueHIuZ2V0Q2FtZXJhUG9zZSgpO1xyXG4gICAgICAgICAgaWYgKHBvc2UpIHtcclxuICAgICAgICAgICAgcG9zZU1hdHJpeC5lbGVtZW50cyA9IHBvc2UudHJhbnNmb3JtLm1hdHJpeDtcclxuICAgICAgICAgICAgcG9zZU1hdHJpeC5kZWNvbXBvc2UoXHJcbiAgICAgICAgICAgICAgb2JqZWN0M0QucG9zaXRpb24sXHJcbiAgICAgICAgICAgICAgb2JqZWN0M0Qucm90YXRpb24sXHJcbiAgICAgICAgICAgICAgb2JqZWN0M0Quc2NhbGVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb24oKTtcclxuXHJcbiAgICAgIC8vIE9uIG1vYmlsZSwgZG8gY2FtZXJhIHJvdGF0aW9uIHdpdGggdG91Y2ggZXZlbnRzIGFuZCBzZW5zb3JzLlxyXG4gICAgICBvYmplY3QzRC5yb3RhdGlvbi54ID1cclxuICAgICAgICB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlci54ICsgcGl0Y2hPYmplY3Qucm90YXRpb24ueDtcclxuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueSA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKyB5YXdPYmplY3Qucm90YXRpb24ueTtcclxuICAgICAgb2JqZWN0M0Qucm90YXRpb24ueiA9IHRoaXMubWFnaWNXaW5kb3dEZWx0YUV1bGVyLno7XHJcbiAgICB9O1xyXG4gIH0pKCksXHJcblxyXG4gIHVwZGF0ZU1hZ2ljV2luZG93T3JpZW50YXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBtYWdpY1dpbmRvd0Fic29sdXRlRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93QWJzb2x1dGVFdWxlcjtcclxuICAgIHZhciBtYWdpY1dpbmRvd0RlbHRhRXVsZXIgPSB0aGlzLm1hZ2ljV2luZG93RGVsdGFFdWxlcjtcclxuICAgIC8vIENhbGN1bGF0ZSBtYWdpYyB3aW5kb3cgSE1EIHF1YXRlcm5pb24uXHJcbiAgICBpZiAodGhpcy5tYWdpY1dpbmRvd0NvbnRyb2xzICYmIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy5lbmFibGVkKSB7XHJcbiAgICAgIHRoaXMubWFnaWNXaW5kb3dDb250cm9scy51cGRhdGUoKTtcclxuICAgICAgbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnNldEZyb21RdWF0ZXJuaW9uKFxyXG4gICAgICAgIHRoaXMubWFnaWNXaW5kb3dPYmplY3QucXVhdGVybmlvbixcclxuICAgICAgICBcIllYWlwiXHJcbiAgICAgICk7XHJcbiAgICAgIGlmICghdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ICYmIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55ICE9PSAwKSB7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMucHJldmlvdXNNYWdpY1dpbmRvd1lhdykge1xyXG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci54ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLng7XHJcbiAgICAgICAgbWFnaWNXaW5kb3dEZWx0YUV1bGVyLnkgKz1cclxuICAgICAgICAgIG1hZ2ljV2luZG93QWJzb2x1dGVFdWxlci55IC0gdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3O1xyXG4gICAgICAgIG1hZ2ljV2luZG93RGVsdGFFdWxlci56ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLno7XHJcbiAgICAgICAgdGhpcy5wcmV2aW91c01hZ2ljV2luZG93WWF3ID0gbWFnaWNXaW5kb3dBYnNvbHV0ZUV1bGVyLnk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUcmFuc2xhdGUgbW91c2UgZHJhZyBpbnRvIHJvdGF0aW9uLlxyXG4gICAqXHJcbiAgICogRHJhZ2dpbmcgdXAgYW5kIGRvd24gcm90YXRlcyB0aGUgY2FtZXJhIGFyb3VuZCB0aGUgWC1heGlzICh5YXcpLlxyXG4gICAqIERyYWdnaW5nIGxlZnQgYW5kIHJpZ2h0IHJvdGF0ZXMgdGhlIGNhbWVyYSBhcm91bmQgdGhlIFktYXhpcyAocGl0Y2gpLlxyXG4gICAqL1xyXG4gIG9uTW91c2VNb3ZlOiBmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICB2YXIgZGlyZWN0aW9uO1xyXG4gICAgdmFyIG1vdmVtZW50WDtcclxuICAgIHZhciBtb3ZlbWVudFk7XHJcbiAgICB2YXIgcGl0Y2hPYmplY3QgPSB0aGlzLnBpdGNoT2JqZWN0O1xyXG4gICAgdmFyIHByZXZpb3VzTW91c2VFdmVudCA9IHRoaXMucHJldmlvdXNNb3VzZUV2ZW50O1xyXG4gICAgdmFyIHlhd09iamVjdCA9IHRoaXMueWF3T2JqZWN0O1xyXG5cclxuICAgIC8vIE5vdCBkcmFnZ2luZyBvciBub3QgZW5hYmxlZC5cclxuICAgIGlmICghdGhpcy5kYXRhLmVuYWJsZWQgfHwgKCF0aGlzLm1vdXNlRG93biAmJiAhdGhpcy5wb2ludGVyTG9ja2VkKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGRlbHRhLlxyXG4gICAgaWYgKHRoaXMucG9pbnRlckxvY2tlZCkge1xyXG4gICAgICBtb3ZlbWVudFggPSBldnQubW92ZW1lbnRYIHx8IGV2dC5tb3pNb3ZlbWVudFggfHwgMDtcclxuICAgICAgbW92ZW1lbnRZID0gZXZ0Lm1vdmVtZW50WSB8fCBldnQubW96TW92ZW1lbnRZIHx8IDA7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBtb3ZlbWVudFggPSBldnQuc2NyZWVuWCAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5YO1xyXG4gICAgICBtb3ZlbWVudFkgPSBldnQuc2NyZWVuWSAtIHByZXZpb3VzTW91c2VFdmVudC5zY3JlZW5ZO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWCA9IGV2dC5zY3JlZW5YO1xyXG4gICAgdGhpcy5wcmV2aW91c01vdXNlRXZlbnQuc2NyZWVuWSA9IGV2dC5zY3JlZW5ZO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSByb3RhdGlvbi5cclxuICAgIGRpcmVjdGlvbiA9IHRoaXMuZGF0YS5yZXZlcnNlTW91c2VEcmFnID8gMSA6IC0xO1xyXG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgKz0gbW92ZW1lbnRYICogMC4wMDIgKiBkaXJlY3Rpb247XHJcbiAgICBwaXRjaE9iamVjdC5yb3RhdGlvbi54ICs9IG1vdmVtZW50WSAqIDAuMDAyICogZGlyZWN0aW9uO1xyXG4gICAgcGl0Y2hPYmplY3Qucm90YXRpb24ueCA9IE1hdGgubWF4KFxyXG4gICAgICAtUElfMixcclxuICAgICAgTWF0aC5taW4oUElfMiwgcGl0Y2hPYmplY3Qucm90YXRpb24ueClcclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXIgbW91c2UgZG93biB0byBkZXRlY3QgbW91c2UgZHJhZy5cclxuICAgKi9cclxuICBvbk1vdXNlRG93bjogZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XHJcbiAgICBpZiAoXHJcbiAgICAgICF0aGlzLmRhdGEuZW5hYmxlZCB8fFxyXG4gICAgICAoc2NlbmVFbC5pcyhcInZyLW1vZGVcIikgJiYgc2NlbmVFbC5jaGVja0hlYWRzZXRDb25uZWN0ZWQoKSlcclxuICAgICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICAvLyBIYW5kbGUgb25seSBwcmltYXJ5IGJ1dHRvbi5cclxuICAgIGlmIChldnQuYnV0dG9uICE9PSAwKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgY2FudmFzRWwgPSBzY2VuZUVsICYmIHNjZW5lRWwuY2FudmFzO1xyXG5cclxuICAgIHRoaXMubW91c2VEb3duID0gdHJ1ZTtcclxuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblggPSBldnQuc2NyZWVuWDtcclxuICAgIHRoaXMucHJldmlvdXNNb3VzZUV2ZW50LnNjcmVlblkgPSBldnQuc2NyZWVuWTtcclxuICAgIHRoaXMuc2hvd0dyYWJiaW5nQ3Vyc29yKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuZGF0YS5wb2ludGVyTG9ja0VuYWJsZWQgJiYgIXRoaXMucG9pbnRlckxvY2tlZCkge1xyXG4gICAgICBpZiAoY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKSB7XHJcbiAgICAgICAgY2FudmFzRWwucmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKSB7XHJcbiAgICAgICAgY2FudmFzRWwubW96UmVxdWVzdFBvaW50ZXJMb2NrKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTaG93cyBncmFiYmluZyBjdXJzb3Igb24gc2NlbmVcclxuICAgKi9cclxuICBzaG93R3JhYmJpbmdDdXJzb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuZWwuc2NlbmVFbC5jYW52YXMuc3R5bGUuY3Vyc29yID0gXCJncmFiYmluZ1wiO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEhpZGVzIGdyYWJiaW5nIGN1cnNvciBvbiBzY2VuZVxyXG4gICAqL1xyXG4gIGhpZGVHcmFiYmluZ0N1cnNvcjogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5lbC5zY2VuZUVsLmNhbnZhcy5zdHlsZS5jdXJzb3IgPSBcIlwiO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVyIG1vdXNlIHVwIHRvIGRldGVjdCByZWxlYXNlIG9mIG1vdXNlIGRyYWcuXHJcbiAgICovXHJcbiAgb25Nb3VzZVVwOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm1vdXNlRG93biA9IGZhbHNlO1xyXG4gICAgdGhpcy5oaWRlR3JhYmJpbmdDdXJzb3IoKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZWdpc3RlciB0b3VjaCBkb3duIHRvIGRldGVjdCB0b3VjaCBkcmFnLlxyXG4gICAqL1xyXG4gIG9uVG91Y2hTdGFydDogZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgaWYgKFxyXG4gICAgICBldnQudG91Y2hlcy5sZW5ndGggIT09IDEgfHxcclxuICAgICAgIXRoaXMuZGF0YS50b3VjaEVuYWJsZWQgfHxcclxuICAgICAgdGhpcy5lbC5zY2VuZUVsLmlzKFwidnItbW9kZVwiKVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMudG91Y2hTdGFydCA9IHtcclxuICAgICAgeDogZXZ0LnRvdWNoZXNbMF0ucGFnZVgsXHJcbiAgICAgIHk6IGV2dC50b3VjaGVzWzBdLnBhZ2VZLFxyXG4gICAgfTtcclxuICAgIHRoaXMudG91Y2hTdGFydGVkID0gdHJ1ZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBUcmFuc2xhdGUgdG91Y2ggbW92ZSB0byBZLWF4aXMgcm90YXRpb24uXHJcbiAgICovXHJcbiAgb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIChldnQpIHtcclxuICAgIHZhciBkaXJlY3Rpb247XHJcbiAgICB2YXIgY2FudmFzID0gdGhpcy5lbC5zY2VuZUVsLmNhbnZhcztcclxuICAgIHZhciBkZWx0YVk7XHJcbiAgICB2YXIgeWF3T2JqZWN0ID0gdGhpcy55YXdPYmplY3Q7XHJcblxyXG4gICAgaWYgKCF0aGlzLnRvdWNoU3RhcnRlZCB8fCAhdGhpcy5kYXRhLnRvdWNoRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZGVsdGFZID1cclxuICAgICAgKDIgKiBNYXRoLlBJICogKGV2dC50b3VjaGVzWzBdLnBhZ2VYIC0gdGhpcy50b3VjaFN0YXJ0LngpKSAvXHJcbiAgICAgIGNhbnZhcy5jbGllbnRXaWR0aDtcclxuXHJcbiAgICBkaXJlY3Rpb24gPSB0aGlzLmRhdGEucmV2ZXJzZVRvdWNoRHJhZyA/IDEgOiAtMTtcclxuICAgIC8vIExpbWl0IHRvdWNoIG9yaWVudGFpb24gdG8gdG8geWF3ICh5IGF4aXMpLlxyXG4gICAgeWF3T2JqZWN0LnJvdGF0aW9uLnkgLT0gZGVsdGFZICogMC41ICogZGlyZWN0aW9uO1xyXG4gICAgdGhpcy50b3VjaFN0YXJ0ID0ge1xyXG4gICAgICB4OiBldnQudG91Y2hlc1swXS5wYWdlWCxcclxuICAgICAgeTogZXZ0LnRvdWNoZXNbMF0ucGFnZVksXHJcbiAgICB9O1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVyIHRvdWNoIGVuZCB0byBkZXRlY3QgcmVsZWFzZSBvZiB0b3VjaCBkcmFnLlxyXG4gICAqL1xyXG4gIG9uVG91Y2hFbmQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudG91Y2hTdGFydGVkID0gZmFsc2U7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogU2F2ZSBwb3NlLlxyXG4gICAqL1xyXG4gIG9uRW50ZXJWUjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHNjZW5lRWwgPSB0aGlzLmVsLnNjZW5lRWw7XHJcbiAgICBpZiAoIXNjZW5lRWwuY2hlY2tIZWFkc2V0Q29ubmVjdGVkKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zYXZlQ2FtZXJhUG9zZSgpO1xyXG4gICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XHJcbiAgICB0aGlzLmVsLm9iamVjdDNELnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcclxuICAgIGlmIChzY2VuZUVsLmhhc1dlYlhSKSB7XHJcbiAgICAgIHRoaXMuZWwub2JqZWN0M0QubWF0cml4QXV0b1VwZGF0ZSA9IGZhbHNlO1xyXG4gICAgICB0aGlzLmVsLm9iamVjdDNELnVwZGF0ZU1hdHJpeCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFJlc3RvcmUgdGhlIHBvc2UuXHJcbiAgICovXHJcbiAgb25FeGl0VlI6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICghdGhpcy5lbC5zY2VuZUVsLmNoZWNrSGVhZHNldENvbm5lY3RlZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMucmVzdG9yZUNhbWVyYVBvc2UoKTtcclxuICAgIHRoaXMucHJldmlvdXNITURQb3NpdGlvbi5zZXQoMCwgMCwgMCk7XHJcbiAgICB0aGlzLmVsLm9iamVjdDNELm1hdHJpeEF1dG9VcGRhdGUgPSB0cnVlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFVwZGF0ZSBQb2ludGVyIExvY2sgc3RhdGUuXHJcbiAgICovXHJcbiAgb25Qb2ludGVyTG9ja0NoYW5nZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5wb2ludGVyTG9ja2VkID0gISEoXHJcbiAgICAgIGRvY3VtZW50LnBvaW50ZXJMb2NrRWxlbWVudCB8fCBkb2N1bWVudC5tb3pQb2ludGVyTG9ja0VsZW1lbnRcclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogUmVjb3ZlciBmcm9tIFBvaW50ZXIgTG9jayBlcnJvci5cclxuICAgKi9cclxuICBvblBvaW50ZXJMb2NrRXJyb3I6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xyXG4gIH0sXHJcblxyXG4gIC8vIEV4aXRzIHBvaW50ZXItbG9ja2VkIG1vZGUuXHJcbiAgZXhpdFBvaW50ZXJMb2NrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBkb2N1bWVudC5leGl0UG9pbnRlckxvY2soKTtcclxuICAgIHRoaXMucG9pbnRlckxvY2tlZCA9IGZhbHNlO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSB0aGUgZmVhdHVyZSBvZiBzaG93aW5nL2hpZGluZyB0aGUgZ3JhYiBjdXJzb3IuXHJcbiAgICovXHJcbiAgdXBkYXRlR3JhYkN1cnNvcjogZnVuY3Rpb24gKGVuYWJsZWQpIHtcclxuICAgIHZhciBzY2VuZUVsID0gdGhpcy5lbC5zY2VuZUVsO1xyXG5cclxuICAgIGZ1bmN0aW9uIGVuYWJsZUdyYWJDdXJzb3IoKSB7XHJcbiAgICAgIHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5hZGQoXCJhLWdyYWItY3Vyc29yXCIpO1xyXG4gICAgfVxyXG4gICAgZnVuY3Rpb24gZGlzYWJsZUdyYWJDdXJzb3IoKSB7XHJcbiAgICAgIHNjZW5lRWwuY2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoXCJhLWdyYWItY3Vyc29yXCIpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghc2NlbmVFbC5jYW52YXMpIHtcclxuICAgICAgaWYgKGVuYWJsZWQpIHtcclxuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJyZW5kZXItdGFyZ2V0LWxvYWRlZFwiLCBlbmFibGVHcmFiQ3Vyc29yKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBzY2VuZUVsLmFkZEV2ZW50TGlzdGVuZXIoXCJyZW5kZXItdGFyZ2V0LWxvYWRlZFwiLCBkaXNhYmxlR3JhYkN1cnNvcik7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChlbmFibGVkKSB7XHJcbiAgICAgIGVuYWJsZUdyYWJDdXJzb3IoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgZGlzYWJsZUdyYWJDdXJzb3IoKTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBTYXZlIGNhbWVyYSBwb3NlIGJlZm9yZSBlbnRlcmluZyBWUiB0byByZXN0b3JlIGxhdGVyIGlmIGV4aXRpbmcuXHJcbiAgICovXHJcbiAgc2F2ZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlbCA9IHRoaXMuZWw7XHJcblxyXG4gICAgdGhpcy5zYXZlZFBvc2UucG9zaXRpb24uY29weShlbC5vYmplY3QzRC5wb3NpdGlvbik7XHJcbiAgICB0aGlzLnNhdmVkUG9zZS5yb3RhdGlvbi5jb3B5KGVsLm9iamVjdDNELnJvdGF0aW9uKTtcclxuICAgIHRoaXMuaGFzU2F2ZWRQb3NlID0gdHJ1ZTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBSZXNldCBjYW1lcmEgcG9zZSB0byBiZWZvcmUgZW50ZXJpbmcgVlIuXHJcbiAgICovXHJcbiAgcmVzdG9yZUNhbWVyYVBvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBlbCA9IHRoaXMuZWw7XHJcbiAgICB2YXIgc2F2ZWRQb3NlID0gdGhpcy5zYXZlZFBvc2U7XHJcblxyXG4gICAgaWYgKCF0aGlzLmhhc1NhdmVkUG9zZSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmVzZXQgY2FtZXJhIG9yaWVudGF0aW9uLlxyXG4gICAgZWwub2JqZWN0M0QucG9zaXRpb24uY29weShzYXZlZFBvc2UucG9zaXRpb24pO1xyXG4gICAgZWwub2JqZWN0M0Qucm90YXRpb24uY29weShzYXZlZFBvc2Uucm90YXRpb24pO1xyXG4gICAgdGhpcy5oYXNTYXZlZFBvc2UgPSBmYWxzZTtcclxuICB9LFxyXG59KTtcclxuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XHJcblxyXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJhcmpzLXdlYmNhbS10ZXh0dXJlXCIsIHtcclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNjZW5lID0gdGhpcy5lbC5zY2VuZUVsO1xyXG4gICAgdGhpcy50ZXhDYW1lcmEgPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKC0wLjUsIDAuNSwgMC41LCAtMC41LCAwLCAxMCk7XHJcbiAgICB0aGlzLnRleFNjZW5lID0gbmV3IFRIUkVFLlNjZW5lKCk7XHJcblxyXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcclxuICAgIHRoaXMudmlkZW8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidmlkZW9cIik7XHJcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcImF1dG9wbGF5XCIsIHRydWUpO1xyXG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJwbGF5c2lubGluZVwiLCB0cnVlKTtcclxuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiZGlzcGxheVwiLCBcIm5vbmVcIik7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMudmlkZW8pO1xyXG4gICAgdGhpcy5nZW9tID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoKTsgLy8wLjUsIDAuNSk7XHJcbiAgICB0aGlzLnRleHR1cmUgPSBuZXcgVEhSRUUuVmlkZW9UZXh0dXJlKHRoaXMudmlkZW8pO1xyXG4gICAgdGhpcy5tYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGhpcy50ZXh0dXJlIH0pO1xyXG4gICAgY29uc3QgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKHRoaXMuZ2VvbSwgdGhpcy5tYXRlcmlhbCk7XHJcbiAgICB0aGlzLnRleFNjZW5lLmFkZChtZXNoKTtcclxuICB9LFxyXG5cclxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xyXG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcclxuICAgICAgICB2aWRlbzoge1xyXG4gICAgICAgICAgZmFjaW5nTW9kZTogXCJlbnZpcm9ubWVudFwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH07XHJcbiAgICAgIG5hdmlnYXRvci5tZWRpYURldmljZXNcclxuICAgICAgICAuZ2V0VXNlck1lZGlhKGNvbnN0cmFpbnRzKVxyXG4gICAgICAgIC50aGVuKChzdHJlYW0pID0+IHtcclxuICAgICAgICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0ID0gc3RyZWFtO1xyXG4gICAgICAgICAgdGhpcy52aWRlby5wbGF5KCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAuY2F0Y2goKGUpID0+IHtcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIGBXZWJjYW0gZXJyb3I6ICR7ZX1gXHJcbiAgICAgICAgICApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcclxuICAgICAgICBcInNvcnJ5IC0gbWVkaWEgZGV2aWNlcyBBUEkgbm90IHN1cHBvcnRlZFwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhcigpO1xyXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5yZW5kZXIodGhpcy50ZXhTY2VuZSwgdGhpcy50ZXhDYW1lcmEpO1xyXG4gICAgdGhpcy5zY2VuZS5yZW5kZXJlci5jbGVhckRlcHRoKCk7XHJcbiAgfSxcclxuXHJcbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMudmlkZW8uc3JjT2JqZWN0LmdldFRyYWNrcygpLmZvckVhY2goKHRyYWNrKSA9PiB7XHJcbiAgICAgIHRyYWNrLnN0b3AoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5tYXRlcmlhbC5kaXNwb3NlKCk7XHJcbiAgICB0aGlzLnRleHR1cmUuZGlzcG9zZSgpO1xyXG4gICAgdGhpcy5nZW9tLmRpc3Bvc2UoKTtcclxuICB9LFxyXG59KTtcclxuIiwiLypcclxuICogVVBEQVRFUyAyOC8wOC8yMDpcclxuICpcclxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XHJcbiAqIGZyZXF1ZW50bHkgR1BTIHVwZGF0ZXMgYXJlIHByb2Nlc3NlZC4gQWltIGlzIHRvIHByZXZlbnQgJ3N0dXR0ZXJpbmcnXHJcbiAqIGVmZmVjdHMgd2hlbiBjbG9zZSB0byBBUiBjb250ZW50IGR1ZSB0byBjb250aW51b3VzIHNtYWxsIGNoYW5nZXMgaW5cclxuICogbG9jYXRpb24uXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XHJcblxyXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtY2FtZXJhXCIsIHtcclxuICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxyXG4gIG9yaWdpbkNvb3JkczogbnVsbCxcclxuICBjdXJyZW50Q29vcmRzOiBudWxsLFxyXG4gIGxvb2tDb250cm9sczogbnVsbCxcclxuICBoZWFkaW5nOiBudWxsLFxyXG4gIHNjaGVtYToge1xyXG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcclxuICAgICAgdHlwZTogXCJpbnRcIixcclxuICAgICAgZGVmYXVsdDogMTAwLFxyXG4gICAgfSxcclxuICAgIGFsZXJ0OiB7XHJcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBtaW5EaXN0YW5jZToge1xyXG4gICAgICB0eXBlOiBcImludFwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIG1heERpc3RhbmNlOiB7XHJcbiAgICAgIHR5cGU6IFwiaW50XCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gICAgZ3BzTWluRGlzdGFuY2U6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogNSxcclxuICAgIH0sXHJcbiAgICBncHNUaW1lSW50ZXJ2YWw6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgIH0sXHJcbiAgfSxcclxuICB1cGRhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcclxuICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xyXG4gICAgICBsb2NhbFBvc2l0aW9uLmxvbmdpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZTtcclxuICAgICAgbG9jYWxQb3NpdGlvbi5sYXRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlO1xyXG4gICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XHJcbiAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XHJcblxyXG4gICAgICAvLyByZS10cmlnZ2VyIGluaXRpYWxpemF0aW9uIGZvciBuZXcgb3JpZ2luXHJcbiAgICAgIHRoaXMub3JpZ2luQ29vcmRzID0gbnVsbDtcclxuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChcclxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImFyanMtbG9vay1jb250cm9sc1wiXSAmJlxyXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcclxuICAgICAgbGF0aXR1ZGU6IDAsXHJcbiAgICAgIGxvbmdpdHVkZTogMCxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5sb2FkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiRElWXCIpO1xyXG4gICAgdGhpcy5sb2FkZXIuY2xhc3NMaXN0LmFkZChcImFyanMtbG9hZGVyXCIpO1xyXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRlcik7XHJcblxyXG4gICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWQgPSB0aGlzLl9vbkdwc0VudGl0eVBsYWNlQWRkZWQuYmluZCh0aGlzKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcclxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5sb29rQ29udHJvbHMgPVxyXG4gICAgICB0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gfHxcclxuICAgICAgdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXTtcclxuXHJcbiAgICAvLyBsaXN0ZW4gdG8gZGV2aWNlb3JpZW50YXRpb24gZXZlbnRcclxuICAgIHZhciBldmVudE5hbWUgPSB0aGlzLl9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZSgpO1xyXG4gICAgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiA9IHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24uYmluZCh0aGlzKTtcclxuXHJcbiAgICAvLyBpZiBTYWZhcmlcclxuICAgIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL1ZlcnNpb25cXC9bXFxkLl0rLipTYWZhcmkvKSkge1xyXG4gICAgICAvLyBpT1MgMTMrXHJcbiAgICAgIGlmICh0eXBlb2YgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbiA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgdmFyIGhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xyXG4gICAgICAgICAgRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpO1xyXG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGhhbmRsZXIpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICBcInRvdWNoZW5kXCIsXHJcbiAgICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGhhbmRsZXIoKTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWxzZVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICBcIkFmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLlwiXHJcbiAgICAgICAgKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcclxuICAgICAgICAgICAgXCJQbGVhc2UgZW5hYmxlIGRldmljZSBvcmllbnRhdGlvbiBpbiBTZXR0aW5ncyA+IFNhZmFyaSA+IE1vdGlvbiAmIE9yaWVudGF0aW9uIEFjY2Vzcy5cIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICB9LCA3NTApO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLCBmYWxzZSk7XHJcbiAgfSxcclxuXHJcbiAgcGxheTogZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlICE9PSAwICYmIHRoaXMuZGF0YS5zaW11bGF0ZUxvbmdpdHVkZSAhPT0gMCkge1xyXG4gICAgICB2YXIgbG9jYWxQb3NpdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuY3VycmVudENvb3JkcyB8fCB7fSk7XHJcbiAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcclxuICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xyXG4gICAgICAgIGxvY2FsUG9zaXRpb24uYWx0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xyXG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gdGhpcy5faW5pdFdhdGNoR1BTKFxyXG4gICAgICAgIGZ1bmN0aW9uIChwb3NpdGlvbikge1xyXG4gICAgICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgYWx0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZSxcclxuICAgICAgICAgICAgYWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hY2N1cmFjeSxcclxuICAgICAgICAgICAgYWx0aXR1ZGVBY2N1cmFjeTogcG9zaXRpb24uY29vcmRzLmFsdGl0dWRlQWNjdXJhY3ksXHJcbiAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSAhPT0gMCkge1xyXG4gICAgICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcclxuICAgICAgICAgIHZhciBkaXN0TW92ZWQgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KFxyXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbixcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50Q29vcmRzXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmIChkaXN0TW92ZWQgPj0gdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlIHx8ICF0aGlzLm9yaWdpbkNvb3Jkcykge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xyXG4gICAgICAgICAgICB0aGlzLmxhc3RQb3NpdGlvbiA9IHtcclxuICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcylcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5oZWFkaW5nID09PSBudWxsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuX3VwZGF0ZVJvdGF0aW9uKCk7XHJcbiAgfSxcclxuXHJcbiAgcGF1c2U6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQpIHtcclxuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcclxuICAgIH1cclxuICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG51bGw7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xyXG5cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcclxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gZXZlbnQgbmFtZVxyXG4gICAqL1xyXG4gIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93KSB7XHJcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIjtcclxuICAgIH0gZWxzZSBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uXCIgaW4gd2luZG93KSB7XHJcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJcIjtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBhc3Mgbm90IHN1cHBvcnRlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXZlbnROYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHVzZXIgcG9zaXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVycm9yXHJcbiAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICovXHJcbiAgX2luaXRXYXRjaEdQUzogZnVuY3Rpb24gKG9uU3VjY2Vzcywgb25FcnJvcikge1xyXG4gICAgaWYgKCFvbkVycm9yKSB7XHJcbiAgICAgIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiRVJST1IoXCIgKyBlcnIuY29kZSArIFwiKTogXCIgKyBlcnIubWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xyXG4gICAgICAgICAgLy8gVXNlciBkZW5pZWQgR2VvTG9jYXRpb24sIGxldCB0aGVpciBrbm93IHRoYXRcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIFwiUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIFwiQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC5cIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XHJcbiAgICAgIG9uRXJyb3Ioe1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogXCJHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlclwiLFxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXHJcbiAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XHJcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcclxuICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcclxuICAgICAgdGltZW91dDogMjcwMDAsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqL1xyXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxyXG4gICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIikpIHtcclxuICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHBvcHVwLmlubmVySFRNTCA9XHJcbiAgICAgICAgICBcIkdQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuXCI7XHJcbiAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhbGVydC1wb3B1cFwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpO1xyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiZcclxuICAgICAgYWxlcnRQb3B1cFxyXG4gICAgKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xyXG4gICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cclxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLmN1cnJlbnRDb29yZHM7XHJcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hcmpzLWxvYWRlclwiKTtcclxuICAgICAgaWYgKGxvYWRlcikge1xyXG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9zZXRQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHBvc2l0aW9uID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcclxuXHJcbiAgICAvLyBjb21wdXRlIHBvc2l0aW9uLnhcclxuICAgIHZhciBkc3RDb29yZHMgPSB7XHJcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5jdXJyZW50Q29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgbGF0aXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxhdGl0dWRlLFxyXG4gICAgfTtcclxuXHJcbiAgICBwb3NpdGlvbi54ID0gdGhpcy5jb21wdXRlRGlzdGFuY2VNZXRlcnModGhpcy5vcmlnaW5Db29yZHMsIGRzdENvb3Jkcyk7XHJcbiAgICBwb3NpdGlvbi54ICo9XHJcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sb25naXR1ZGUgPyAxIDogLTE7XHJcblxyXG4gICAgLy8gY29tcHV0ZSBwb3NpdGlvbi56XHJcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xyXG4gICAgICBsb25naXR1ZGU6IHRoaXMub3JpZ2luQ29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgbGF0aXR1ZGU6IHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcclxuICAgIH07XHJcblxyXG4gICAgcG9zaXRpb24ueiA9IHRoaXMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKHRoaXMub3JpZ2luQ29vcmRzLCBkc3RDb29yZHMpO1xyXG4gICAgcG9zaXRpb24ueiAqPVxyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUgPiB0aGlzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSA/IC0xIDogMTtcclxuXHJcbiAgICAvLyB1cGRhdGUgcG9zaXRpb25cclxuICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwicG9zaXRpb25cIiwgcG9zaXRpb24pO1xyXG5cclxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XHJcbiAgICAgICAgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIHNvdXJjZSBhbmQgZGVzdGluYXRpb24gaW5wdXRzLlxyXG4gICAqXHJcbiAgICogIENhbGN1bGF0ZSBkaXN0YW5jZSwgYmVhcmluZyBhbmQgbW9yZSBiZXR3ZWVuIExhdGl0dWRlL0xvbmdpdHVkZSBwb2ludHNcclxuICAgKiAgRGV0YWlsczogaHR0cHM6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvbGF0bG9uZy5odG1sXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBzcmNcclxuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICovXHJcbiAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbiAoc3JjLCBkZXN0LCBpc1BsYWNlKSB7XHJcbiAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLl9oYXZlcnNpbmVEaXN0KHNyYywgZGVzdCk7XHJcblxyXG4gICAgLy8gaWYgZnVuY3Rpb24gaGFzIGJlZW4gY2FsbGVkIGZvciBhIHBsYWNlLCBhbmQgaWYgaXQncyB0b28gbmVhciBhbmQgYSBtaW4gZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxyXG4gICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxyXG4gICAgaWYgKFxyXG4gICAgICBpc1BsYWNlICYmXHJcbiAgICAgIHRoaXMuZGF0YS5taW5EaXN0YW5jZSAmJlxyXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgPiAwICYmXHJcbiAgICAgIGRpc3RhbmNlIDwgdGhpcy5kYXRhLm1pbkRpc3RhbmNlXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGlmIGZ1bmN0aW9uIGhhcyBiZWVuIGNhbGxlZCBmb3IgYSBwbGFjZSwgYW5kIGlmIGl0J3MgdG9vIGZhciBhbmQgYSBtYXggZGlzdGFuY2UgaGFzIGJlZW4gc2V0LFxyXG4gICAgLy8gcmV0dXJuIG1heCBkaXN0YW5jZSBwb3NzaWJsZSAtIHRvIGJlIGhhbmRsZWQgYnkgdGhlIGNhbGxlclxyXG4gICAgaWYgKFxyXG4gICAgICBpc1BsYWNlICYmXHJcbiAgICAgIHRoaXMuZGF0YS5tYXhEaXN0YW5jZSAmJlxyXG4gICAgICB0aGlzLmRhdGEubWF4RGlzdGFuY2UgPiAwICYmXHJcbiAgICAgIGRpc3RhbmNlID4gdGhpcy5kYXRhLm1heERpc3RhbmNlXHJcbiAgICApIHtcclxuICAgICAgcmV0dXJuIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBkaXN0YW5jZTtcclxuICB9LFxyXG5cclxuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xyXG4gICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XHJcbiAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcclxuXHJcbiAgICB2YXIgYSA9XHJcbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xyXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcclxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXHJcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XHJcbiAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xyXG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDb21wdXRlIGNvbXBhc3MgaGVhZGluZy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBhbHBoYVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBiZXRhXHJcbiAgICogQHBhcmFtIHtudW1iZXJ9IGdhbW1hXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjb21wYXNzIGhlYWRpbmdcclxuICAgKi9cclxuICBfY29tcHV0ZUNvbXBhc3NIZWFkaW5nOiBmdW5jdGlvbiAoYWxwaGEsIGJldGEsIGdhbW1hKSB7XHJcbiAgICAvLyBDb252ZXJ0IGRlZ3JlZXMgdG8gcmFkaWFuc1xyXG4gICAgdmFyIGFscGhhUmFkID0gYWxwaGEgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICB2YXIgYmV0YVJhZCA9IGJldGEgKiAoTWF0aC5QSSAvIDE4MCk7XHJcbiAgICB2YXIgZ2FtbWFSYWQgPSBnYW1tYSAqIChNYXRoLlBJIC8gMTgwKTtcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgZXF1YXRpb24gY29tcG9uZW50c1xyXG4gICAgdmFyIGNBID0gTWF0aC5jb3MoYWxwaGFSYWQpO1xyXG4gICAgdmFyIHNBID0gTWF0aC5zaW4oYWxwaGFSYWQpO1xyXG4gICAgdmFyIHNCID0gTWF0aC5zaW4oYmV0YVJhZCk7XHJcbiAgICB2YXIgY0cgPSBNYXRoLmNvcyhnYW1tYVJhZCk7XHJcbiAgICB2YXIgc0cgPSBNYXRoLnNpbihnYW1tYVJhZCk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIEEsIEIsIEMgcm90YXRpb24gY29tcG9uZW50c1xyXG4gICAgdmFyIHJBID0gLWNBICogc0cgLSBzQSAqIHNCICogY0c7XHJcbiAgICB2YXIgckIgPSAtc0EgKiBzRyArIGNBICogc0IgKiBjRztcclxuXHJcbiAgICAvLyBDYWxjdWxhdGUgY29tcGFzcyBoZWFkaW5nXHJcbiAgICB2YXIgY29tcGFzc0hlYWRpbmcgPSBNYXRoLmF0YW4ockEgLyByQik7XHJcblxyXG4gICAgLy8gQ29udmVydCBmcm9tIGhhbGYgdW5pdCBjaXJjbGUgdG8gd2hvbGUgdW5pdCBjaXJjbGVcclxuICAgIGlmIChyQiA8IDApIHtcclxuICAgICAgY29tcGFzc0hlYWRpbmcgKz0gTWF0aC5QSTtcclxuICAgIH0gZWxzZSBpZiAockEgPCAwKSB7XHJcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IDIgKiBNYXRoLlBJO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIENvbnZlcnQgcmFkaWFucyB0byBkZWdyZWVzXHJcbiAgICBjb21wYXNzSGVhZGluZyAqPSAxODAgLyBNYXRoLlBJO1xyXG5cclxuICAgIHJldHVybiBjb21wYXNzSGVhZGluZztcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBkZXZpY2Ugb3JpZW50YXRpb24gZXZlbnQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldmVudFxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqL1xyXG4gIF9vbkRldmljZU9yaWVudGF0aW9uOiBmdW5jdGlvbiAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzSGVhZGluZyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGlmIChldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3kgPCA1MCkge1xyXG4gICAgICAgIHRoaXMuaGVhZGluZyA9IGV2ZW50LndlYmtpdENvbXBhc3NIZWFkaW5nO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcIndlYmtpdENvbXBhc3NBY2N1cmFjeSBpcyBldmVudC53ZWJraXRDb21wYXNzQWNjdXJhY3lcIik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoZXZlbnQuYWxwaGEgIT09IG51bGwpIHtcclxuICAgICAgaWYgKGV2ZW50LmFic29sdXRlID09PSB0cnVlIHx8IGV2ZW50LmFic29sdXRlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcgPSB0aGlzLl9jb21wdXRlQ29tcGFzc0hlYWRpbmcoXHJcbiAgICAgICAgICBldmVudC5hbHBoYSxcclxuICAgICAgICAgIGV2ZW50LmJldGEsXHJcbiAgICAgICAgICBldmVudC5nYW1tYVxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWJzb2x1dGUgPT09IGZhbHNlXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJldmVudC5hbHBoYSA9PT0gbnVsbFwiKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdXNlciByb3RhdGlvbiBkYXRhLlxyXG4gICAqXHJcbiAgICogQHJldHVybnMge3ZvaWR9XHJcbiAgICovXHJcbiAgX3VwZGF0ZVJvdGF0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgaGVhZGluZyA9IDM2MCAtIHRoaXMuaGVhZGluZztcclxuICAgIHZhciBjYW1lcmFSb3RhdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicm90YXRpb25cIikueTtcclxuICAgIHZhciB5YXdSb3RhdGlvbiA9IFRIUkVFLk1hdGgucmFkVG9EZWcoXHJcbiAgICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55XHJcbiAgICApO1xyXG4gICAgdmFyIG9mZnNldCA9IChoZWFkaW5nIC0gKGNhbWVyYVJvdGF0aW9uIC0geWF3Um90YXRpb24pKSAlIDM2MDtcclxuICAgIHRoaXMubG9va0NvbnRyb2xzLnlhd09iamVjdC5yb3RhdGlvbi55ID0gVEhSRUUuTWF0aC5kZWdUb1JhZChvZmZzZXQpO1xyXG4gIH0sXHJcblxyXG4gIF9vbkdwc0VudGl0eVBsYWNlQWRkZWQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGlmIHBsYWNlcyBhcmUgYWRkZWQgYWZ0ZXIgY2FtZXJhIGluaXRpYWxpemF0aW9uIGlzIGZpbmlzaGVkXHJcbiAgICBpZiAodGhpcy5vcmlnaW5Db29yZHMpIHtcclxuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIpKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmxvYWRlciAmJiB0aGlzLmxvYWRlci5wYXJlbnRFbGVtZW50KSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy5sb2FkZXIpO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG4iLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xyXG5cclxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiZ3BzLWVudGl0eS1wbGFjZVwiLCB7XHJcbiAgX2NhbWVyYUdwczogbnVsbCxcclxuICBzY2hlbWE6IHtcclxuICAgIGxvbmdpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIGxhdGl0dWRlOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBjbGVhbmluZyBsaXN0ZW5lcnMgd2hlbiB0aGUgZW50aXR5IGlzIHJlbW92ZWQgZnJvbSB0aGUgRE9NXHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIixcclxuICAgICAgdGhpcy5jb29yZFNldExpc3RlbmVyXHJcbiAgICApO1xyXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIFwiZ3BzLWNhbWVyYS11cGRhdGUtcG9zaXRpb25cIixcclxuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbkxpc3RlbmVyXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5jb29yZFNldExpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xyXG4gICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1jYW1lcmFdXCIpO1xyXG4gICAgICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtY2FtZXJhXCJdKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWRcIik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLWNhbWVyYVwiXTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLl91cGRhdGVQb3NpdGlvbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXIgPSAoZXYpID0+IHtcclxuICAgICAgaWYgKCF0aGlzLmRhdGEgfHwgIXRoaXMuX2NhbWVyYUdwcykge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGRzdENvb3JkcyA9IHtcclxuICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb25naXR1ZGUsXHJcbiAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sYXRpdHVkZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxyXG4gICAgICB2YXIgZGlzdGFuY2VGb3JNc2cgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxyXG4gICAgICAgIGV2LmRldGFpbC5wb3NpdGlvbixcclxuICAgICAgICBkc3RDb29yZHNcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiZGlzdGFuY2VcIiwgZGlzdGFuY2VGb3JNc2cpO1xyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlTXNnXCIsIHRoaXMuX2Zvcm1hdERpc3RhbmNlKGRpc3RhbmNlRm9yTXNnKSk7XHJcbiAgICAgIHRoaXMuZWwuZGlzcGF0Y2hFdmVudChcclxuICAgICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLXVwZGF0ZS1wb3NpdGlvblwiLCB7XHJcbiAgICAgICAgICBkZXRhaWw6IHsgZGlzdGFuY2U6IGRpc3RhbmNlRm9yTXNnIH0sXHJcbiAgICAgICAgfSlcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHZhciBhY3R1YWxEaXN0YW5jZSA9IHRoaXMuX2NhbWVyYUdwcy5jb21wdXRlRGlzdGFuY2VNZXRlcnMoXHJcbiAgICAgICAgZXYuZGV0YWlsLnBvc2l0aW9uLFxyXG4gICAgICAgIGRzdENvb3JkcyxcclxuICAgICAgICB0cnVlXHJcbiAgICAgICk7XHJcblxyXG4gICAgICBpZiAoYWN0dWFsRGlzdGFuY2UgPT09IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSKSB7XHJcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5oaWRlRm9yTWluRGlzdGFuY2UodGhpcy5lbCwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiLFxyXG4gICAgICB0aGlzLmNvb3JkU2V0TGlzdGVuZXJcclxuICAgICk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLFxyXG4gICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uTGlzdGVuZXJcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSAwO1xyXG5cclxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsIHtcclxuICAgICAgICBkZXRhaWw6IHsgY29tcG9uZW50OiB0aGlzLmVsIH0sXHJcbiAgICAgIH0pXHJcbiAgICApO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGlkZSBlbnRpdHkgYWNjb3JkaW5nIHRvIG1pbkRpc3RhbmNlIHByb3BlcnR5XHJcbiAgICogQHJldHVybnMge3ZvaWR9XHJcbiAgICovXHJcbiAgaGlkZUZvck1pbkRpc3RhbmNlOiBmdW5jdGlvbiAoZWwsIGhpZGVFbnRpdHkpIHtcclxuICAgIGlmIChoaWRlRW50aXR5KSB7XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJmYWxzZVwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGVsLnNldEF0dHJpYnV0ZShcInZpc2libGVcIiwgXCJ0cnVlXCIpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHBsYWNlIHBvc2l0aW9uXHJcbiAgICogQHJldHVybnMge3ZvaWR9XHJcbiAgICovXHJcbiAgX3VwZGF0ZVBvc2l0aW9uOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgcG9zaXRpb24gPSB7IHg6IDAsIHk6IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIikueSB8fCAwLCB6OiAwIH07XHJcblxyXG4gICAgLy8gdXBkYXRlIHBvc2l0aW9uLnhcclxuICAgIHZhciBkc3RDb29yZHMgPSB7XHJcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLmxvbmdpdHVkZSxcclxuICAgICAgbGF0aXR1ZGU6IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubGF0aXR1ZGUsXHJcbiAgICB9O1xyXG5cclxuICAgIHBvc2l0aW9uLnggPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKFxyXG4gICAgICB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLFxyXG4gICAgICBkc3RDb29yZHNcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5fcG9zaXRpb25YRGVidWcgPSBwb3NpdGlvbi54O1xyXG5cclxuICAgIHBvc2l0aW9uLnggKj1cclxuICAgICAgdGhpcy5kYXRhLmxvbmdpdHVkZSA+IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlID8gMSA6IC0xO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvbi56XHJcbiAgICB2YXIgZHN0Q29vcmRzID0ge1xyXG4gICAgICBsb25naXR1ZGU6IHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMubG9uZ2l0dWRlLFxyXG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLmxhdGl0dWRlLFxyXG4gICAgfTtcclxuXHJcbiAgICBwb3NpdGlvbi56ID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcclxuICAgICAgdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3JkcyxcclxuICAgICAgZHN0Q29vcmRzXHJcbiAgICApO1xyXG5cclxuICAgIHBvc2l0aW9uLnogKj1cclxuICAgICAgdGhpcy5kYXRhLmxhdGl0dWRlID4gdGhpcy5fY2FtZXJhR3BzLm9yaWdpbkNvb3Jkcy5sYXRpdHVkZSA/IC0xIDogMTtcclxuXHJcbiAgICBpZiAocG9zaXRpb24ueSAhPT0gMCkge1xyXG4gICAgICB2YXIgYWx0aXR1ZGUgPVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcy5vcmlnaW5Db29yZHMuYWx0aXR1ZGUgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgICAgPyB0aGlzLl9jYW1lcmFHcHMub3JpZ2luQ29vcmRzLmFsdGl0dWRlXHJcbiAgICAgICAgICA6IDA7XHJcbiAgICAgIHBvc2l0aW9uLnkgPSBwb3NpdGlvbi55IC0gYWx0aXR1ZGU7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxyXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBwb3NpdGlvbik7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxyXG4gICAqL1xyXG5cclxuICBfZm9ybWF0RGlzdGFuY2U6IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xyXG4gICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDApO1xyXG5cclxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XHJcbiAgICAgIHJldHVybiBkaXN0YW5jZSAvIDEwMDAgKyBcIiBraWxvbWV0ZXJzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgXCIgbWV0ZXJzXCI7XHJcbiAgfSxcclxufSk7XHJcbiIsIi8qKiBncHMtcHJvamVjdGVkLWNhbWVyYVxyXG4gKlxyXG4gKiBiYXNlZCBvbiB0aGUgb3JpZ2luYWwgZ3BzLWNhbWVyYSwgbW9kaWZpZWQgYnkgbmlja3cgMDIvMDQvMjBcclxuICpcclxuICogUmF0aGVyIHRoYW4ga2VlcGluZyB0cmFjayBvZiBwb3NpdGlvbiBieSBjYWxjdWxhdGluZyB0aGUgZGlzdGFuY2Ugb2ZcclxuICogZW50aXRpZXMgb3IgdGhlIGN1cnJlbnQgbG9jYXRpb24gdG8gdGhlIG9yaWdpbmFsIGxvY2F0aW9uLCB0aGlzIHZlcnNpb25cclxuICogbWFrZXMgdXNlIG9mIHRoZSBcIkdvb2dsZVwiIFNwaGVyaWNhbCBNZXJjYWN0b3IgcHJvamVjdGlvbiwgYWthIGVwc2c6Mzg1Ny5cclxuICpcclxuICogVGhlIG9yaWdpbmFsIHBvc2l0aW9uIChsYXQvbG9uKSBpcyBwcm9qZWN0ZWQgaW50byBTcGhlcmljYWwgTWVyY2F0b3IgYW5kXHJcbiAqIHN0b3JlZC5cclxuICpcclxuICogVGhlbiwgd2hlbiB3ZSByZWNlaXZlIGEgbmV3IHBvc2l0aW9uIChsYXQvbG9uKSwgdGhpcyBuZXcgcG9zaXRpb24gaXNcclxuICogcHJvamVjdGVkIGludG8gU3BoZXJpY2FsIE1lcmNhdG9yIGFuZCB0aGVuIGl0cyB3b3JsZCBwb3NpdGlvbiBjYWxjdWxhdGVkXHJcbiAqIGJ5IGNvbXBhcmluZyBhZ2FpbnN0IHRoZSBvcmlnaW5hbCBwb3NpdGlvbi5cclxuICpcclxuICogVGhlIHNhbWUgaXMgYWxzbyB0aGUgY2FzZSBmb3IgJ2VudGl0eS1wbGFjZXMnOyB3aGVuIHRoZXNlIGFyZSBhZGRlZCwgdGhlaXJcclxuICogU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmUgY2FsY3VsYXRlZCAoc2VlIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlKS5cclxuICpcclxuICogU3BoZXJpY2FsIE1lcmNhdG9yIHVuaXRzIGFyZSBjbG9zZSB0bywgYnV0IG5vdCBleGFjdGx5LCBtZXRyZXMsIGFuZCBhcmVcclxuICogaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMuIE5vbmV0aGVsZXNzIHRoZXkgYXJlIGEgZ29vZCBhcHByb3hpbWF0aW9uXHJcbiAqIGZvciBtYW55IGFyZWFzIG9mIHRoZSB3b3JsZCBhbmQgYXBwZWFyIG5vdCB0byBjYXVzZSB1bmFjY2VwdGFibGUgZGlzdG9ydGlvbnNcclxuICogd2hlbiB1c2VkIGFzIHRoZSB1bml0cyBmb3IgQVIgYXBwcy5cclxuICpcclxuICogVVBEQVRFUyAyOC8wOC8yMDpcclxuICpcclxuICogLSBhZGQgZ3BzTWluRGlzdGFuY2UgYW5kIGdwc1RpbWVJbnRlcnZhbCBwcm9wZXJ0aWVzIHRvIGNvbnRyb2wgaG93XHJcbiAqIGZyZXF1ZW50bHkgR1BTIHVwZGF0ZXMgYXJlIHByb2Nlc3NlZC4gQWltIGlzIHRvIHByZXZlbnQgJ3N0dXR0ZXJpbmcnXHJcbiAqIGVmZmVjdHMgd2hlbiBjbG9zZSB0byBBUiBjb250ZW50IGR1ZSB0byBjb250aW51b3VzIHNtYWxsIGNoYW5nZXMgaW5cclxuICogbG9jYXRpb24uXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1wcm9qZWN0ZWQtY2FtZXJhXCIsIHtcclxuICBfd2F0Y2hQb3NpdGlvbklkOiBudWxsLFxyXG4gIG9yaWdpbkNvb3JkczogbnVsbCwgLy8gb3JpZ2luYWwgY29vcmRzIG5vdyBpbiBTcGhlcmljYWwgTWVyY2F0b3JcclxuICBjdXJyZW50Q29vcmRzOiBudWxsLFxyXG4gIGxvb2tDb250cm9sczogbnVsbCxcclxuICBoZWFkaW5nOiBudWxsLFxyXG4gIHNjaGVtYToge1xyXG4gICAgc2ltdWxhdGVMYXRpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIHNpbXVsYXRlTG9uZ2l0dWRlOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gICAgc2ltdWxhdGVBbHRpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIHBvc2l0aW9uTWluQWNjdXJhY3k6IHtcclxuICAgICAgdHlwZTogXCJpbnRcIixcclxuICAgICAgZGVmYXVsdDogMTAwLFxyXG4gICAgfSxcclxuICAgIGFsZXJ0OiB7XHJcbiAgICAgIHR5cGU6IFwiYm9vbGVhblwiLFxyXG4gICAgICBkZWZhdWx0OiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICBtaW5EaXN0YW5jZToge1xyXG4gICAgICB0eXBlOiBcImludFwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIGdwc01pbkRpc3RhbmNlOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gICAgZ3BzVGltZUludGVydmFsOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgIT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlICE9PSAwKSB7XHJcbiAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5jdXJyZW50Q29vcmRzIHx8IHt9KTtcclxuICAgICAgbG9jYWxQb3NpdGlvbi5sb25naXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGU7XHJcbiAgICAgIGxvY2FsUG9zaXRpb24ubGF0aXR1ZGUgPSB0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZTtcclxuICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMgPSBsb2NhbFBvc2l0aW9uO1xyXG5cclxuICAgICAgLy8gcmUtdHJpZ2dlciBpbml0aWFsaXphdGlvbiBmb3IgbmV3IG9yaWdpblxyXG4gICAgICB0aGlzLm9yaWdpbkNvb3JkcyA9IG51bGw7XHJcbiAgICAgIHRoaXMuX3VwZGF0ZVBvc2l0aW9uKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAoXHJcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWxvb2stY29udHJvbHNcIl0gJiZcclxuICAgICAgIXRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl1cclxuICAgICkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XHJcbiAgICAgIGxhdGl0dWRlOiAwLFxyXG4gICAgICBsb25naXR1ZGU6IDAsXHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMubG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIkRJVlwiKTtcclxuICAgIHRoaXMubG9hZGVyLmNsYXNzTGlzdC5hZGQoXCJhcmpzLWxvYWRlclwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5sb2FkZXIpO1xyXG5cclxuICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkID0gdGhpcy5fb25HcHNFbnRpdHlQbGFjZUFkZGVkLmJpbmQodGhpcyk7XHJcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcclxuICAgICAgXCJncHMtZW50aXR5LXBsYWNlLWFkZGVkXCIsXHJcbiAgICAgIHRoaXMub25HcHNFbnRpdHlQbGFjZUFkZGVkXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMubG9va0NvbnRyb2xzID1cclxuICAgICAgdGhpcy5lbC5jb21wb25lbnRzW1wiYXJqcy1sb29rLWNvbnRyb2xzXCJdIHx8XHJcbiAgICAgIHRoaXMuZWwuY29tcG9uZW50c1tcImxvb2stY29udHJvbHNcIl07XHJcblxyXG4gICAgLy8gbGlzdGVuIHRvIGRldmljZW9yaWVudGF0aW9uIGV2ZW50XHJcbiAgICB2YXIgZXZlbnROYW1lID0gdGhpcy5fZ2V0RGV2aWNlT3JpZW50YXRpb25FdmVudE5hbWUoKTtcclxuICAgIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24gPSB0aGlzLl9vbkRldmljZU9yaWVudGF0aW9uLmJpbmQodGhpcyk7XHJcblxyXG4gICAgLy8gaWYgU2FmYXJpXHJcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcclxuICAgICAgLy8gaU9TIDEzK1xyXG4gICAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIHZhciBoYW5kbGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coXCJSZXF1ZXN0aW5nIGRldmljZSBvcmllbnRhdGlvbiBwZXJtaXNzaW9ucy4uLlwiKTtcclxuICAgICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcclxuICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCBoYW5kbGVyKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgXCJ0b3VjaGVuZFwiLFxyXG4gICAgICAgICAgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBoYW5kbGVyKCk7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZmFsc2VcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxyXG4gICAgICAgICAgXCJBZnRlciBjYW1lcmEgcGVybWlzc2lvbiBwcm9tcHQsIHBsZWFzZSB0YXAgdGhlIHNjcmVlbiB0byBhY3RpdmF0ZSBnZW9sb2NhdGlvbi5cIlxyXG4gICAgICAgICk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIFwiUGxlYXNlIGVuYWJsZSBkZXZpY2Ugb3JpZW50YXRpb24gaW4gU2V0dGluZ3MgPiBTYWZhcmkgPiBNb3Rpb24gJiBPcmllbnRhdGlvbiBBY2Nlc3MuXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSwgNzUwKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgdGhpcy5fb25EZXZpY2VPcmllbnRhdGlvbiwgZmFsc2UpO1xyXG4gIH0sXHJcblxyXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCAmJiB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApIHtcclxuICAgICAgdmFyIGxvY2FsUG9zaXRpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLmN1cnJlbnRDb29yZHMgfHwge30pO1xyXG4gICAgICBsb2NhbFBvc2l0aW9uLmxhdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGU7XHJcbiAgICAgIGxvY2FsUG9zaXRpb24ubG9uZ2l0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlO1xyXG4gICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcclxuICAgICAgICBsb2NhbFBvc2l0aW9uLmFsdGl0dWRlID0gdGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGU7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5jdXJyZW50Q29vcmRzID0gbG9jYWxQb3NpdGlvbjtcclxuICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IHRoaXMuX2luaXRXYXRjaEdQUyhcclxuICAgICAgICBmdW5jdGlvbiAocG9zaXRpb24pIHtcclxuICAgICAgICAgIHZhciBsb2NhbFBvc2l0aW9uID0ge1xyXG4gICAgICAgICAgICBsYXRpdHVkZTogcG9zaXRpb24uY29vcmRzLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICBsb25naXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgIGFsdGl0dWRlOiBwb3NpdGlvbi5jb29yZHMuYWx0aXR1ZGUsXHJcbiAgICAgICAgICAgIGFjY3VyYWN5OiBwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3ksXHJcbiAgICAgICAgICAgIGFsdGl0dWRlQWNjdXJhY3k6IHBvc2l0aW9uLmNvb3Jkcy5hbHRpdHVkZUFjY3VyYWN5LFxyXG4gICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlQWx0aXR1ZGUgIT09IDApIHtcclxuICAgICAgICAgICAgbG9jYWxQb3NpdGlvbi5hbHRpdHVkZSA9IHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIHRoaXMuY3VycmVudENvb3JkcyA9IGxvY2FsUG9zaXRpb247XHJcbiAgICAgICAgICB2YXIgZGlzdE1vdmVkID0gdGhpcy5faGF2ZXJzaW5lRGlzdChcclxuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24sXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudENvb3Jkc1xyXG4gICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuZGF0YS5ncHNNaW5EaXN0YW5jZSB8fCAhdGhpcy5vcmlnaW5Db29yZHMpIHtcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdGhpcy5sYXN0UG9zaXRpb24gPSB7XHJcbiAgICAgICAgICAgICAgbG9uZ2l0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgIGxhdGl0dWRlOiB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKHRoaXMuaGVhZGluZyA9PT0gbnVsbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl91cGRhdGVSb3RhdGlvbigpO1xyXG4gIH0sXHJcblxyXG4gIHBhdXNlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkKSB7XHJcbiAgICAgIG5hdmlnYXRvci5nZW9sb2NhdGlvbi5jbGVhcldhdGNoKHRoaXMuX3dhdGNoUG9zaXRpb25JZCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLl93YXRjaFBvc2l0aW9uSWQgPSBudWxsO1xyXG4gIH0sXHJcblxyXG4gIHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGV2ZW50TmFtZSA9IHRoaXMuX2dldERldmljZU9yaWVudGF0aW9uRXZlbnROYW1lKCk7XHJcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHRoaXMuX29uRGV2aWNlT3JpZW50YXRpb24sIGZhbHNlKTtcclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIixcclxuICAgICAgdGhpcy5vbkdwc0VudGl0eVBsYWNlQWRkZWRcclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IGRldmljZSBvcmllbnRhdGlvbiBldmVudCBuYW1lLCBkZXBlbmRzIG9uIGJyb3dzZXIgaW1wbGVtZW50YXRpb24uXHJcbiAgICogQHJldHVybnMge3N0cmluZ30gZXZlbnQgbmFtZVxyXG4gICAqL1xyXG4gIF9nZXREZXZpY2VPcmllbnRhdGlvbkV2ZW50TmFtZTogZnVuY3Rpb24gKCkge1xyXG4gICAgaWYgKFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93KSB7XHJcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIjtcclxuICAgIH0gZWxzZSBpZiAoXCJvbmRldmljZW9yaWVudGF0aW9uXCIgaW4gd2luZG93KSB7XHJcbiAgICAgIHZhciBldmVudE5hbWUgPSBcImRldmljZW9yaWVudGF0aW9uXCI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgZXZlbnROYW1lID0gXCJcIjtcclxuICAgICAgY29uc29sZS5lcnJvcihcIkNvbXBhc3Mgbm90IHN1cHBvcnRlZFwiKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZXZlbnROYW1lO1xyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEdldCBjdXJyZW50IHVzZXIgcG9zaXRpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvblN1Y2Nlc3NcclxuICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbkVycm9yXHJcbiAgICogQHJldHVybnMge1Byb21pc2V9XHJcbiAgICovXHJcbiAgX2luaXRXYXRjaEdQUzogZnVuY3Rpb24gKG9uU3VjY2Vzcywgb25FcnJvcikge1xyXG4gICAgaWYgKCFvbkVycm9yKSB7XHJcbiAgICAgIG9uRXJyb3IgPSBmdW5jdGlvbiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKFwiRVJST1IoXCIgKyBlcnIuY29kZSArIFwiKTogXCIgKyBlcnIubWVzc2FnZSk7XHJcblxyXG4gICAgICAgIGlmIChlcnIuY29kZSA9PT0gMSkge1xyXG4gICAgICAgICAgLy8gVXNlciBkZW5pZWQgR2VvTG9jYXRpb24sIGxldCB0aGVpciBrbm93IHRoYXRcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIFwiUGxlYXNlIGFjdGl2YXRlIEdlb2xvY2F0aW9uIGFuZCByZWZyZXNoIHRoZSBwYWdlLiBJZiBpdCBpcyBhbHJlYWR5IGFjdGl2ZSwgcGxlYXNlIGNoZWNrIHBlcm1pc3Npb25zIGZvciB0aGlzIHdlYnNpdGUuXCJcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXJyLmNvZGUgPT09IDMpIHtcclxuICAgICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICAgIFwiQ2Fubm90IHJldHJpZXZlIEdQUyBwb3NpdGlvbi4gU2lnbmFsIGlzIGFic2VudC5cIlxyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKFwiZ2VvbG9jYXRpb25cIiBpbiBuYXZpZ2F0b3IgPT09IGZhbHNlKSB7XHJcbiAgICAgIG9uRXJyb3Ioe1xyXG4gICAgICAgIGNvZGU6IDAsXHJcbiAgICAgICAgbWVzc2FnZTogXCJHZW9sb2NhdGlvbiBpcyBub3Qgc3VwcG9ydGVkIGJ5IHlvdXIgYnJvd3NlclwiLFxyXG4gICAgICB9KTtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HZW9sb2NhdGlvbi93YXRjaFBvc2l0aW9uXHJcbiAgICByZXR1cm4gbmF2aWdhdG9yLmdlb2xvY2F0aW9uLndhdGNoUG9zaXRpb24ob25TdWNjZXNzLCBvbkVycm9yLCB7XHJcbiAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSxcclxuICAgICAgbWF4aW11bUFnZTogdGhpcy5kYXRhLmdwc1RpbWVJbnRlcnZhbCxcclxuICAgICAgdGltZW91dDogMjcwMDAsXHJcbiAgICB9KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgdXNlciBwb3NpdGlvbi5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqL1xyXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgLy8gZG9uJ3QgdXBkYXRlIGlmIGFjY3VyYWN5IGlzIG5vdCBnb29kIGVub3VnaFxyXG4gICAgaWYgKHRoaXMuY3VycmVudENvb3Jkcy5hY2N1cmFjeSA+IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5KSB7XHJcbiAgICAgIGlmICh0aGlzLmRhdGEuYWxlcnQgJiYgIWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYWxlcnQtcG9wdXBcIikpIHtcclxuICAgICAgICB2YXIgcG9wdXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIHBvcHVwLmlubmVySFRNTCA9XHJcbiAgICAgICAgICBcIkdQUyBzaWduYWwgaXMgdmVyeSBwb29yLiBUcnkgbW92ZSBvdXRkb29yIG9yIHRvIGFuIGFyZWEgd2l0aCBhIGJldHRlciBzaWduYWwuXCI7XHJcbiAgICAgICAgcG9wdXAuc2V0QXR0cmlidXRlKFwiaWRcIiwgXCJhbGVydC1wb3B1cFwiKTtcclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHBvcHVwKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFsZXJ0UG9wdXAgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImFsZXJ0LXBvcHVwXCIpO1xyXG4gICAgaWYgKFxyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5kYXRhLnBvc2l0aW9uTWluQWNjdXJhY3kgJiZcclxuICAgICAgYWxlcnRQb3B1cFxyXG4gICAgKSB7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYWxlcnRQb3B1cCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLm9yaWdpbkNvb3Jkcykge1xyXG4gICAgICAvLyBmaXJzdCBjYW1lcmEgaW5pdGlhbGl6YXRpb25cclxuICAgICAgLy8gTm93IHN0b3JlIG9yaWdpbkNvb3JkcyBhcyBQUk9KRUNURUQgb3JpZ2luYWwgbGF0L2xvbiwgc28gdGhhdFxyXG4gICAgICAvLyB3ZSBjYW4gc2V0IHRoZSB3b3JsZCBvcmlnaW4gdG8gdGhlIG9yaWdpbmFsIHBvc2l0aW9uIGluIFwibWV0cmVzXCJcclxuICAgICAgdGhpcy5vcmlnaW5Db29yZHMgPSB0aGlzLl9wcm9qZWN0KFxyXG4gICAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICB0aGlzLmN1cnJlbnRDb29yZHMubG9uZ2l0dWRlXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuX3NldFBvc2l0aW9uKCk7XHJcblxyXG4gICAgICB2YXIgbG9hZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5hcmpzLWxvYWRlclwiKTtcclxuICAgICAgaWYgKGxvYWRlcikge1xyXG4gICAgICAgIGxvYWRlci5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLW9yaWdpbi1jb29yZC1zZXRcIikpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2V0UG9zaXRpb24oKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldCB0aGUgY3VycmVudCBwb3NpdGlvbiAoaW4gd29ybGQgY29vcmRzLCBiYXNlZCBvbiBTcGhlcmljYWwgTWVyY2F0b3IpXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7dm9pZH1cclxuICAgKi9cclxuICBfc2V0UG9zaXRpb246IGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XHJcblxyXG4gICAgdmFyIHdvcmxkQ29vcmRzID0gdGhpcy5sYXRMb25Ub1dvcmxkKFxyXG4gICAgICB0aGlzLmN1cnJlbnRDb29yZHMubGF0aXR1ZGUsXHJcbiAgICAgIHRoaXMuY3VycmVudENvb3Jkcy5sb25naXR1ZGVcclxuICAgICk7XHJcblxyXG4gICAgcG9zaXRpb24ueCA9IHdvcmxkQ29vcmRzWzBdO1xyXG4gICAgcG9zaXRpb24ueiA9IHdvcmxkQ29vcmRzWzFdO1xyXG5cclxuICAgIC8vIHVwZGF0ZSBwb3NpdGlvblxyXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiLCBwb3NpdGlvbik7XHJcblxyXG4gICAgLy8gYWRkIHRoZSBzcGhtZXJjIHBvc2l0aW9uIHRvIHRoZSBldmVudCAoZm9yIHRlc3Rpbmcgb25seSlcclxuICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICBuZXcgQ3VzdG9tRXZlbnQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XHJcbiAgICAgICAgZGV0YWlsOiB7IHBvc2l0aW9uOiB0aGlzLmN1cnJlbnRDb29yZHMsIG9yaWdpbjogdGhpcy5vcmlnaW5Db29yZHMgfSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGRpc3RhbmNlIGluIG1ldGVycyBiZXR3ZWVuIGNhbWVyYSBhbmQgZGVzdGluYXRpb24gaW5wdXQuXHJcbiAgICpcclxuICAgKiBBc3N1bWUgd2UgYXJlIHVzaW5nIGEgbWV0cmUtYmFzZWQgcHJvamVjdGlvbi4gTm90IGFsbCAnbWV0cmUtYmFzZWQnXHJcbiAgICogcHJvamVjdGlvbnMgZ2l2ZSBleGFjdCBtZXRyZXMsIGUuZy4gU3BoZXJpY2FsIE1lcmNhdG9yLCBidXQgaXQgYXBwZWFyc1xyXG4gICAqIGNsb3NlIGVub3VnaCB0byBiZSB1c2VkIGZvciBBUiBhdCBsZWFzdCBpbiBtaWRkbGUgdGVtcGVyYXRlXHJcbiAgICogbGF0aXR1ZGVzICg0MCAtIDU1KS4gSXQgaXMgaGVhdmlseSBkaXN0b3J0ZWQgbmVhciB0aGUgcG9sZXMsIGhvd2V2ZXIuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1Bvc2l0aW9ufSBkZXN0XHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpc1BsYWNlXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7bnVtYmVyfSBkaXN0YW5jZSB8IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgICovXHJcbiAgY29tcHV0ZURpc3RhbmNlTWV0ZXJzOiBmdW5jdGlvbiAoZGVzdCwgaXNQbGFjZSkge1xyXG4gICAgdmFyIHNyYyA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XHJcbiAgICB2YXIgZHggPSBkZXN0LnggLSBzcmMueDtcclxuICAgIHZhciBkeiA9IGRlc3QueiAtIHNyYy56O1xyXG4gICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeiAqIGR6KTtcclxuXHJcbiAgICAvLyBpZiBmdW5jdGlvbiBoYXMgYmVlbiBjYWxsZWQgZm9yIGEgcGxhY2UsIGFuZCBpZiBpdCdzIHRvbyBuZWFyIGFuZCBhIG1pbiBkaXN0YW5jZSBoYXMgYmVlbiBzZXQsXHJcbiAgICAvLyByZXR1cm4gbWF4IGRpc3RhbmNlIHBvc3NpYmxlIC0gdG8gYmUgaGFuZGxlZCBieSB0aGUgIG1ldGhvZCBjYWxsZXJcclxuICAgIGlmIChcclxuICAgICAgaXNQbGFjZSAmJlxyXG4gICAgICB0aGlzLmRhdGEubWluRGlzdGFuY2UgJiZcclxuICAgICAgdGhpcy5kYXRhLm1pbkRpc3RhbmNlID4gMCAmJlxyXG4gICAgICBkaXN0YW5jZSA8IHRoaXMuZGF0YS5taW5EaXN0YW5jZVxyXG4gICAgKSB7XHJcbiAgICAgIHJldHVybiBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGlzdGFuY2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gT3BlbkdMIHdvcmxkIGNvb3JkaW5hdGVzLlxyXG4gICAqXHJcbiAgICogRmlyc3QgcHJvamVjdHMgbGF0L2xvbiB0byBhYnNvbHV0ZSBTcGhlcmljYWwgTWVyY2F0b3IgYW5kIHRoZW5cclxuICAgKiBjYWxjdWxhdGVzIHRoZSB3b3JsZCBjb29yZGluYXRlcyBieSBjb21wYXJpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvclxyXG4gICAqIGNvb3JkaW5hdGVzIHdpdGggdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlcyBvZiB0aGUgb3JpZ2luIHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGxhdFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsb25cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHthcnJheX0gd29ybGQgY29vcmRpbmF0ZXNcclxuICAgKi9cclxuICBsYXRMb25Ub1dvcmxkOiBmdW5jdGlvbiAobGF0LCBsb24pIHtcclxuICAgIHZhciBwcm9qZWN0ZWQgPSB0aGlzLl9wcm9qZWN0KGxhdCwgbG9uKTtcclxuICAgIC8vIFNpZ24gb2YgeiBuZWVkcyB0byBiZSByZXZlcnNlZCBjb21wYXJlZCB0byBwcm9qZWN0ZWQgY29vcmRpbmF0ZXNcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHByb2plY3RlZFswXSAtIHRoaXMub3JpZ2luQ29vcmRzWzBdLFxyXG4gICAgICAtKHByb2plY3RlZFsxXSAtIHRoaXMub3JpZ2luQ29vcmRzWzFdKSxcclxuICAgIF07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDb252ZXJ0cyBsYXRpdHVkZS9sb25naXR1ZGUgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkaW5hdGVzLlxyXG4gICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBsYXRcclxuICAgKiBAcGFyYW0ge051bWJlcn0gbG9uXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyB7YXJyYXl9IFNwaGVyaWNhbCBNZXJjYXRvciBjb29yZGluYXRlc1xyXG4gICAqL1xyXG4gIF9wcm9qZWN0OiBmdW5jdGlvbiAobGF0LCBsb24pIHtcclxuICAgIGNvbnN0IEhBTEZfRUFSVEggPSAyMDAzNzUwOC4zNDtcclxuXHJcbiAgICAvLyBDb252ZXJ0IHRoZSBzdXBwbGllZCBjb29yZHMgdG8gU3BoZXJpY2FsIE1lcmNhdG9yIChFUFNHOjM4NTcpLCBhbHNvXHJcbiAgICAvLyBrbm93biBhcyAnR29vZ2xlIFByb2plY3Rpb24nLCB1c2luZyB0aGUgYWxnb3JpdGhtIHVzZWQgZXh0ZW5zaXZlbHlcclxuICAgIC8vIGluIHZhcmlvdXMgT3BlblN0cmVldE1hcCBzb2Z0d2FyZS5cclxuICAgIHZhciB5ID1cclxuICAgICAgTWF0aC5sb2coTWF0aC50YW4oKCg5MCArIGxhdCkgKiBNYXRoLlBJKSAvIDM2MC4wKSkgLyAoTWF0aC5QSSAvIDE4MC4wKTtcclxuICAgIHJldHVybiBbKGxvbiAvIDE4MC4wKSAqIEhBTEZfRUFSVEgsICh5ICogSEFMRl9FQVJUSCkgLyAxODAuMF07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDb252ZXJ0cyBTcGhlcmljYWwgTWVyY2F0b3IgY29vcmRpbmF0ZXMgdG8gbGF0aXR1ZGUvbG9uZ2l0dWRlLlxyXG4gICAqIEFsZ29yaXRobSBpcyB1c2VkIGluIHNldmVyYWwgT3BlblN0cmVldE1hcC1yZWxhdGVkIGFwcGxpY2F0aW9ucy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3IgZWFzdGluZ1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzcGhlcmljYWwgbWVyY2F0b3Igbm9ydGhpbmdcclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHtvYmplY3R9IGxvbi9sYXRcclxuICAgKi9cclxuICBfdW5wcm9qZWN0OiBmdW5jdGlvbiAoZSwgbikge1xyXG4gICAgY29uc3QgSEFMRl9FQVJUSCA9IDIwMDM3NTA4LjM0O1xyXG4gICAgdmFyIHlwID0gKG4gLyBIQUxGX0VBUlRIKSAqIDE4MC4wO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbG9uZ2l0dWRlOiAoZSAvIEhBTEZfRUFSVEgpICogMTgwLjAsXHJcbiAgICAgIGxhdGl0dWRlOlxyXG4gICAgICAgICgxODAuMCAvIE1hdGguUEkpICpcclxuICAgICAgICAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCgoeXAgKiBNYXRoLlBJKSAvIDE4MC4wKSkgLSBNYXRoLlBJIC8gMiksXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ29tcHV0ZSBjb21wYXNzIGhlYWRpbmcuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge251bWJlcn0gYWxwaGFcclxuICAgKiBAcGFyYW0ge251bWJlcn0gYmV0YVxyXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBnYW1tYVxyXG4gICAqXHJcbiAgICogQHJldHVybnMge251bWJlcn0gY29tcGFzcyBoZWFkaW5nXHJcbiAgICovXHJcbiAgX2NvbXB1dGVDb21wYXNzSGVhZGluZzogZnVuY3Rpb24gKGFscGhhLCBiZXRhLCBnYW1tYSkge1xyXG4gICAgLy8gQ29udmVydCBkZWdyZWVzIHRvIHJhZGlhbnNcclxuICAgIHZhciBhbHBoYVJhZCA9IGFscGhhICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgdmFyIGJldGFSYWQgPSBiZXRhICogKE1hdGguUEkgLyAxODApO1xyXG4gICAgdmFyIGdhbW1hUmFkID0gZ2FtbWEgKiAoTWF0aC5QSSAvIDE4MCk7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGVxdWF0aW9uIGNvbXBvbmVudHNcclxuICAgIHZhciBjQSA9IE1hdGguY29zKGFscGhhUmFkKTtcclxuICAgIHZhciBzQSA9IE1hdGguc2luKGFscGhhUmFkKTtcclxuICAgIHZhciBzQiA9IE1hdGguc2luKGJldGFSYWQpO1xyXG4gICAgdmFyIGNHID0gTWF0aC5jb3MoZ2FtbWFSYWQpO1xyXG4gICAgdmFyIHNHID0gTWF0aC5zaW4oZ2FtbWFSYWQpO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBBLCBCLCBDIHJvdGF0aW9uIGNvbXBvbmVudHNcclxuICAgIHZhciByQSA9IC1jQSAqIHNHIC0gc0EgKiBzQiAqIGNHO1xyXG4gICAgdmFyIHJCID0gLXNBICogc0cgKyBjQSAqIHNCICogY0c7XHJcblxyXG4gICAgLy8gQ2FsY3VsYXRlIGNvbXBhc3MgaGVhZGluZ1xyXG4gICAgdmFyIGNvbXBhc3NIZWFkaW5nID0gTWF0aC5hdGFuKHJBIC8gckIpO1xyXG5cclxuICAgIC8vIENvbnZlcnQgZnJvbSBoYWxmIHVuaXQgY2lyY2xlIHRvIHdob2xlIHVuaXQgY2lyY2xlXHJcbiAgICBpZiAockIgPCAwKSB7XHJcbiAgICAgIGNvbXBhc3NIZWFkaW5nICs9IE1hdGguUEk7XHJcbiAgICB9IGVsc2UgaWYgKHJBIDwgMCkge1xyXG4gICAgICBjb21wYXNzSGVhZGluZyArPSAyICogTWF0aC5QSTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBDb252ZXJ0IHJhZGlhbnMgdG8gZGVncmVlc1xyXG4gICAgY29tcGFzc0hlYWRpbmcgKj0gMTgwIC8gTWF0aC5QSTtcclxuXHJcbiAgICByZXR1cm4gY29tcGFzc0hlYWRpbmc7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgZGV2aWNlIG9yaWVudGF0aW9uIGV2ZW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZlbnRcclxuICAgKiBAcmV0dXJucyB7dm9pZH1cclxuICAgKi9cclxuICBfb25EZXZpY2VPcmllbnRhdGlvbjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0hlYWRpbmcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAoZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5IDwgNTApIHtcclxuICAgICAgICB0aGlzLmhlYWRpbmcgPSBldmVudC53ZWJraXRDb21wYXNzSGVhZGluZztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBjb25zb2xlLndhcm4oXCJ3ZWJraXRDb21wYXNzQWNjdXJhY3kgaXMgZXZlbnQud2Via2l0Q29tcGFzc0FjY3VyYWN5XCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGV2ZW50LmFscGhhICE9PSBudWxsKSB7XHJcbiAgICAgIGlmIChldmVudC5hYnNvbHV0ZSA9PT0gdHJ1ZSB8fCBldmVudC5hYnNvbHV0ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy5oZWFkaW5nID0gdGhpcy5fY29tcHV0ZUNvbXBhc3NIZWFkaW5nKFxyXG4gICAgICAgICAgZXZlbnQuYWxwaGEsXHJcbiAgICAgICAgICBldmVudC5iZXRhLFxyXG4gICAgICAgICAgZXZlbnQuZ2FtbWFcclxuICAgICAgICApO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihcImV2ZW50LmFic29sdXRlID09PSBmYWxzZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc29sZS53YXJuKFwiZXZlbnQuYWxwaGEgPT09IG51bGxcIik7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogVXBkYXRlIHVzZXIgcm90YXRpb24gZGF0YS5cclxuICAgKlxyXG4gICAqIEByZXR1cm5zIHt2b2lkfVxyXG4gICAqL1xyXG4gIF91cGRhdGVSb3RhdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGhlYWRpbmcgPSAzNjAgLSB0aGlzLmhlYWRpbmc7XHJcbiAgICB2YXIgY2FtZXJhUm90YXRpb24gPSB0aGlzLmVsLmdldEF0dHJpYnV0ZShcInJvdGF0aW9uXCIpLnk7XHJcbiAgICB2YXIgeWF3Um90YXRpb24gPSBUSFJFRS5NYXRoLnJhZFRvRGVnKFxyXG4gICAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueVxyXG4gICAgKTtcclxuICAgIHZhciBvZmZzZXQgPSAoaGVhZGluZyAtIChjYW1lcmFSb3RhdGlvbiAtIHlhd1JvdGF0aW9uKSkgJSAzNjA7XHJcbiAgICB0aGlzLmxvb2tDb250cm9scy55YXdPYmplY3Qucm90YXRpb24ueSA9IFRIUkVFLk1hdGguZGVnVG9SYWQob2Zmc2V0KTtcclxuICB9LFxyXG5cclxuICAvKipcclxuICAgKiBDYWxjdWxhdGUgaGF2ZXJzaW5lIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdC9sb24gcGFpcnMuXHJcbiAgICpcclxuICAgKiBUYWtlbiBmcm9tIGdwcy1jYW1lcmFcclxuICAgKi9cclxuICBfaGF2ZXJzaW5lRGlzdDogZnVuY3Rpb24gKHNyYywgZGVzdCkge1xyXG4gICAgdmFyIGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XHJcbiAgICB2YXIgZGxhdGl0dWRlID0gVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlIC0gc3JjLmxhdGl0dWRlKTtcclxuXHJcbiAgICB2YXIgYSA9XHJcbiAgICAgIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICogTWF0aC5zaW4oZGxhdGl0dWRlIC8gMikgK1xyXG4gICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKHNyYy5sYXRpdHVkZSkpICpcclxuICAgICAgICBNYXRoLmNvcyhUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUpKSAqXHJcbiAgICAgICAgKE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsb25naXR1ZGUgLyAyKSk7XHJcbiAgICB2YXIgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xyXG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcclxuICB9LFxyXG5cclxuICBfb25HcHNFbnRpdHlQbGFjZUFkZGVkOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBpZiBwbGFjZXMgYXJlIGFkZGVkIGFmdGVyIGNhbWVyYSBpbml0aWFsaXphdGlvbiBpcyBmaW5pc2hlZFxyXG4gICAgaWYgKHRoaXMub3JpZ2luQ29vcmRzKSB7XHJcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChcImdwcy1jYW1lcmEtb3JpZ2luLWNvb3JkLXNldFwiKSk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5sb2FkZXIgJiYgdGhpcy5sb2FkZXIucGFyZW50RWxlbWVudCkge1xyXG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMubG9hZGVyKTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuIiwiLyoqIGdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXHJcbiAqXHJcbiAqIGJhc2VkIG9uIHRoZSBvcmlnaW5hbCBncHMtZW50aXR5LXBsYWNlLCBtb2RpZmllZCBieSBuaWNrdyAwMi8wNC8yMFxyXG4gKlxyXG4gKiBSYXRoZXIgdGhhbiBrZWVwaW5nIHRyYWNrIG9mIHBvc2l0aW9uIGJ5IGNhbGN1bGF0aW5nIHRoZSBkaXN0YW5jZSBvZlxyXG4gKiBlbnRpdGllcyBvciB0aGUgY3VycmVudCBsb2NhdGlvbiB0byB0aGUgb3JpZ2luYWwgbG9jYXRpb24sIHRoaXMgdmVyc2lvblxyXG4gKiBtYWtlcyB1c2Ugb2YgdGhlIFwiR29vZ2xlXCIgU3BoZXJpY2FsIE1lcmNhY3RvciBwcm9qZWN0aW9uLCBha2EgZXBzZzozODU3LlxyXG4gKlxyXG4gKiBUaGUgb3JpZ2luYWwgbG9jYXRpb24gb24gc3RhcnR1cCAobGF0L2xvbikgaXMgcHJvamVjdGVkIGludG8gU3BoZXJpY2FsXHJcbiAqIE1lcmNhdG9yIGFuZCBzdG9yZWQuXHJcbiAqXHJcbiAqIFdoZW4gJ2VudGl0eS1wbGFjZXMnIGFyZSBhZGRlZCwgdGhlaXIgU3BoZXJpY2FsIE1lcmNhdG9yIGNvb3JkcyBhcmVcclxuICogY2FsY3VsYXRlZCBhbmQgY29udmVydGVkIGludG8gd29ybGQgY29vcmRpbmF0ZXMsIHJlbGF0aXZlIHRvIHRoZSBvcmlnaW5hbFxyXG4gKiBwb3NpdGlvbiwgdXNpbmcgdGhlIFNwaGVyaWNhbCBNZXJjYXRvciBwcm9qZWN0aW9uIGNhbGN1bGF0aW9uIGluXHJcbiAqIGdwcy1wcm9qZWN0ZWQtY2FtZXJhLlxyXG4gKlxyXG4gKiBTcGhlcmljYWwgTWVyY2F0b3IgdW5pdHMgYXJlIGNsb3NlIHRvLCBidXQgbm90IGV4YWN0bHksIG1ldHJlcywgYW5kIGFyZVxyXG4gKiBoZWF2aWx5IGRpc3RvcnRlZCBuZWFyIHRoZSBwb2xlcy4gTm9uZXRoZWxlc3MgdGhleSBhcmUgYSBnb29kIGFwcHJveGltYXRpb25cclxuICogZm9yIG1hbnkgYXJlYXMgb2YgdGhlIHdvcmxkIGFuZCBhcHBlYXIgbm90IHRvIGNhdXNlIHVuYWNjZXB0YWJsZSBkaXN0b3J0aW9uc1xyXG4gKiB3aGVuIHVzZWQgYXMgdGhlIHVuaXRzIGZvciBBUiBhcHBzLlxyXG4gKi9cclxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1wcm9qZWN0ZWQtZW50aXR5LXBsYWNlXCIsIHtcclxuICBfY2FtZXJhR3BzOiBudWxsLFxyXG4gIHNjaGVtYToge1xyXG4gICAgbG9uZ2l0dWRlOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDAsXHJcbiAgICB9LFxyXG4gICAgbGF0aXR1ZGU6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgIH0sXHJcbiAgfSxcclxuICByZW1vdmU6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIGNsZWFuaW5nIGxpc3RlbmVycyB3aGVuIHRoZSBlbnRpdHkgaXMgcmVtb3ZlZCBmcm9tIHRoZSBET01cclxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXHJcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxyXG4gICAgKTtcclxuICB9LFxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIC8vIFVzZWQgbm93IHRvIGdldCB0aGUgR1BTIGNhbWVyYSB3aGVuIGl0J3MgYmVlbiBzZXR1cFxyXG4gICAgdGhpcy5jb29yZFNldExpc3RlbmVyID0gKCkgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuX2NhbWVyYUdwcykge1xyXG4gICAgICAgIHZhciBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1wcm9qZWN0ZWQtY2FtZXJhXVwiKTtcclxuICAgICAgICBpZiAoIWNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLXByb2plY3RlZC1jYW1lcmFcIl0pIHtcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJncHMtcHJvamVjdGVkLWNhbWVyYSBub3QgaW5pdGlhbGl6ZWRcIik7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuX2NhbWVyYUdwcyA9IGNhbWVyYS5jb21wb25lbnRzW1wiZ3BzLXByb2plY3RlZC1jYW1lcmFcIl07XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlUG9zaXRpb24oKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyB1cGRhdGUgcG9zaXRpb24gbmVlZHMgdG8gd29ycnkgYWJvdXQgZGlzdGFuY2UgYnV0IG5vdGhpbmcgZWxzZT9cclxuICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lciA9IChldikgPT4ge1xyXG4gICAgICBpZiAoIXRoaXMuZGF0YSB8fCAhdGhpcy5fY2FtZXJhR3BzKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgZHN0Q29vcmRzID0gdGhpcy5lbC5nZXRBdHRyaWJ1dGUoXCJwb3NpdGlvblwiKTtcclxuXHJcbiAgICAgIC8vIGl0J3MgYWN0dWFsbHkgYSAnZGlzdGFuY2UgcGxhY2UnLCBidXQgd2UgZG9uJ3QgY2FsbCBpdCB3aXRoIGxhc3QgcGFyYW0sIGJlY2F1c2Ugd2Ugd2FudCB0byByZXRyaWV2ZSBkaXN0YW5jZSBldmVuIGlmIGl0J3MgPCBtaW5EaXN0YW5jZSBwcm9wZXJ0eVxyXG4gICAgICAvLyBfY29tcHV0ZURpc3RhbmNlTWV0ZXJzIGlzIG5vdyBnb2luZyB0byB1c2UgdGhlIHByb2plY3RlZFxyXG4gICAgICB2YXIgZGlzdGFuY2VGb3JNc2cgPSB0aGlzLl9jYW1lcmFHcHMuY29tcHV0ZURpc3RhbmNlTWV0ZXJzKGRzdENvb3Jkcyk7XHJcblxyXG4gICAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcImRpc3RhbmNlXCIsIGRpc3RhbmNlRm9yTXNnKTtcclxuICAgICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJkaXN0YW5jZU1zZ1wiLCB0aGlzLl9mb3JtYXREaXN0YW5jZShkaXN0YW5jZUZvck1zZykpO1xyXG5cclxuICAgICAgdGhpcy5lbC5kaXNwYXRjaEV2ZW50KFxyXG4gICAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtdXBkYXRlLXBvc2l0aW9uXCIsIHtcclxuICAgICAgICAgIGRldGFpbDogeyBkaXN0YW5jZTogZGlzdGFuY2VGb3JNc2cgfSxcclxuICAgICAgICB9KVxyXG4gICAgICApO1xyXG5cclxuICAgICAgdmFyIGFjdHVhbERpc3RhbmNlID0gdGhpcy5fY2FtZXJhR3BzLmNvbXB1dGVEaXN0YW5jZU1ldGVycyhcclxuICAgICAgICBkc3RDb29yZHMsXHJcbiAgICAgICAgdHJ1ZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKGFjdHVhbERpc3RhbmNlID09PSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUikge1xyXG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuaGlkZUZvck1pbkRpc3RhbmNlKHRoaXMuZWwsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICAvLyBSZXRhaW4gYXMgdGhpcyBldmVudCBpcyBmaXJlZCB3aGVuIHRoZSBHUFMgY2FtZXJhIGlzIHNldCB1cFxyXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgIFwiZ3BzLWNhbWVyYS1vcmlnaW4tY29vcmQtc2V0XCIsXHJcbiAgICAgIHRoaXMuY29vcmRTZXRMaXN0ZW5lclxyXG4gICAgKTtcclxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBcImdwcy1jYW1lcmEtdXBkYXRlLXBvc2l0aW9uXCIsXHJcbiAgICAgIHRoaXMudXBkYXRlUG9zaXRpb25MaXN0ZW5lclxyXG4gICAgKTtcclxuXHJcbiAgICB0aGlzLl9wb3NpdGlvblhEZWJ1ZyA9IDA7XHJcblxyXG4gICAgd2luZG93LmRpc3BhdGNoRXZlbnQoXHJcbiAgICAgIG5ldyBDdXN0b21FdmVudChcImdwcy1lbnRpdHktcGxhY2UtYWRkZWRcIiwge1xyXG4gICAgICAgIGRldGFpbDogeyBjb21wb25lbnQ6IHRoaXMuZWwgfSxcclxuICAgICAgfSlcclxuICAgICk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIaWRlIGVudGl0eSBhY2NvcmRpbmcgdG8gbWluRGlzdGFuY2UgcHJvcGVydHlcclxuICAgKiBAcmV0dXJucyB7dm9pZH1cclxuICAgKi9cclxuICBoaWRlRm9yTWluRGlzdGFuY2U6IGZ1bmN0aW9uIChlbCwgaGlkZUVudGl0eSkge1xyXG4gICAgaWYgKGhpZGVFbnRpdHkpIHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcImZhbHNlXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmlzaWJsZVwiLCBcInRydWVcIik7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBVcGRhdGUgcGxhY2UgcG9zaXRpb25cclxuICAgKiBAcmV0dXJucyB7dm9pZH1cclxuICAgKi9cclxuXHJcbiAgLy8gc2V0IHBvc2l0aW9uIHRvIHdvcmxkIGNvb3JkcyB1c2luZyB0aGUgbGF0L2xvblxyXG4gIF91cGRhdGVQb3NpdGlvbjogZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIHdvcmxkUG9zID0gdGhpcy5fY2FtZXJhR3BzLmxhdExvblRvV29ybGQoXHJcbiAgICAgIHRoaXMuZGF0YS5sYXRpdHVkZSxcclxuICAgICAgdGhpcy5kYXRhLmxvbmdpdHVkZVxyXG4gICAgKTtcclxuICAgIHZhciBwb3NpdGlvbiA9IHRoaXMuZWwuZ2V0QXR0cmlidXRlKFwicG9zaXRpb25cIik7XHJcblxyXG4gICAgLy8gdXBkYXRlIGVsZW1lbnQncyBwb3NpdGlvbiBpbiAzRCB3b3JsZFxyXG4gICAgLy90aGlzLmVsLnNldEF0dHJpYnV0ZSgncG9zaXRpb24nLCBwb3NpdGlvbik7XHJcbiAgICB0aGlzLmVsLnNldEF0dHJpYnV0ZShcInBvc2l0aW9uXCIsIHtcclxuICAgICAgeDogd29ybGRQb3NbMF0sXHJcbiAgICAgIHk6IHBvc2l0aW9uLnksXHJcbiAgICAgIHo6IHdvcmxkUG9zWzFdLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0IGRpc3RhbmNlcyBzdHJpbmdcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkaXN0YW5jZVxyXG4gICAqL1xyXG5cclxuICBfZm9ybWF0RGlzdGFuY2U6IGZ1bmN0aW9uIChkaXN0YW5jZSkge1xyXG4gICAgZGlzdGFuY2UgPSBkaXN0YW5jZS50b0ZpeGVkKDApO1xyXG5cclxuICAgIGlmIChkaXN0YW5jZSA+PSAxMDAwKSB7XHJcbiAgICAgIHJldHVybiBkaXN0YW5jZSAvIDEwMDAgKyBcIiBraWxvbWV0ZXJzXCI7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRpc3RhbmNlICsgXCIgbWV0ZXJzXCI7XHJcbiAgfSxcclxufSk7XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9hZnJhbWVfXzsiLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfdGhyZWVfXzsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IFwiLi9hcmpzLWxvb2stY29udHJvbHNcIjtcclxuaW1wb3J0IFwiLi9hcmpzLXdlYmNhbS10ZXh0dXJlXCI7XHJcbmltcG9ydCBcIi4vQXJqc0RldmljZU9yaWVudGF0aW9uQ29udHJvbHNcIjtcclxuaW1wb3J0IFwiLi9ncHMtY2FtZXJhXCI7XHJcbmltcG9ydCBcIi4vZ3BzLWVudGl0eS1wbGFjZVwiO1xyXG5pbXBvcnQgXCIuL2dwcy1wcm9qZWN0ZWQtY2FtZXJhXCI7XHJcbmltcG9ydCBcIi4vZ3BzLXByb2plY3RlZC1lbnRpdHktcGxhY2VcIjtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9