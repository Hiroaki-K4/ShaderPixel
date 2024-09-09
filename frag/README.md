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
glslViewer fractal/mandelbort.frag
```

<img src="../images/mandelbrot.gif" width='400'>

<br></br>

# References
- [The Book of Shaders](https://thebookofshaders.com/)
- [Exploring The Mandelbrot And Julia Sets](https://storymaps.com/stories/37478f4f41874a30b97074d945b67bef)
- [Understanding Julia and Mandelbrot Sets](https://www.karlsims.com/julia.html)
