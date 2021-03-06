/**
 * @author sanyabeast | github.com/sanyabeast | a.gvrnsk@gmail.com | telegram:sanyabeats
 */

 
import EventBus from "EventBus"
import Utils from "Utils"

/**
 * @class
 * Basic module
 *
 */
class GLEngineModule {
	get domComponent () {
		if ( this.$modules ) {
			return this.$modules.domComponent || null
		}
	}

	get domElement () {
		if ( this.domComponent ) {
			return this.domComponent.domElement
		}
	}

	constructor () {
		this.UUID = Utils.generateRandomString( this.constructor.name, 32 )
		this.$state = new Utils.DataKeeper()
		this.$modules = new Utils.DataKeeper()
		this.$temp = new Utils.DataKeeper()
	}

	on ( eventName, callback ) {
		EventBus.on( `${ this.UUID }/${ eventName }`, callback )
	}

	emit ( eventName, payload ) {
		EventBus.emit( `${ this.UUID }/${ eventName }`, payload )
	}

	/* logging */
	clog ( ...args ) {
		console.log( `%cGLEngine:${ this.constructor.name }:`, "font-weight:bold; color:#3982c6;", ...args )
	}
}

export default GLEngineModule