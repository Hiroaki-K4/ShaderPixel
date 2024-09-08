#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float julia(vec2 uv, int max_iter){
	int j=0;
	vec2 c=vec2(0.274,0.008);
	// vec2 c=vec2(0.285,0.01);
	// vec2 c=vec2(-0.70176,-0.3842);
	for(int i=0;i<max_iter;i++){
		j++;
		uv=vec2(uv.x*uv.x-uv.y*uv.y,2.0*uv.x*uv.y)+c;
		// Check for divergence
		if(length(uv)>float(2)){
			break;
		}
	}
	return float(j)/float(max_iter);
}

void main(){
	vec2 uv=(2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

	int max_iter = int(abs(sin(u_time*0.05)) * 100.0);
	float f=julia(uv, max_iter);

	gl_FragColor=vec4(vec3(f),1.0);
}
