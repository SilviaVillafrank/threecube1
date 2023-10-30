// Importa la libreria Three.js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { DragControls } from 'three/examples/jsm/controls/DragControls.js'

THREE.ColorManagement.enabled = false

//texture

const textureLoader = new THREE.TextureLoader();
const redBaseColor = textureLoader.load('/textures/red/furbasecolor.jpg');
const redNormalmap = textureLoader.load('/textures/red/furnormal.jpg');
const redHeightmap = textureLoader.load('/textures/red/furheight.png');
const redRoughnessmap = textureLoader.load('/textures/red/furroughness.jpg');
const redAmbientOcclusionsmap = textureLoader.load('/textures/red/furambientOcclusion.jpg');
const redMetallic = textureLoader.load('/textures/red/furmetallic.jpg');


// Canvas
const canvas = document.querySelector('canvas.webgl')

//Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
 }

let controls;

// Crea la scena
const scene = new THREE.Scene();


// Crea una telecamera prospettica
const camera = new THREE.PerspectiveCamera(100, sizes.width / sizes.height, 0.1, 100)
//camera.position.z = 5;
//camera.position.y = 2;
camera.position.set(0, 2, 10 );
scene.add(camera)



// Crea un renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
renderer.shadowMap.enabled = true;// Abilita il mapping delle ombre
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//renderer.setAnimationLoop( renderer );


controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, -1, 0);
controls.update();


// Lights
scene.add(new THREE.AmbientLight(0x404040, 3));

const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(0, 5, 0);
dirLight.castShadow = true;
scene.add(dirLight);


dirLight.castShadow = true;


// Crea un cubo rosso //color: 0xff00

const redMaterial = new THREE.MeshStandardMaterial()
  redMaterial.map = redBaseColor
  redMaterial.normalMap = redNormalmap
  redMaterial.displacementMap = redHeightmap
  redMaterial.roughnessMap = redRoughnessmap
  redMaterial.aoMap = redAmbientOcclusionsmap
  redMaterial.metalnessMap = redMetallic



const redCube = new THREE.Mesh(new THREE.BoxGeometry(), redMaterial);
redCube.castShadow = true; // Abilita il lancio di ombre dal materiale
scene.add(redCube);


// Crea un materiale verde
const greenMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
greenMaterial.castShadow = true; // Abilita il lancio di ombre dal materiale
//greenMaterial.receiveShadow = true; // Abilita la ricezione di ombre dal materiale

// Crea un cubo verde
const greenCube = new THREE.Mesh(new THREE.BoxGeometry(), greenMaterial);
greenCube.castShadow = true;
scene.add(greenCube);

// Crea un materiale blu
const blueMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff });
blueMaterial.castShadow = true; // Abilita il lancio di ombre dal materiale
//greenMaterial.receiveShadow = true; // Abilita la ricezione di ombre dal materiale

// Crea una sfera blu
const blueSphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), blueMaterial);
blueSphere.castShadow = true;
scene.add(blueSphere);


// Imposta la posizione dei cubi
redCube.position.x = -4;
greenCube.position.x = 4;
blueSphere.position.y = 4;

// Crea un pavimento
const floorGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floorMaterial.receiveShadow = true; // Il pavimento riceve ombre
floor.rotation.x = -Math.PI / 2; // Ruota il pavimento in modo che sia orizzontale
floor.position.y = -2; // Posiziona il pavimento al di sotto dei cubi
floor.receiveShadow = true;
scene.add(floor);

const clock = new THREE.Clock()


// Funzione per animare i cubi
function animateCubes() {
  requestAnimationFrame(animateCubes);

  // Fai ruotare i cubi
  redCube.rotation.x += 0.01;
  redCube.rotation.y += 0.01;
  greenCube.rotation.x += 0.01;
  greenCube.rotation.y += 0.01;

  // Rendi visibile la scena
  renderer.render(scene, camera);

}

function sin(){
  const elapsedTIme = clock.getElapsedTime()
  blueSphere.position.y = Math.sin(elapsedTIme)
  //blueSphere.position.x = Math.cos(elapsedTIme)
  requestAnimationFrame(sin);
  // Rendi visibile la scena
  renderer.render(scene, camera);
}

const controls1 = new DragControls([redCube, greenCube,blueSphere], camera, renderer.domElement)
controls1.addEventListener('dragstart', function (event) {
  controls.enabled = false
  event.object.material.opacity = 0.33
})
controls1.addEventListener('dragend', function (event) {
  controls.enabled = true
  event.object.material.opacity = 1
})


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// Chiama la funzione per iniziare l'animazione
animateCubes();
sin();



