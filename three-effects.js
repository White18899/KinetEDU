/**
 * KinetEdu - Three.js WebGL Particle Background Effect
 * Creates a stunning, interactive 3D particle field that reacts to 
 * mouse movement (hover parallax & repulsion) and click shockwaves.
 */

(function() {
    let scene, camera, renderer, particleSystem;
    let particlesCount = 600;
    let positions, velocities, colors, basePositions;
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    
    // Proximity repulsion and Click shockwave settings
    let mouse3D = new THREE.Vector3(0, 0, 0);
    let clickShockwave = {
        active: false,
        origin: new THREE.Vector3(0, 0, 0),
        radius: 0,
        maxRadius: 25,
        speed: 0.8,
        force: 15
    };

    // Color Palette matching KinetEdu
    const colorsPalette = [
        new THREE.Color('#FF7F50'), // Coral
        new THREE.Color('#FFD6BA'), // Soft Peach
        new THREE.Color('#FFF8F2'), // Cream/White
        new THREE.Color('#F5E6DA')  // Warm Tan
    ];

    function init() {
        const canvas = document.getElementById('webgl-canvas');
        if (!canvas) return;

        // 1. Scene Setup
        scene = new THREE.Scene();
        // Setup transparent fog to fade particles in distance
        scene.fog = new THREE.FogExp2('#FFF8F2', 0.015);

        // 2. Camera Setup
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.z = 60;

        // 3. Renderer Setup
        renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true // Enable transparency so background CSS shows through
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        // 4. Create Round Particle Texture
        const particleTexture = createCircleTexture();

        // 5. Build Particles Geometry
        const geometry = new THREE.BufferGeometry();
        positions = new Float32Array(particlesCount * 3);
        basePositions = new Float32Array(particlesCount * 3);
        velocities = new Float32Array(particlesCount * 3);
        colors = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount; i++) {
            // Random positions in a bounding box
            const x = (Math.random() - 0.5) * 120;
            const y = (Math.random() - 0.5) * 120;
            const z = (Math.random() - 0.5) * 120;

            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;

            // Keep track of base starting positions for noise/wave calculations
            basePositions[i * 3] = x;
            basePositions[i * 3 + 1] = y;
            basePositions[i * 3 + 2] = z;

            // Velocities for drifting movement
            velocities[i * 3] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;

            // Choose a random color from our theme palette
            const randomColor = colorsPalette[Math.floor(Math.random() * colorsPalette.length)];
            colors[i * 3] = randomColor.r;
            colors[i * 3 + 1] = randomColor.g;
            colors[i * 3 + 2] = randomColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        // 6. Create Material
        const material = new THREE.PointsMaterial({
            size: 1.2,
            vertexColors: true,
            map: particleTexture,
            transparent: true,
            opacity: 0.85,
            depthWrite: false,
            blending: THREE.NormalBlending
        });

        // 7. Add to Scene
        particleSystem = new THREE.Points(geometry, material);
        scene.add(particleSystem);

        // 8. Event Listeners
        window.addEventListener('resize', onWindowResize);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onClick);

        // Start Loop
        animate();
    }

    /**
     * Programmatically generates a circular glowing texture to avoid external assets.
     */
    function createCircleTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Draw radial gradient
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);

        const texture = new THREE.CanvasTexture(canvas);
        return texture;
    }

    function onMouseMove(event) {
        // Normalize mouse coordinates (-1 to 1)
        mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;

        // Project mouse position to 3D plane
        mouse3D.set(mouse.targetX * 50, mouse.targetY * 40, 0);
    }

    function onClick(event) {
        // Trigger a shockwave at the cursor projected coordinates
        clickShockwave.origin.copy(mouse3D);
        clickShockwave.radius = 0;
        clickShockwave.active = true;
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Main animation loop
    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.0005;

        // Smoothly interpolate mouse coordinates for camera parallax
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        // Camera gentle panning rotation based on cursor
        camera.position.x = mouse.x * 12;
        camera.position.y = mouse.y * 10;
        camera.lookAt(scene.position);

        // Update Click Shockwave Expansion
        if (clickShockwave.active) {
            clickShockwave.radius += clickShockwave.speed;
            if (clickShockwave.radius > clickShockwave.maxRadius) {
                clickShockwave.active = false;
            }
        }

        const positionAttribute = particleSystem.geometry.attributes.position;
        const positionsArr = positionAttribute.array;

        for (let i = 0; i < particlesCount; i++) {
            const idx = i * 3;
            
            // 1. Natural Drift and Wave Behavior
            let px = basePositions[idx] + Math.sin(time + basePositions[idx + 1] * 0.1) * 2.0;
            let py = basePositions[idx + 1] + Math.cos(time + basePositions[idx] * 0.1) * 2.0;
            let pz = basePositions[idx + 2] + Math.sin(time + basePositions[idx + 2] * 0.05) * 1.5;

            // Update original floating position drift
            basePositions[idx] += velocities[idx];
            basePositions[idx + 1] += velocities[idx + 1];
            basePositions[idx + 2] += velocities[idx + 2];

            // Wrap around box boundaries if particles drift too far
            const boundary = 70;
            if (Math.abs(basePositions[idx]) > boundary) basePositions[idx] *= -0.9;
            if (Math.abs(basePositions[idx + 1]) > boundary) basePositions[idx + 1] *= -0.9;
            if (Math.abs(basePositions[idx + 2]) > boundary) basePositions[idx + 2] *= -0.9;

            let particlePos = new THREE.Vector3(px, py, pz);

            // 2. Proximity Cursor Repulsion Force field
            const distToMouse = particlePos.distanceTo(mouse3D);
            const repelThreshold = 18;
            if (distToMouse < repelThreshold) {
                // Compute repulsion force vector
                const forceDirection = new THREE.Vector3().subVectors(particlePos, mouse3D).normalize();
                const forceMagnitude = (repelThreshold - distToMouse) / repelThreshold;
                const pushForce = forceDirection.multiplyScalar(forceMagnitude * 6.5);
                
                particlePos.add(pushForce);
            }

            // 3. Click Shockwave Force field
            if (clickShockwave.active) {
                const distToShockwave = particlePos.distanceTo(clickShockwave.origin);
                const deltaDist = Math.abs(distToShockwave - clickShockwave.radius);
                
                // If particle is close to the shockwave expansion front
                if (deltaDist < 4) {
                    const waveDir = new THREE.Vector3().subVectors(particlePos, clickShockwave.origin).normalize();
                    // Decay the wave force as the radius grows
                    const decay = (clickShockwave.maxRadius - clickShockwave.radius) / clickShockwave.maxRadius;
                    const waveForce = waveDir.multiplyScalar(clickShockwave.force * decay * (1.0 - deltaDist / 4.0));
                    
                    particlePos.add(waveForce);
                }
            }

            // Save computed positions back to buffer attribute
            positionsArr[idx] = particlePos.x;
            positionsArr[idx + 1] = particlePos.y;
            positionsArr[idx + 2] = particlePos.z;
        }

        positionAttribute.needsUpdate = true;

        // Slow rotation of the entire particle system
        particleSystem.rotation.y = time * 0.03;
        particleSystem.rotation.x = time * 0.01;

        renderer.render(scene, camera);
    }

    init();
})();
