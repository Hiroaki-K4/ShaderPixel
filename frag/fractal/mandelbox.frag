#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void ballFold(inout vec3 z, inout float dz)
{
	float z_sq = dot(z,z);
    float z_sqrt = sqrt(z_sq);
	if (z_sqrt < 0.5)
    { 
		float temp = 2.0;
		z *= temp;
		dz*= temp;
	}
    else if (z_sqrt < 1.0)
    { 
		float temp = 1.0 / z_sq;
		z *= temp;
		dz*= temp;
	}
}

void boxFold(inout vec3 z)
{
	z = clamp(z, -1.0, 1.0) * 2.0 - z;
}

float mandelbox(vec3 z)
{
    float scale = 2.0;
	// vec3 offset = z;
	vec3 offset = z * 1.6;
	float dr = 1.0;

    int iter = int(15.0 * abs(sin(u_time*0.1)));
	for (int n = 0; n < iter; n++)
    {
        // Fold the surrounding area around a 1*1*1 cube
		boxFold(z);
        // Fold around the ball
        ballFold(z,dr);
        z = scale * z + offset;
        dr = dr * abs(scale) + 1.0;
	}
	float r = length(z);
	return r / abs(dr);
}

float rayMarcher(in vec3 camPos, in vec3 rayDir)
{
	const float maxd = 50.0;
	const float precis = 0.01;
    float h = precis*2.0;
    float t = 0.0;
	float res = -1.0;
    for(int i=0; i<100; i++)
    {
        if (h<precis||t>maxd)
        {
            break;
        }
        h = mandelbox( camPos+rayDir*t );
        t += h;
    }

    // Ray hit something
    if (t<maxd)
    {
        res = t;
    }
    return res;
}

vec3 normal(in vec3 pos)
{
    const float eps = 0.005;

    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);

	return normalize( v1*mandelbox( pos + v1*eps ) + 
					  v2*mandelbox( pos + v2*eps ) + 
					  v3*mandelbox( pos + v3*eps ) + 
					  v4*mandelbox( pos + v4*eps ) );
}

float ambocc(in vec3 pos, in vec3 nor)
{
	float occ = 0.0;
    float sca = 1.0;
    for( int i=0; i<5; i++ )
    {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = mandelbox( aopos );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp( 1.0 - 3.0*occ, 0.0, 1.0 );    
}

vec3 light(in vec3 lightdir, in vec3 lightcol, in vec3 tex, in vec3 norm, in vec3 camdir)
{    
    float cosa = pow(0.5 + 0.5*dot(norm, -lightdir),2.0);
    float cosr = max(dot(-camdir, reflect(lightdir, norm)), -0.0);

    float diffuse = cosa;
    float phong = pow(cosr, 8.0);

    return lightcol * (tex * diffuse + phong);
}

vec3 material(in vec3 pos , in vec3 camdir)
{    
	vec3 norm = normal(pos);

    vec3 d1 = -normalize(vec3(5.0,10.0,-20.0));
    vec3 d2 = -normalize(vec3(-5,10.0,20.0));
    vec3 d3 = -normalize(vec3(20,5.0,-5.0));
    vec3 d4 = -normalize(vec3(-20.0,5.0,5.0));

    vec3 tex = vec3(0.2);

    float ao = ambocc(pos, norm);

    vec3 l1 = light(d1, vec3(1.0), tex, norm, camdir);
    vec3 l2 = light(d2, vec3(1.0), tex, norm, camdir);
    vec3 l3 = light(d3, vec3(1.0), tex, norm, camdir);
    vec3 l4 = light(d4, vec3(1.0), tex, norm, camdir);

    return 0.5 * ao + 0.5 * (l1+l2+l3+l4);
}

mat3 calcLookAtMatrix(in vec3 camPos, in vec3 objPos)
{
    vec3 camDir = normalize(objPos - camPos);
    vec3 camRight = normalize(cross(camDir, vec3(0.0, 1.0, 0.0)));
    vec3 camUp = normalize(cross(camRight, camDir));
    return mat3(camRight, camUp, camDir);
}

vec3 rayRender(vec3 camPos, vec3 rayDir)
{
	vec3 col = vec3(0.0);

	float dist = rayMarcher(camPos, rayDir);

    if (dist==-1.0)
    {
        col = vec3(1.0);
    }
    else
    {
    	vec3 inters = camPos + dist * rayDir;
		col = material(inters, rayDir);
    }

    return col;
}

void main()
{
    float t = u_time;

	// Convert window coordinates to normalized screen coordinates
    vec2 xy = (gl_FragCoord.xy - u_resolution.xy/2.0) / max(u_resolution.xy.x, u_resolution.xy.y);

    vec3 camPos = vec3(30.0*cos(t/5.0),10.0,30.0*sin(t/5.0));
    vec3 objPos = vec3(0.0,0.0,0.0);

    mat3 camMat = calcLookAtMatrix(camPos, objPos);
	// Transform the ray direction from the screen space to the world space
    // according to the camera's orientation
    vec3 rayDir = normalize(camMat * vec3(xy, 1.0));

    vec3 col = rayRender(camPos, rayDir);

	gl_FragColor = vec4(col, 1.0);
}
