#ifdef GL_ES
precision ${maxShaderPrecision} float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 viewportSize;

const float k = 0.4142135623730950488016887242097;
const float pi2_3 = 2.0943951023931954923084289221863;

bool getr_( bool r, int a, int n ) {
	for (int i = 1; i < 1000; ++i) {
		if (i > n) return r; 
		r = (r != (mod(((float(a + i) - 0.5) * k + 0.5), 2.0) < 1.0));
	}
}
	
bool getr( int i1, int i2 ) {
	int n1 = (i1 < i2 ? i1 : i2);
	int n2 = (i1 + i2 - 2 * n1);
	bool r = getr_(false, 0, n1);
	r = r ^^ getr_(r, n1, n2);
	return r ^^ ((mod(float(i1), 2.0) >= 1.0 ) && (mod(float(i2), 2.0) >= 1.0));
}

void main( void ) {
	vec2 p = gl_FragCoord.xy - viewportSize;
	float t = (sin(time) * 0.4 - time * 0.3), s = sin(t), c = cos(t);
	float r = min(viewportSize.x, viewportSize.y) * 1.2;
	float l = length(p) / r; l = 1.0 - l * l; l = (l > 0.0 ? l : 0.0);
	float d = exp((sin(time) + 1.0) * 0.7);
	p = vec2(c * p.x - s * p.y, s * p.x + c * p.y);
	p = abs(p / d) + (0.5, 0.5);
	
	float R = sin(time + pi2_3 * 0.0) * 0.5 + 0.5;
	float G = sin(time + pi2_3 * 1.0) * 0.5 + 0.5;
	float B = sin(time + pi2_3 * 2.0) * 0.5 + 0.5;
	
	gl_FragColor = vec4( (getr(int(p.x), int(p.y)) ? vec3(l * R, l * G, l * B) : vec3(0.0, 0.0, 0.0)), 1.0 );
}