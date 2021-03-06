/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Utils from "Utils"
import ChartMath from "ChartMath"

class Uniform {
	constructor( name, gl, shaderProgram, value ) {

		this.gl = gl
		this.name = name
		this.shaderProgram = this.shaderProgram
		this.type = value.uniformType
		this.value = value

		this.$state = new Utils.DataKeeper( {
			loc: gl.getUniformLocation( shaderProgram, name )
		} )
	}

	update () {
		if ( this.value.isSimple ) {
			this.gl[ this.type ]( this.$state.loc, this.value.valueOf() )
		} else {
			this.gl[ this.type ]( this.$state.loc, this.value.toArray() )
		}
		
	}
}

export default Uniform