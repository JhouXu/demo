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

/***/ "./aframe/src/new-location-based/arjs-device-orientation-controls.js":
/*!***************************************************************************!*\
  !*** ./aframe/src/new-location-based/arjs-device-orientation-controls.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);
/**
 * arjs-device-orientation-controls
 *
 * Replaces the standard look-controls component to provide mobile device
 * orientation controls.
 *
 * A lightweight A-Frame wrapper round the modified three.js
 * DeviceOrientationControls used in the three.js location-based API.
 *
 * Creates the THREE object using using the three.js camera, and allows update
 * of the smoothing factor.
 */


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("arjs-device-orientation-controls", {
  schema: {
    smoothingFactor: {
      type: "number",
      default: 1,
    },
  },

  init: function () {
    this._orientationControls = new THREEx.DeviceOrientationControls(
      this.el.object3D
    );
  },

  update: function () {
    this._orientationControls.smoothingFactor = this.data.smoothingFactor;
  },

  tick: function () {
    this._orientationControls.update();
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-camera.js":
/*!*********************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-camera.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-camera", {
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
      default: -Number.MAX_VALUE,
    },
    gpsMinDistance: {
      type: "number",
      default: 0,
    },
    positionMinAccuracy: {
      type: "number",
      default: 1000,
    },
  },

  init: function () {
    this._testForOrientationControls();

    this.threeLoc = new THREEx.LocationBased(
      this.el.sceneEl.object3D,
      this.el.object3D
    );

    this.threeLoc.on("gpsupdate", (gpspos) => {
      this._sendGpsUpdateEvent(gpspos.coords.longitude, gpspos.coords.latitude);
    });

    this.threeLoc.on("gpserror", (code) => {
      const msg = [
        "User denied access to GPS.",
        "GPS satellites not available.",
        "Timeout communicating with GPS satellites - try moving to a more open area.",
      ];
      if (code >= 1 && code <= 3) {
        this._displayError(msg[code - 1]);
      } else {
        this._displayError(`Unknown geolocation error code ${code}.`);
      }
    });

    // Use arjs-device-orientation-controls on mobile only, with standard
    // look-controls disabled (this interferes with the readings from the
    // sensors). On desktop, use standard look-controls instead.

    const mobile = this._isMobile();
    this.el.setAttribute("look-controls-enabled", !mobile);
    if (mobile) {
      this.el.setAttribute("arjs-device-orientation-controls", true);
    }

    // from original gps-camera component
    // if Safari
    if (!!navigator.userAgent.match(/Version\/[\d.]+.*Safari/)) {
      this._setupSafariOrientationPermissions();
    }
  },

  update: function (oldData) {
    this.threeLoc.setGpsOptions({
      gpsMinAccuracy: this.data.positionMinAccuracy,
      gpsMinDistance: this.data.gpsMinDistance,
    });
    if (
      (this.data.simulateLatitude !== 0 || this.data.simulateLongitude !== 0) &&
      (this.data.simulateLatitude != oldData.simulateLatitude ||
        this.data.simulateLongitude != oldData.simulateLongitude)
    ) {
      this.threeLoc.fakeGps(
        this.data.simulateLongitude,
        this.data.simulateLatitude
      );
      this.data.simulateLatitude = 0;
      this.data.simulateLongitude = 0;
    }
    if (this.data.simulateAltitude > -Number.MAX_VALUE) {
      this.threeLoc.setElevation(this.data.simulateAltitude + 1.6);
    }
  },

  play: function () {
    if (this.data.simulateLatitude === 0 && this.data.simulateLongitude === 0) {
      this.threeLoc.startGps();
    }
  },

  pause: function () {
    this.threeLoc.stopGps();
  },

  _sendGpsUpdateEvent: function (lon, lat) {
    this.el.emit("gps-camera-update-position", {
      position: {
        longitude: lon,
        latitude: lat,
      },
    });
  },

  _testForOrientationControls: function () {
    const msg =
      "WARNING - No orientation controls component, app will not respond to device rotation.";
    if (
      !this.el.components["arjs-device-orientation-controls"] &&
      !this.el.components["look-controls"]
    ) {
      this._displayError(msg);
    }
  },

  _displayError: function (error) {
    const arjs = this.el.sceneEl.systems["arjs"];
    if (arjs) {
      arjs._displayErrorPopup(msg);
    } else {
      alert(msg);
    }
  },

  // from original gps-camera component
  _setupSafariOrientationPermissions: function () {
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
  },

  _isMobile: function () {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // true for mobile device
      return true;
    }
    return false;
  },
});


/***/ }),

/***/ "./aframe/src/new-location-based/gps-new-entity-place.js":
/*!***************************************************************!*\
  !*** ./aframe/src/new-location-based/gps-new-entity-place.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! aframe */ "aframe");
/* harmony import */ var aframe__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(aframe__WEBPACK_IMPORTED_MODULE_0__);


aframe__WEBPACK_IMPORTED_MODULE_0__.registerComponent("gps-new-entity-place", {
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

  init: function () {
    const camera = document.querySelector("[gps-new-camera]");
    if (!camera.components["gps-new-camera"]) {
      console.error("gps-new-camera not initialised");
      return;
    }
    this._cameraGps = camera.components["gps-new-camera"];
  },

  update: function () {
    const projCoords = this._cameraGps.threeLoc.lonLatToWorldCoords(
      this.data.longitude,
      this.data.latitude
    );
    this.el.object3D.position.set(
      projCoords[0],
      this.el.object3D.position.y,
      projCoords[1]
    );
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
/*!************************************************!*\
  !*** ./aframe/src/new-location-based/index.js ***!
  \************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _location_based_arjs_webcam_texture__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../location-based/arjs-webcam-texture */ "./aframe/src/location-based/arjs-webcam-texture.js");
/* harmony import */ var _gps_new_camera__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gps-new-camera */ "./aframe/src/new-location-based/gps-new-camera.js");
/* harmony import */ var _gps_new_entity_place__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./gps-new-entity-place */ "./aframe/src/new-location-based/gps-new-entity-place.js");
/* harmony import */ var _arjs_device_orientation_controls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./arjs-device-orientation-controls */ "./aframe/src/new-location-based/arjs-device-orientation-controls.js");





})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWZyYW1lLWFyLW5ldy1sb2NhdGlvbi1vbmx5LmpzIiwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPOzs7Ozs7Ozs7Ozs7Ozs7QUNWaUM7QUFDRjtBQUMvQjtBQUNBLHFEQUF3QjtBQUN4QjtBQUNBO0FBQ0EseUJBQXlCLHFEQUF3QjtBQUNqRCx3QkFBd0Isd0NBQVc7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0RBQXlCLElBQUk7QUFDakQsdUJBQXVCLCtDQUFrQjtBQUN6Qyx3QkFBd0Isb0RBQXVCLEdBQUcsbUJBQW1CO0FBQ3JFLHFCQUFxQix1Q0FBVTtBQUMvQjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSw2QkFBNkIsRUFBRTtBQUMvQjtBQUNBLFNBQVM7QUFDVCxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ2hFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNpQztBQUNqQyxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ25DZ0M7QUFDakM7QUFDQSxxREFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUiw2REFBNkQsS0FBSztBQUNsRTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7QUM3S2dDO0FBQ2pDO0FBQ0EscURBQXdCO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILENBQUM7Ozs7Ozs7Ozs7O0FDbENEOzs7Ozs7Ozs7O0FDQUE7Ozs7OztVQ0FBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7Ozs7QUNOK0M7QUFDckI7QUFDTTtBQUNZIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbG9jYXRpb24tYmFzZWQvYXJqcy13ZWJjYW0tdGV4dHVyZS5qcyIsIndlYnBhY2s6Ly9BUmpzLy4vYWZyYW1lL3NyYy9uZXctbG9jYXRpb24tYmFzZWQvYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHMuanMiLCJ3ZWJwYWNrOi8vQVJqcy8uL2FmcmFtZS9zcmMvbmV3LWxvY2F0aW9uLWJhc2VkL2dwcy1uZXctY2FtZXJhLmpzIiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9ncHMtbmV3LWVudGl0eS1wbGFjZS5qcyIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwiYWZyYW1lXCIsXCJjb21tb25qczJcIjpcImFmcmFtZVwiLFwiYW1kXCI6XCJhZnJhbWVcIixcInJvb3RcIjpcIkFGUkFNRVwifSIsIndlYnBhY2s6Ly9BUmpzL2V4dGVybmFsIHVtZCB7XCJjb21tb25qc1wiOlwidGhyZWVcIixcImNvbW1vbmpzMlwiOlwidGhyZWVcIixcImFtZFwiOlwidGhyZWVcIixcInJvb3RcIjpcIlRIUkVFXCJ9Iiwid2VicGFjazovL0FSanMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9BUmpzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vQVJqcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL0FSanMvLi9hZnJhbWUvc3JjL25ldy1sb2NhdGlvbi1iYXNlZC9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KHJlcXVpcmUoXCJhZnJhbWVcIiksIHJlcXVpcmUoXCJ0aHJlZVwiKSk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXCJhZnJhbWVcIiwgXCJ0aHJlZVwiXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJBUmpzXCJdID0gZmFjdG9yeShyZXF1aXJlKFwiYWZyYW1lXCIpLCByZXF1aXJlKFwidGhyZWVcIikpO1xuXHRlbHNlXG5cdFx0cm9vdFtcIkFSanNcIl0gPSBmYWN0b3J5KHJvb3RbXCJBRlJBTUVcIl0sIHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2FmcmFtZV9fLCBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pIHtcbnJldHVybiAiLCJpbXBvcnQgKiBhcyBBRlJBTUUgZnJvbSBcImFmcmFtZVwiO1xyXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImFyanMtd2ViY2FtLXRleHR1cmVcIiwge1xyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuc2NlbmUgPSB0aGlzLmVsLnNjZW5lRWw7XHJcbiAgICB0aGlzLnRleENhbWVyYSA9IG5ldyBUSFJFRS5PcnRob2dyYXBoaWNDYW1lcmEoLTAuNSwgMC41LCAwLjUsIC0wLjUsIDAsIDEwKTtcclxuICAgIHRoaXMudGV4U2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuXHJcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmF1dG9DbGVhciA9IGZhbHNlO1xyXG4gICAgdGhpcy52aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcclxuICAgIHRoaXMudmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XHJcbiAgICB0aGlzLnZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xyXG4gICAgdGhpcy52aWRlby5zZXRBdHRyaWJ1dGUoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcclxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy52aWRlbyk7XHJcbiAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpOyAvLzAuNSwgMC41KTtcclxuICAgIHRoaXMudGV4dHVyZSA9IG5ldyBUSFJFRS5WaWRlb1RleHR1cmUodGhpcy52aWRlbyk7XHJcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcclxuICAgIHRoaXMudGV4U2NlbmUuYWRkKG1lc2gpO1xyXG4gIH0sXHJcblxyXG4gIHBsYXk6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChuYXZpZ2F0b3IubWVkaWFEZXZpY2VzICYmIG5hdmlnYXRvci5tZWRpYURldmljZXMuZ2V0VXNlck1lZGlhKSB7XHJcbiAgICAgIGNvbnN0IGNvbnN0cmFpbnRzID0ge1xyXG4gICAgICAgIHZpZGVvOiB7XHJcbiAgICAgICAgICBmYWNpbmdNb2RlOiBcImVudmlyb25tZW50XCIsXHJcbiAgICAgICAgfSxcclxuICAgICAgfTtcclxuICAgICAgbmF2aWdhdG9yLm1lZGlhRGV2aWNlc1xyXG4gICAgICAgIC5nZXRVc2VyTWVkaWEoY29uc3RyYWludHMpXHJcbiAgICAgICAgLnRoZW4oKHN0cmVhbSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy52aWRlby5zcmNPYmplY3QgPSBzdHJlYW07XHJcbiAgICAgICAgICB0aGlzLnZpZGVvLnBsYXkoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcclxuICAgICAgICAgICAgYFdlYmNhbSBlcnJvcjogJHtlfWBcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmVsLnNjZW5lRWwuc3lzdGVtc1tcImFyanNcIl0uX2Rpc3BsYXlFcnJvclBvcHVwKFxyXG4gICAgICAgIFwic29ycnkgLSBtZWRpYSBkZXZpY2VzIEFQSSBub3Qgc3VwcG9ydGVkXCJcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICB0aWNrOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyKCk7XHJcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLnJlbmRlcih0aGlzLnRleFNjZW5lLCB0aGlzLnRleENhbWVyYSk7XHJcbiAgICB0aGlzLnNjZW5lLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcclxuICB9LFxyXG5cclxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy52aWRlby5zcmNPYmplY3QuZ2V0VHJhY2tzKCkuZm9yRWFjaCgodHJhY2spID0+IHtcclxuICAgICAgdHJhY2suc3RvcCgpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuXHJcbiAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcclxuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xyXG4gIH0sXHJcbn0pO1xyXG4iLCIvKipcclxuICogYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcclxuICpcclxuICogUmVwbGFjZXMgdGhlIHN0YW5kYXJkIGxvb2stY29udHJvbHMgY29tcG9uZW50IHRvIHByb3ZpZGUgbW9iaWxlIGRldmljZVxyXG4gKiBvcmllbnRhdGlvbiBjb250cm9scy5cclxuICpcclxuICogQSBsaWdodHdlaWdodCBBLUZyYW1lIHdyYXBwZXIgcm91bmQgdGhlIG1vZGlmaWVkIHRocmVlLmpzXHJcbiAqIERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgdXNlZCBpbiB0aGUgdGhyZWUuanMgbG9jYXRpb24tYmFzZWQgQVBJLlxyXG4gKlxyXG4gKiBDcmVhdGVzIHRoZSBUSFJFRSBvYmplY3QgdXNpbmcgdXNpbmcgdGhlIHRocmVlLmpzIGNhbWVyYSwgYW5kIGFsbG93cyB1cGRhdGVcclxuICogb2YgdGhlIHNtb290aGluZyBmYWN0b3IuXHJcbiAqL1xyXG5cclxuaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuQUZSQU1FLnJlZ2lzdGVyQ29tcG9uZW50KFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwge1xyXG4gIHNjaGVtYToge1xyXG4gICAgc21vb3RoaW5nRmFjdG9yOiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDEsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX29yaWVudGF0aW9uQ29udHJvbHMgPSBuZXcgVEhSRUV4LkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMoXHJcbiAgICAgIHRoaXMuZWwub2JqZWN0M0RcclxuICAgICk7XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICB0aGlzLl9vcmllbnRhdGlvbkNvbnRyb2xzLnNtb290aGluZ0ZhY3RvciA9IHRoaXMuZGF0YS5zbW9vdGhpbmdGYWN0b3I7XHJcbiAgfSxcclxuXHJcbiAgdGljazogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy5fb3JpZW50YXRpb25Db250cm9scy51cGRhdGUoKTtcclxuICB9LFxyXG59KTtcclxuIiwiaW1wb3J0ICogYXMgQUZSQU1FIGZyb20gXCJhZnJhbWVcIjtcclxuXHJcbkFGUkFNRS5yZWdpc3RlckNvbXBvbmVudChcImdwcy1uZXctY2FtZXJhXCIsIHtcclxuICBzY2hlbWE6IHtcclxuICAgIHNpbXVsYXRlTGF0aXR1ZGU6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgIH0sXHJcbiAgICBzaW11bGF0ZUxvbmdpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICAgIHNpbXVsYXRlQWx0aXR1ZGU6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogLU51bWJlci5NQVhfVkFMVUUsXHJcbiAgICB9LFxyXG4gICAgZ3BzTWluRGlzdGFuY2U6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgIH0sXHJcbiAgICBwb3NpdGlvbk1pbkFjY3VyYWN5OiB7XHJcbiAgICAgIHR5cGU6IFwibnVtYmVyXCIsXHJcbiAgICAgIGRlZmF1bHQ6IDEwMDAsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcclxuICAgIHRoaXMuX3Rlc3RGb3JPcmllbnRhdGlvbkNvbnRyb2xzKCk7XHJcblxyXG4gICAgdGhpcy50aHJlZUxvYyA9IG5ldyBUSFJFRXguTG9jYXRpb25CYXNlZChcclxuICAgICAgdGhpcy5lbC5zY2VuZUVsLm9iamVjdDNELFxyXG4gICAgICB0aGlzLmVsLm9iamVjdDNEXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMudGhyZWVMb2Mub24oXCJncHN1cGRhdGVcIiwgKGdwc3BvcykgPT4ge1xyXG4gICAgICB0aGlzLl9zZW5kR3BzVXBkYXRlRXZlbnQoZ3BzcG9zLmNvb3Jkcy5sb25naXR1ZGUsIGdwc3Bvcy5jb29yZHMubGF0aXR1ZGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy50aHJlZUxvYy5vbihcImdwc2Vycm9yXCIsIChjb2RlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1zZyA9IFtcclxuICAgICAgICBcIlVzZXIgZGVuaWVkIGFjY2VzcyB0byBHUFMuXCIsXHJcbiAgICAgICAgXCJHUFMgc2F0ZWxsaXRlcyBub3QgYXZhaWxhYmxlLlwiLFxyXG4gICAgICAgIFwiVGltZW91dCBjb21tdW5pY2F0aW5nIHdpdGggR1BTIHNhdGVsbGl0ZXMgLSB0cnkgbW92aW5nIHRvIGEgbW9yZSBvcGVuIGFyZWEuXCIsXHJcbiAgICAgIF07XHJcbiAgICAgIGlmIChjb2RlID49IDEgJiYgY29kZSA8PSAzKSB7XHJcbiAgICAgICAgdGhpcy5fZGlzcGxheUVycm9yKG1zZ1tjb2RlIC0gMV0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihgVW5rbm93biBnZW9sb2NhdGlvbiBlcnJvciBjb2RlICR7Y29kZX0uYCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIC8vIFVzZSBhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9scyBvbiBtb2JpbGUgb25seSwgd2l0aCBzdGFuZGFyZFxyXG4gICAgLy8gbG9vay1jb250cm9scyBkaXNhYmxlZCAodGhpcyBpbnRlcmZlcmVzIHdpdGggdGhlIHJlYWRpbmdzIGZyb20gdGhlXHJcbiAgICAvLyBzZW5zb3JzKS4gT24gZGVza3RvcCwgdXNlIHN0YW5kYXJkIGxvb2stY29udHJvbHMgaW5zdGVhZC5cclxuXHJcbiAgICBjb25zdCBtb2JpbGUgPSB0aGlzLl9pc01vYmlsZSgpO1xyXG4gICAgdGhpcy5lbC5zZXRBdHRyaWJ1dGUoXCJsb29rLWNvbnRyb2xzLWVuYWJsZWRcIiwgIW1vYmlsZSk7XHJcbiAgICBpZiAobW9iaWxlKSB7XHJcbiAgICAgIHRoaXMuZWwuc2V0QXR0cmlidXRlKFwiYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIiwgdHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZnJvbSBvcmlnaW5hbCBncHMtY2FtZXJhIGNvbXBvbmVudFxyXG4gICAgLy8gaWYgU2FmYXJpXHJcbiAgICBpZiAoISFuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9WZXJzaW9uXFwvW1xcZC5dKy4qU2FmYXJpLykpIHtcclxuICAgICAgdGhpcy5fc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiAob2xkRGF0YSkge1xyXG4gICAgdGhpcy50aHJlZUxvYy5zZXRHcHNPcHRpb25zKHtcclxuICAgICAgZ3BzTWluQWNjdXJhY3k6IHRoaXMuZGF0YS5wb3NpdGlvbk1pbkFjY3VyYWN5LFxyXG4gICAgICBncHNNaW5EaXN0YW5jZTogdGhpcy5kYXRhLmdwc01pbkRpc3RhbmNlLFxyXG4gICAgfSk7XHJcbiAgICBpZiAoXHJcbiAgICAgICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPT0gMCB8fCB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT09IDApICYmXHJcbiAgICAgICh0aGlzLmRhdGEuc2ltdWxhdGVMYXRpdHVkZSAhPSBvbGREYXRhLnNpbXVsYXRlTGF0aXR1ZGUgfHxcclxuICAgICAgICB0aGlzLmRhdGEuc2ltdWxhdGVMb25naXR1ZGUgIT0gb2xkRGF0YS5zaW11bGF0ZUxvbmdpdHVkZSlcclxuICAgICkge1xyXG4gICAgICB0aGlzLnRocmVlTG9jLmZha2VHcHMoXHJcbiAgICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlLFxyXG4gICAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlXHJcbiAgICAgICk7XHJcbiAgICAgIHRoaXMuZGF0YS5zaW11bGF0ZUxhdGl0dWRlID0gMDtcclxuICAgICAgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlID0gMDtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmRhdGEuc2ltdWxhdGVBbHRpdHVkZSA+IC1OdW1iZXIuTUFYX1ZBTFVFKSB7XHJcbiAgICAgIHRoaXMudGhyZWVMb2Muc2V0RWxldmF0aW9uKHRoaXMuZGF0YS5zaW11bGF0ZUFsdGl0dWRlICsgMS42KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwbGF5OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBpZiAodGhpcy5kYXRhLnNpbXVsYXRlTGF0aXR1ZGUgPT09IDAgJiYgdGhpcy5kYXRhLnNpbXVsYXRlTG9uZ2l0dWRlID09PSAwKSB7XHJcbiAgICAgIHRoaXMudGhyZWVMb2Muc3RhcnRHcHMoKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBwYXVzZTogZnVuY3Rpb24gKCkge1xyXG4gICAgdGhpcy50aHJlZUxvYy5zdG9wR3BzKCk7XHJcbiAgfSxcclxuXHJcbiAgX3NlbmRHcHNVcGRhdGVFdmVudDogZnVuY3Rpb24gKGxvbiwgbGF0KSB7XHJcbiAgICB0aGlzLmVsLmVtaXQoXCJncHMtY2FtZXJhLXVwZGF0ZS1wb3NpdGlvblwiLCB7XHJcbiAgICAgIHBvc2l0aW9uOiB7XHJcbiAgICAgICAgbG9uZ2l0dWRlOiBsb24sXHJcbiAgICAgICAgbGF0aXR1ZGU6IGxhdCxcclxuICAgICAgfSxcclxuICAgIH0pO1xyXG4gIH0sXHJcblxyXG4gIF90ZXN0Rm9yT3JpZW50YXRpb25Db250cm9sczogZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgbXNnID1cclxuICAgICAgXCJXQVJOSU5HIC0gTm8gb3JpZW50YXRpb24gY29udHJvbHMgY29tcG9uZW50LCBhcHAgd2lsbCBub3QgcmVzcG9uZCB0byBkZXZpY2Ugcm90YXRpb24uXCI7XHJcbiAgICBpZiAoXHJcbiAgICAgICF0aGlzLmVsLmNvbXBvbmVudHNbXCJhcmpzLWRldmljZS1vcmllbnRhdGlvbi1jb250cm9sc1wiXSAmJlxyXG4gICAgICAhdGhpcy5lbC5jb21wb25lbnRzW1wibG9vay1jb250cm9sc1wiXVxyXG4gICAgKSB7XHJcbiAgICAgIHRoaXMuX2Rpc3BsYXlFcnJvcihtc2cpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIF9kaXNwbGF5RXJyb3I6IGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgY29uc3QgYXJqcyA9IHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXTtcclxuICAgIGlmIChhcmpzKSB7XHJcbiAgICAgIGFyanMuX2Rpc3BsYXlFcnJvclBvcHVwKG1zZyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhbGVydChtc2cpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIC8vIGZyb20gb3JpZ2luYWwgZ3BzLWNhbWVyYSBjb21wb25lbnRcclxuICBfc2V0dXBTYWZhcmlPcmllbnRhdGlvblBlcm1pc3Npb25zOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBpT1MgMTMrXHJcbiAgICBpZiAodHlwZW9mIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcIlJlcXVlc3RpbmcgZGV2aWNlIG9yaWVudGF0aW9uIHBlcm1pc3Npb25zLi4uXCIpO1xyXG4gICAgICAgIERldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24oKTtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgaGFuZGxlcik7XHJcbiAgICAgIH07XHJcblxyXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwidG91Y2hlbmRcIixcclxuICAgICAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBoYW5kbGVyKCk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWxzZVxyXG4gICAgICApO1xyXG5cclxuICAgICAgdGhpcy5lbC5zY2VuZUVsLnN5c3RlbXNbXCJhcmpzXCJdLl9kaXNwbGF5RXJyb3JQb3B1cChcclxuICAgICAgICBcIkFmdGVyIGNhbWVyYSBwZXJtaXNzaW9uIHByb21wdCwgcGxlYXNlIHRhcCB0aGUgc2NyZWVuIHRvIGFjdGl2YXRlIGdlb2xvY2F0aW9uLlwiXHJcbiAgICAgICk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YXIgdGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuZWwuc2NlbmVFbC5zeXN0ZW1zW1wiYXJqc1wiXS5fZGlzcGxheUVycm9yUG9wdXAoXHJcbiAgICAgICAgICBcIlBsZWFzZSBlbmFibGUgZGV2aWNlIG9yaWVudGF0aW9uIGluIFNldHRpbmdzID4gU2FmYXJpID4gTW90aW9uICYgT3JpZW50YXRpb24gQWNjZXNzLlwiXHJcbiAgICAgICAgKTtcclxuICAgICAgfSwgNzUwKTtcclxuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBfaXNNb2JpbGU6IGZ1bmN0aW9uICgpIHtcclxuICAgIGlmIChcclxuICAgICAgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KFxyXG4gICAgICAgIG5hdmlnYXRvci51c2VyQWdlbnRcclxuICAgICAgKVxyXG4gICAgKSB7XHJcbiAgICAgIC8vIHRydWUgZm9yIG1vYmlsZSBkZXZpY2VcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxufSk7XHJcbiIsImltcG9ydCAqIGFzIEFGUkFNRSBmcm9tIFwiYWZyYW1lXCI7XHJcblxyXG5BRlJBTUUucmVnaXN0ZXJDb21wb25lbnQoXCJncHMtbmV3LWVudGl0eS1wbGFjZVwiLCB7XHJcbiAgc2NoZW1hOiB7XHJcbiAgICBsb25naXR1ZGU6IHtcclxuICAgICAgdHlwZTogXCJudW1iZXJcIixcclxuICAgICAgZGVmYXVsdDogMCxcclxuICAgIH0sXHJcbiAgICBsYXRpdHVkZToge1xyXG4gICAgICB0eXBlOiBcIm51bWJlclwiLFxyXG4gICAgICBkZWZhdWx0OiAwLFxyXG4gICAgfSxcclxuICB9LFxyXG5cclxuICBpbml0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCBjYW1lcmEgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiW2dwcy1uZXctY2FtZXJhXVwiKTtcclxuICAgIGlmICghY2FtZXJhLmNvbXBvbmVudHNbXCJncHMtbmV3LWNhbWVyYVwiXSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFwiZ3BzLW5ldy1jYW1lcmEgbm90IGluaXRpYWxpc2VkXCIpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLl9jYW1lcmFHcHMgPSBjYW1lcmEuY29tcG9uZW50c1tcImdwcy1uZXctY2FtZXJhXCJdO1xyXG4gIH0sXHJcblxyXG4gIHVwZGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgcHJvakNvb3JkcyA9IHRoaXMuX2NhbWVyYUdwcy50aHJlZUxvYy5sb25MYXRUb1dvcmxkQ29vcmRzKFxyXG4gICAgICB0aGlzLmRhdGEubG9uZ2l0dWRlLFxyXG4gICAgICB0aGlzLmRhdGEubGF0aXR1ZGVcclxuICAgICk7XHJcbiAgICB0aGlzLmVsLm9iamVjdDNELnBvc2l0aW9uLnNldChcclxuICAgICAgcHJvakNvb3Jkc1swXSxcclxuICAgICAgdGhpcy5lbC5vYmplY3QzRC5wb3NpdGlvbi55LFxyXG4gICAgICBwcm9qQ29vcmRzWzFdXHJcbiAgICApO1xyXG4gIH0sXHJcbn0pO1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IF9fV0VCUEFDS19FWFRFUk5BTF9NT0RVTEVfYWZyYW1lX187IiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4uL2xvY2F0aW9uLWJhc2VkL2FyanMtd2ViY2FtLXRleHR1cmVcIjtcclxuaW1wb3J0IFwiLi9ncHMtbmV3LWNhbWVyYVwiO1xyXG5pbXBvcnQgXCIuL2dwcy1uZXctZW50aXR5LXBsYWNlXCI7XHJcbmltcG9ydCBcIi4vYXJqcy1kZXZpY2Utb3JpZW50YXRpb24tY29udHJvbHNcIjtcclxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9