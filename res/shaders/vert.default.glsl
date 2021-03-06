precision ${maxShaderPrecision} float;

attribute vec2 coords;
uniform vec2 position;

uniform vec2  worldPosition;
uniform vec2  worldScale;
uniform vec2  viewportSize;

void main(void) {
	vec2 pos = vec2( coords );

	pos -= position;
	pos -= worldPosition;
	pos /= worldScale;
	pos /= viewportSize;
	pos -= 1.;

   	gl_Position = vec4( pos.xy, 0., 1.);
}