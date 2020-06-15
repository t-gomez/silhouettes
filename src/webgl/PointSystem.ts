import { Points, Scene, PointsMaterial, ImageUtils, AdditiveBlending, Vector3, Geometry, BufferGeometry } from "three";
import GeometryUtils from "@utils/GeometryUtils";
import { TweenMax, Expo } from "gsap";

export default class PointSystem {
    public points: Points;
    public count: number;

    private material: PointsMaterial;
    private mapUrl = './textures/texture.png'; 
    private materialScale = .01;

    constructor(scene: Scene, pointCount: number) {
        this.createPointMaterial();
        this.createPointSystem(pointCount);

        scene.add(this.points);
    }

    public morph(geometry: Geometry | BufferGeometry): void {
        let points: Vector3[];

        if (geometry instanceof BufferGeometry) {
            points = GeometryUtils.randomPointsInBufferGeometry(<BufferGeometry>geometry, this.count);
        } else {
            points = GeometryUtils.randomPointsInGeometry(<Geometry>geometry, this.count);
        }

        const systemGeometry = <Geometry>this.points.geometry;

        points.forEach((point, i) => {
            TweenMax.to(
                systemGeometry.vertices[i],
                2,
                {
                    x: point.x,
                    y: point.y,
                    z: point.z,
                    ease: Expo.easeInOut
                }
            );
        });
        
        systemGeometry.verticesNeedUpdate = true;
    }

    public update(secs: number): void {
        this.points.rotation.y += 0.01;
        (<Geometry>this.points.geometry).verticesNeedUpdate = true;
    }

    private createPointMaterial(): void {
        this.material = new PointsMaterial({
			size: this.materialScale,
			map: ImageUtils.loadTexture(this.mapUrl),
			blending: AdditiveBlending,
			transparent: true
		});
    }
    
    private createPointSystem(pointCount: number): void {
        this.count = pointCount;
        
        const points = new Geometry();
        
		for (let p = 0; p < pointCount; p++) {
			const vertex = new Vector3(0, 0, 0);
			points.vertices.push(vertex);
        }
        
        this.points = new Points(points, this.material);
    }
}