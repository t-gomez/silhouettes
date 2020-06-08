import { Vector3, BufferGeometry, Geometry, Face3 } from "three";

// Get uniformly distributed random points in mesh
// 	- create array with cumulative sums of face areas
//  - pick random number from 0 to total area
//  - find corresponding place in area array by binary search
//	- get random point in face

export default class GeometryUtils {
    static randomPointsInGeometry(geometry: Geometry, n: number): Vector3[] {

        var face, i,
            faces = geometry.faces,
            vertices = geometry.vertices,
            il = faces.length,
            totalArea = 0,
            cumulativeAreas = [],
            vA, vB, vC;
    
        // precompute face areas
    
        for ( i = 0; i < il; i ++ ) {
    
            face = faces[ i ];
    
            vA = vertices[ face.a ];
            vB = vertices[ face.b ];
            vC = vertices[ face.c ];
    
            face._area = this.triangleArea( vA, vB, vC );
    
            totalArea += face._area;
    
            cumulativeAreas[ i ] = totalArea;
    
        }
    
        // pick random face weighted by face area
    
        var r, index,
            result = [];
    
        var stats = {};
    
        for ( i = 0; i < n; i ++ ) {
    
            r = Math.random() * totalArea;
            index = this.binarySearchIndices(cumulativeAreas, r );
    
            result[ i ] = this.randomPointInFace( faces[ index ], geometry );
    
            if ( ! stats[ index ] ) {
    
                stats[ index ] = 1;
    
            } else {
    
                stats[ index ] += 1;
    
            }
    
        }
    
        return result;
    
    }

    static randomPointsInBufferGeometry(geometry: BufferGeometry, n: number): Vector3[] {

        let i,
            vertices = geometry.attributes.position.array,
            totalArea = 0,
            cumulativeAreas = [],
            vA, vB, vC;
    
        // precompute face areas
        vA = new Vector3();
        vB = new Vector3();
        vC = new Vector3();
    
        // geometry._areas = [];
        var il = vertices.length / 9;
    
        for ( i = 0; i < il; i ++ ) {
    
            vA.set( vertices[ i * 9 + 0 ], vertices[ i * 9 + 1 ], vertices[ i * 9 + 2 ] );
            vB.set( vertices[ i * 9 + 3 ], vertices[ i * 9 + 4 ], vertices[ i * 9 + 5 ] );
            vC.set( vertices[ i * 9 + 6 ], vertices[ i * 9 + 7 ], vertices[ i * 9 + 8 ] );
    
            totalArea += this.triangleArea( vA, vB, vC );
    
            cumulativeAreas.push( totalArea );
    
        }
    
        // pick random face weighted by face area
    
        var r, index,
            result = [];
    
        for ( i = 0; i < n; i ++ ) {
    
            r = Math.random() * totalArea;
    
            index = this.binarySearchIndices(cumulativeAreas, r );
    
            // result[ i ] = GeometryUtils.randomPointInFace( faces[ index ], geometry, true );
            vA.set( vertices[ index * 9 + 0 ], vertices[ index * 9 + 1 ], vertices[ index * 9 + 2 ] );
            vB.set( vertices[ index * 9 + 3 ], vertices[ index * 9 + 4 ], vertices[ index * 9 + 5 ] );
            vC.set( vertices[ index * 9 + 6 ], vertices[ index * 9 + 7 ], vertices[ index * 9 + 8 ] );
            result[ i ] = this.randomPointInTriangle( vA, vB, vC );
    
        }
    
        return result;
    }
    
    // binary search cumulative areas array
    
    static binarySearchIndices(areas, value): number{
    
        function binarySearch( start, end ) {
    
            // return closest larger index
            // if exact number is not found
    
            if ( end < start )
                return start;
    
            var mid = start + Math.floor( ( end - start ) / 2 );
    
            if ( areas[ mid ] > value ) {
    
                return binarySearch( start, mid - 1 );
    
            } else if ( areas[ mid ] < value ) {
    
                return binarySearch( mid + 1, end );
    
            } else {
    
                return mid;
    
            }
    
        }
    
        var result = binarySearch( 0, areas.length - 1 );
        return result;
    
    }
    
    static triangleArea(vectorA: Vector3, vectorB: Vector3, vectorC: Vector3): number {
        var vector1 = new Vector3();
        var vector2 = new Vector3();
        
        vector1.subVectors( vectorB, vectorA );
        vector2.subVectors( vectorC, vectorA );
        vector1.cross( vector2 );
    
        return 0.5 * vector1.length();
    
    }
    
    // Get random point in triangle (via barycentric coordinates)
    // 	(uniform distribution)
    // 	http://www.cgafaq.info/wiki/Random_Point_In_Triangle
    
    static randomPointInTriangle(vectorA: Vector3, vectorB: Vector3, vectorC: Vector3): Vector3 {
        var vector = new Vector3();        
        var point = new Vector3();
    
        var a = Math.random();
        var b = Math.random();
    
        if ( ( a + b ) > 1 ) {
    
            a = 1 - a;
            b = 1 - b;
    
        }
    
        var c = 1 - a - b;
    
        point.copy( vectorA );
        point.multiplyScalar( a );
    
        vector.copy( vectorB );
        vector.multiplyScalar( b );
    
        point.add( vector );
    
        vector.copy( vectorC );
        vector.multiplyScalar( c );
    
        point.add( vector );
    
        return point;
    }
    
    // Get random point in face (triangle)
    // (uniform distribution)
    
    static randomPointInFace(face, geometry: Geometry ): Vector3 {
        var vA, vB, vC;
    
        vA = geometry.vertices[ face.a ];
        vB = geometry.vertices[ face.b ];
        vC = geometry.vertices[ face.c ];
    
        return this.randomPointInTriangle( vA, vB, vC );
    }
}
