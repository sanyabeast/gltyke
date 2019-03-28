import GLEngine from "GLEngine"

class App {
	static GLEngine = GLEngine;

	constructor () {
		this.glengine = new GLEngine()

		document.body.appendChild( this.glengine.domElement )

		GLEngine.MainLoop.addTask( ()=>{
			this.glengine.render( true )
		} )

		GLEngine.MainLoop.start()


		let w = 800

		let rect1 = new GLEngine.Mesh( {
			geometry: new GLEngine.RectGeometry( {
				width: w,
				height: w
			} ),
			material: new GLEngine.Material( {
				fragmentShader: "frag.fluid_m",
				vertexShader: "vert.default",
				uniforms: {
					diffuse: GLEngine.ChartMath.color( "#ff0000" ),
					opacity: GLEngine.ChartMath.float32( 1 )
				}
			} )
		} )

		rect1.position.x = 0
		rect1.position.y = 0


		let rect2 = new GLEngine.Mesh( {
			geometry: new GLEngine.RectGeometry( {
				width: w,
				height: w
			} ),
			material: new GLEngine.Material( {
				fragmentShader: "frag.framework",
				vertexShader: "vert.default",
				uniforms: {
					diffuse: GLEngine.ChartMath.color( "#ff0000" ),
					opacity: GLEngine.ChartMath.float32( 1 )
				}
			} )
		} )

		rect2.position.x = 400
		rect2.position.y = 0

		let rect3 = new GLEngine.Mesh( {
			geometry: new GLEngine.RectGeometry( {
				width: w,
				height: w
			} ),
			material: new GLEngine.Material( {
				fragmentShader: "frag.fluid",
				vertexShader: "vert.default",
				uniforms: {
					diffuse: GLEngine.ChartMath.color( "#ff0000" ),
					opacity: GLEngine.ChartMath.float32( 1 )
				}
			} )
		} )

		rect3.position.x = 400
		rect3.position.y = 400

		let rect4 = new GLEngine.Mesh( {
			geometry: new GLEngine.RectGeometry( {
				width: w,
				height: w
			} ),
			material: new GLEngine.Material( {
				fragmentShader: "frag.ocean",
				vertexShader: "vert.default",
				uniforms: {
					diffuse: GLEngine.ChartMath.color( "#ff0000" ),
					opacity: GLEngine.ChartMath.float32( 1 )
				}
			} )
		} )

		rect4.position.x = 0
		rect4.position.y = 400



		this.glengine.addChild( rect1 )
		this.glengine.addChild( rect2 )
		this.glengine.addChild( rect3 )
		this.glengine.addChild( rect4 )

		this.glengine.setScale( 1, 1 )
		this.glengine.setPosition( -this.glengine.size.x / 2, -this.glengine.size.y / 2 )
	}
}

export default App