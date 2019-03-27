/*

	Tech tunnel
	
	by T_S=RTX1911=   @T_SDesignWorks

*/


#ifdef GL_ES
precision ${maxShaderPrecision} float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 viewportSize;
uniform float lowFreq;

#define mycos(x) sin(1.57079633-x) 

vec3 roy(vec3 v, float x)
{
    return vec3(mycos(x)*v.x - sin(x)*v.z,v.y,sin(x)*v.x + mycos(x)*v.z);
}

vec3 rox(vec3 v, float x)
{
    return vec3(v.x,v.y*mycos(x) - v.z*sin(x),v.y*sin(x) + v.z*mycos(x));
}

float fdtun(vec3 rd, vec3 ro, float r)
{
	float a = dot(rd.xy,rd.xy);
  	float b = dot(ro.xy,rd.xy);
	float d = (b*b)-(32.0*a*(dot(ro.xy,ro.xy)+(r*r)));
  	return (-b+sqrt(abs(d)))/(3.75*a);
}

vec2 tunuv(vec3 pos){
	return vec2(pos.z,(atan(pos.y, pos.x))/0.31830988618379);
}

vec3 checkerCol(vec2 loc, vec3 col)
{
	return mix(col, vec3(0.25), mod(step(fract(loc.x), 0.75) + step(fract(loc.y), 0.25),7.5));
}

vec3 lcheckcol(vec2 loc, vec3 col)
{
	return checkerCol(loc*15.0,col)*checkerCol(loc*1.75,col);	
}
void main( void ) {
	vec3 dif = vec3(0.15,0.0,0.0);
	vec3 scoll = vec3(0.0,0.5,1.0);
	vec3 scolr = vec3(0.25,0.5,0.0);
	vec2 uv = (gl_FragCoord.xy/viewportSize.xy);
	vec3 ro = vec3(0.0,0.0,(time / 10.)*2.5);
	vec3 dir = normalize( vec3( -1.0 + 2.0*vec2(uv.x - .2, uv.y)* vec2(viewportSize.x/viewportSize.y, 1.0), -1.33 ) );

	float ry = (time / 10.)*0.3;
	
	dir = roy(rox(dir,((time + mouse.y / 399.) / 10.)*0.25),(time / 10.)*-0.5);
	vec3 lro = ro-dif;
	vec3 rro = ro+dif;

	const float r = 1.0;
	float ld = fdtun(dir,lro,r);
	float rd = fdtun(dir,rro,r);
	vec2 luv = tunuv(ro + ld*dir);
	vec2 ruv = tunuv(ro + rd*dir);
	vec3 coll = lcheckcol(luv*.25,scoll)*(20.0/exp(sqrt(ld)));
	vec3 colr = lcheckcol(ruv*.5,scolr)*(20.0/exp(sqrt(rd)));
	gl_FragColor = vec4(sqrt(coll+2.5*lowFreq*1.0+(colr-1.0)+lowFreq*20.0),1.0);
}
