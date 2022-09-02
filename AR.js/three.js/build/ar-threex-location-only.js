(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["THREEx"] = factory(require("three"));
	else
		root["THREEx"] = factory(root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_three__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./three.js/src/location-based/js/device-orientation-controls.js":
/*!***********************************************************************!*\
  !*** ./three.js/src/location-based/js/device-orientation-controls.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DeviceOrientationControls": () => (/* binding */ DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);
// Modified version of THREE.DeviceOrientationControls from three.js
// will use the deviceorientationabsolute event if available



const _zee = new three__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 1);
const _euler = new three__WEBPACK_IMPORTED_MODULE_0__.Euler();
const _q0 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();
const _q1 = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

const _changeEvent = { type: "change" };

class DeviceOrientationControls extends three__WEBPACK_IMPORTED_MODULE_0__.EventDispatcher {
  constructor(object) {
    super();

    if (window.isSecureContext === false) {
      console.error(
        "THREE.DeviceOrientationControls: DeviceOrientationEvent is only available in secure contexts (https)"
      );
    }

    const scope = this;

    const EPS = 0.000001;
    const lastQuaternion = new three__WEBPACK_IMPORTED_MODULE_0__.Quaternion();

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alphaOffset = 0; // radians

    this.orientationChangeEventName =
      "ondeviceorientationabsolute" in window
        ? "deviceorientationabsolute"
        : "deviceorientation";

    const onDeviceOrientationChangeEvent = function (event) {
      scope.deviceOrientation = event;
    };

    const onScreenOrientationChangeEvent = function () {
      scope.screenOrientation = window.orientation || 0;
    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    const setObjectQuaternion = function (
      quaternion,
      alpha,
      beta,
      gamma,
      orient
    ) {
      _euler.set(beta, alpha, -gamma, "YXZ"); // 'ZXY' for the device, but 'YXZ' for us

      quaternion.setFromEuler(_euler); // orient the device

      quaternion.multiply(_q1); // camera looks out the back of the device, not the top

      quaternion.multiply(_q0.setFromAxisAngle(_zee, -orient)); // adjust for screen orientation
    };

    this.connect = function () {
      onScreenOrientationChangeEvent(); // run once on load

      // iOS 13+

      if (
        window.DeviceOrientationEvent !== undefined &&
        typeof window.DeviceOrientationEvent.requestPermission === "function"
      ) {
        window.DeviceOrientationEvent.requestPermission()
          .then(function (response) {
            if (response == "granted") {
              window.addEventListener(
                "orientationchange",
                onScreenOrientationChangeEvent
              );
              window.addEventListener(
                this.orientationChangeEventName,
                onDeviceOrientationChangeEvent
              );
            }
          })
          .catch(function (error) {
            console.error(
              "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
              error
            );
          });
      } else {
        window.addEventListener(
          "orientationchange",
          onScreenOrientationChangeEvent
        );
        window.addEventListener(
          this.orientationChangeEventName,
          onDeviceOrientationChangeEvent
        );
      }

      scope.enabled = true;
    };

    this.disconnect = function () {
      window.removeEventListener(
        "orientationchange",
        onScreenOrientationChangeEvent
      );
      window.removeEventListener(
        this.orientationChangeEventName,
        onDeviceOrientationChangeEvent
      );

      scope.enabled = false;
    };

    this.update = function () {
      if (scope.enabled === false) return;

      const device = scope.deviceOrientation;

      if (device) {
        const alpha = device.alpha
          ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.alpha) + scope.alphaOffset
          : 0; // Z

        const beta = device.beta ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.beta) : 0; // X'

        const gamma = device.gamma ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(device.gamma) : 0; // Y''

        const orient = scope.screenOrientation
          ? three__WEBPACK_IMPORTED_MODULE_0__.Math.degToRad(scope.screenOrientation)
          : 0; // O

        setObjectQuaternion(
          scope.object.quaternion,
          alpha,
          beta,
          gamma,
          orient
        );

        if (8 * (1 - lastQuaternion.dot(scope.object.quaternion)) > EPS) {
          lastQuaternion.copy(scope.object.quaternion);
          scope.dispatchEvent(_changeEvent);
        }
      }
    };

    this.dispose = function () {
      scope.disconnect();
    };

    this.connect();
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/location-based.js":
/*!**********************************************************!*\
  !*** ./three.js/src/location-based/js/location-based.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocationBased": () => (/* binding */ LocationBased)
/* harmony export */ });
/* harmony import */ var _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./sphmerc-projection.js */ "./three.js/src/location-based/js/sphmerc-projection.js");


class LocationBased {
  constructor(scene, camera, options = {}) {
    this._scene = scene;
    this._camera = camera;
    this._proj = new _sphmerc_projection_js__WEBPACK_IMPORTED_MODULE_0__.SphMercProjection();
    this._eventHandlers = {};
    this._lastCoords = null;
    this._gpsMinDistance = 0;
    this._gpsMinAccuracy = 1000;
    this._watchPositionId = null;
    this.setGpsOptions(options);
  }

  setProjection(proj) {
    this._proj = proj;
  }

  setGpsOptions(options = {}) {
    if (options.gpsMinDistance !== undefined) {
      this._gpsMinDistance = options.gpsMinDistance;
    }
    if (options.gpsMinAccuracy !== undefined) {
      this._gpsMinAccuracy = options.gpsMinAccuracy;
    }
  }

  startGps(maximumAge = 0) {
    if (this._watchPositionId === null) {
      this._watchPositionId = navigator.geolocation.watchPosition(
        (position) => {
          this._gpsReceived(position);
        },
        (error) => {
          if (this._eventHandlers["gpserror"]) {
            this._eventHandlers["gpserror"](error.code);
          } else {
            alert(`GPS error: code ${error.code}`);
          }
        },
        {
          enableHighAccuracy: true,
          maximumAge: maximumAge,
        }
      );
      return true;
    }
    return false;
  }

  stopGps() {
    if (this._watchPositionId !== null) {
      navigator.geolocation.clearWatch(this._watchPositionId);
      this._watchPositionId = null;
      return true;
    }
    return false;
  }

  fakeGps(lon, lat, elev = null, acc = 0) {
    if (elev !== null) {
      this.setElevation(elev);
    }

    this._gpsReceived({
      coords: {
        longitude: lon,
        latitude: lat,
        accuracy: acc,
      },
    });
  }

  lonLatToWorldCoords(lon, lat) {
    const projectedPos = this._proj.project(lon, lat);
    return [projectedPos[0], -projectedPos[1]];
  }

  add(object, lon, lat, elev) {
    this.setWorldPosition(object, lon, lat, elev);
    this._scene.add(object);
  }

  setWorldPosition(object, lon, lat, elev) {
    const worldCoords = this.lonLatToWorldCoords(lon, lat);
    [object.position.x, object.position.z] = worldCoords;
    if (elev !== undefined) {
      object.position.y = elev;
    }
  }

  setElevation(elev) {
    this._camera.position.y = elev;
  }

  on(eventName, eventHandler) {
    this._eventHandlers[eventName] = eventHandler;
  }

  _gpsReceived(position) {
    let distMoved = Number.MAX_VALUE;
    if (position.coords.accuracy <= this._gpsMinAccuracy) {
      if (this._lastCoords === null) {
        this._lastCoords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
      } else {
        distMoved = this._haversineDist(this._lastCoords, position.coords);
      }
      if (distMoved >= this._gpsMinDistance) {
        this._lastCoords.longitude = position.coords.longitude;
        this._lastCoords.latitude = position.coords.latitude;

        this.setWorldPosition(
          this._camera,
          position.coords.longitude,
          position.coords.latitude
        );
        if (this._eventHandlers["gpsupdate"]) {
          this._eventHandlers["gpsupdate"](position, distMoved);
        }
      }
    }
  }

  /**
   * Calculate haversine distance between two lat/lon pairs.
   *
   * Taken from original A-Frame components
   */
  _haversineDist(src, dest) {
    const dlongitude = THREE.Math.degToRad(dest.longitude - src.longitude);
    const dlatitude = THREE.Math.degToRad(dest.latitude - src.latitude);

    const a =
      Math.sin(dlatitude / 2) * Math.sin(dlatitude / 2) +
      Math.cos(THREE.Math.degToRad(src.latitude)) *
        Math.cos(THREE.Math.degToRad(dest.latitude)) *
        (Math.sin(dlongitude / 2) * Math.sin(dlongitude / 2));
    const angle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return angle * 6371000;
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/sphmerc-projection.js":
/*!**************************************************************!*\
  !*** ./three.js/src/location-based/js/sphmerc-projection.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SphMercProjection": () => (/* binding */ SphMercProjection)
/* harmony export */ });
class SphMercProjection {
  constructor() {
    this.EARTH = 40075016.68;
    this.HALF_EARTH = 20037508.34;
  }

  project(lon, lat) {
    return [this.lonToSphMerc(lon), this.latToSphMerc(lat)];
  }

  unproject(projected) {
    return [this.sphMercToLon(projected[0]), this.sphMercToLat(projected[1])];
  }

  lonToSphMerc(lon) {
    return (lon / 180) * this.HALF_EARTH;
  }

  latToSphMerc(lat) {
    var y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
    return (y * this.HALF_EARTH) / 180.0;
  }

  sphMercToLon(x) {
    return (x / this.HALF_EARTH) * 180.0;
  }

  sphMercToLat(y) {
    var lat = (y / this.HALF_EARTH) * 180.0;
    lat =
      (180 / Math.PI) *
      (2 * Math.atan(Math.exp((lat * Math.PI) / 180)) - Math.PI / 2);
    return lat;
  }

  getID() {
    return "epsg:3857";
  }
}




/***/ }),

/***/ "./three.js/src/location-based/js/webcam-renderer.js":
/*!***********************************************************!*\
  !*** ./three.js/src/location-based/js/webcam-renderer.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WebcamRenderer": () => (/* binding */ WebcamRenderer)
/* harmony export */ });
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three */ "three");
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(three__WEBPACK_IMPORTED_MODULE_0__);


class WebcamRenderer {
  constructor(renderer, videoElement) {
    this.renderer = renderer;
    this.renderer.autoClear = false;
    this.sceneWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.Scene();
    let video;
    if (videoElement === undefined) {
      video = document.createElement("video");
      video.setAttribute("autoplay", true);
      video.setAttribute("playsinline", true);
      video.style.display = "none";
      document.body.appendChild(video);
    } else {
      video = document.querySelector(videoElement);
    }
    this.geom = new three__WEBPACK_IMPORTED_MODULE_0__.PlaneBufferGeometry();
    this.texture = new three__WEBPACK_IMPORTED_MODULE_0__.VideoTexture(video);
    this.material = new three__WEBPACK_IMPORTED_MODULE_0__.MeshBasicMaterial({ map: this.texture });
    const mesh = new three__WEBPACK_IMPORTED_MODULE_0__.Mesh(this.geom, this.material);
    this.sceneWebcam.add(mesh);
    this.cameraWebcam = new three__WEBPACK_IMPORTED_MODULE_0__.OrthographicCamera(
      -0.5,
      0.5,
      0.5,
      -0.5,
      0,
      10
    );
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const constraints = {
        video: {
          width: 1280,
          height: 720,
          facingMode: "environment",
        },
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          console.log(`using the webcam successfully...`);
          video.srcObject = stream;
          video.play();
        })
        .catch((e) => {
          alert(`Webcam error: ${e}`);
        });
    } else {
      alert("sorry - media devices API not supported");
    }
  }

  update() {
    this.renderer.clear();
    this.renderer.render(this.sceneWebcam, this.cameraWebcam);
    this.renderer.clearDepth();
  }

  dispose() {
    this.material.dispose();
    this.texture.dispose();
    this.geom.dispose();
  }
}




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
/*!**********************************************!*\
  !*** ./three.js/src/location-based/index.js ***!
  \**********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LocationBased": () => (/* reexport safe */ _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__.LocationBased),
/* harmony export */   "WebcamRenderer": () => (/* reexport safe */ _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__.WebcamRenderer),
/* harmony export */   "DeviceOrientationControls": () => (/* reexport safe */ _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__.DeviceOrientationControls)
/* harmony export */ });
/* harmony import */ var _js_location_based_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/location-based.js */ "./three.js/src/location-based/js/location-based.js");
/* harmony import */ var _js_webcam_renderer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/webcam-renderer.js */ "./three.js/src/location-based/js/webcam-renderer.js");
/* harmony import */ var _js_device_orientation_controls_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/device-orientation-controls.js */ "./three.js/src/location-based/js/device-orientation-controls.js");






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDMEI7Ozs7Ozs7Ozs7O0FDbEUxQjs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNOdUQ7QUFDRTtBQUN1QjtBQUNoRjtBQUNvRSIsInNvdXJjZXMiOlsid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL2RldmljZS1vcmllbnRhdGlvbi1jb250cm9scy5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvbG9jYXRpb24tYmFzZWQuanMiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2pzL3NwaG1lcmMtcHJvamVjdGlvbi5qcyIsIndlYnBhY2s6Ly9USFJFRXgvLi90aHJlZS5qcy9zcmMvbG9jYXRpb24tYmFzZWQvanMvd2ViY2FtLXJlbmRlcmVyLmpzIiwid2VicGFjazovL1RIUkVFeC9leHRlcm5hbCB1bWQge1wiY29tbW9uanNcIjpcInRocmVlXCIsXCJjb21tb25qczJcIjpcInRocmVlXCIsXCJhbWRcIjpcInRocmVlXCIsXCJyb290XCI6XCJUSFJFRVwifSIsIndlYnBhY2s6Ly9USFJFRXgvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL1RIUkVFeC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vVEhSRUV4L3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vVEhSRUV4Ly4vdGhyZWUuanMvc3JjL2xvY2F0aW9uLWJhc2VkL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcInRocmVlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlRIUkVFeFwiXSA9IGZhY3RvcnkocmVxdWlyZShcInRocmVlXCIpKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJUSFJFRXhcIl0gPSBmYWN0b3J5KHJvb3RbXCJUSFJFRVwiXSk7XG59KSh0aGlzLCBmdW5jdGlvbihfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX18pIHtcbnJldHVybiAiLCIvLyBNb2RpZmllZCB2ZXJzaW9uIG9mIFRIUkVFLkRldmljZU9yaWVudGF0aW9uQ29udHJvbHMgZnJvbSB0aHJlZS5qc1xyXG4vLyB3aWxsIHVzZSB0aGUgZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZSBldmVudCBpZiBhdmFpbGFibGVcclxuXHJcbmltcG9ydCB7XHJcbiAgRXVsZXIsXHJcbiAgRXZlbnREaXNwYXRjaGVyLFxyXG4gIE1hdGggYXMgTWF0aFV0aWxzLFxyXG4gIFF1YXRlcm5pb24sXHJcbiAgVmVjdG9yMyxcclxufSBmcm9tIFwidGhyZWVcIjtcclxuXHJcbmNvbnN0IF96ZWUgPSBuZXcgVmVjdG9yMygwLCAwLCAxKTtcclxuY29uc3QgX2V1bGVyID0gbmV3IEV1bGVyKCk7XHJcbmNvbnN0IF9xMCA9IG5ldyBRdWF0ZXJuaW9uKCk7XHJcbmNvbnN0IF9xMSA9IG5ldyBRdWF0ZXJuaW9uKC1NYXRoLnNxcnQoMC41KSwgMCwgMCwgTWF0aC5zcXJ0KDAuNSkpOyAvLyAtIFBJLzIgYXJvdW5kIHRoZSB4LWF4aXNcclxuXHJcbmNvbnN0IF9jaGFuZ2VFdmVudCA9IHsgdHlwZTogXCJjaGFuZ2VcIiB9O1xyXG5cclxuY2xhc3MgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyBleHRlbmRzIEV2ZW50RGlzcGF0Y2hlciB7XHJcbiAgY29uc3RydWN0b3Iob2JqZWN0KSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIGlmICh3aW5kb3cuaXNTZWN1cmVDb250ZXh0ID09PSBmYWxzZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKFxyXG4gICAgICAgIFwiVEhSRUUuRGV2aWNlT3JpZW50YXRpb25Db250cm9sczogRGV2aWNlT3JpZW50YXRpb25FdmVudCBpcyBvbmx5IGF2YWlsYWJsZSBpbiBzZWN1cmUgY29udGV4dHMgKGh0dHBzKVwiXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc2NvcGUgPSB0aGlzO1xyXG5cclxuICAgIGNvbnN0IEVQUyA9IDAuMDAwMDAxO1xyXG4gICAgY29uc3QgbGFzdFF1YXRlcm5pb24gPSBuZXcgUXVhdGVybmlvbigpO1xyXG5cclxuICAgIHRoaXMub2JqZWN0ID0gb2JqZWN0O1xyXG4gICAgdGhpcy5vYmplY3Qucm90YXRpb24ucmVvcmRlcihcIllYWlwiKTtcclxuXHJcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG5cclxuICAgIHRoaXMuZGV2aWNlT3JpZW50YXRpb24gPSB7fTtcclxuICAgIHRoaXMuc2NyZWVuT3JpZW50YXRpb24gPSAwO1xyXG5cclxuICAgIHRoaXMuYWxwaGFPZmZzZXQgPSAwOyAvLyByYWRpYW5zXHJcblxyXG4gICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSA9XHJcbiAgICAgIFwib25kZXZpY2VvcmllbnRhdGlvbmFic29sdXRlXCIgaW4gd2luZG93XHJcbiAgICAgICAgPyBcImRldmljZW9yaWVudGF0aW9uYWJzb2x1dGVcIlxyXG4gICAgICAgIDogXCJkZXZpY2VvcmllbnRhdGlvblwiO1xyXG5cclxuICAgIGNvbnN0IG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudCA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICBzY29wZS5kZXZpY2VPcmllbnRhdGlvbiA9IGV2ZW50O1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uID0gd2luZG93Lm9yaWVudGF0aW9uIHx8IDA7XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFRoZSBhbmdsZXMgYWxwaGEsIGJldGEgYW5kIGdhbW1hIGZvcm0gYSBzZXQgb2YgaW50cmluc2ljIFRhaXQtQnJ5YW4gYW5nbGVzIG9mIHR5cGUgWi1YJy1ZJydcclxuXHJcbiAgICBjb25zdCBzZXRPYmplY3RRdWF0ZXJuaW9uID0gZnVuY3Rpb24gKFxyXG4gICAgICBxdWF0ZXJuaW9uLFxyXG4gICAgICBhbHBoYSxcclxuICAgICAgYmV0YSxcclxuICAgICAgZ2FtbWEsXHJcbiAgICAgIG9yaWVudFxyXG4gICAgKSB7XHJcbiAgICAgIF9ldWxlci5zZXQoYmV0YSwgYWxwaGEsIC1nYW1tYSwgXCJZWFpcIik7IC8vICdaWFknIGZvciB0aGUgZGV2aWNlLCBidXQgJ1lYWicgZm9yIHVzXHJcblxyXG4gICAgICBxdWF0ZXJuaW9uLnNldEZyb21FdWxlcihfZXVsZXIpOyAvLyBvcmllbnQgdGhlIGRldmljZVxyXG5cclxuICAgICAgcXVhdGVybmlvbi5tdWx0aXBseShfcTEpOyAvLyBjYW1lcmEgbG9va3Mgb3V0IHRoZSBiYWNrIG9mIHRoZSBkZXZpY2UsIG5vdCB0aGUgdG9wXHJcblxyXG4gICAgICBxdWF0ZXJuaW9uLm11bHRpcGx5KF9xMC5zZXRGcm9tQXhpc0FuZ2xlKF96ZWUsIC1vcmllbnQpKTsgLy8gYWRqdXN0IGZvciBzY3JlZW4gb3JpZW50YXRpb25cclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5jb25uZWN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnQoKTsgLy8gcnVuIG9uY2Ugb24gbG9hZFxyXG5cclxuICAgICAgLy8gaU9TIDEzK1xyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50ICE9PSB1bmRlZmluZWQgJiZcclxuICAgICAgICB0eXBlb2Ygd2luZG93LkRldmljZU9yaWVudGF0aW9uRXZlbnQucmVxdWVzdFBlcm1pc3Npb24gPT09IFwiZnVuY3Rpb25cIlxyXG4gICAgICApIHtcclxuICAgICAgICB3aW5kb3cuRGV2aWNlT3JpZW50YXRpb25FdmVudC5yZXF1ZXN0UGVybWlzc2lvbigpXHJcbiAgICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09IFwiZ3JhbnRlZFwiKSB7XHJcbiAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXHJcbiAgICAgICAgICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcclxuICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcclxuICAgICAgICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxyXG4gICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXHJcbiAgICAgICAgICAgICAgXCJUSFJFRS5EZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzOiBVbmFibGUgdG8gdXNlIERldmljZU9yaWVudGF0aW9uIEFQSTpcIixcclxuICAgICAgICAgICAgICBlcnJvclxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICBcIm9yaWVudGF0aW9uY2hhbmdlXCIsXHJcbiAgICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcclxuICAgICAgICApO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcclxuICAgICAgICAgIG9uRGV2aWNlT3JpZW50YXRpb25DaGFuZ2VFdmVudFxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHNjb3BlLmVuYWJsZWQgPSB0cnVlO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmRpc2Nvbm5lY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxyXG4gICAgICAgIFwib3JpZW50YXRpb25jaGFuZ2VcIixcclxuICAgICAgICBvblNjcmVlbk9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcclxuICAgICAgKTtcclxuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgdGhpcy5vcmllbnRhdGlvbkNoYW5nZUV2ZW50TmFtZSxcclxuICAgICAgICBvbkRldmljZU9yaWVudGF0aW9uQ2hhbmdlRXZlbnRcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHNjb3BlLmVuYWJsZWQgPSBmYWxzZTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChzY29wZS5lbmFibGVkID09PSBmYWxzZSkgcmV0dXJuO1xyXG5cclxuICAgICAgY29uc3QgZGV2aWNlID0gc2NvcGUuZGV2aWNlT3JpZW50YXRpb247XHJcblxyXG4gICAgICBpZiAoZGV2aWNlKSB7XHJcbiAgICAgICAgY29uc3QgYWxwaGEgPSBkZXZpY2UuYWxwaGFcclxuICAgICAgICAgID8gTWF0aFV0aWxzLmRlZ1RvUmFkKGRldmljZS5hbHBoYSkgKyBzY29wZS5hbHBoYU9mZnNldFxyXG4gICAgICAgICAgOiAwOyAvLyBaXHJcblxyXG4gICAgICAgIGNvbnN0IGJldGEgPSBkZXZpY2UuYmV0YSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuYmV0YSkgOiAwOyAvLyBYJ1xyXG5cclxuICAgICAgICBjb25zdCBnYW1tYSA9IGRldmljZS5nYW1tYSA/IE1hdGhVdGlscy5kZWdUb1JhZChkZXZpY2UuZ2FtbWEpIDogMDsgLy8gWScnXHJcblxyXG4gICAgICAgIGNvbnN0IG9yaWVudCA9IHNjb3BlLnNjcmVlbk9yaWVudGF0aW9uXHJcbiAgICAgICAgICA/IE1hdGhVdGlscy5kZWdUb1JhZChzY29wZS5zY3JlZW5PcmllbnRhdGlvbilcclxuICAgICAgICAgIDogMDsgLy8gT1xyXG5cclxuICAgICAgICBzZXRPYmplY3RRdWF0ZXJuaW9uKFxyXG4gICAgICAgICAgc2NvcGUub2JqZWN0LnF1YXRlcm5pb24sXHJcbiAgICAgICAgICBhbHBoYSxcclxuICAgICAgICAgIGJldGEsXHJcbiAgICAgICAgICBnYW1tYSxcclxuICAgICAgICAgIG9yaWVudFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGlmICg4ICogKDEgLSBsYXN0UXVhdGVybmlvbi5kb3Qoc2NvcGUub2JqZWN0LnF1YXRlcm5pb24pKSA+IEVQUykge1xyXG4gICAgICAgICAgbGFzdFF1YXRlcm5pb24uY29weShzY29wZS5vYmplY3QucXVhdGVybmlvbik7XHJcbiAgICAgICAgICBzY29wZS5kaXNwYXRjaEV2ZW50KF9jaGFuZ2VFdmVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuZGlzcG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgc2NvcGUuZGlzY29ubmVjdCgpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmNvbm5lY3QoKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IERldmljZU9yaWVudGF0aW9uQ29udHJvbHMgfTtcclxuIiwiaW1wb3J0IHsgU3BoTWVyY1Byb2plY3Rpb24gfSBmcm9tIFwiLi9zcGhtZXJjLXByb2plY3Rpb24uanNcIjtcclxuXHJcbmNsYXNzIExvY2F0aW9uQmFzZWQge1xyXG4gIGNvbnN0cnVjdG9yKHNjZW5lLCBjYW1lcmEsIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5fc2NlbmUgPSBzY2VuZTtcclxuICAgIHRoaXMuX2NhbWVyYSA9IGNhbWVyYTtcclxuICAgIHRoaXMuX3Byb2ogPSBuZXcgU3BoTWVyY1Byb2plY3Rpb24oKTtcclxuICAgIHRoaXMuX2V2ZW50SGFuZGxlcnMgPSB7fTtcclxuICAgIHRoaXMuX2xhc3RDb29yZHMgPSBudWxsO1xyXG4gICAgdGhpcy5fZ3BzTWluRGlzdGFuY2UgPSAwO1xyXG4gICAgdGhpcy5fZ3BzTWluQWNjdXJhY3kgPSAxMDAwO1xyXG4gICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcclxuICAgIHRoaXMuc2V0R3BzT3B0aW9ucyhvcHRpb25zKTtcclxuICB9XHJcblxyXG4gIHNldFByb2plY3Rpb24ocHJvaikge1xyXG4gICAgdGhpcy5fcHJvaiA9IHByb2o7XHJcbiAgfVxyXG5cclxuICBzZXRHcHNPcHRpb25zKG9wdGlvbnMgPSB7fSkge1xyXG4gICAgaWYgKG9wdGlvbnMuZ3BzTWluRGlzdGFuY2UgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9ncHNNaW5EaXN0YW5jZSA9IG9wdGlvbnMuZ3BzTWluRGlzdGFuY2U7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5ncHNNaW5BY2N1cmFjeSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuX2dwc01pbkFjY3VyYWN5ID0gb3B0aW9ucy5ncHNNaW5BY2N1cmFjeTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHN0YXJ0R3BzKG1heGltdW1BZ2UgPSAwKSB7XHJcbiAgICBpZiAodGhpcy5fd2F0Y2hQb3NpdGlvbklkID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuX3dhdGNoUG9zaXRpb25JZCA9IG5hdmlnYXRvci5nZW9sb2NhdGlvbi53YXRjaFBvc2l0aW9uKFxyXG4gICAgICAgIChwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgdGhpcy5fZ3BzUmVjZWl2ZWQocG9zaXRpb24pO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICBpZiAodGhpcy5fZXZlbnRIYW5kbGVyc1tcImdwc2Vycm9yXCJdKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlcnNbXCJncHNlcnJvclwiXShlcnJvci5jb2RlKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KGBHUFMgZXJyb3I6IGNvZGUgJHtlcnJvci5jb2RlfWApO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgZW5hYmxlSGlnaEFjY3VyYWN5OiB0cnVlLFxyXG4gICAgICAgICAgbWF4aW11bUFnZTogbWF4aW11bUFnZSxcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgc3RvcEdwcygpIHtcclxuICAgIGlmICh0aGlzLl93YXRjaFBvc2l0aW9uSWQgIT09IG51bGwpIHtcclxuICAgICAgbmF2aWdhdG9yLmdlb2xvY2F0aW9uLmNsZWFyV2F0Y2godGhpcy5fd2F0Y2hQb3NpdGlvbklkKTtcclxuICAgICAgdGhpcy5fd2F0Y2hQb3NpdGlvbklkID0gbnVsbDtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBmYWtlR3BzKGxvbiwgbGF0LCBlbGV2ID0gbnVsbCwgYWNjID0gMCkge1xyXG4gICAgaWYgKGVsZXYgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zZXRFbGV2YXRpb24oZWxldik7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fZ3BzUmVjZWl2ZWQoe1xyXG4gICAgICBjb29yZHM6IHtcclxuICAgICAgICBsb25naXR1ZGU6IGxvbixcclxuICAgICAgICBsYXRpdHVkZTogbGF0LFxyXG4gICAgICAgIGFjY3VyYWN5OiBhY2MsXHJcbiAgICAgIH0sXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxvbkxhdFRvV29ybGRDb29yZHMobG9uLCBsYXQpIHtcclxuICAgIGNvbnN0IHByb2plY3RlZFBvcyA9IHRoaXMuX3Byb2oucHJvamVjdChsb24sIGxhdCk7XHJcbiAgICByZXR1cm4gW3Byb2plY3RlZFBvc1swXSwgLXByb2plY3RlZFBvc1sxXV07XHJcbiAgfVxyXG5cclxuICBhZGQob2JqZWN0LCBsb24sIGxhdCwgZWxldikge1xyXG4gICAgdGhpcy5zZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpO1xyXG4gICAgdGhpcy5fc2NlbmUuYWRkKG9iamVjdCk7XHJcbiAgfVxyXG5cclxuICBzZXRXb3JsZFBvc2l0aW9uKG9iamVjdCwgbG9uLCBsYXQsIGVsZXYpIHtcclxuICAgIGNvbnN0IHdvcmxkQ29vcmRzID0gdGhpcy5sb25MYXRUb1dvcmxkQ29vcmRzKGxvbiwgbGF0KTtcclxuICAgIFtvYmplY3QucG9zaXRpb24ueCwgb2JqZWN0LnBvc2l0aW9uLnpdID0gd29ybGRDb29yZHM7XHJcbiAgICBpZiAoZWxldiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIG9iamVjdC5wb3NpdGlvbi55ID0gZWxldjtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldEVsZXZhdGlvbihlbGV2KSB7XHJcbiAgICB0aGlzLl9jYW1lcmEucG9zaXRpb24ueSA9IGVsZXY7XHJcbiAgfVxyXG5cclxuICBvbihldmVudE5hbWUsIGV2ZW50SGFuZGxlcikge1xyXG4gICAgdGhpcy5fZXZlbnRIYW5kbGVyc1tldmVudE5hbWVdID0gZXZlbnRIYW5kbGVyO1xyXG4gIH1cclxuXHJcbiAgX2dwc1JlY2VpdmVkKHBvc2l0aW9uKSB7XHJcbiAgICBsZXQgZGlzdE1vdmVkID0gTnVtYmVyLk1BWF9WQUxVRTtcclxuICAgIGlmIChwb3NpdGlvbi5jb29yZHMuYWNjdXJhY3kgPD0gdGhpcy5fZ3BzTWluQWNjdXJhY3kpIHtcclxuICAgICAgaWYgKHRoaXMuX2xhc3RDb29yZHMgPT09IG51bGwpIHtcclxuICAgICAgICB0aGlzLl9sYXN0Q29vcmRzID0ge1xyXG4gICAgICAgICAgbGF0aXR1ZGU6IHBvc2l0aW9uLmNvb3Jkcy5sYXRpdHVkZSxcclxuICAgICAgICAgIGxvbmdpdHVkZTogcG9zaXRpb24uY29vcmRzLmxvbmdpdHVkZSxcclxuICAgICAgICB9O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRpc3RNb3ZlZCA9IHRoaXMuX2hhdmVyc2luZURpc3QodGhpcy5fbGFzdENvb3JkcywgcG9zaXRpb24uY29vcmRzKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZGlzdE1vdmVkID49IHRoaXMuX2dwc01pbkRpc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5fbGFzdENvb3Jkcy5sb25naXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubG9uZ2l0dWRlO1xyXG4gICAgICAgIHRoaXMuX2xhc3RDb29yZHMubGF0aXR1ZGUgPSBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGU7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0V29ybGRQb3NpdGlvbihcclxuICAgICAgICAgIHRoaXMuX2NhbWVyYSxcclxuICAgICAgICAgIHBvc2l0aW9uLmNvb3Jkcy5sb25naXR1ZGUsXHJcbiAgICAgICAgICBwb3NpdGlvbi5jb29yZHMubGF0aXR1ZGVcclxuICAgICAgICApO1xyXG4gICAgICAgIGlmICh0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKSB7XHJcbiAgICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXJzW1wiZ3BzdXBkYXRlXCJdKHBvc2l0aW9uLCBkaXN0TW92ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQ2FsY3VsYXRlIGhhdmVyc2luZSBkaXN0YW5jZSBiZXR3ZWVuIHR3byBsYXQvbG9uIHBhaXJzLlxyXG4gICAqXHJcbiAgICogVGFrZW4gZnJvbSBvcmlnaW5hbCBBLUZyYW1lIGNvbXBvbmVudHNcclxuICAgKi9cclxuICBfaGF2ZXJzaW5lRGlzdChzcmMsIGRlc3QpIHtcclxuICAgIGNvbnN0IGRsb25naXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubG9uZ2l0dWRlIC0gc3JjLmxvbmdpdHVkZSk7XHJcbiAgICBjb25zdCBkbGF0aXR1ZGUgPSBUSFJFRS5NYXRoLmRlZ1RvUmFkKGRlc3QubGF0aXR1ZGUgLSBzcmMubGF0aXR1ZGUpO1xyXG5cclxuICAgIGNvbnN0IGEgPVxyXG4gICAgICBNYXRoLnNpbihkbGF0aXR1ZGUgLyAyKSAqIE1hdGguc2luKGRsYXRpdHVkZSAvIDIpICtcclxuICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChzcmMubGF0aXR1ZGUpKSAqXHJcbiAgICAgICAgTWF0aC5jb3MoVEhSRUUuTWF0aC5kZWdUb1JhZChkZXN0LmxhdGl0dWRlKSkgKlxyXG4gICAgICAgIChNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikgKiBNYXRoLnNpbihkbG9uZ2l0dWRlIC8gMikpO1xyXG4gICAgY29uc3QgYW5nbGUgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xyXG4gICAgcmV0dXJuIGFuZ2xlICogNjM3MTAwMDtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7IExvY2F0aW9uQmFzZWQgfTtcclxuIiwiY2xhc3MgU3BoTWVyY1Byb2plY3Rpb24ge1xyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5FQVJUSCA9IDQwMDc1MDE2LjY4O1xyXG4gICAgdGhpcy5IQUxGX0VBUlRIID0gMjAwMzc1MDguMzQ7XHJcbiAgfVxyXG5cclxuICBwcm9qZWN0KGxvbiwgbGF0KSB7XHJcbiAgICByZXR1cm4gW3RoaXMubG9uVG9TcGhNZXJjKGxvbiksIHRoaXMubGF0VG9TcGhNZXJjKGxhdCldO1xyXG4gIH1cclxuXHJcbiAgdW5wcm9qZWN0KHByb2plY3RlZCkge1xyXG4gICAgcmV0dXJuIFt0aGlzLnNwaE1lcmNUb0xvbihwcm9qZWN0ZWRbMF0pLCB0aGlzLnNwaE1lcmNUb0xhdChwcm9qZWN0ZWRbMV0pXTtcclxuICB9XHJcblxyXG4gIGxvblRvU3BoTWVyYyhsb24pIHtcclxuICAgIHJldHVybiAobG9uIC8gMTgwKSAqIHRoaXMuSEFMRl9FQVJUSDtcclxuICB9XHJcblxyXG4gIGxhdFRvU3BoTWVyYyhsYXQpIHtcclxuICAgIHZhciB5ID0gTWF0aC5sb2coTWF0aC50YW4oKCg5MCArIGxhdCkgKiBNYXRoLlBJKSAvIDM2MCkpIC8gKE1hdGguUEkgLyAxODApO1xyXG4gICAgcmV0dXJuICh5ICogdGhpcy5IQUxGX0VBUlRIKSAvIDE4MC4wO1xyXG4gIH1cclxuXHJcbiAgc3BoTWVyY1RvTG9uKHgpIHtcclxuICAgIHJldHVybiAoeCAvIHRoaXMuSEFMRl9FQVJUSCkgKiAxODAuMDtcclxuICB9XHJcblxyXG4gIHNwaE1lcmNUb0xhdCh5KSB7XHJcbiAgICB2YXIgbGF0ID0gKHkgLyB0aGlzLkhBTEZfRUFSVEgpICogMTgwLjA7XHJcbiAgICBsYXQgPVxyXG4gICAgICAoMTgwIC8gTWF0aC5QSSkgKlxyXG4gICAgICAoMiAqIE1hdGguYXRhbihNYXRoLmV4cCgobGF0ICogTWF0aC5QSSkgLyAxODApKSAtIE1hdGguUEkgLyAyKTtcclxuICAgIHJldHVybiBsYXQ7XHJcbiAgfVxyXG5cclxuICBnZXRJRCgpIHtcclxuICAgIHJldHVybiBcImVwc2c6Mzg1N1wiO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgU3BoTWVyY1Byb2plY3Rpb24gfTtcclxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XHJcblxyXG5jbGFzcyBXZWJjYW1SZW5kZXJlciB7XHJcbiAgY29uc3RydWN0b3IocmVuZGVyZXIsIHZpZGVvRWxlbWVudCkge1xyXG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyO1xyXG4gICAgdGhpcy5yZW5kZXJlci5hdXRvQ2xlYXIgPSBmYWxzZTtcclxuICAgIHRoaXMuc2NlbmVXZWJjYW0gPSBuZXcgVEhSRUUuU2NlbmUoKTtcclxuICAgIGxldCB2aWRlbztcclxuICAgIGlmICh2aWRlb0VsZW1lbnQgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB2aWRlbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ2aWRlb1wiKTtcclxuICAgICAgdmlkZW8uc2V0QXR0cmlidXRlKFwiYXV0b3BsYXlcIiwgdHJ1ZSk7XHJcbiAgICAgIHZpZGVvLnNldEF0dHJpYnV0ZShcInBsYXlzaW5saW5lXCIsIHRydWUpO1xyXG4gICAgICB2aWRlby5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodmlkZW8pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmlkZW8gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZpZGVvRWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmdlb20gPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSgpO1xyXG4gICAgdGhpcy50ZXh0dXJlID0gbmV3IFRIUkVFLlZpZGVvVGV4dHVyZSh2aWRlbyk7XHJcbiAgICB0aGlzLm1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0aGlzLnRleHR1cmUgfSk7XHJcbiAgICBjb25zdCBtZXNoID0gbmV3IFRIUkVFLk1lc2godGhpcy5nZW9tLCB0aGlzLm1hdGVyaWFsKTtcclxuICAgIHRoaXMuc2NlbmVXZWJjYW0uYWRkKG1lc2gpO1xyXG4gICAgdGhpcy5jYW1lcmFXZWJjYW0gPSBuZXcgVEhSRUUuT3J0aG9ncmFwaGljQ2FtZXJhKFxyXG4gICAgICAtMC41LFxyXG4gICAgICAwLjUsXHJcbiAgICAgIDAuNSxcclxuICAgICAgLTAuNSxcclxuICAgICAgMCxcclxuICAgICAgMTBcclxuICAgICk7XHJcbiAgICBpZiAobmF2aWdhdG9yLm1lZGlhRGV2aWNlcyAmJiBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzLmdldFVzZXJNZWRpYSkge1xyXG4gICAgICBjb25zdCBjb25zdHJhaW50cyA9IHtcclxuICAgICAgICB2aWRlbzoge1xyXG4gICAgICAgICAgd2lkdGg6IDEyODAsXHJcbiAgICAgICAgICBoZWlnaHQ6IDcyMCxcclxuICAgICAgICAgIGZhY2luZ01vZGU6IFwiZW52aXJvbm1lbnRcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9O1xyXG4gICAgICBuYXZpZ2F0b3IubWVkaWFEZXZpY2VzXHJcbiAgICAgICAgLmdldFVzZXJNZWRpYShjb25zdHJhaW50cylcclxuICAgICAgICAudGhlbigoc3RyZWFtKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZyhgdXNpbmcgdGhlIHdlYmNhbSBzdWNjZXNzZnVsbHkuLi5gKTtcclxuICAgICAgICAgIHZpZGVvLnNyY09iamVjdCA9IHN0cmVhbTtcclxuICAgICAgICAgIHZpZGVvLnBsYXkoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoZSkgPT4ge1xyXG4gICAgICAgICAgYWxlcnQoYFdlYmNhbSBlcnJvcjogJHtlfWApO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYWxlcnQoXCJzb3JyeSAtIG1lZGlhIGRldmljZXMgQVBJIG5vdCBzdXBwb3J0ZWRcIik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoKSB7XHJcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyKCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnJlbmRlcih0aGlzLnNjZW5lV2ViY2FtLCB0aGlzLmNhbWVyYVdlYmNhbSk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLmNsZWFyRGVwdGgoKTtcclxuICB9XHJcblxyXG4gIGRpc3Bvc2UoKSB7XHJcbiAgICB0aGlzLm1hdGVyaWFsLmRpc3Bvc2UoKTtcclxuICAgIHRoaXMudGV4dHVyZS5kaXNwb3NlKCk7XHJcbiAgICB0aGlzLmdlb20uZGlzcG9zZSgpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IHsgV2ViY2FtUmVuZGVyZXIgfTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX3RocmVlX187IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IExvY2F0aW9uQmFzZWQgfSBmcm9tIFwiLi9qcy9sb2NhdGlvbi1iYXNlZC5qc1wiO1xyXG5pbXBvcnQgeyBXZWJjYW1SZW5kZXJlciB9IGZyb20gXCIuL2pzL3dlYmNhbS1yZW5kZXJlci5qc1wiO1xyXG5pbXBvcnQgeyBEZXZpY2VPcmllbnRhdGlvbkNvbnRyb2xzIH0gZnJvbSBcIi4vanMvZGV2aWNlLW9yaWVudGF0aW9uLWNvbnRyb2xzLmpzXCI7XHJcblxyXG5leHBvcnQgeyBMb2NhdGlvbkJhc2VkLCBXZWJjYW1SZW5kZXJlciwgRGV2aWNlT3JpZW50YXRpb25Db250cm9scyB9O1xyXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=