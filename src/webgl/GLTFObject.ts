import { LoadingManager, Scene, Vector3 } from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader";

export default class GLTFObject {
    loader: GLTFLoader;
    scene: Scene;
    scale: Vector3;
    wireframe: boolean;

    constructor(scene: Scene, loadingManager: LoadingManager = null) {
        this.loader = new GLTFLoader(loadingManager);
        this.scene = scene;
    }

    public load(path: string, scale: Vector3, wireframe: boolean) {
        this.scale = scale;
        this.wireframe = wireframe;
        this.loader.load(path, this.onLoad);
    }

    private onLoad(gltf: GLTF): void {
        const model = gltf.scene.children[0];

        if (this.scale) {
            model.scale.set(this.scale.x, this.scale.y, this.scale.z);
        }

        if (this.wireframe) {
            gltf.scene.traverse((node: any) => {
            	if (!node.isMesh) return;
            	node.material.wireframe = true;
            });
        }
        
        this.scene.add(gltf.scene);
        
        
        // const animation = this.planet.animations[0];

        // const mixer = new AnimationMixer(model);
        // mixer.timeScale = .1;
        // // mixers.push( mixer );

        // const action = mixer.clipAction( animation );
        // action.play();
    }
}