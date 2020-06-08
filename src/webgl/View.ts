/*
 * View.ts
 * ===========
 * Topmost Three.js class. 
 * Controls scene, cam, renderer, and objects in scene.
 */
import { WebGLRenderer, Scene, PerspectiveCamera, Mesh, Geometry, SphereGeometry,TorusGeometry, PlaneGeometry, TorusKnotGeometry, BufferGeometry } from "three";
import { OrbitControls } from 'OrbitControls';
import Particles from "./Particles";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import GeometryUtils from "@utils/GeometryUtils";


export default class View {
	private renderer: WebGLRenderer;
	private scene: Scene;
	private camera: PerspectiveCamera;
	private particles: Particles;
	private controls: OrbitControls;
	private loader: OBJLoader;
	private uploaderInput: HTMLInputElement;
	private uploaderButton: HTMLButtonElement;
	private customShape = false;

	private particleCount = 10000;
	
	private currentSecond: number = null;
	private currentShapeIndex = -1;
	private morphDelay = 4;
	private shapes: Array<Geometry | BufferGeometry> = [
		new SphereGeometry(1, 20, 20),
		new PlaneGeometry(3, 3),
		new TorusGeometry(),
		new TorusKnotGeometry(),
	];

	constructor(canvas: HTMLCanvasElement) {
		this.renderer = new WebGLRenderer({
			canvas: canvas,
			antialias: true,
		});

		this.camera = new PerspectiveCamera(50, 1, 0.1, 1000);
		this.camera.position.z = 5;
		this.scene = new Scene();
		this.onWindowResize(window.innerWidth, window.innerHeight);

		this.controls = new OrbitControls(this.camera, this.renderer.domElement);

		this.particles = new Particles(this.scene, this.particleCount);

		this.loader = new OBJLoader();
		this.uploaderInput = document.querySelector('#uploader');
		this.uploaderButton = document.querySelector('#uploader-button');
		this.setUploaderEvent();
		
		this.loadObject('models/saturn/model.obj', false);
		this.loadObject('models/earth/model.obj', false, 4);
		this.loadObject('models/solar-system/model.obj', false, .5);
	}

	public onWindowResize(vpW: number, vpH: number): void {
		this.renderer.setSize(vpW, vpH);
		this.camera.aspect = vpW / vpH;
		this.camera.updateProjectionMatrix();
	}


	public update(secs: number): void {
		this.particles.update(secs);
		this.renderer.render(this.scene, this.camera);

		if (Math.round(secs) % this.morphDelay === 0) {
			// Avoid morphing shapes within the same second in different frames
			if (this.currentSecond === Math.round(secs)) {
				return;
			}

			if (this.customShape) {
				return;
			}
			
			this.currentSecond = Math.round(secs);
			
			this.handleMorphing();
		}
	}

	private handleMorphing(): void {
		let index = this.currentShapeIndex + 1;

		if (index > this.shapes.length - 1) {
			index = 0;
		}

		if (this.currentShapeIndex === index) {
			return;
		}

		this.currentShapeIndex = index;

		const geometry = this.shapes[index];

		this.particles.morph(geometry);
	}
	
	private setUploaderEvent(): void {
		this.uploaderButton.addEventListener('click', (event) => {
			this.uploaderInput.click();
		});

		this.uploaderInput.addEventListener('change', (event) => {
			const url = URL.createObjectURL(this.uploaderInput.files[0]);
			this.loadObject(url);			
		});
	}

	private loadObject(url: string, custom = true, scale = 1): void {
		this.loader.load(url, (obj) => {
			let morphed = false;

			obj.traverse(child => {
				if (child instanceof Mesh) {
					// Avoid morphing multiple times for the same object
					if (morphed) return;

					const geometry = <BufferGeometry>child.geometry;
					
					geometry.scale(scale, scale, scale);

					if (custom) {
						this.customShape = true;
						this.particles.morph(geometry);
					} else {
						this.shapes.push(geometry);
					}
				}
			});
		});
	}
}