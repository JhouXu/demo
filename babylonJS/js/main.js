"use strict";

// 初始化大小
window.onload = () => renderRect();
window.onresize = () => renderRect();
function renderRect() {
  var { innerWidth, innerHeight } = window;
  var canvas = document.getElementById("renderCanvas");
  canvas.style.width = `${innerWidth}px`;
  canvas.style.height = `${innerHeight}px`;
}

const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
// Add your code here matching the playground format
const createScene = function () {
  // const scene = new BABYLON.Scene(engine);
  // BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/", "box.babylon");
  // const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  // camera.attachControl(canvas, true);
  // const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
  // return scene;

  const scene = new BABYLON.Scene(engine);
  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
  const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 15, new BABYLON.Vector3(0, 0, 0));
  camera.attachControl(canvas, true);

  const faceUV = [];
  faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
  faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
  faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
  faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side

  const box = BABYLON.MeshBuilder.CreateBox("box", { width: 4, height: 2, depth: 2, faceUV, wrap: true });
  box.position = new BABYLON.Vector3(0, 1, 0);

  const roof = BABYLON.MeshBuilder.CreateCylinder("roof", { diameter: 2.5, height: 4, tessellation: 3 });
  roof.position = new BABYLON.Vector3(0, 2.625, 0);
  roof.rotation = new BABYLON.Vector3(0, 0, Math.PI / 2);

  const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 10, height: 10 });

  // 纹理
  const groundMat = new BABYLON.StandardMaterial("groundMat");
  groundMat.diffuseColor = new BABYLON.Color3.Green();
  ground.material = groundMat;

  const roofMat = new BABYLON.StandardMaterial("roofMat");
  roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");
  const boxMat = new BABYLON.StandardMaterial("boxMat");
  boxMat.diffuseTexture = new BABYLON.Texture(
    "https://doc.babylonjs.com/_next/image?url=%2Fimg%2Fgetstarted%2Fsemihouse.png&w=1920&q=75"
  );

  roof.material = roofMat;
  box.material = boxMat;

  const house = BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);

  const points = [
    // (x, y, z)
    new BABYLON.Vector3(0, 0, 0),
    new BABYLON.Vector3(0, 10, 10),
    new BABYLON.Vector3(0, 10, 0),
    new BABYLON.Vector3(0, 0, 0),
  ];
  const lines = BABYLON.MeshBuilder.CreateLines("lines", { points: points }, scene);

  return scene;
};
const scene = createScene(); //Call the createScene function
// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});
