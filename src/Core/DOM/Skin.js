/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import Utils from "Utils"
import Config from "Config"

class Skin {

	cssText = "";

	constructor ( skinData ) {
		this.$name = skinData.name
		this.$values = new Utils.DataKeeper( skinData.values )
		this.$updateCSS()
	}

	$updateCSS () {
		this.cssText = Utils.generateVarsCSS( this.$values )
	}

	apply () {
		Utils.injectCSS( "glengine-skin-vars", this.cssText )

		Utils.loopCollection( Config.glColors, ( color, name )=>{
			if ( this.$values[ name ] ) {
				color.setCSSHex( this.$values[ name ] )
			}
		} )

	}
}

export default Skin