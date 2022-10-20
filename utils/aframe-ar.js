!function(e){var t={};function n(a){if(t[a])return t[a].exports;var i=t[a]={i:a,l:!1,exports:{}};return e[a].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=t,n.d=function(e,t,a){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:a})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var a=Object.create(null);if(n.r(a),Object.defineProperty(a,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(a,i,function(t){return e[t]}.bind(null,i));return a},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){n(1),n(2),n(3),n(4),n(5),n(6),n(7),n(8)},function(e,t){var n,a,i;AFRAME.registerComponent("webxr-ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1},worldSensing:{default:!1}},init:function(){this.posePosition=new THREE.Vector3,this.poseQuaternion=new THREE.Quaternion,this.poseEuler=new THREE.Euler(0,0,0,"YXZ"),this.poseRotation=new THREE.Vector3,this.projectionMatrix=new THREE.Matrix4,this.onceSceneLoaded=this.onceSceneLoaded.bind(this),this.el.sceneEl.hasLoaded?setTimeout(this.onceSceneLoaded):this.el.sceneEl.addEventListener("loaded",this.onceSceneLoaded),this.rawPlanes_=null,this.planes_=new Map,this.anchors_=new Map},convertPolygonToVertices:function(e){return newVertices},convertedPlane:function(e,t){var n,a=[0,0],i=[0,0],r=e.polygon.length,o=new Float32Array(3*r),s=0,c=0;for(s=0;s<r;s++)n=e.polygon[s],o[c]=n.x,o[c+1]=n.y,o[c+2]=n.z,c+=3,0==s?(a[0]=i[0]=n.x,a[1]=i[1]=n.z):(a[0]>n.x&&(a[0]=n.x),i[0]<n.x&&(i[0]=n.x),a[1]>n.z&&(a[1]=n.z),i[1]<n.z&&(i[1]=n.z));var l=t.transform.position;return e.position.set(l.x,l.y,l.z),{id:e.id,center:e.position,extent:[i[0]-a[0],i[1]-a[1]],modelMatrix:t.transform.matrix,alignment:"Horizontal"!=e.orientation?1:0,vertices:o}},rawPlaneRemoved:function(e){this.planes_.delete(e.id)},rawPlaneUpdated:function(e,t){this.planes_.set(e.id,this.convertedPlane(e,t))},rawPlaneNotUpdated:function(e,t){this.rawPlaneUpdated(e,t)},rawPlaneCreated:function(e,t){e.id=Math.random().toString().substring(2),e.position=new THREE.Vector3,this.planes_[e.id]=this.convertedPlane(e,t)},tick:function(e,t){let n=this.el.sceneEl.frame;if(!this.arDisplay||!n||!n.worldInformation)return;let a=n.worldInformation;this.rawPlanes_&&this.rawPlanes_.forEach(e=>{a.detectedPlanes&&a.detectedPlanes.has(e)||this.rawPlaneRemoved(e)});let i=this.el.sceneEl.time;a.detectedPlanes&&a.detectedPlanes.forEach(e=>{let t=n.getPose(e.planeSpace,this.refSpace);this.rawPlanes_.has(e)?e.lastChangedTime==i?this.rawPlaneUpdated(e,t):this.rawPlaneNotUpdated(e,t):this.rawPlaneCreated(e,t)}),this.rawPlanes_=a.detectedPlanes},takeOverCamera:function(e){this.arCamera=e,e.isARPerspectiveCamera=!0,e.vrDisplay=this.arDisplay,e.el.setAttribute("ar-camera","enabled",!0)},onceSceneLoaded:function(){var e=this;window.addEventListener("ardisplayconnect",(function(){e.arDisplay||e.checkForARDisplay()})),this.checkForARDisplay()},checkForARDisplay:function(){if(navigator.xr&&navigator.xr.isSessionSupported){var e=this;e.arDisplay={type:"webxr-ar"},navigator.xr.isSessionSupported("immersive-ar").then((function(t){if(t){let t=["local-floor"],n=[];(e.data.worldSensing?t:n).push("hit-test");let a=e.el.sceneEl.getAttribute("webxr");a?(a.optionalFeatures.forEach((function(e){n=n.filter((function(t,n,a){return t!=e}))})),a.requiredFeatures.forEach((function(e){t=t.filter((function(t,n,a){return t!=e}))})),t.forEach((function(e){a.optionalFeatures=a.optionalFeatures.filter((function(t,n,a){return t!=e}))})),a.requiredFeatures=a.requiredFeatures.concat(t),a.optionalFeatures=a.optionalFeatures.concat(n),e.el.sceneEl.setAttribute("webxr",a)):e.el.sceneEl.setAttribute("webxr",{requiredFeatures:t.join(","),optionalFeatures:n.join(",")}),e.el.sceneEl.setAttribute("vr-mode-ui","enabled","true"),e.xrHitTestSource=null,e.viewerSpace=null,e.refSpace=null,e.el.sceneEl.renderer.xr.addEventListener("sessionend",t=>{e.viewerSpace=null,e.refSpace=null,e.xrHitTestSource=null}),e.el.sceneEl.renderer.xr.addEventListener("sessionstart",t=>{let n=e.el.sceneEl.renderer.xr.getSession(),a=e.el.sceneEl.canvas;n.addEventListener("selectstart",(function(e){var t=e.inputSource.gamepad.axes[0],n=e.inputSource.gamepad.axes[1];setTimeout(()=>{var e=new TouchEvent("touchstart",{view:window,bubbles:!0,cancelable:!0});e.targetTouches=[{pageX:t,pageY:n}],a.dispatchEvent(e)})})),n.addEventListener("selectend",(function(e){var t=e.inputSource.gamepad.axes[0],n=e.inputSource.gamepad.axes[1];setTimeout(()=>{var e=new TouchEvent("touchend",{view:window,bubbles:!0,cancelable:!0});e.targetTouches=[{pageX:t,pageY:n}],a.dispatchEvent(e)})})),n.addEventListener("select",(function(e){var t=e.inputSource.gamepad.axes[0],n=e.inputSource.gamepad.axes[1];setTimeout(()=>{var e=new MouseEvent("click",{clientX:t,clientY:n,bubbles:!0,cancelable:!0});a.dispatchEvent(e)})})),n.requestReferenceSpace("viewer").then(t=>{e.viewerSpace=t,e.data.worldSensing&&n.requestHitTestSource({space:e.viewerSpace}).then(t=>{e.xrHitTestSource=t})}),n.requestReferenceSpace("local-floor").then(t=>{e.refSpace=t}),e.data.worldSensing&&n.updateWorldTrackingState({planeDetectionState:{enabled:!0}})})}}))}},getPosition:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.posePosition:null},getOrientation:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.poseQuaternion:null},getRotation:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.poseRotation:null},getProjectionMatrix:function(){return this.arDisplay&&this.arDisplay.getFrameData?this.projectionMatrix:null},hitAR:(n=new THREE.Matrix4,a=new THREE.Vector3,new THREE.Quaternion,new THREE.Vector3,i=new THREE.Vector3,function(e,t,r,o){if(!this.arDisplay)return[];var s=[];if(this.el.sceneEl.is("ar-mode")){if(!this.viewerSpace)return;let e=this.el.sceneEl.frame,t=e.getViewerPose(this.refSpace);if(this.xrHitTestSource&&t){let t=e.getHitTestResults(this.xrHitTestSource);s=[];for(var c=0;t&&c<t.length;c++){let e=t[c].getPose(this.refSpace);n.fromArray(e.transform.matrix),a.setFromMatrixPosition(n),o.object3D.getWorldPosition(i),s.push({distance:a.distanceTo(i),point:a.clone(),object:r&&r.object3D||this.el.sceneEl.object3D})}}}return s}),addImage:function(e,t,n){return this.arDisplay,null},removeImage:function(e){return this.arDisplay,null},getAnchors:function(){return Array.from(this.anchors_.values())},getPlanes:function(){return Array.from(this.planes_.values())}})},function(e,t){function n(e){var t,n=e.length,a=new Float32Array(3*n),i=0,r=0;for(i=0;i<n;i++)t=e[i],a[r]=t.x,a[r+1]=t.y,a[r+2]=t.z,r+=3;return a}var a,i,r,o,s;AFRAME.registerComponent("mozilla-xr-ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1},worldSensing:{default:!0}},init:function(){this.onInit=this.onInit.bind(this),this.onWatch=this.onWatch.bind(this),this.forceResize=this.forceResize.bind(this),this.poseMatrix=new THREE.Matrix4,this.posePosition=new THREE.Vector3,this.poseQuaternion=new THREE.Quaternion,this.poseEuler=new THREE.Euler(0,0,0,"YXZ"),this.poseRotation=new THREE.Vector3,this.projectionMatrix=new THREE.Matrix4,this.viewMatrix=new THREE.Matrix4,this.onceSceneLoaded=this.onceSceneLoaded.bind(this),this.el.sceneEl.hasLoaded?setTimeout(this.onceSceneLoaded):this.el.sceneEl.addEventListener("loaded",this.onceSceneLoaded),this.planes_=new Map,this.anchors_=new Map},takeOverCamera:function(e){this.arCamera=e,e.el.setAttribute("ar-camera","enabled",!0)},onceSceneLoaded:function(){if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.initAR&&!(navigator.userAgent.indexOf("Mobile WebXRViewer/v1.")<0)){window.arkitCallback0=this.onInit,window.arkitCallback1=this.onWatch;var e={options:{ui:{browser:!0,points:!0,focus:!1,rec:!0,rec_time:!0,mic:!1,build:!1,plane:!0,warnings:!0,anchors:!1,debug:!0,statistics:!1}},callback:"arkitCallback0"};window.setNativeTime=function(e){window.nativeTime=e.nativeTime},["arkitStartRecording","arkitStopRecording","arkitDidMoveBackground","arkitWillEnterForeground","arkitInterrupted","arkitInterruptionEnded","arkitShowDebug","onError","arTrackingChanged","ios_did_receive_memory_warning","onComputerVisionData","userGrantedComputerVisionData","userGrantedWorldSensingData"].forEach((function(e){window[e]=function(t){console.log(e+":",t)}}));var t=this;t.el.addEventListener("exit-vr",(function(e){window.webkit.messageHandlers.stopAR.postMessage({}),t.data.takeOverCamera&&t.arCamera&&t.arCamera.el.setAttribute("ar-camera","enabled",!1),setTimeout((function(){t.el.sceneEl.components["vr-mode-ui"].enterAREl.classList.remove("a-hidden")}))}));var n=this.el.sceneEl.components["vr-mode-ui"],a=n.enterAREl.cloneNode(!0);n.enterAREl.parentNode.replaceChild(a,n.enterAREl),n.enterAREl=a,n.enterAREl.classList.remove("a-hidden"),n.enterAREl.onclick=function(){var n=AFRAME.scenes[0];n.addState("ar-mode"),n.components["vr-mode-ui"].orientationModalEl.style="display:none!important",n.addState("vr-mode"),n.emit("enter-vr",{target:n}),window.webkit.messageHandlers.initAR.postMessage(e),n.wakelock.release(),t.data.takeOverCamera&&setTimeout((function(){t.takeOverCamera(n.camera)}));let a=new THREE.Vector2,i=n.renderer.getPixelRatio();n.renderer.getSize(a),console.log("pixelRatio ",i," size ",a),n.canvas.style.position="absolute !important",n.canvas.style.width="100% !important",n.canvas.style.height="100% !important",window.userGrantedWorldSensingData=function(e){console.log("userGrantedWorldSensingData:",e),setTimeout((function(){t.forceResize(screen.width*window.devicePixelRatio,screen.height*window.devicePixelRatio)}),100)}}}},forceResize:function(e,t){var n=this.el.sceneEl;console.log("forceResize ",e,t," was ",n.canvas.width,n.canvas.height,screen.width,screen.height,window.devicePixelRatio,n.renderer.getPixelRatio());var a=n.renderer.getPixelRatio(),i=n.maxCanvasSize;(e*a>i.width||t*a>i.height)&&(console.log("applying maxSize constraints ",i),aspectRatio=e/t,e*a>i.width&&-1!==i.width&&(e=Math.round(i.width/a),t=Math.round(i.width/aspectRatio/a)),t*a>i.height&&-1!==i.height&&(t=Math.round(i.height/a),e=Math.round(i.height*aspectRatio/a)),console.log("applied maxSize constraints ",e,t,i)),e=e||this.forceResizeX,this.forceResizeX=e,t=t||this.forceResizeY,this.forceResizeY=t,n.canvas.setAttribute("width",e),n.canvas.setAttribute("height",t),n.camera.aspect=e/t,n.camera.projectionMatrix.copy(this.projectionMatrix),n.renderer.setSize(e,t,!1),n.emit("rendererresize",null,!1)},checkForARDisplay:function(){if(window.webkit&&window.webkit.messageHandlers&&window.webkit.messageHandlers.watchAR&&!(navigator.userAgent.indexOf("Mobile WebXRViewer/v1.")<0)){var e=this;e.arDisplay=!0;var t={options:{location:!0,camera:!0,objects:!0,light_intensity:!0,worldSensing:this.data.worldSensing},callback:"arkitCallback1"};window.arkitWindowResize=function(t){console.log("arkitWindowResize:",t),setTimeout((function(){e.forceResize(t.width*window.devicePixelRatio,t.height*window.devicePixelRatio)}),150)},window.webkit.messageHandlers.watchAR.postMessage(t)}},onInit:function(e){this.checkForARDisplay()},onWatch:function(e){this.frameData=e,this.handleFrame(e)},handleFrame:function(e){var t,a;if(this.poseMatrix.fromArray(e.camera_transform),this.poseMatrix.decompose(this.posePosition,this.poseQuaternion,this.poseRotation),this.poseEuler.setFromQuaternion(this.poseQuaternion),this.poseRotation.set(THREE.Math.RAD2DEG*this.poseEuler.x,THREE.Math.RAD2DEG*this.poseEuler.y,THREE.Math.RAD2DEG*this.poseEuler.z),this.projectionMatrix.fromArray(e.projection_camera),this.viewMatrix.fromArray(e.camera_view),this.arCamera&&this.data.cameraUserHeight&&(this.posePosition.y+=this.arCamera.el.components.camera.data.userHeight),this.posePosition.x||this.posePosition.y||this.posePosition.z||this.poseQuaternion.x||this.poseQuaternion.y||this.poseQuaternion.z?!1!==this.poseLost&&(this.poseLost=!1,this.el.emit("poseFound")):!0!==this.poseLost&&(this.poseLost=!0,this.el.emit("poseLost",!1)),e.newObjects&&e.newObjects.length)for(t=0;t<e.newObjects.length;t++)if((a=e.newObjects[t]).plane_center)this.planes_.set(a.uuid,{id:a.uuid,center:a.plane_center,extent:[a.plane_extent.x,a.plane_extent.z],modelMatrix:a.transform,alignment:a.plane_alignment,vertices:n(a.geometry.vertices)});else{var i={id:a.uuid,modelMatrix:a.transform};"image"===a.type&&(i.name=a.uuid),this.anchors_.set(a.uuid,i)}if(e.removedObjects&&e.removedObjects.length)for(t=0;t<e.removedObjects.length;t++)a=e.removedObjects[t],this.planes_.get(a)?this.planes_.delete(a):this.anchors_.delete(a);if(e.objects&&e.objects.length)for(t=0;t<e.objects.length;t++)if((a=e.objects[t]).plane_center){var r=this.planes_.get(a.uuid);r?(r.center=a.plane_center,r.extent=[a.plane_extent.x,a.plane_extent.z],r.modelMatrix=a.transform,r.alignment=a.plane_alignment,r.vertices=n(a.geometry.vertices)):this.planes_.set(a.uuid,{id:a.uuid,center:a.plane_center,extent:[a.plane_extent.x,a.plane_extent.z],modelMatrix:a.transform,alignment:a.plane_alignment,vertices:n(a.geometry.vertices)})}else{var o=this.anchors_.get(a.uuid);o?o.modelMatrix=a.transform:this.anchors_.set(a.uuid,{id:a.uuid,modelMatrix:a.transform})}},getPosition:function(){return this.arDisplay?this.posePosition:null},getOrientation:function(){return this.arDisplay?this.poseQuaternion:null},getRotation:function(){return this.arDisplay?this.poseRotation:null},getProjectionMatrix:function(){return this.arDisplay?this.projectionMatrix:null},addImage:function(e,t,n){if(!this.arDisplay)return null;var a,i=document.createElement("canvas"),r=i.getContext("2d");if(a||((a=document.createElement("img")).crossOrigin="anonymous",a.src=t,document.body.appendChild(a)),a.complete&&a.naturalHeight)if(a.width&&a.height){i.width=a.width,i.height=a.height,r.drawImage(a,0,0);var o=function(e){var t="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=e;e instanceof ArrayBuffer?a=new Uint8Array(arrayBuffer):e instanceof ImageData&&(a=e.data);for(var i,r=e.length,o=r%3,s=r-o,c=0;c<s;c+=3)t+=n[(16515072&(i=a[c]<<16|a[c+1]<<8|a[c+2]))>>18]+n[(258048&i)>>12]+n[(4032&i)>>6]+n[63&i];return 1==o?t+=n[(252&(i=a[s]))>>2]+n[(3&i)<<4]+"==":2==o&&(t+=n[(64512&(i=a[s]<<8|a[s+1]))>>10]+n[(1008&i)>>4]+n[(15&i)<<2]+"="),t}(r.getImageData(0,0,a.width,a.height).data);if(o){window.callbackForCreateImageAnchorCounter=(window.callbackForCreateImageAnchorCounter||0)+1;var s="callbackForCreateImageAnchor_"+window.callbackForCreateImageAnchorCounter,c=e;window[s]=function(e){void 0!==e.created?e.created?window.webkit.messageHandlers.activateDetectionImage.postMessage({callback:s,uid:c}):(console.log("addImage: !created; ",e.error),delete window[s]):void 0!==e.activated&&(e.activated||console.log("addImage: !activated; ",e.error),delete window[s])},window.webkit.messageHandlers.createImageAnchor.postMessage({callback:s,uid:e,buffer:o,imageWidth:a.width,imageHeight:a.height,physicalWidth:n})}else console.log("!!! addImage: !b64ImageData, aborting")}else console.log("!!! addImage: !aImg.width || !aImg.height, aborting");else console.log("!!! addImage: !aImg.complete || !aImg.naturalHeight, aborting")},removeImage:function(e){if(!this.arDisplay)return null;window.callbackForRemoveImageAnchorCounter=(window.callbackForRemoveImageAnchorCounter||0)+1;var t="callbackForRemoveImageAnchor_"+window.callbackForRemoveImageAnchorCounter,n=e;window[t]=function(e){void 0!==e.deactivated&&(e.deactivated||(console.log("!!! "+t+": !deactivated",e.error),delete window[t]),window.webkit.messageHandlers.destroyDetectionImage.postMessage({callback:t,uid:n})),void 0!==e.destroyed&&(e.destroyed||console.log("!!! "+t+": !destroyed, ",e.error),delete window[t])},window.webkit.messageHandlers.deactivateDetectionImage.postMessage({callback:t,uid:n})},getAnchors:function(){return Array.from(this.anchors_.values())},getPlanes:function(){return Array.from(this.planes_.values())},hitTestNoAnchor:function(){function e(){return this.modelMatrix=new Float32Array(16),this}var t,n={rayStart:new THREE.Vector3,rayEnd:new THREE.Vector3,cameraPosition:new THREE.Vector3,cameraQuaternion:new THREE.Quaternion,projViewMatrix:new THREE.Matrix4,worldRayStart:new THREE.Vector3,worldRayEnd:new THREE.Vector3,worldRayDir:new THREE.Vector3,planeMatrix:new THREE.Matrix4,planeMatrixInverse:new THREE.Matrix4,planeExtent:new THREE.Vector3,planePosition:new THREE.Vector3,planeCenter:new THREE.Vector3,planeNormal:new THREE.Vector3,planeIntersection:new THREE.Vector3,planeIntersectionLocal:new THREE.Vector3,planeHit:new THREE.Matrix4,planeQuaternion:new THREE.Quaternion},a=(t=new THREE.Vector3,function(e,n,a,i){var r=e.dot(i);return t.subVectors(n,a),t.dot(e)/r}),i=function(e,t){n.planeMatrix.fromArray(e.modelMatrix),n.planeIntersection.setFromMatrixPosition(n.planeMatrix);var a=n.planeIntersection.distanceTo(n.cameraPosition);return n.planeMatrix.fromArray(t.modelMatrix),n.planeIntersection.setFromMatrixPosition(n.planeMatrix),a<n.planeIntersection.distanceTo(n.cameraPosition)?-1:1};return function(t,r){if(t<0||t>1||r<0||r>1)throw new Error("hitTest - x and y values must be normalized [0,1]!");var o=[],s=this.getPlanes();if(!s||0===s.length)return o;n.rayStart.set(2*t-1,2*(1-r)-1,0),n.rayEnd.set(2*t-1,2*(1-r)-1,1),n.planeMatrix.multiplyMatrices(this.projectionMatrix,this.viewMatrix),n.projViewMatrix.getInverse(n.planeMatrix),n.worldRayStart.copy(n.rayStart).applyMatrix4(n.projViewMatrix),n.worldRayEnd.copy(n.rayEnd).applyMatrix4(n.projViewMatrix),n.worldRayDir.subVectors(n.worldRayEnd,n.worldRayStart).normalize();for(var c=0;c<s.length;c++){var l=s[c];n.planeMatrix.fromArray(l.modelMatrix),n.planeCenter.set(l.center.x,l.center.y,l.center.z),n.planePosition.copy(n.planeCenter).applyMatrix4(n.planeMatrix),n.planeAlignment=l.alignment,0===n.planeAlignment?n.planeNormal.set(0,1,0):n.planeNormal.set(n.planeMatrix[4],n.planeMatrix[5],n.planeMatrix[6]);var d=a(n.planeNormal,n.planePosition,n.worldRayStart,n.worldRayDir);if(!(d<0)){n.planeIntersectionLocal.copy(n.worldRayDir).multiplyScalar(d),n.planeIntersection.addVectors(n.worldRayStart,n.planeIntersectionLocal),n.planeExtent.set(l.extent[0],0,l.extent[1]),n.planeMatrixInverse.getInverse(n.planeMatrix),n.planeIntersectionLocal.copy(n.planeIntersection).applyMatrix4(n.planeMatrixInverse);if(!(Math.abs(n.planeIntersectionLocal.x)>n.planeExtent.x/2+.0075||Math.abs(n.planeIntersectionLocal.z)>n.planeExtent.z/2+.0075)){n.planeQuaternion.setFromRotationMatrix(n.planeMatrix),n.planeHit.makeRotationFromQuaternion(n.planeQuaternion).setPosition(n.planeIntersection);for(var h=new e,u=0;u<16;u++)h.modelMatrix[u]=n.planeHit.elements[u];h.i=c,o.push(h)}}}return o.sort(i),o}}(),hitAR:(a=new THREE.Matrix4,i=new THREE.Vector3,r=new THREE.Quaternion,o=new THREE.Vector3,s=new THREE.Vector3,function(e,t,n,c){if(!this.arDisplay)return[];for(var l=this.hitTestNoAnchor(e,t),d=[],h=0;l&&h<l.length;h++)a.fromArray(l[h].modelMatrix),a.decompose(i,r,o),c.object3D.getWorldPosition(s),d.push({distance:i.distanceTo(s),point:i.clone(),object:n&&n.object3D||this.el.sceneEl.object3D});return d})})},function(e,t){var n,a,i,r;AFRAME.registerComponent("ar-planes",{getPlaneSource:function(){var e;return this.planeSource||(e=this.el.sceneEl.components.ar)&&(this.planeSource=e.getSource()),this.planeSource},getPlanes:function(){var e=this.getPlaneSource();if(e&&e.getPlanes)return e.getPlanes()},init:function(){this.planes={},this.anchorsAdded=[],this.anchorsAddedDetail={type:"added",anchors:this.anchorsAdded},this.anchorsUpdated=[],this.anchorsUpdatedDetail={type:"updated",anchors:this.anchorsUpdated},this.anchorsRemoved=[],this.anchorsRemovedDetail={type:"removed",anchors:this.anchorsRemoved}},tick:(n=new THREE.Vector3(1,1,1),a=new THREE.Matrix4,i=new THREE.Vector3,r=new THREE.Quaternion,function(e,t){var o=this.getPlanes();if(o){var s,c=[],l=[],d=[],h={};for(s=0;o&&s<o.length;s++){var u,p=o[s],m=(void 0!==p.identifier?p.identifier:p.id).toString(),f=p.timestamp;h[m]=!0;var g=!this.planes[m],w=void 0!==f;if(g||!w||f!==this.planes[m].timestamp){if(u={identifier:m},void 0!==f&&(u.timestamp=f),p.modelMatrix||p.transform?u.modelMatrix=p.modelMatrix||p.transform:(i.fromArray(p.position),r.fromArray(p.orientation),n.set(1,1,1),a.compose(i,r,n),u.modelMatrix=a.elements.slice()),u.extent=p.extent,p.center&&(u.center=p.center),p.polygon?u.vertices=p.polygon:p.vertices&&(u.vertices=p.vertices),g)c.push(u);else if(w)l.push(u);else{if(AFRAME.utils.deepEqual(u,this.planes[m]))continue;l.push(u)}w?this.planes[m]=u:(this.planes[m]={identifier:u.identifier,modelMatrix:u.modelMatrix.slice(),extent:u.extent.slice()},u.vertices&&(this.planes[m].vertices=u.vertices.slice()))}}var v=this;Object.keys(v.planes).forEach((function(e){h[e]||(d.push(v.planes[e]),delete v.planes[e])})),this.anchorsAdded=c,c.length>0&&(this.anchorsAddedDetail.anchors=c,this.el.emit("anchorsadded",this.anchorsAddedDetail)),this.anchorsUpdated=l,l.length>0&&(this.anchorsUpdatedDetail.anchors=l,this.el.emit("anchorsupdated",this.anchorsUpdatedDetail)),this.anchorsRemoved=d,d.length>0&&(this.anchorsRemovedDetail.anchors=d,this.el.emit("anchorsremoved",this.anchorsRemovedDetail))}})})},function(e,t){AFRAME.registerComponent("ar-anchors",{getSource:function(){var e;return this.source||(e=this.el.sceneEl.components.ar)&&(this.source=e.getSource()),this.source},getAnchors:function(){var e=this.getSource();if(e&&e.getAnchors)return e.getAnchors()}})},function(e,t){AFRAME.registerComponent("ar-images",{getSource:function(){var e;return this.source||(e=this.el.sceneEl.components.ar)&&(this.source=e.getSource()),this.source},addImage:function(e,t,n){var a=this.getSource();if(a&&a.addImage)return a.addImage(e,t,n)},removeImage:function(e){var t=this.getSource();if(t&&t.removeImage)return t.removeImage(e)}})},function(e,t){AFRAME.registerComponent("ar",{schema:{takeOverCamera:{default:!0},cameraUserHeight:{default:!1},worldSensing:{default:!0},hideUI:{default:!1}},dependencies:["webxr-ar","mozilla-xr-ar","ar-planes","ar-anchors"],getSource:function(){var e;if(!this.source){var t=this;t.dependencies.forEach((function(n){(e=t.el.sceneEl.components[n])&&e.arDisplay&&(t.source=e)}))}return this.source},getPlanes:function(){return this.source?this.source.getPlanes():void 0},getAnchors:function(){return this.source?this.source.getAnchors():void 0},addImage:function(e,t,n){return this.source.addImage(e,t,n)},removeImage:function(e){return this.source.removeImage(e)},init:function(){var e={takeOverCamera:this.data.takeOverCamera,cameraUserHeight:this.data.cameraUserHeight,worldSensing:this.data.worldSensing},t=this;this.dependencies.forEach((function(n){t.el.setAttribute(n,e)})),this.data.hideUI&&this.el.sceneEl.setAttribute("vr-mode-ui",{enabled:!1}),document.head.insertAdjacentHTML("beforeend","<style>html,body {background-color: transparent !important;}</style>")}})},function(e,t){AFRAME.registerComponent("ar-camera",{schema:{enabled:{default:!0}},init:function(){var e=this.el.getAttribute("look-controls");this.wasLookControlsEnabled=!!e&&e.enabled},update:function(e){if(!e||e.enabled!==this.data.enabled)if(this.data.enabled){var t=this.el.getAttribute("look-controls");this.wasLookControlsEnabled=!!t&&t.enabled,this.wasLookControlsEnabled&&this.el.setAttribute("look-controls","enabled",!1)}else this.wasLookControlsEnabled&&this.el.setAttribute("look-controls","enabled",!0)},tick:function(e,t){if(this.data.enabled){var n=this.checkWhichAR();if(n){var a=n.getPosition();a&&this.el.setAttribute("position",a);var i=n.getRotation();if(i&&this.el.setAttribute("rotation",i),!this.el.sceneEl.is("vr-mode")){var r=n.getProjectionMatrix();r&&(this.el.components.camera.camera.projectionMatrix=r)}}}},checkWhichAR:function(){if(!this.whichar){var e=this.el.sceneEl.components.ar.getSource();if(!e||!e.arDisplay)return;this.whichar=e}return this.whichar}})},function(e,t){AFRAME.registerComponent("ar-raycaster",{dependencies:["raycaster"],schema:{x:{default:.5},y:{default:.5},el:{type:"selector"}},init:function(){this.raycaster=this.el.components.raycaster.raycaster,this.raycasterIntersectObjects=this.raycaster.intersectObjects.bind(this.raycaster),this.raycaster.intersectObjects=this.intersectObjects.bind(this)},update:function(e){this.data.el||this.el.sceneEl.object3D.el||(this.el.sceneEl.object3D.el=this.el.sceneEl)},intersectObjects:function(e,t,n){var a=this.raycasterIntersectObjects(e,t,n),i=this.hitAR();return i&&i.length&&(n?(i.forEach(e=>n.push(e)),a=n):i.forEach(e=>a.push(e))),a},hitAR:function(){var e=this.checkWhichAR();if(!e||!e.arDisplay)return[];var t=this.data.x,n=this.data.y;return arguments.length>=2&&(t=arguments[0],n=arguments[1]),e.hitAR(t,n,this.data.el,this.el)},checkWhichAR:function(){if(!this.whichar){var e=this.el.sceneEl.components.ar;if(e&&(e=e.getSource?e.getSource():void 0),!e||!e.arDisplay)return;this.whichar=e}return this.whichar}})}]);
//# sourceMappingURL=aframe-ar.min.js.map