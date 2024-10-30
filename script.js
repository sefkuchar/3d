// Initialize Three.js scene, camera, and renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x808080);
const camera = new THREE.PerspectiveCamera(75, 600 / 400, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(600, 400);
document.getElementById("viewer").appendChild(renderer.domElement);

// Ambient and Directional Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 1).normalize();
scene.add(directionalLight);

// Camera controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.set(0, 1, 5);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

let currentModel;

// Materials
const materials = {
    plastic: new THREE.MeshStandardMaterial({ color: 0xffddaa, metalness: 0.1, roughness: 0.8 }),
    titanium: new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 1, roughness: 0.3 }),
    PEEK: new THREE.MeshStandardMaterial({ color: 0x88aaff, metalness: 0.5, roughness: 0.1, opacity: 0.5, transparent: true })
};

// Model data
const models = {
    outer: {
        leg: { path: 'models/leg_anatomy.glb', scale: 0.5 },
        hand: { path: 'models/hand.glb', scale: 20 },
        arm: { path: 'models/arm.glb', scale: 2 }
    },
    inner: {
        heart: { path: 'models/realistic_human_heart.glb', scale: 2 },
        lung: { path: 'models/lung_model.glb', scale: 0.01 },
        liver: { path: 'models/liver.glb', scale: 10 }
    }
};

// Update model buttons based on category selection
function updateModelButtons() {
    const category = document.getElementById("categorySelect").value;
    const buttonContainer = document.getElementById("buttonContainer");
    buttonContainer.innerHTML = ''; // Clear existing buttons

    if (category && models[category]) {
        for (const [name, model] of Object.entries(models[category])) {
            const button = document.createElement("button");
            button.innerText = `${name.charAt(0).toUpperCase() + name.slice(1)} Model`;
            button.onclick = () => loadModel(model.path, model.scale);
            buttonContainer.appendChild(button);
        }
    }
}

// Load selected model with the specified scale factor
function loadModel(modelPath, scaleFactor) {
    if (currentModel) {
        scene.remove(currentModel); // Remove the current model from the scene
    }

    const loader = new THREE.GLTFLoader();
    loader.load(modelPath, function(gltf) {
        currentModel = gltf.scene;

        // Scale the model right after loading
        currentModel.scale.set(scaleFactor, scaleFactor, scaleFactor); // Set the scale for x, y, z

        // Optional: Center the model
        const box = new THREE.Box3().setFromObject(currentModel);
        const center = box.getCenter(new THREE.Vector3());
        currentModel.position.sub(center); // Center the model

        scene.add(currentModel);

        // Retrieve and display the comment
        const comment = document.getElementById("comment").value;
        console.log("Comment:", comment); // Log the comment or handle it as needed
    }, undefined, function(error) {
        console.error('Error loading model:', error); // Handle loading errors
    });
}

// Apply selected material to the current model
function applyMaterial() {
    const materialType = document.getElementById("materialSelect").value;
    if (currentModel && materials[materialType]) {
        currentModel.traverse((child) => {
            if (child.isMesh) child.material = materials[materialType];
        });
    }
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
