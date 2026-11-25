"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// 4x4 Bayer matrix (0..15) for authentic halftone pixel dithering like marwieang.com
const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

type ObstacleKind = "block" | "step2" | "step3" | "spike" | "doubleSpike" | "pillarGap";

type Segment = {
  x: number; // in low-res pixel units
  w: number;
  topOffset: number; // height above base ground (in low-res px)
  hasSpike?: boolean;
  doubleSpike?: boolean;
  hasPad?: boolean;
};

type BgTower = {
  x: number;
  w: number;
  h: number;
  layer: 0 | 1; // 0 = far halftone, 1 = mid stepped block
  stepped: boolean;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  accent?: boolean;
};

const PIXEL = 3; // 1 logical pixel = 3x3 CSS pixels (crisp pixel-art look)
const BLOCK_UNIT = 10; // 10 logical px = 30 CSS px per GD block
const CUBE_SIZE = 9; // 9 logical px = 27 CSS px cube

export function GeometryDashBg() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // Pause background runner while on the dedicated /game arcade route
    if (pathname === "/game") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let groundY = 0;
    let rafId = 0;

    // Runner state (logical pixel coordinates)
    let cubeX = 56;
    let cubeY = 0;
    let cubeVy = 0;
    let cubeAngle = 0; // radians
    let targetAngle = 0;
    let onGround = true;

    const GRAVITY = 155; // logical px / s^2
    const JUMP_VY = -64; // logical px / s
    const PAD_JUMP_VY = -80;
    const SCROLL_SPEED = 36; // logical px / s

    let segments: Segment[] = [];
    let towers: BgTower[] = [];
    let particles: Particle[] = [];
    let patternCursor = 0;
    let dustTimer = 0;

    const PATTERN_SEQUENCE: ObstacleKind[] = [
      "block",
      "spike",
      "step2",
      "step3",
      "doubleSpike",
      "pillarGap",
      "step2",
      "spike"
    ];

    function appendNextCourseChunk(startX: number): number {
      const kind = PATTERN_SEQUENCE[patternCursor % PATTERN_SEQUENCE.length];
      patternCursor += 1;
      let cursor = startX;

      // Flat safe run-up
      segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: 0 });
      cursor += BLOCK_UNIT * 3;

      if (kind === "spike") {
        segments.push({ x: cursor, w: BLOCK_UNIT * 4, topOffset: 0, hasSpike: true });
        cursor += BLOCK_UNIT * 4;
      } else if (kind === "doubleSpike") {
        segments.push({
          x: cursor,
          w: BLOCK_UNIT * 5,
          topOffset: 0,
          hasSpike: true,
          doubleSpike: true
        });
        cursor += BLOCK_UNIT * 5;
      } else if (kind === "block") {
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: BLOCK_UNIT });
        cursor += BLOCK_UNIT * 2;
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: 0 });
        cursor += BLOCK_UNIT * 2;
      } else if (kind === "step2") {
        // 2-step GD block staircase
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT });
        cursor += BLOCK_UNIT * 3;
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT * 2 });
        cursor += BLOCK_UNIT * 3;
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: 0 });
        cursor += BLOCK_UNIT * 2;
      } else if (kind === "step3") {
        // 3-step GD block staircase + jump pad bounce!
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: 0, hasPad: true });
        cursor += BLOCK_UNIT * 2;
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT * 2 });
        cursor += BLOCK_UNIT * 3;
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT * 3 });
        cursor += BLOCK_UNIT * 3;
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT });
        cursor += BLOCK_UNIT * 3;
      } else if (kind === "pillarGap") {
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: BLOCK_UNIT });
        cursor += BLOCK_UNIT * 2;
        // Low trench with spike (cube jumps pillar-to-pillar over it!)
        segments.push({ x: cursor, w: BLOCK_UNIT * 2, topOffset: 0, hasSpike: true });
        cursor += BLOCK_UNIT * 2;
        segments.push({ x: cursor, w: BLOCK_UNIT * 3, topOffset: BLOCK_UNIT * 2 });
        cursor += BLOCK_UNIT * 3;
      }

      return cursor;
    }

    function initWorld() {
      const cssW = window.innerWidth;
      const cssH = Math.round(Math.min(Math.max(window.innerHeight * 0.5, 260), 430));

      width = Math.max(120, Math.floor(cssW / PIXEL));
      height = Math.max(80, Math.floor(cssH / PIXEL));

      if (canvas) {
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;
      }

      groundY = height - 14;
      // Place cube in the open left gutter between the 252px sidebar and the centered 656px column on desktop
      if (cssW >= 1024) {
        const leftGutterW = Math.max(48, (cssW - 252 - 656) / 2);
        const targetCssX = 252 + Math.min(leftGutterW * 0.52, 260);
        cubeX = Math.max(94, Math.floor(targetCssX / PIXEL));
      } else {
        cubeX = Math.max(20, Math.floor(width * 0.18));
      }

      segments = [];
      let cursor = 0;
      // Flat intro runway
      segments.push({ x: 0, w: BLOCK_UNIT * 8, topOffset: 0 });
      cursor = BLOCK_UNIT * 8;
      while (cursor < width + BLOCK_UNIT * 18) {
        cursor = appendNextCourseChunk(cursor);
      }

      cubeY = groundY - CUBE_SIZE;
      cubeVy = 0;
      cubeAngle = 0;
      targetAngle = 0;
      onGround = true;

      // Populate far & mid Bayer-dithered stepped block skyline
      towers = [];
      let tx = 4;
      while (tx < width + 80) {
        const w = BLOCK_UNIT * (2 + Math.floor((tx * 7) % 4));
        const h = BLOCK_UNIT * (3 + Math.floor((tx * 13) % 6));
        towers.push({
          x: tx,
          w,
          h,
          layer: (tx % 2) as 0 | 1,
          stepped: tx % 3 === 0
        });
        tx += w + BLOCK_UNIT * (1 + (tx % 3));
      }
    }

    function spawnBurst(x: number, y: number, count: number, accent = false) {
      for (let i = 0; i < count; i++) {
        const angle = -Math.PI * 0.15 - Math.random() * Math.PI * 0.7;
        const speed = 10 + Math.random() * 26;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed - SCROLL_SPEED * 0.35,
          vy: Math.sin(angle) * speed,
          life: 0,
          maxLife: 0.32 + Math.random() * 0.25,
          size: Math.random() > 0.6 ? 2 : 1,
          accent
        });
      }
    }

    function doJump(vy = JUMP_VY, accent = false) {
      if (!onGround) return;
      cubeVy = vy;
      onGround = false;
      targetAngle = Math.round(cubeAngle / (Math.PI / 2)) * (Math.PI / 2) + Math.PI / 2;
      spawnBurst(cubeX + CUBE_SIZE * 0.4, cubeY + CUBE_SIZE, 6, accent);
    }

    function getSegmentAt(xPos: number): Segment | undefined {
      return segments.find((s) => xPos >= s.x && xPos < s.x + s.w);
    }

    function update(dt: number) {
      const dx = SCROLL_SPEED * dt;

      // Scroll parallax block towers
      for (const t of towers) {
        t.x -= dx * (t.layer === 0 ? 0.28 : 0.52);
      }
      const maxTowerX = towers.reduce((m, t) => Math.max(m, t.x + t.w), 0);
      for (const t of towers) {
        if (t.x + t.w < -20) {
          t.x = Math.max(width + 10, maxTowerX + BLOCK_UNIT * 2);
        }
      }

      // Scroll foreground obstacle segments
      for (const s of segments) {
        s.x -= dx;
      }
      if (segments.length > 0 && segments[0].x + segments[0].w < -30) {
        segments.shift();
      }
      const lastSeg = segments[segments.length - 1];
      if (lastSeg && lastSeg.x + lastSeg.w < width + BLOCK_UNIT * 14) {
        appendNextCourseChunk(lastSeg.x + lastSeg.w);
      }

      // Current surface height underneath the cube
      const segLeft = getSegmentAt(cubeX + 2);
      const segRight = getSegmentAt(cubeX + CUBE_SIZE - 2);
      const currentTopOffset = Math.max(segLeft?.topOffset ?? 0, segRight?.topOffset ?? 0);
      const surfaceY = groundY - currentTopOffset;

      // Auto-pad bounce check
      const centerSeg = getSegmentAt(cubeX + CUBE_SIZE * 0.5);
      if (onGround && centerSeg?.hasPad) {
        const padCenter = centerSeg.x + centerSeg.w * 0.55;
        if (Math.abs(cubeX + CUBE_SIZE * 0.5 - padCenter) < 4) {
          doJump(PAD_JUMP_VY, true);
        }
      }

      // Lookahead AI auto-jumper (scans upcoming spikes & higher ledges!)
      if (onGround) {
        const lookMin = cubeX + CUBE_SIZE + 3;
        const lookMax = cubeX + CUBE_SIZE + 15;

        for (const s of segments) {
          // 1. Jump before a higher stepped block!
          if (s.topOffset > currentTopOffset && s.x >= lookMin - 4 && s.x <= lookMax) {
            doJump(JUMP_VY);
            break;
          }
          // 2. Jump before single or double spikes!
          if (s.hasSpike) {
            const spikeStartX = s.x + BLOCK_UNIT * 1.4;
            if (spikeStartX >= lookMin && spikeStartX <= lookMax + 2) {
              doJump(s.doubleSpike ? JUMP_VY * 1.07 : JUMP_VY);
              break;
            }
          }
        }
      }

      // Vertical physics & smooth 90-degree Geometry Dash flip
      if (!onGround || cubeY + CUBE_SIZE < surfaceY) {
        cubeVy += GRAVITY * dt;
        cubeY += cubeVy * dt;

        // Spin smoothly toward next 90-degree quarter turn in air
        cubeAngle += 5.4 * dt;

        if (cubeY + CUBE_SIZE >= surfaceY) {
          cubeY = surfaceY - CUBE_SIZE;
          cubeVy = 0;
          if (!onGround) {
            onGround = true;
            // Snap cleanly to 90-degree multiple on landing!
            cubeAngle = Math.round(cubeAngle / (Math.PI / 2)) * (Math.PI / 2);
            targetAngle = cubeAngle;
            spawnBurst(cubeX + 2, cubeY + CUBE_SIZE, 3, false);
          }
        }
      } else {
        cubeY = surfaceY - CUBE_SIZE;
        // Check if walked off a ledge -> fall & quarter-turn!
        if (cubeY + CUBE_SIZE < surfaceY - 0.5) {
          onGround = false;
        }
      }

      // Sliding pixel trail dust while grounded
      dustTimer += dt;
      if (onGround && dustTimer >= 0.07) {
        dustTimer = 0;
        particles.push({
          x: cubeX - 1,
          y: cubeY + CUBE_SIZE - 1 - Math.random() * 1.5,
          vx: -SCROLL_SPEED * (0.5 + Math.random() * 0.3),
          vy: -4 - Math.random() * 8,
          life: 0,
          maxLife: 0.28,
          size: 1
        });
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vy += 45 * dt;
      }
    }

    function drawDitherRect(
      rx: number,
      ry: number,
      rw: number,
      rh: number,
      density: number, // 0..16
      color: string
    ) {
      if (!ctx) return;
      ctx.fillStyle = color;
      const x0 = Math.max(0, Math.floor(rx));
      const y0 = Math.max(0, Math.floor(ry));
      const x1 = Math.min(width, Math.floor(rx + rw));
      const y1 = Math.min(height, Math.floor(ry + rh));

      for (let py = y0; py < y1; py++) {
        const row = BAYER_4X4[py & 3];
        // Fade density slightly near top of tall towers for soft marwieang halftone blend
        const vRatio = (py - ry) / Math.max(1, rh);
        const localDensity = density * (0.45 + 0.55 * vRatio);
        for (let px = x0; px < x1; px++) {
          if (row[px & 3] < localDensity) {
            ctx.fillRect(px, py, 1, 1);
          }
        }
      }
    }

    function draw() {
      if (!ctx) return;
      const isDark = document.documentElement.classList.contains("dark");

      ctx.clearRect(0, 0, width, height);

      // Subtle monochrome halftone palette matching marwieang.com's clouds
      const ditherFar = isDark ? "rgba(255, 255, 255, 0.055)" : "rgba(17, 17, 19, 0.065)";
      const ditherMid = isDark ? "rgba(255, 255, 255, 0.085)" : "rgba(17, 17, 19, 0.10)";
      const blockFill = isDark ? "#17191d" : "#f0f0ed";
      const blockDither = isDark ? "rgba(255, 255, 255, 0.09)" : "rgba(17, 17, 19, 0.12)";
      const blockEdge = isDark ? "rgba(255, 255, 255, 0.19)" : "rgba(17, 17, 19, 0.20)";
      const blockInnerGrid = isDark ? "rgba(255, 255, 255, 0.07)" : "rgba(17, 17, 19, 0.07)";
      const spikeFill = isDark ? "#2a3036" : "#d4d4cf";
      const spikeEdge = isDark ? "#8fbc9f" : "#525258";
      const padColor = isDark ? "#8fbc9f" : "#426451";
      const cubePrimary = isDark ? "#8fbc9f" : "#2f4f3e";
      const cubeInner = isDark ? "#111412" : "#fcfcfb";

      // 1. Far & Mid Bayer-dithered stepped block towers (instead of clouds!)
      for (const pass of [0, 1] as const) {
        for (const t of towers) {
          if (t.layer !== pass) continue;
          const topY = groundY - t.h;
          const density = pass === 0 ? 4.2 : 6.8;
          const col = pass === 0 ? ditherFar : ditherMid;

          if (t.stepped) {
            // Stepped ziggurat / blocky silhouette
            const stepW = Math.floor(t.w * 0.6);
            drawDitherRect(t.x, topY + BLOCK_UNIT * 2, t.w, t.h - BLOCK_UNIT * 2, density, col);
            drawDitherRect(
              t.x + Math.floor((t.w - stepW) / 2),
              topY,
              stepW,
              BLOCK_UNIT * 2,
              density,
              col
            );
          } else {
            drawDitherRect(t.x, topY, t.w, t.h, density, col);
          }

          // Crisp 1px top cap edge on mid-layer blocks
          if (pass === 1) {
            ctx.fillStyle = col;
            ctx.fillRect(Math.floor(t.x), Math.floor(topY), Math.floor(t.w), 1);
          }
        }
      }

      // 2. Foreground Geometry Dash Block Course
      for (const s of segments) {
        const sx = Math.floor(s.x);
        const sw = Math.ceil(s.w);
        if (sx + sw < 0 || sx > width) continue;

        const sy = Math.floor(groundY - s.topOffset);
        const sh = height - sy;

        // Solid base + Bayer dither texture inside blocks
        ctx.fillStyle = blockFill;
        ctx.fillRect(sx, sy, sw, sh);
        drawDitherRect(sx, sy + 2, sw, sh - 2, 5.5, blockDither);

        // Individual square GD block grid subdivisions (BLOCK_UNIT x BLOCK_UNIT)
        ctx.fillStyle = blockInnerGrid;
        for (let gx = sx; gx < sx + sw; gx += BLOCK_UNIT) {
          ctx.fillRect(gx, sy, 1, sh);
          // Inner decorative square inside each top-row block!
          if (gx + BLOCK_UNIT <= sx + sw + 1) {
            ctx.fillRect(gx + 3, sy + 3, BLOCK_UNIT - 6, 1);
            ctx.fillRect(gx + 3, sy + BLOCK_UNIT - 4, BLOCK_UNIT - 6, 1);
            ctx.fillRect(gx + 3, sy + 3, 1, BLOCK_UNIT - 6);
            ctx.fillRect(gx + BLOCK_UNIT - 4, sy + 3, 1, BLOCK_UNIT - 6);
          }
        }
        for (let gy = sy + BLOCK_UNIT; gy < height; gy += BLOCK_UNIT) {
          ctx.fillRect(sx, gy, sw, 1);
        }

        // Crisp top & side edges on raised platforms
        ctx.fillStyle = blockEdge;
        ctx.fillRect(sx, sy, sw, 1);
        if (s.topOffset > 0) {
          ctx.fillRect(sx, sy, 1, s.topOffset + 1);
          ctx.fillRect(sx + sw - 1, sy, 1, s.topOffset + 1);
        }

        // Glowing jump pad
        if (s.hasPad) {
          const px = Math.floor(s.x + s.w * 0.5 - 4);
          ctx.fillStyle = padColor;
          ctx.fillRect(px, sy - 2, 8, 2);
          ctx.fillRect(px + 2, sy - 3, 4, 1);
        }

        // Pixel-art Geometry Dash Triangle Spikes!
        if (s.hasSpike) {
          const spikeCount = s.doubleSpike ? 2 : 1;
          const baseStartX = Math.floor(s.x + BLOCK_UNIT * 1.4);
          for (let k = 0; k < spikeCount; k++) {
            const bx = baseStartX + k * 8;
            const spikeH = 7;
            for (let row = 0; row < spikeH; row++) {
              const halfSpan = Math.floor(((spikeH - 1 - row) * 3.5) / (spikeH - 1));
              const py = sy - 1 - row;
              ctx.fillStyle = spikeFill;
              ctx.fillRect(bx + 3 - halfSpan, py, halfSpan * 2 + 1, 1);
              // Crisp spike outline pixels
              ctx.fillStyle = spikeEdge;
              ctx.fillRect(bx + 3 - halfSpan, py, 1, 1);
              ctx.fillRect(bx + 3 + halfSpan, py, 1, 1);
            }
          }
        }
      }

      // 3. Pixel Trail & Jump Burst Particles
      for (const p of particles) {
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.accent
          ? isDark
            ? `rgba(143, 188, 159, ${alpha * 0.9})`
            : `rgba(66, 100, 81, ${alpha * 0.85})`
          : isDark
            ? `rgba(236, 236, 238, ${alpha * 0.45})`
            : `rgba(17, 17, 19, ${alpha * 0.35})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.size, p.size);
      }

      // 4. The Geometry Dash Jumping Cube (rotates 90° in mid-air!)
      ctx.save();
      const cx = cubeX + CUBE_SIZE / 2;
      const cy = cubeY + CUBE_SIZE / 2;
      ctx.translate(cx, cy);
      ctx.rotate(cubeAngle);

      const half = Math.floor(CUBE_SIZE / 2);
      // Outer cube shell
      ctx.fillStyle = cubePrimary;
      ctx.fillRect(-half, -half, CUBE_SIZE, CUBE_SIZE);

      // Inner GD icon face cutout (2 pixel eyes + visor mouth!)
      ctx.fillStyle = cubeInner;
      ctx.fillRect(-half + 1, -half + 1, CUBE_SIZE - 2, CUBE_SIZE - 2);

      ctx.fillStyle = cubePrimary;
      // Eyes
      ctx.fillRect(-half + 2, -half + 2, 2, 2);
      ctx.fillRect(half - 3, -half + 2, 2, 2);
      // Mouth bar
      ctx.fillRect(-half + 2, half - 3, CUBE_SIZE - 4, 2);

      ctx.restore();
    }

    initWorld();
    draw();

    if (reducedMotion) {
      const onResizeStatic = () => {
        initWorld();
        draw();
      };
      window.addEventListener("resize", onResizeStatic);
      return () => window.removeEventListener("resize", onResizeStatic);
    }

    let lastTime = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      if (!document.hidden) {
        update(dt);
        draw();
      }
      rafId = window.requestAnimationFrame(tick);
    };
    rafId = window.requestAnimationFrame(tick);

    // Optional fun Easter egg: pressing Space (when not typing in an input) makes the cube hop!
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.isContentEditable)
      ) {
        return;
      }
      doJump(JUMP_VY, true);
    };

    const onResize = () => {
      initWorld();
    };

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  if (pathname === "/game") return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[50vh] min-h-[260px] max-h-[430px] overflow-hidden opacity-95 [mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_24%)]"
    >
      <canvas
        ref={canvasRef}
        className="absolute bottom-0 left-0 block [image-rendering:pixelated]"
      />
    </div>
  );
}
