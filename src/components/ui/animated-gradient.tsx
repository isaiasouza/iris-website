"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";

type PatternShape = "Checks" | "Stripes" | "Edge";
type PresetName = "Prism" | "Lava" | "Plasma" | "Pulse" | "Vortex" | "Mist";

const PATTERN_SHAPES: Record<PatternShape, number> = {
  Checks: 0,
  Stripes: 1,
  Edge: 2,
};

interface PresetParams {
  color1: string;
  color2: string;
  color3: string;
  rotation: number;
  proportion: number;
  scale: number;
  speed: number;
  distortion: number;
  swirl: number;
  swirlIterations: number;
  softness: number;
  offset: number;
  shape: PatternShape;
  shapeSize: number;
}

const PRESETS: Record<PresetName, PresetParams> = {
  Prism: {
    color1: "#050505",
    color2: "#66B3FF",
    color3: "#FFFFFF",
    rotation: -50,
    proportion: 1,
    scale: 0.01,
    speed: 30,
    distortion: 0,
    swirl: 50,
    swirlIterations: 16,
    softness: 47,
    offset: -299,
    shape: "Checks",
    shapeSize: 45,
  },
  Lava: {
    color1: "#FF9F21",
    color2: "#FF0303",
    color3: "#000000",
    rotation: 114,
    proportion: 100,
    scale: 0.52,
    speed: 30,
    distortion: 7,
    swirl: 18,
    swirlIterations: 20,
    softness: 100,
    offset: 717,
    shape: "Edge",
    shapeSize: 12,
  },
  Plasma: {
    color1: "#B566FF",
    color2: "#000000",
    color3: "#000000",
    rotation: 0,
    proportion: 63,
    scale: 0.75,
    speed: 30,
    distortion: 5,
    swirl: 61,
    swirlIterations: 5,
    softness: 100,
    offset: -168,
    shape: "Checks",
    shapeSize: 28,
  },
  Pulse: {
    color1: "#66FF85",
    color2: "#000000",
    color3: "#000000",
    rotation: -167,
    proportion: 92,
    scale: 0,
    speed: 20,
    distortion: 54,
    swirl: 75,
    swirlIterations: 3,
    softness: 28,
    offset: -813,
    shape: "Checks",
    shapeSize: 79,
  },
  Vortex: {
    color1: "#000000",
    color2: "#FFFFFF",
    color3: "#000000",
    rotation: 50,
    proportion: 41,
    scale: 0.4,
    speed: 20,
    distortion: 0,
    swirl: 100,
    swirlIterations: 3,
    softness: 5,
    offset: -744,
    shape: "Stripes",
    shapeSize: 80,
  },
  Mist: {
    color1: "#050505",
    color2: "#FF66B8",
    color3: "#050505",
    rotation: 0,
    proportion: 33,
    scale: 0.48,
    speed: 39,
    distortion: 4,
    swirl: 65,
    swirlIterations: 5,
    softness: 100,
    offset: -235,
    shape: "Edge",
    shapeSize: 48,
  },
};

interface CustomConfig {
  preset: "custom";
  color1: string;
  color2: string;
  color3: string;
  rotation?: number;
  proportion?: number;
  scale?: number;
  speed?: number;
  distortion?: number;
  swirl?: number;
  swirlIterations?: number;
  softness?: number;
  offset?: number;
  shape?: PatternShape;
  shapeSize?: number;
}

interface PresetConfig {
  preset: PresetName;
  speed?: number;
}

type GradientConfig = CustomConfig | PresetConfig;

interface NoiseConfig {
  opacity: number;
  scale?: number;
}

interface AnimatedGradientProps {
  config?: GradientConfig;
  noise?: NoiseConfig;
  radius?: string;
  style?: CSSProperties;
  className?: string;
}

export default function AnimatedGradient({
  config = { preset: "Prism" },
  noise,
  radius = "0px",
  style,
  className,
}: AnimatedGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const frameIdRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef(0);
  const params = useMemo((): PresetParams => {
    if (config.preset === "custom") {
      return {
        color1: config.color1,
        color2: config.color2,
        color3: config.color3,
        rotation: config.rotation ?? 0,
        proportion: config.proportion ?? 35,
        scale: config.scale ?? 1,
        speed: config.speed ?? 25,
        distortion: config.distortion ?? 12,
        swirl: config.swirl ?? 80,
        swirlIterations: config.swirlIterations ?? 10,
        softness: config.softness ?? 100,
        offset: config.offset ?? 0,
        shape: config.shape ?? "Checks",
        shapeSize: config.shapeSize ?? 10,
      };
    }

    const preset = PRESETS[config.preset] || PRESETS.Prism;
    return { ...preset, speed: config.speed ?? preset.speed };
  }, [config]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl2", {
      premultipliedAlpha: true,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }
    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      time: gl.getUniformLocation(program, "u_time"),
      resolution: gl.getUniformLocation(program, "u_resolution"),
      pixelRatio: gl.getUniformLocation(program, "u_pixelRatio"),
      scale: gl.getUniformLocation(program, "u_scale"),
      rotation: gl.getUniformLocation(program, "u_rotation"),
      color1: gl.getUniformLocation(program, "u_color1"),
      color2: gl.getUniformLocation(program, "u_color2"),
      color3: gl.getUniformLocation(program, "u_color3"),
      proportion: gl.getUniformLocation(program, "u_proportion"),
      softness: gl.getUniformLocation(program, "u_softness"),
      shape: gl.getUniformLocation(program, "u_shape"),
      shapeScale: gl.getUniformLocation(program, "u_shapeScale"),
      distortion: gl.getUniformLocation(program, "u_distortion"),
      swirl: gl.getUniformLocation(program, "u_swirl"),
      swirlIterations: gl.getUniformLocation(program, "u_swirlIterations"),
    };

    let pixelRatio = 1;
    const resize = () => {
      const width = Math.max(container.clientWidth, 1);
      const height = Math.max(container.clientHeight, 1);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    startTimeRef.current = performance.now();

    const draw = (time: number) => {
      const elapsed = (time - startTimeRef.current) / 1000;
      const speed = (params.speed / 100) * 5;
      const c1 = hexToRgba(params.color1);
      const c2 = hexToRgba(params.color2);
      const c3 = hexToRgba(params.color3);

      gl.uniform1f(uniforms.time, elapsed * speed + params.offset * 0.01);
      gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.pixelRatio, pixelRatio);
      gl.uniform1f(uniforms.scale, params.scale);
      gl.uniform1f(uniforms.rotation, (params.rotation * Math.PI) / 180);
      gl.uniform4f(uniforms.color1, c1[0], c1[1], c1[2], c1[3]);
      gl.uniform4f(uniforms.color2, c2[0], c2[1], c2[2], c2[3]);
      gl.uniform4f(uniforms.color3, c3[0], c3[1], c3[2], c3[3]);
      gl.uniform1f(uniforms.proportion, params.proportion / 100);
      gl.uniform1f(uniforms.softness, params.softness / 100);
      gl.uniform1f(uniforms.shape, PATTERN_SHAPES[params.shape]);
      gl.uniform1f(uniforms.shapeScale, params.shapeSize / 100);
      gl.uniform1f(uniforms.distortion, params.distortion / 50);
      gl.uniform1f(uniforms.swirl, params.swirl / 100);
      gl.uniform1f(uniforms.swirlIterations, params.swirl === 0 ? 0 : params.swirlIterations);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduceMotion) frameIdRef.current = requestAnimationFrame(draw);
    };

    frameIdRef.current = requestAnimationFrame(draw);

    return () => {
      if (frameIdRef.current !== undefined) cancelAnimationFrame(frameIdRef.current);
      resizeObserver.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(positionBuffer);
    };
  }, [params]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: -1,
        borderRadius: radius,
        overflow: "hidden",
        ...style,
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {noise && noise.opacity > 0 ? (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: NOISE_TEXTURE,
            backgroundSize: (noise.scale ?? 1) * 200,
            backgroundRepeat: "repeat",
            opacity: noise.opacity / 2,
          }}
        />
      ) : null}
    </div>
  );
}

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
  gl.deleteShader(shader);
  return null;
}

function hexToRgba(hex: string): [number, number, number, number] {
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 1;

  if (hex.startsWith("rgba(")) {
    const parts = hex.slice(5, -1).split(",");
    r = parseInt(parts[0]) / 255;
    g = parseInt(parts[1]) / 255;
    b = parseInt(parts[2]) / 255;
    a = parseFloat(parts[3]);
  } else if (hex.startsWith("rgb(")) {
    const parts = hex.slice(4, -1).split(",");
    r = parseInt(parts[0]) / 255;
    g = parseInt(parts[1]) / 255;
    b = parseInt(parts[2]) / 255;
  } else if (hex.startsWith("#")) {
    const color = hex.slice(1);
    if (color.length === 3) {
      r = parseInt(color[0] + color[0], 16) / 255;
      g = parseInt(color[1] + color[1], 16) / 255;
      b = parseInt(color[2] + color[2], 16) / 255;
    } else if (color.length >= 6) {
      r = parseInt(color.slice(0, 2), 16) / 255;
      g = parseInt(color.slice(2, 4), 16) / 255;
      b = parseInt(color.slice(4, 6), 16) / 255;
      if (color.length === 8) a = parseInt(color.slice(6, 8), 16) / 255;
    }
  }

  return [r, g, b, a];
}

const NOISE_TEXTURE = `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwBAMAAAClLOS0AAAAElBMVEUAAAAAAAAAAAAAAAAAAAAAAADgKxmiAAAABnRSTlMCCgkGBAVJOAVJAAAASklEQVQ4y2NgGAWjYBSMglEwCgY/YGRgZBQUYmJiZGQEkYwMjIyMgoKCjIyMIJKBgRFIMjIyAklGRkYGRkFBYEcwMDIyMjAOUQAA1I4HwVwZAkYAAAAASUVORK5CYII=")`;

const VERTEX_SHADER = `#version 300 es
in vec4 a_position;
void main() {
  gl_Position = a_position;
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform float u_time;
uniform float u_pixelRatio;
uniform vec2 u_resolution;
uniform float u_scale;
uniform float u_rotation;
uniform vec4 u_color1;
uniform vec4 u_color2;
uniform vec4 u_color3;
uniform float u_proportion;
uniform float u_softness;
uniform float u_shape;
uniform float u_shapeScale;
uniform float u_distortion;
uniform float u_swirl;
uniform float u_swirlIterations;

out vec4 fragColor;

#define TWO_PI 6.28318530718
#define PI 3.14159265358979323846

vec2 rotate(vec2 uv, float th) {
  return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
}

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec4 blendColors(vec4 c1, vec4 c2, vec4 c3, float mixer, float edgesWidth, float edgeBlur) {
  vec3 color1 = c1.rgb * c1.a;
  vec3 color2 = c2.rgb * c2.a;
  vec3 color3 = c3.rgb * c3.a;
  float r1 = smoothstep(.0 + .35 * edgesWidth, .7 - .35 * edgesWidth + .5 * edgeBlur, mixer);
  float r2 = smoothstep(.3 + .35 * edgesWidth, 1. - .35 * edgesWidth + edgeBlur, mixer);
  vec3 blended = mix(color1, color2, r1);
  float blendedOpacity = mix(c1.a, c2.a, r1);
  return vec4(mix(blended, color3, r2), mix(blendedOpacity, c3.a, r2));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float t = .5 * u_time;
  float noiseScale = .0005 + .006 * u_scale;

  uv -= .5;
  uv *= noiseScale * u_resolution;
  uv = rotate(uv, u_rotation * .5 * PI);
  uv /= u_pixelRatio;
  uv += .5;

  float n1 = noise(uv + t);
  float n2 = noise(uv * 2. - t);
  float angle = n1 * TWO_PI;
  uv.x += 4. * u_distortion * n2 * cos(angle);
  uv.y += 4. * u_distortion * n2 * sin(angle);

  float iterations = ceil(clamp(u_swirlIterations, 1., 30.));
  for (float i = 1.; i <= 30.; i++) {
    if (i > iterations) break;
    uv.x += clamp(u_swirl, 0., 2.) / i * cos(t + i * 1.5 * uv.y);
    uv.y += clamp(u_swirl, 0., 2.) / i * cos(t + i * uv.x);
  }

  float proportion = clamp(u_proportion, 0., 1.);
  float shape = 0.;
  float mixer = 0.;

  if (u_shape < .5) {
    vec2 checksUv = uv * (.5 + 3.5 * u_shapeScale);
    shape = .5 + .5 * sin(checksUv.x) * cos(checksUv.y);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else if (u_shape < 1.5) {
    vec2 stripesUv = uv * (.25 + 3. * u_shapeScale);
    float f = fract(stripesUv.y);
    shape = smoothstep(.0, .55, f) * smoothstep(1., .45, f);
    mixer = shape + .48 * sign(proportion - .5) * pow(abs(proportion - .5), .5);
  } else {
    float edge = 1. - uv.y;
    edge -= .5;
    edge /= noiseScale * u_resolution.y;
    edge += .5;
    float shapeScaling = .2 * (1. - u_shapeScale);
    shape = smoothstep(.45 - shapeScaling, .55 + shapeScaling, edge + .3 * (proportion - .5));
    mixer = shape;
  }

  fragColor = blendColors(
    u_color1,
    u_color2,
    u_color3,
    mixer,
    1. - clamp(u_softness, 0., 1.),
    .01 + .01 * u_scale
  );
}`;
