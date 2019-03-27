/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import ChartMath from "ChartMath"
import Utils from "Utils"
import BufferAttribute from "GLEngine/Core/BufferAttribute"

import Geometry from "GLEngine/Core/Geometry"


class LineGeometry extends Geometry {
	constructor ( params ) {
		super( params )

		this.$temp.setMultiple( {
			direction: ChartMath.vec2( 0, 0 ),
			negNormal: ChartMath.vec2( 0, 0 ),
			posNormal: ChartMath.vec2( 0, 0 ),
		} )

		this.setAttributesData( this.$generateRectGeometry( params.width || 1, params.height || 1 ) )
	}

	$generateRectGeometry ( width, height ) {
		return {
			coords: [
				0,  	0,
	            0,  	height/2,
	            width/2, 	0,
	            width/2, 	0,
	            0, 		height/2,
	            width/2, 	height/2,
			]
		}
	}
}

export default LineGeometry