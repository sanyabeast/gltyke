/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import ChartMath from "ChartMath"
import Utils from "Utils"

import RenderingObject from "GLEngine/Core/RenderingObject"
import Mesh from "GLEngine/Core/Mesh"
import Material from "GLEngine/Core/Material"
import LineGeometry from "GLEngine/Geometries/LineGeometry"

class Line extends Mesh {
	constructor ( params ) {
		super( params )

		this.$params.material = new Material( {
			fragmentShader: "frag.default",
			vertexShader: "vert.line2d",
			uniforms: params.uniforms
		} )

		if ( params.points ) {
			this.setPoints( params.points )
		}
	}

	setPoints ( points ) {
		this.$data.points = points

		let extremum = ChartMath.getExtremum( points )

		this.$state.boundRect.set(
			points[0].x,
			extremum.min,
			(points[points.length - 1].x) - this.$state.boundRect.x,
			extremum.size,
		)

		this.geometry = new LineGeometry( {
			points: points
		} )

		
	}

	
}

export default Line