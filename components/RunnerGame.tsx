"use client";

import { useEffect, useRef, useState } from "react";

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
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkDevice = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isSmallScreen && isTouchDevice);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  useEffect(() => {
    if (isMobile !== false) return;

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

    function onKeyDown(event: KeyboardEvent) {
      if (event.code === "Space" || event.code === "ArrowUp") {
        event.preventDefault();

        if (isGameOver) {
          resetGame();
          return;
        }

        if (!character.isJumping) {
          character.velocityY = JUMP_FORCE;
          character.isJumping = true;
        }
      }

      if ((event.code === "ArrowDown" || event.code === "KeyS") && !character.isJumping) {
        event.preventDefault();
        isDucking = true;
      }
    }

    function onKeyUp(event: KeyboardEvent) {
      if (event.code === "ArrowDown" || event.code === "KeyS") {
        isDucking = false;
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

      if (isGameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "#fff";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("Game Over", canvasWidth / 2, canvasHeight / 2 - 10);
        ctx.font = "14px system-ui";
        ctx.fillText("Press Space to restart", canvasWidth / 2, canvasHeight / 2 + 20);
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
  }, [isMobile]);

  if (isMobile === null) {
    return <div className="flex min-h-[250px] w-full max-w-[600px] items-center justify-center" />;
  }

  if (isMobile) {
    return (
      <div className="flex min-h-[250px] w-full max-w-[600px] flex-col items-center justify-center gap-3 rounded-lg border border-line bg-white px-6 py-10 text-center dark:border-moss dark:bg-ink">
        <p className="text-base font-semibold text-ink dark:text-paper">Best played on desktop</p>
        <p className="max-w-xs text-sm leading-6 text-steel dark:text-paper">
          This mini game uses keyboard controls that work best on a laptop or desktop.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[600px]">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="h-auto w-full rounded-lg border-2 border-moss bg-white"
      />
      <p className="mt-3 text-center text-sm text-steel dark:text-paper">
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