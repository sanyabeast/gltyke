/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import GLEngineModule from "Core/GLEngineModule"
import Utils from "Utils"
import Config from "Config"
import DOMComponent from "Core/DOM/Component"

import Geometry from "GLEngine/Core/Geometry"
import Material from "GLEngine/Core/Material"
import Mesh from "GLEngine/Core/Mesh"
import Uniform from "GLEngine/Core/Uniform"
import MainLoop from "MainLoop"
import ChartMath from "ChartMath"

import RenderingObject from "GLEngine/Core/RenderingObject"
import DOMElement from "GLEngine/DOMElement"

import Group from "GLEngine/Group"
import Line from "GLEngine/Line"

import RectGeometry from "GLEngine/Geometries/RectGeometry"

class GLEngine extends Utils.aggregation( GLEngineModule, RenderingObject ) {
   static MainLoop = MainLoop
   static ChartMath = ChartMath
   static Utils = Utils

	static Geometry = Geometry
	static Material = Material
	static Mesh = Mesh
	static RenderingObject = RenderingObject
	static Uniform = Uniform
   static DOMElement = DOMElement

   static Group = Group
   static Line = Line

   static RectGeometry = RectGeometry

   static processAsset ( context, assetName, extension, processor ) {
      context.keys().forEach( ( path )=>{
         let data = context( path ).default
         let name = path.replace( `.${extension}`, "" ).replace( "./", "" )
         Config.assets[ assetName ][ name ] = ( processor ? processor( data ) : data )
      })
   }

   static loadAssets () {
      this.processAsset( require.context("txt!html"), "html", "html" )
      this.processAsset( require.context("scss"), "css", "scss" )
      this.processAsset( require.context("txt!shaders"), "shaders", "glsl" )
   }

   get domElement () { return this.$dom.canvasElement }

	constructor () {
		super()

      this.$modules = {
         canvas: new DOMComponent( {
            template: "canvas-element"
         } ),
      }


      this.$dom = {
         canvasElement: this.$modules.canvas.domElement,
      }

      this.$state = {
         gl: this.$dom.canvasElement.getContext( "webgl" ),
         size: ChartMath.vec2( 1, 1 ),
         position: ChartMath.vec2( 0, 0 ),
         scale: ChartMath.vec2( 1, 1 ),
         viewport: ChartMath.rect( 0, 0, 1, 1 ),
         worldPosition: ChartMath.vec2( 0, 0 ),
         worldScale: ChartMath.vec2( 1, 1 ),
         projectionModified: true,
         sizeNeedsUpdate: true,
         maxShaderPrecision: "mediump",
         time: ChartMath.float32( 0 ),
         mouse: ChartMath.vec2( 0, 0 )
      }

      this.$temp.prevTimeUpdate = ( +new Date() )
      this.$temp.time = ( +new Date() )
      this.$modules.canvas.on( "canvas.mousemove", ( evt )=>{
         this.$state.mouse.set( evt.x / this.$state.size.x, evt.y / this.$state.size.y )
      } )


      let gl = this.$state.gl
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      gl.disable(gl.DEPTH_TEST);

      this.$detectMaxFloatPrecision()

      Utils.proxyProps( this, this.$state, [
         "position",
         "scale",
         "viewport",
         "size",
         "worldScale",
         "worldPosition",
         "maxShaderPrecision",
         "time",
         "mouse"
      ] )

 
	   this.render = this.render.bind( this )

	}

	setSize ( w, h ) {
      w *= Config.DPR
      h *= Config.DPR

      if ( this.$state.size.x === w  && this.$state.size.y === h ) {
         return
      }

      if ( !w || !h ){
         return
      }

      this.$dom.canvasElement.width = w
      this.$dom.canvasElement.height = h
      
      this.$state.size.set( w, h )
      this.$state.gl.viewport( 0, 0, w, h )

      this.updateProjection()
	}

   setScale ( x, y ) {
      this.$state.viewport.w = this.$state.size.x * x
      this.$state.viewport.h = this.$state.size.y * y

      this.updateProjection()
   }

   setPosition (x, y ) {
      y = ( typeof y == "number" ) ? y : this.$state.position.y
      this.$state.position.set( x, y )

      this.updateProjection()
   }

   setViewport ( x, y, w, h ) {
      let viewport = this.$state.viewport

      viewport.set( x, y, w, h )

      this.$state.position.set( viewport.x, viewport.y )

      this.emit( "viewport.updated", viewport )
      this.updateProjection()
   } 


	fitSize () {
		if ( this.domElement.parentNode) {
			let rect = this.domElement.parentElement.getBoundingClientRect()
			this.setSize( rect.width, rect.height )
		}
	}

   updateProjection () {
      let viewport = this.$state.viewport
      let position = this.$state.position
      let worldPosition = this.$state.worldPosition
      let worldScale = this.$state.worldScale
      let size = this.$state.size
      let scale = this.$state.scale

      scale.set( viewport.w / size.x, viewport.h / size.y )

      viewport.x = position.x
      viewport.y = position.y

      worldPosition.set( viewport.x, viewport.y )
      worldScale.set( scale.x / 2, scale.y / 2 )

      this.$state.projectionModified = true
      this.emit( "projection.updated", viewport )
   }

   toReal ( x, y ) {
      return ChartMath.point(
         Math.round( ( (x - this.position.x) / this.scale.x ) ), 
         Math.round( ( this.size.y - ((y - this.position.y) / this.scale.y) ) )
      )

   }

   toRealScale ( x, y ) {
      return ChartMath.point(
         Math.round( ( x / this.scale.x ) ),
         Math.round( ( y / this.scale.y ) ),
      )
   }

   toVirtual ( x, y ) {
      return ChartMath.point(
         ( ( x * this.scale.x ) + this.position.x ),
         ( ( ( this.size.y - y )   * this.scale.y ) + this.position.y ),
      )
   } 

   toVirtualScale ( x, y ) {
      return ChartMath.point(
         x * this.scale.x,
         y * this.scale.y,
      )
   }

	render ( force ) {
      this.fitSize()


      if ( this.$state.projectionModified || force === true ) {
         this.$state.projectionModified = false;
         this.$updateTime()
         super.render( this, this.$state.gl, -this.$state.position.x, -this.$state.position.y, 1 )
      }
	}

   updateValue ( value ) {
      this.value = value || this.value
   }

   $detectMaxFloatPrecision () {
      let gl = this.$state.gl
      let maxShaderPrecision = "lowp"

      let formats = {
         LOW_FLOAT: "lowp",
         MEDIUM_FLOAT: "mediump",
         HIGH_FLOAT: "highp"
      }

      Utils.loopCollection( formats, ( precisionFormat, constName )=>{
         let fragData = gl.getShaderPrecisionFormat( gl.FRAGMENT_SHADER, gl[constName] )
         let vertData = gl.getShaderPrecisionFormat( gl.VERTEX_SHADER, gl[constName] )

         if ( fragData && vertData && fragData.precision && vertData.precision ) {
            maxShaderPrecision = precisionFormat
         } 
      } )

      this.clog( `Max shader float precision format: ${ maxShaderPrecision }` )
      this.$state.maxShaderPrecision = maxShaderPrecision
   }

   $updateTime () {
      let now = +new Date()
      let delta = ( now - this.$temp.prevTimeUpdate )

      this.$temp.prevTimeUpdate = now
      this.$temp.time = ( ( this.$temp.time + delta ) % ( 60 * 60 * 1000 ) )
      this.$state.time.set( this.$temp.time / 1000 )
      
   }
}

GLEngine.loadAssets()

export default GLEngine