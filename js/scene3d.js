/**
 * Mantra Miles Tour - Three.js 3D Visual Fallback Engine (Emerald Green Atmosphere)
 * Features: Emerald Volvo Sleeper Bus, Coastal Highway Curve, Soaring Flight & Particle Trails
 */

let scene, camera, renderer;
let volvoBusGroup, busWheels = [];
let jetPlaneGroup, jetParticles = [];
let roadDashesGroup;
let cloudGroup;
let mouseX = 0, mouseY = 0;
let targetCameraX = 0, targetCameraY = 10, targetCameraZ = 32;
let isDragging = false, previousMouseX = 0, previousMouseY = 0;
let busAngle = 0;

function init3DHeroScene() {
    const container = document.getElementById('hero3dCanvas');
    if (!container) return;

    // 1. SCENE CREATION (Deep Emerald Atmosphere #0F2A1D)
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061E14);
    scene.fog = new THREE.FogExp2(0x061E14, 0.014);

    // 2. CAMERA CREATION
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    camera.position.set(0, 10, 32);
    camera.lookAt(0, 2.5, 0);

    // 3. RENDERER
    renderer = new THREE.WebGLRenderer({ canvas: container, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. LIGHTING SYSTEM (Emerald Leaf Green & Sunset Gold)
    const ambientLight = new THREE.AmbientLight(0x0F2A1D, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xE6AF2E, 2.8);
    sunLight.position.set(40, 35, 25);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const skyLight = new THREE.HemisphereLight(0x2D6A4F, 0x061E14, 1.4);
    scene.add(skyLight);

    createStarfield();
    createMountains();
    createClouds();
    createCoastalHighway();
    createVolvoBus();
    createJetAircraft();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    setupCanvasInteractions(container);

    animateScene();
}

function createStarfield() {
    const starsGeo = new THREE.BufferGeometry();
    const starCount = 500;
    const posArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 400;
        posArray[i + 1] = Math.random() * 140 + 20;
        posArray[i + 2] = (Math.random() - 0.5) * 400;
    }

    starsGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starsMat = new THREE.PointsMaterial({
        size: 0.9,
        color: 0xE6AF2E,
        transparent: true,
        opacity: 0.75
    });

    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);
}

function createMountains() {
    const mountainGroup = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
        color: 0x0F2A1D,
        roughness: 0.9,
        metalness: 0.1,
        flatShading: true
    });

    for (let i = -5; i <= 5; i++) {
        const height = 18 + Math.random() * 18;
        const radius = 20 + Math.random() * 15;
        const geo = new THREE.ConeGeometry(radius, height, 5);
        const mountain = new THREE.Mesh(geo, mat);
        mountain.position.set(i * 32 + (Math.random() - 0.5) * 10, height / 2 - 4, -120);
        mountainGroup.add(mountain);
    }
    scene.add(mountainGroup);
}

function createClouds() {
    cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
        color: 0x1B4332,
        roughness: 1.0,
        transparent: true,
        opacity: 0.55
    });

    for (let c = 0; c < 5; c++) {
        const cluster = new THREE.Group();
        const numPuffs = 5 + Math.floor(Math.random() * 4);
        for (let p = 0; p < numPuffs; p++) {
            const size = 7 + Math.random() * 8;
            const geo = new THREE.DodecahedronGeometry(size, 1);
            const puff = new THREE.Mesh(geo, cloudMat);
            puff.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 6, (Math.random() - 0.5) * 16);
            cluster.add(puff);
        }
        cluster.position.set((Math.random() - 0.5) * 180, 36 + Math.random() * 20, -65 + (Math.random() - 0.5) * 50);
        cloudGroup.add(cluster);
    }
    scene.add(cloudGroup);
}

function createCoastalHighway() {
    const roadGeo = new THREE.PlaneGeometry(36, 300);
    const roadMat = new THREE.MeshStandardMaterial({
        color: 0x061E14,
        roughness: 0.8,
        metalness: 0.2
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -50);
    road.receiveShadow = true;
    scene.add(road);

    roadDashesGroup = new THREE.Group();
    const dashGeo = new THREE.BoxGeometry(0.8, 0.05, 4);
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xE6AF2E });

    for (let z = -180; z < 50; z += 12) {
        const dash1 = new THREE.Mesh(dashGeo, dashMat);
        dash1.position.set(-6, 0.04, z);
        roadDashesGroup.add(dash1);

        const dash2 = new THREE.Mesh(dashGeo, dashMat);
        dash2.position.set(6, 0.04, z);
        roadDashesGroup.add(dash2);
    }
    scene.add(roadDashesGroup);
}

function createVolvoBus() {
    volvoBusGroup = new THREE.Group();

    const bodyLength = 16;
    const bodyHeight = 4.2;
    const bodyWidth = 4.4;

    const bodyGeo = new THREE.BoxGeometry(bodyWidth, bodyHeight, bodyLength);
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x2D6A4F,
        roughness: 0.2,
        metalness: 0.85
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = bodyHeight / 2 + 1.2;
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    volvoBusGroup.add(bodyMesh);

    const roofGeo = new THREE.BoxGeometry(bodyWidth - 0.2, 0.8, bodyLength - 1);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x0F2A1D, roughness: 0.3, metalness: 0.8 });
    const roofMesh = new THREE.Mesh(roofGeo, roofMat);
    roofMesh.position.y = bodyHeight + 1.6;
    volvoBusGroup.add(roofMesh);

    const stripeGeo = new THREE.BoxGeometry(bodyWidth + 0.05, 0.5, bodyLength + 0.05);
    const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xE6AF2E,
        emissive: 0xE6AF2E,
        emissiveIntensity: 0.35,
        metalness: 0.9
    });
    const stripeMesh = new THREE.Mesh(stripeGeo, stripeMat);
    stripeMesh.position.y = bodyHeight / 2 + 1.2;
    volvoBusGroup.add(stripeMesh);

    const windowGeo = new THREE.BoxGeometry(bodyWidth + 0.1, 1.6, bodyLength - 2);
    const windowMat = new THREE.MeshStandardMaterial({
        color: 0x00F5D4,
        emissive: 0x00F5D4,
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7,
        roughness: 0.1
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.y = bodyHeight / 2 + 2.0;
    volvoBusGroup.add(windowMesh);

    const lightMat = new THREE.MeshBasicMaterial({ color: 0xFFF3B0 });
    const hlLeft = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.2), lightMat);
    hlLeft.position.set(-1.4, 1.6, bodyLength / 2 + 0.1);
    volvoBusGroup.add(hlLeft);

    const hlRight = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.4, 0.2), lightMat);
    hlRight.position.set(1.4, 1.6, bodyLength / 2 + 0.1);
    volvoBusGroup.add(hlRight);

    const coneGeo = new THREE.ConeGeometry(4.5, 26, 16);
    const coneMat = new THREE.MeshBasicMaterial({
        color: 0xFFF3B0,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
    });

    const lightConeLeft = new THREE.Mesh(coneGeo, coneMat);
    lightConeLeft.rotation.x = Math.PI / 2 - 0.2;
    lightConeLeft.position.set(-1.4, 0.5, bodyLength / 2 + 13.5);
    volvoBusGroup.add(lightConeLeft);

    const lightConeRight = new THREE.Mesh(coneGeo, coneMat);
    lightConeRight.rotation.x = Math.PI / 2 - 0.2;
    lightConeRight.position.set(1.4, 0.5, bodyLength / 2 + 13.5);
    volvoBusGroup.add(lightConeRight);

    const wheelRadius = 1.0;
    const wheelWidth = 0.8;
    const wheelGeo = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelWidth, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xE6AF2E, metalness: 0.9, roughness: 0.2 });

    const wheelPositions = [
        { x: -bodyWidth / 2 - 0.1, z: 5.5 },
        { x: bodyWidth / 2 + 0.1, z: 5.5 },
        { x: -bodyWidth / 2 - 0.1, z: -3.2 },
        { x: bodyWidth / 2 + 0.1, z: -3.2 },
        { x: -bodyWidth / 2 - 0.1, z: -5.6 },
        { x: bodyWidth / 2 + 0.1, z: -5.6 }
    ];

    wheelPositions.forEach(pos => {
        const wheelGroup = new THREE.Group();
        const tire = new THREE.Mesh(wheelGeo, wheelMat);
        tire.rotation.z = Math.PI / 2;
        tire.castShadow = true;
        wheelGroup.add(tire);

        const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, wheelWidth + 0.05, 12), rimMat);
        rim.rotation.z = Math.PI / 2;
        wheelGroup.add(rim);

        wheelGroup.position.set(pos.x, wheelRadius, pos.z);
        volvoBusGroup.add(wheelGroup);
        busWheels.push(wheelGroup);
    });

    volvoBusGroup.position.set(0, 0, 5);
    scene.add(volvoBusGroup);
}

function createJetAircraft() {
    jetPlaneGroup = new THREE.Group();

    const planeMat = new THREE.MeshStandardMaterial({
        color: 0xE6AF2E,
        roughness: 0.2,
        metalness: 0.9
    });

    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 10, 16), planeMat);
    fuselage.rotation.x = Math.PI / 2;
    jetPlaneGroup.add(fuselage);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.8, 2.5, 16), planeMat);
    nose.rotation.x = Math.PI / 2;
    nose.position.z = 6.25;
    jetPlaneGroup.add(nose);

    const wing = new THREE.Mesh(new THREE.BoxGeometry(12, 0.1, 2.5), planeMat);
    wing.position.z = 0.5;
    jetPlaneGroup.add(wing);

    const tailMat = new THREE.MeshStandardMaterial({ color: 0x2D6A4F, metalness: 0.8 });
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.8, 2.0), tailMat);
    tail.position.set(0, 1.4, -4.0);
    jetPlaneGroup.add(tail);

    jetPlaneGroup.scale.set(0.75, 0.75, 0.75);
    jetPlaneGroup.position.set(-65, 40, -45);
    jetPlaneGroup.rotation.y = Math.PI / 4;
    scene.add(jetPlaneGroup);

    createJetParticleTrail();
}

function createJetParticleTrail() {
    const trailCount = 120;
    const trailGeo = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);

    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.PointsMaterial({
        color: 0xE6AF2E,
        size: 1.3,
        transparent: true,
        opacity: 0.65
    });

    const trailPoints = new THREE.Points(trailGeo, trailMat);
    scene.add(trailPoints);
    jetParticles = { mesh: trailPoints, positions: trailPositions, index: 0 };
}

function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
}

function setupCanvasInteractions(canvas) {
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;

        targetCameraX -= deltaX * 0.07;
        targetCameraY += deltaY * 0.07;
        targetCameraY = Math.max(3, Math.min(25, targetCameraY));

        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
    });
}

function onWindowResize() {
    const container = document.getElementById('hero3dCanvas');
    if (!container || !renderer || !camera) return;

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

function animateScene() {
    requestAnimationFrame(animateScene);

    roadDashesGroup.children.forEach(dash => {
        dash.position.z += 0.8;
        if (dash.position.z > 30) {
            dash.position.z = -180;
        }
    });

    busWheels.forEach(wheel => {
        wheel.children[0].rotation.x += 0.25;
    });

    busAngle += 0.08;
    if (volvoBusGroup) {
        volvoBusGroup.position.y = Math.sin(busAngle) * 0.08;
    }

    if (jetPlaneGroup) {
        jetPlaneGroup.position.x += 0.35;
        jetPlaneGroup.position.z += 0.15;
        jetPlaneGroup.position.y = 40 + Math.sin(busAngle * 0.5) * 1.5;

        if (jetPlaneGroup.position.x > 85) {
            jetPlaneGroup.position.set(-85, 40, -50);
        }

        if (jetParticles && jetParticles.positions) {
            const p = jetParticles.positions;
            const idx = (jetParticles.index % 120) * 3;
            p[idx] = jetPlaneGroup.position.x - 2;
            p[idx + 1] = jetPlaneGroup.position.y - 0.5;
            p[idx + 2] = jetPlaneGroup.position.z - 2;
            jetParticles.mesh.geometry.attributes.position.needsUpdate = true;
            jetParticles.index++;
        }
    }

    if (cloudGroup) {
        cloudGroup.rotation.y += 0.0007;
    }

    camera.position.x += (targetCameraX + mouseX * 3.5 - camera.position.x) * 0.05;
    camera.position.y += (targetCameraY + mouseY * 2 - camera.position.y) * 0.05;
    camera.lookAt(0, 2.5, 0);

    renderer.render(scene, camera);
}

document.addEventListener('DOMContentLoaded', init3DHeroScene);
