import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GUI } from 'dat.gui'



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight);

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector("#bg"),
    antialias: true
})

renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth, innerHeight);
camera.position.setZ(0);




const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({ color: 0xFF6347 });
const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);


const ambientLight = new THREE.AmbientLight(0xffffff, 3, 100, 45);
ambientLight.position.y = 30;
ambientLight.position.z = 10;
scene.add(ambientLight);
const backgroundTexture = new THREE.TextureLoader().load("/src/three/images/background.png");

scene.background = backgroundTexture;



var monitor;
const fbxLoader = new FBXLoader();
fbxLoader.load(
    '/src/three/Ultrawide Monitor.fbx',
    (object) => {
        object.scale.set(0.1, 0.1, 0.1);

        object.position.z = -50;
        object.rotation.z = 3.15;
        object.rotation.x = 4.7;
        monitor = object;
        // scene.add(monitor);

    }
)

const objLoader = new OBJLoader()
var nameText;
fbxLoader.load(
    '/src/three/viktorkvapil.fbx',
    (object) => {
        object.scale.set(0.009, 0.009, 0.009)
        object.traverse((child) => {
            child.material = new THREE.MeshBasicMaterial({ color: 0x66e64a });
        })
        nameText = object
        scene.add(nameText);
    }
)

// const controls = new OrbitControls(camera, renderer.domElement);

function lerp(x, y, a) {
    return (1 - a) * x + a * y
}

function scalePercent(start, end) {
    return (scrollPercent - start) / (end - start)
}

const animationScripts = [];

animationScripts.push({
    start: 0, end: 50,
    func: () => {
        camera.position.z = lerp(0, 40, scalePercent(0, 50));
        nameText.rotation.x = lerp(0, 1.7, scalePercent(0, 50));
    }
})

animationScripts.push({
    start: 50, end: 100,
    func: () => {
        camera.position.y = -lerp(0, 100, scalePercent(50, 100))
    }
})


function playScrollAnimations() {
    animationScripts.forEach(function (a) {
        if (scrollPercent >= a.start && scrollPercent < a.end) {
            a.func();
        }
    });
}
let scrollPercent = 0;

document.body.onscroll = function () {
    //calculate the current scroll progress as a percentage
    scrollPercent =
        ((document.documentElement.scrollTop || document.body.scrollTop) /
            ((document.documentElement.scrollHeight ||
                document.body.scrollHeight) -
                document.documentElement.clientHeight)) *
        100;
};


function addStar() {
    const geometry = new THREE.SphereGeometry(0.2, 24, 24);
    const material = new THREE.MeshBasicMaterial({ color: 0x8C8A93 });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

    star.position.set(x, y, z);
    scene.add(star);
}

Array(200).fill().forEach(addStar);

// document.body.onscroll = scrollEffect;

function scrollEffect() {
    const t = document.body.getBoundingClientRect().top;
    document.body.bound

    if (t >= -1630) {
        camera.position.z = t * -0.023;
        camera.position.y = t * -0.01;
        nameText.rotation.x = t * -0.001;

    }
    else {
        camera.position.y = t * 0.01;
        console.log(camera.position.y);
    }
}



function animate() {
    requestAnimationFrame(animate);
    console.log(window.scrollY);
    playScrollAnimations();
    renderer.render(scene, camera);
}

window.scrollTo(0, 0);

animate();
