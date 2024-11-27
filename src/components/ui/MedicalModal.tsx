"use client";
import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const MedicalModel3D: React.FC = () => {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mountRef.current) return;

		// Scene setup
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);

		// Camera setup
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.z = 5;

		// Renderer setup
		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		mountRef.current.appendChild(renderer.domElement);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(0, 1, 1);
		scene.add(directionalLight);

		// Controls
		const controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.05;

		// Load 3D model
		const loader = new GLTFLoader();
		loader.load(
			"/assets/3d/medical_model.glb", // Replace with your actual model path
			(gltf) => {
				scene.add(gltf.scene);
				gltf.scene.scale.set(0.5, 0.5, 0.5); // Adjust scale as needed
				gltf.scene.position.set(0, -1, 0); // Adjust position as needed
			},
			undefined,
			(error) => console.error("An error occurred loading the 3D model:", error)
		);

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		};
		animate();

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			mountRef.current?.removeChild(renderer.domElement);
		};
	}, []);

	return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default MedicalModel3D;
