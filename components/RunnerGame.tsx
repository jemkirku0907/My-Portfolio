"use client";

import { useEffect, useRef } from "react";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 250;
const GROUND_Y = 200;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const NORMAL_HEIGHT = 40;
const DUCK_HEIGHT = 20;

type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: "small" | "tall" | "flying";
};

export function RunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const controlsRef = useRef<{ jump: () => void; setDuck: (duck: boolean) => void }>({
    jump: () => {},
    setDuck: () => {}
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const drawingContext = canvas.getContext("2d");
    if (!drawingContext) return;
    const ctx = drawingContext;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const character = {
      x: 80,
      y: GROUND_Y,
      width: 30,
      height: NORMAL_HEIGHT,
      velocityY: 0,
      isJumping: false
    };

    let isDucking = false;
    let legFrame = 0;
    let animationTimer = 0;
    let groundOffset = 0;
    let score = 0;
    let isGameOver = false;
    let gameSpeed = 5;
    let dayNightTimer = 0;
    let obstacles: Obstacle[] = [];
    let obstacleTimer = 0;
    let nextObstacleGap = 90;
    let rafId = 0;

    // High score — persisted in localStorage so it survives refreshes and
    // repeat visits to /game.
    const HIGH_SCORE_KEY = "runner-high-score";
    let highScore = Number(window.localStorage.getItem(HIGH_SCORE_KEY)) || 0;

    function resetGame() {
      character.y = GROUND_Y;
      character.height = NORMAL_HEIGHT;
      character.velocityY = 0;
      character.isJumping = false;
      isDucking = false;
      obstacles = [];
      score = 0;
      gameSpeed = 5;
      isGameOver = false;
      obstacleTimer = 0;
      dayNightTimer = 0;
    }

    function checkCollision(char: typeof character, obs: Obstacle) {
      return char.x < obs.x + obs.width && char.x + char.width > obs.x && char.y < obs.y + obs.height && char.y + char.height > obs.y;
    }

    function triggerJump() {
      if (isGameOver) {
        resetGame();
        return;
      }

      if (!character.isJumping) {
        character.velocityY = JUMP_FORCE;
        character.isJumping = true;
      }
    }

    function setDuck(ducking: boolean) {
      if (!character.isJumping) {
        isDucking = ducking;
      } else if (!ducking) {
        isDucking = false;
      }
    }

    controlsRef.current = { jump: triggerJump, setDuck };

    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();
        triggerJump();
      }

      if ((event.code === "ArrowDown" || event.code === "KeyS") && !character.isJumping) {
        event.preventDefault();
        setDuck(true);
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "ArrowDown" || event.code === "KeyS") {
        setDuck(false);
      }
    }

    function update() {
      if (isGameOver) return;

      if (character.isJumping) {
        character.velocityY += GRAVITY;
        character.y += character.velocityY;

        if (character.y >= GROUND_Y) {
          character.y = GROUND_Y;
          character.velocityY = 0;
          character.isJumping = false;
        }
      }

      if (!character.isJumping) {
        animationTimer++;
        if (animationTimer % 8 === 0) legFrame = legFrame === 0 ? 1 : 0;
      }

      if (isDucking && !character.isJumping) {
        character.height = DUCK_HEIGHT;
        character.y = GROUND_Y + (NORMAL_HEIGHT - DUCK_HEIGHT);
      } else if (!character.isJumping) {
        character.height = NORMAL_HEIGHT;
        character.y = GROUND_Y;
      }

      groundOffset = (groundOffset + gameSpeed) % 40;
      obstacleTimer++;

      if (obstacleTimer >= nextObstacleGap) {
        const obstacleTypes: Obstacle["type"][] = ["small", "tall", "flying"];
        const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
        const obstacle: Obstacle =
          type === "tall"
            ? { x: canvasWidth, y: GROUND_Y - 15, width: 22, height: 55, type }
            : type === "flying"
              ? { x: canvasWidth, y: GROUND_Y + 5, width: 28, height: 20, type }
              : { x: canvasWidth, y: GROUND_Y + 10, width: 22, height: 30, type };

        obstacles.push(obstacle);
        obstacleTimer = 0;
        nextObstacleGap = 60 + Math.random() * 60;
      }

      for (let index = obstacles.length - 1; index >= 0; index--) {
        const obstacle = obstacles[index];
        obstacle.x -= gameSpeed;

        if (obstacle.type === "flying") {
          const xOverlap = character.x < obstacle.x + obstacle.width && character.x + character.width > obstacle.x;
          if (xOverlap && !isDucking) isGameOver = true;
        } else if (checkCollision(character, obstacle)) {
          isGameOver = true;
        }

        if (obstacle.x + obstacle.width < 0) {
          obstacles.splice(index, 1);
          score++;
          if (score > highScore) {
            highScore = score;
            window.localStorage.setItem(HIGH_SCORE_KEY, String(highScore));
          }
          if (score % 10 === 0) gameSpeed += 0.5;
        }
      }

      gameSpeed += 0.001;
      dayNightTimer += 0.5;
    }

    function lerp(start: number, end: number, amount: number) {
      return Math.round(start + (end - start) * amount);
    }

    function drawFace(headX: number, headY: number, jumping: boolean) {
      const eyeY = headY + 8;

      if (isGameOver) {
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        for (const offset of [5, 19]) {
          ctx.beginPath();
          ctx.moveTo(headX + offset, eyeY - 3);
          ctx.lineTo(headX + offset + 6, eyeY + 3);
          ctx.moveTo(headX + offset + 6, eyeY - 3);
          ctx.lineTo(headX + offset, eyeY + 3);
          ctx.stroke();
        }
        return;
      }

      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(headX + 8, eyeY, jumping ? 4 : 2, 0, Math.PI * 2);
      ctx.arc(headX + 22, eyeY, jumping ? 4 : 2, 0, Math.PI * 2);
      ctx.fill();

      if (jumping) {
        // "Wow" mouth — open circle, wide-eyed surprise while airborne
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(headX + 15, eyeY + 10, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Regular smile while grounded
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(headX + 15, eyeY + 5, 5, 0.2 * Math.PI, 0.8 * Math.PI);
        ctx.stroke();
      }
    }

    function drawSkyIcon(cycle: number) {
      const arcX = 40 + (canvasWidth - 80) * ((Math.sin(dayNightTimer * 0.01 - Math.PI / 2) + 1) / 2);
      const arcY = 45 - 25 * Math.sin(dayNightTimer * 0.01);

      if (cycle > 0.5) {
        ctx.save();
        ctx.globalAlpha = (cycle - 0.5) * 2;
        ctx.fillStyle = "#f5b942";
        ctx.beginPath();
        ctx.arc(arcX, arcY, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#f5b942";
        ctx.lineWidth = 2;
        for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
          ctx.beginPath();
          ctx.moveTo(arcX + Math.cos(angle) * 18, arcY + Math.sin(angle) * 18);
          ctx.lineTo(arcX + Math.cos(angle) * 23, arcY + Math.sin(angle) * 23);
          ctx.stroke();
        }
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.globalAlpha = (0.5 - cycle) * 2;
      ctx.fillStyle = "#e8e8f0";
      ctx.beginPath();
      ctx.arc(arcX, arcY, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(arcX + 6, arcY - 4, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.globalAlpha = (0.5 - cycle) * 2;
      ctx.fillStyle = "#fff";
      for (const [starX, starY] of [[arcX - 60, arcY - 10], [arcX + 40, arcY + 15], [arcX - 30, arcY + 20]]) {
        ctx.beginPath();
        ctx.arc(starX, starY, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function draw() {
      const cycle = (Math.sin(dayNightTimer * 0.01) + 1) / 2;
      const bg = [lerp(20, 255, cycle), lerp(24, 255, cycle), lerp(38, 255, cycle)];
      const ground = [lerp(90, 31, cycle), lerp(140, 110, cycle), lerp(110, 52, cycle)];
      const obstacleColor = [lerp(235, 51, cycle), lerp(90, 51, cycle), lerp(90, 51, cycle)];

      ctx.fillStyle = `rgb(${bg.join(", ")})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      drawSkyIcon(cycle);

      const groundLineY = GROUND_Y + NORMAL_HEIGHT;
      ctx.strokeStyle = `rgb(${ground.join(", ")})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundLineY);
      ctx.lineTo(canvasWidth, groundLineY);
      ctx.stroke();

      ctx.strokeStyle = "#c9c2b0";
      ctx.lineWidth = 3;
      for (let x = -groundOffset; x < canvasWidth; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, groundLineY + 8);
        ctx.lineTo(x + 20, groundLineY + 8);
        ctx.stroke();
      }

      ctx.fillStyle = isGameOver ? "#b0453f" : "#1f6e34";
      if (isDucking && !character.isJumping) {
        ctx.fillRect(character.x - 5, character.y, character.width + 10, character.height);
        drawFace(character.x, character.y, false);
      } else {
        ctx.fillRect(character.x, character.y, character.width, character.height - 15);
        drawFace(character.x, character.y, character.isJumping);

        const legY = character.y + character.height - 15;
        // FIX: explicitly pick the leg color instead of falling back to
        // ctx.fillStyle, which by this point holds a stale "#fff" left over
        // from drawFace()'s eyes — that stale white was leaking onto the legs
        // whenever the character was jumping (or game over).
        ctx.fillStyle = !character.isJumping && !isGameOver ? "#0f4d22" : isGameOver ? "#b0453f" : "#1f6e34";
        ctx.fillRect(character.x, legY - (legFrame === 1 && !character.isJumping ? 3 : 0), 10, 15);
        ctx.fillRect(character.x + 18, legY - (legFrame === 0 && !character.isJumping ? 3 : 0), 10, 15);
      }

      ctx.fillStyle = `rgb(${obstacleColor.join(", ")})`;
      obstacles.forEach((obstacle) => ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height));

      const scoreShade = lerp(220, 51, cycle);
      ctx.fillStyle = `rgb(${scoreShade}, ${scoreShade}, ${scoreShade})`;
      ctx.font = "16px monospace";
      ctx.fillText(`Score: ${score}`, canvasWidth - 110, 30);
      ctx.font = "12px monospace";
      ctx.fillText(`Best: ${highScore}`, canvasWidth - 110, 48);

      if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 10);

        if (score > 0 && score === highScore) {
          ctx.fillStyle = "#f5b942";
          ctx.font = "bold 14px system-ui";
          ctx.fillText("New High Score!", canvasWidth / 2, canvasHeight / 2 + 12);
          ctx.fillStyle = "#fff";
          ctx.font = "14px system-ui";
          ctx.fillText("Press Space or tap to restart", canvasWidth / 2, canvasHeight / 2 + 34);
        } else {
          ctx.font = "14px system-ui";
          ctx.fillText("Press Space or tap to restart", canvasWidth / 2, canvasHeight / 2 + 20);
        }
        ctx.textAlign = "left";
      }
    }

    function gameLoop() {
      update();
      draw();
      rafId = requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);
    rafId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <div className="w-full max-w-[600px]">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onPointerDown={() => controlsRef.current.jump()}
        className="h-auto w-full touch-none select-none rounded-lg border-2 border-moss bg-white cursor-pointer"
      />

      {/* Mobile / Touch Controls */}
      <div className="mt-4 grid grid-cols-2 gap-3 md:hidden">
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            controlsRef.current.setDuck(true);
          }}
          onPointerUp={() => controlsRef.current.setDuck(false)}
          onPointerLeave={() => controlsRef.current.setDuck(false)}
          onPointerCancel={() => controlsRef.current.setDuck(false)}
          className="focus-ring min-h-12 touch-none select-none rounded-xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm active:scale-95 active:border-moss dark:border-moss dark:bg-ink dark:text-paper"
        >
          Hold to Duck
        </button>
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            controlsRef.current.jump();
          }}
          className="focus-ring min-h-12 touch-none select-none rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-white shadow-sm active:scale-95 dark:bg-paper dark:text-ink"
        >
          Tap to Jump
        </button>
      </div>

      <p className="mt-3 hidden text-center text-sm text-steel dark:text-paper md:block">
        Press <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs dark:border-moss">Space</kbd>
        {" / "}
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs dark:border-moss">Up</kbd> to jump,
        hold <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs dark:border-moss">Down</kbd>
        {" / "}
        <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-xs dark:border-moss">S</kbd> to duck
      </p>
    </div>
  );
}