#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

bool check_mandelbrot(vec2 uv, int max_iter){
	vec2 z = vec2(0.0);
	vec2 c = uv - vec2(0.72, -0.25);
	bool inMandelbrotSet = true; 
	for(int i=0;i<max_iter;i++){
		z=vec2(z.x*z.x-z.y*z.y, 2.0*z.x*z.y)+c;
		// Check for divergence
		if(length(z)>float(2)){
			inMandelbrotSet = false;
			break;
		}
	}
	return inMandelbrotSet;
}

void main(){
	vec2 uv=(2.0*gl_FragCoord.xy-u_resolution.xy)/u_resolution.y;

	// Calculate scale
    float scale = 1.0 + u_time * 0.7;
    uv /= scale;

	int max_iter = 100;
	bool inMandelbrotSet=check_mandelbrot(uv, max_iter);

	if (inMandelbrotSet) {
        gl_FragColor = vec4(1,1,1,1);
    } else {
        gl_FragColor = vec4(0,0,0,1);
    }
}
