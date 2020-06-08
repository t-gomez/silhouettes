import { Points, Scene, PointsMaterial, ImageUtils, AdditiveBlending, Vector3, Geometry, BufferGeometry } from "three";
import GeometryUtils from "@utils/GeometryUtils";
import { TweenMax, Expo } from "gsap";

export default class Particles {
    public particles: Points;
    public count: number;

    private material: PointsMaterial;
    private mapUrl = './textures/particle.png'; 
    private materialScale = .01;

    constructor(scene: Scene, particleCount: number) {
        this.createParticleMaterial();
        this.createParticleSystem(particleCount);

        scene.add(this.particles);
    }

    public morph(geometry: Geometry | BufferGeometry): void {
        let points: Vector3[];

        if (geometry instanceof BufferGeometry) {
            points = GeometryUtils.randomPointsInBufferGeometry(<BufferGeometry>geometry, this.count);
        } else {
            points = GeometryUtils.randomPointsInGeometry(<Geometry>geometry, this.count);
        }

        const particleGeometry = <Geometry>this.particles.geometry;

        points.forEach((point, i) => {
            TweenMax.to(
                particleGeometry.vertices[i],
                2,
                {
                    x: point.x,
                    y: point.y,
                    z: point.z,
                    ease: Expo.easeInOut
                }
            );
        });
        
        particleGeometry.verticesNeedUpdate = true;
    }

    public update(secs: number): void {
        this.particles.rotation.y += 0.01;
        (<Geometry>this.particles.geometry).verticesNeedUpdate = true;
    }

    private createParticleMaterial(): void {
        this.material = new PointsMaterial({
			size: this.materialScale,
			map: ImageUtils.loadTexture(this.mapUrl),
			blending: AdditiveBlending,
			transparent: true
		});
    }
    
    private createParticleSystem(particleCount: number): void {
        this.count = particleCount;
        
        const particles = new Geometry();
        
		for (let p = 0; p < particleCount; p++) {
			const vertex = new Vector3(0, 0, 0);
			particles.vertices.push(vertex);
        }
        
        this.particles = new Points(particles, this.material);
    }
}