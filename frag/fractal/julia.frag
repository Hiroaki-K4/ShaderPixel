#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
int ITR=100;

float julia(vec2 uv){
	int j=0;
    // TODO Change shape gradually 
    // ITR=ITR*int(floor(sin(u_time) * 0.5 + 0.5));
    // ITR=ITR+floor(u_time);
	for(int i=0;i<ITR;i++){
		j++;
		// vec2 c=vec2(-0.345,0.654);
        vec2 c=vec2(0.274,0.008);
		// vec2 d=vec2(0.005,0.0);
		uv=vec2(uv.x*uv.x-uv.y*uv.y,2.0*uv.x*uv.y)+c;
		if(length(uv)>float(ITR)){
			break;
		}
	}
	return float(j)/float(ITR);
}

void main(){
	vec2 uv=(2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

	// uv*=abs(sin(iTime*0.2));
	float f=julia(uv);

	gl_FragColor=vec4(vec3(f),1.0);
}
