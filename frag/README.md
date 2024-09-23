# Various shaders

You can try various shaders by using glslViewer.

```bash
glslViewer *.frag
```

<br></br>

# Julia set
Julia set is a type of fractal. It is represented as a complex number $z=x+yi$. $z$ is updated by the following equation.

$$
z=z^2+c
$$

$c$ is a constant. $c$ can be added to produce various boundaries instead of circles.

<img src="../images/julia_bound.png" width='400'>

You can draw Julia set by running the following command.

```bash
glslViewer fractal/julia.frag
```

**Pattern1: $c=0.274+0.008i$**

<img src="../images/julia.gif" width='400'>

**Pattern2: $c=0.285+0.01i$**

<img src="../images/julia_2.gif" width='400'>

**Pattern3: $c=-0.70176-0.3842i$**

<img src="../images/julia_3.gif" width='400'>

<br></br>

## Mandelbrot set
In Mandelbrot, the value of $c$ is determined by the coordinates. $z$ is initialized at $(0,0)$ and updated according to the formula $z=z^2+c$. Mandelbrot includes various Julia sets depending on the coordinates.

<img src="../images/mandelbrot_julia.png" width='600'>

You can draw Mandelbrot set by running the following command.

```bash
glslViewer fractal/mandelbrot.frag
```

<img src="../images/mandelbrot.gif" width='400'>

<br></br>

## Mandelbox
Mandelbox is a type of fractal that combines characteristics of both a box and a ball. It is generated using a specific iterative formula, similar to other fractals like the Mandelbrot set, but with some key differences. A key feature of the Mandelbox is its "folding" mechanism, where points in space are folded across both spherical and box-shaped boundaries. This gives it a distinctive structure that retains self-similar properties on different scales, making it visually complex and highly detailed.

### Box Fold
The Box Fold is a key transformation in the generation of Mandelbox fractals. It is one of two folds (along with the Ball Fold) used to iteratively transform points in space to create the complex structure of the Mandelbox.

The Box Fold reflects points in space if they cross a defined boundary. Specifically, if any coordinate of a point exceeds a certain threshold (often 1 or 2, depending on the fractal’s scale), the Box Fold "folds" the coordinate back by reflecting it across this boundary. This folding process compresses the space in such a way that it helps to keep the fractal bounded within a specific region.  
The Box Fold is defined as follows.

$$
F_{box}(x)=
\begin{cases}
-2-x & (x<-1) \\
x & (-1 \leq x \leq 1) \\
2-x & (x>1)
\end{cases}
$$

The 2D Box Fold moves as follows.

<img src="../images/box_fold.gif" width='400'>

In 3D, it folds around the cube. The code in GLSL is as follows.

```glsl
void boxFold(inout vec3 z)
{
	z = clamp(z, -1.0, 1.0) * 2.0 - z;
}
```

### Ball Fold
The Ball Fold is another essential operation in the generation of Mandelbox fractals. This fold works in conjunction with the Box Fold to shape the fractal into its intricate, self-similar structure.  
If a point is too close to the origin (within a defined radius, often 0.5 or 1), the Ball Fold inverts the point, pushing it outward. This prevents points from collapsing into the center. No changes are made to points far from the center.

The Ball Fold is defined as follows.

$$
F_{ball}(x)=
\begin{cases}
4\vec{x} & (|\vec{x}|<\frac{1}{2}) \\
\vec{x}/|\vec{x}|^2 & (\frac{1}{2} \leq |\vec{x}| < 1) \\
\vec{x} & (|\vec{x}|\geq1)
\end{cases}
$$

The 2D Ball Fold moves as follows.

<img src="../images/ball_fold.gif" width='400'>

In 3D, it folds around the cube. The code in GLSL is as follows.

```glsl
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
```

<br></br>

You can draw Mandelbox by running the following command.

```bash
glslViewer fractal/mandelbox.frag
```

The Mandelbox below changes its shape by changing the number of iterations of folding over time.

<img src="../images/mandelbox.gif" width='400'>

<br></br>

# References
- [The Book of Shaders](https://thebookofshaders.com/)
- [Exploring The Mandelbrot And Julia Sets](https://storymaps.com/stories/37478f4f41874a30b97074d945b67bef)
- [Understanding Julia and Mandelbrot Sets](https://www.karlsims.com/julia.html)
- [The Mandelbox Set](https://digitalfreepen.com/mandelbox370/)
- [What is a Mandelbox](https://sites.google.com/site/mandelbox/what-is-a-mandelbox)
- [2D Mandelbox Fold](https://vimeo.com/9745981)
- [Shadertoy](https://www.shadertoy.com/view/MtlXR4)
