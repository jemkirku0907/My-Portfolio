"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Gamepad2, RotateCcw, Volume2, VolumeX, Shield, Zap, Swords } from "lucide-react";

type FighterId = "Ninja" | "Baller" | "Warrior" | "Mage";

type FighterDef = {
  id: FighterId;
  name: string;
  title: string;
  subName: string;
  style: string;
  origin: string;
  portrait: string;
  spritesDir: string;
  soundSpecial: string;
  scale: number;
  originYOffset: number;
  frames: {
    idle: number;
    walk: number;
    jump: number;
    attack: number;
    special: number;
    block: number;
    hit: number;
    ko: number;
  };
};

const FIGHTERS: Record<FighterId, FighterDef> = {
  Ninja: {
    id: "Ninja",
    name: "Ryu",
    title: "Shadow Striker",
    subName: "HAYABUSA NINJUTSU",
    style: "Ninjutsu",
    origin: "Japan",
    portrait: "/game/street-fighter/Sprites/Ninja/portrait.png",
    spritesDir: "/game/street-fighter/Sprites/Ninja",
    soundSpecial: "/game/street-fighter/Sounds/Special/Ninja.wav",
    scale: 2.6,
    originYOffset: 0,
    frames: { idle: 4, walk: 4, jump: 1, attack: 4, special: 6, block: 2, hit: 1, ko: 2 }
  },
  Baller: {
    id: "Baller",
    name: "Rene",
    title: "Street Baller",
    subName: "BASKETBALL BRAWLER",
    style: "Street Dunk",
    origin: "Philippines",
    portrait: "/game/street-fighter/Sprites/Baller/portrait.png",
    spritesDir: "/game/street-fighter/Sprites/Baller",
    soundSpecial: "/game/street-fighter/Sounds/Special/Baller.wav",
    scale: 2.6,
    originYOffset: 0,
    frames: { idle: 4, walk: 4, jump: 1, attack: 4, special: 6, block: 2, hit: 1, ko: 2 }
  },
  Warrior: {
    id: "Warrior",
    name: "Fumiko",
    title: "Blade Master",
    subName: "SHADOW KENJUTSU",
    style: "Kenjutsu",
    origin: "Japan",
    portrait: "/game/street-fighter/Sprites/Warrior/idle.png",
    spritesDir: "/game/street-fighter/Sprites/Warrior",
    soundSpecial: "/game/street-fighter/Sounds/Special/Warrior.wav",
    scale: 4.2,
    originYOffset: 0,
    frames: { idle: 8, walk: 8, jump: 1, attack: 8, special: 8, block: 8, hit: 8, ko: 8 }
  },
  Mage: {
    id: "Mage",
    name: "Elena",
    title: "Pyro Mancer",
    subName: "ELEMENTAL SORCERY",
    style: "Sorcery",
    origin: "Arcadia",
    portrait: "/game/street-fighter/Sprites/Mage/idle.png",
    spritesDir: "/game/street-fighter/Sprites/Mage",
    soundSpecial: "/game/street-fighter/Sounds/Special/Mage.wav",
    scale: 1.6,
    originYOffset: 0,
    frames: { idle: 8, walk: 8, jump: 1, attack: 8, special: 8, block: 1, hit: 1, ko: 1 }
  }
};

const STAGES = [
  { name: "Rooftop Arena", src: "/game/street-fighter/Sprites/Stages/rooftop.png" },
  { name: "Chinatown Alley", src: "/game/street-fighter/Sprites/Stages/chinatown.png" },
  { name: "City Stadium", src: "/game/street-fighter/Sprites/Stages/stadium.jpg" }
];

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const GROUND_Y = 370;

type AnimState = "idle" | "walk" | "jump" | "attack" | "special" | "block" | "hit" | "ko";

interface FighterState {
  def: FighterDef;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  anim: AnimState;
  frameIndex: number;
  frameTimer: number;
  facing: 1 | -1;
  hp: number;
  maxHp: number;
  lagHp: number;
  rage: number;
  isBlocking: boolean;
  attackCooldown: number;
  hitFlashTimer: number;
  lungeOffset: number;
}

export function StreetFighterGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedP1, setSelectedP1] = useState<FighterId>("Ninja");
  const [selectedP2, setSelectedP2] = useState<FighterId>("Baller");
  const [stageIndex, setStageIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [matchResult, setMatchResult] = useState<"fight" | "p1_win" | "p2_win" | "draw" | null>(null);
  const [comboCount, setComboCount] = useState(0);

  // Sound ref cache
  const soundCache = useRef<Record<string, HTMLAudioElement>>({});
  const playSound = (src: string, volume = 0.6) => {
    if (!soundEnabled) return;
    try {
      let audio = soundCache.current[src];
      if (!audio) {
        audio = new Audio(src);
        soundCache.current[src] = audio;
      }
      audio.currentTime = 0;
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.play().catch(() => {});
    } catch {
      // Audio playback blocked by browser policy until interaction
    }
  };

  // Image assets cache
  const imageCache = useRef<Record<string, HTMLImageElement>>({});
  const getImage = (src: string): HTMLImageElement | null => {
    if (!src) return null;
    let img = imageCache.current[src];
    if (!img) {
      img = new window.Image();
      img.src = src;
      imageCache.current[src] = img;
    }
    return img.complete && img.naturalWidth > 0 ? img : null;
  };

  // Input states
  const keysDown = useRef<Record<string, boolean>>({});

  // Reset or initialize match
  const matchIdRef = useRef(0);
  const [gameKey, setGameKey] = useState(0);

  const resetMatch = () => {
    setMatchResult(null);
    setComboCount(0);
    setGameKey((k) => k + 1);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on game control keys
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space", "KeyW", "KeyS", "KeyA", "KeyD"].includes(e.code)) {
        e.preventDefault();
      }
      keysDown.current[e.code] = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.current[e.code] = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    const p1Def = FIGHTERS[selectedP1];
    const p2Def = FIGHTERS[selectedP2];

    const p1: FighterState = {
      def: p1Def,
      x: 220,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      isGrounded: true,
      anim: "idle",
      frameIndex: 0,
      frameTimer: 0,
      facing: 1,
      hp: 100,
      maxHp: 100,
      lagHp: 100,
      rage: 40,
      isBlocking: false,
      attackCooldown: 0,
      hitFlashTimer: 0,
      lungeOffset: 0
    };

    const p2: FighterState = {
      def: p2Def,
      x: 580,
      y: GROUND_Y,
      vx: 0,
      vy: 0,
      isGrounded: true,
      anim: "idle",
      frameIndex: 0,
      frameTimer: 0,
      facing: -1,
      hp: 100,
      maxHp: 100,
      lagHp: 100,
      rage: 30,
      isBlocking: false,
      attackCooldown: 0,
      hitFlashTimer: 0,
      lungeOffset: 0
    };

    let roundTimer = 99;
    let roundTimerAcc = 0;
    let cutInTimer = 0;
    let cutInFighter: FighterDef | null = null;
    let screenShake = 0;
    let localCombo = 0;
    let bannerText = "ROUND 1";
    let bannerTimer = 90;
    let isGameOver = false;

    // AI state
    let aiTimer = 0;
    let aiAction: "none" | "approach" | "retreat" | "attack" | "special" | "block" = "none";

    // Hit sparks
    const sparks: Array<{ x: number; y: number; life: number; color: string }> = [];

    let lastTime = performance.now();
    let animFrameId = 0;

    const spawnSparks = (x: number, y: number, color = "#ffea00") => {
      for (let i = 0; i < 8; i++) {
        sparks.push({
          x: x + (Math.random() - 0.5) * 30,
          y: y + (Math.random() - 0.5) * 30,
          life: 1.0,
          color
        });
      }
    };

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Round timer
      if (!isGameOver && bannerTimer <= 0) {
        roundTimerAcc += dt;
        if (roundTimerAcc >= 1) {
          roundTimer = Math.max(0, roundTimer - 1);
          roundTimerAcc = 0;
          if (roundTimer === 0) {
            isGameOver = true;
            if (p1.hp > p2.hp) setMatchResult("p1_win");
            else if (p2.hp > p1.hp) setMatchResult("p2_win");
            else setMatchResult("draw");
          }
        }
      }

      if (bannerTimer > 0) {
        bannerTimer--;
        if (bannerTimer === 45) {
          bannerText = "FIGHT!";
          playSound("/game/street-fighter/Sounds/basic_swing_sword.wav", 0.5);
        } else if (bannerTimer === 0) {
          bannerText = "";
        }
      }

      // Update screen shake
      if (screenShake > 0) screenShake *= 0.85;
      if (screenShake < 0.2) screenShake = 0;

      // Update cutin
      if (cutInTimer > 0) cutInTimer -= dt;

      // ----------------- Player 1 Input -----------------
      if (!isGameOver && p1.hp > 0 && bannerTimer <= 0) {
        const k = keysDown.current;
        p1.isBlocking = Boolean(k["KeyS"] || k["ArrowDown"]);

        if (p1.attackCooldown > 0) p1.attackCooldown -= dt;

        // Special Attack
        if ((k["KeyG"] || k["KeyK"]) && p1.attackCooldown <= 0 && p1.rage >= 50 && p1.anim !== "special" && p1.anim !== "hit") {
          p1.anim = "special";
          p1.frameIndex = 0;
          p1.frameTimer = 0;
          p1.attackCooldown = 0.9;
          p1.rage -= 50;
          p1.lungeOffset = p1.facing * 50;
          cutInFighter = p1.def;
          cutInTimer = 0.6;
          screenShake = 12;
          playSound(p1.def.soundSpecial, 0.8);

          // Check hit
          const dist = Math.abs(p1.x - p2.x);
          if (dist < 180) {
            const blocked = p2.isBlocking;
            const dmg = blocked ? 8 : 34;
            p2.hp = Math.max(0, p2.hp - dmg);
            p2.hitFlashTimer = 0.2;
            p2.anim = p2.hp <= 0 ? "ko" : "hit";
            p2.x += p1.facing * (blocked ? 15 : 45);
            localCombo++;
            setComboCount(localCombo);
            spawnSparks((p1.x + p2.x) / 2, p2.y - 70, "#ff4400");
            playSound(blocked ? "/game/street-fighter/Sounds/basic_block.wav" : "/game/street-fighter/Sounds/basic_hit_sword.wav", 0.7);
          }
        }
        // Basic Attack
        else if ((k["KeyF"] || k["KeyJ"] || k["Space"]) && p1.attackCooldown <= 0 && p1.anim !== "attack" && p1.anim !== "special" && p1.anim !== "hit") {
          p1.anim = "attack";
          p1.frameIndex = 0;
          p1.frameTimer = 0;
          p1.attackCooldown = 0.38;
          p1.lungeOffset = p1.facing * 25;
          playSound("/game/street-fighter/Sounds/basic_swing_sword.wav", 0.5);

          // Check hit
          const dist = Math.abs(p1.x - p2.x);
          if (dist < 135) {
            const blocked = p2.isBlocking;
            const dmg = blocked ? 2 : 12;
            p2.hp = Math.max(0, p2.hp - dmg);
            p2.hitFlashTimer = 0.15;
            p2.anim = p2.hp <= 0 ? "ko" : "hit";
            p2.x += p1.facing * (blocked ? 8 : 22);
            p1.rage = Math.min(100, p1.rage + 18);
            localCombo++;
            setComboCount(localCombo);
            spawnSparks((p1.x + p2.x) / 2, p2.y - 60, "#ffea00");
            playSound(blocked ? "/game/street-fighter/Sounds/basic_block.wav" : "/game/street-fighter/Sounds/basic_hit_sword.wav", 0.6);
          }
        }
        // Movement
        else if (p1.anim !== "attack" && p1.anim !== "special" && p1.anim !== "hit") {
          if (p1.isBlocking) {
            p1.anim = "block";
            p1.vx = 0;
          } else {
            p1.vx = 0;
            if (k["KeyA"] || k["ArrowLeft"]) {
              p1.vx = -180;
              p1.anim = "walk";
            } else if (k["KeyD"] || k["ArrowRight"]) {
              p1.vx = 180;
              p1.anim = "walk";
            } else {
              p1.anim = "idle";
            }

            if ((k["KeyW"] || k["ArrowUp"]) && p1.isGrounded) {
              p1.vy = -420;
              p1.isGrounded = false;
              p1.anim = "jump";
            }
          }
        }
      }

      // ----------------- Player 2 (CPU AI) -----------------
      if (!isGameOver && p2.hp > 0 && bannerTimer <= 0) {
        aiTimer -= dt;
        if (p2.attackCooldown > 0) p2.attackCooldown -= dt;

        const dist = Math.abs(p1.x - p2.x);

        if (aiTimer <= 0) {
          aiTimer = 0.25 + Math.random() * 0.35;
          const r = Math.random();

          if (dist < 140) {
            // Close range decisions
            if (p2.rage >= 50 && r < 0.35) aiAction = "special";
            else if (r < 0.65) aiAction = "attack";
            else if (r < 0.85) aiAction = "block";
            else aiAction = "retreat";
          } else {
            // Far range
            if (r < 0.7) aiAction = "approach";
            else if (r < 0.85 && p2.isGrounded) {
              p2.vy = -400;
              p2.isGrounded = false;
              aiAction = "none";
            } else aiAction = "none";
          }
        }

        // Execute AI Action
        if (p2.anim !== "attack" && p2.anim !== "special" && p2.anim !== "hit") {
          p2.isBlocking = aiAction === "block";

          if (aiAction === "special" && p2.attackCooldown <= 0 && p2.rage >= 50) {
            p2.anim = "special";
            p2.frameIndex = 0;
            p2.frameTimer = 0;
            p2.attackCooldown = 0.95;
            p2.rage -= 50;
            p2.lungeOffset = p2.facing * 45;
            cutInFighter = p2.def;
            cutInTimer = 0.6;
            screenShake = 12;
            playSound(p2.def.soundSpecial, 0.8);

            if (dist < 170) {
              const blocked = p1.isBlocking;
              const dmg = blocked ? 8 : 32;
              p1.hp = Math.max(0, p1.hp - dmg);
              p1.hitFlashTimer = 0.2;
              p1.anim = p1.hp <= 0 ? "ko" : "hit";
              p1.x += p2.facing * (blocked ? 15 : 45);
              localCombo = 0;
              setComboCount(0);
              spawnSparks((p1.x + p2.x) / 2, p1.y - 70, "#ff4400");
              playSound(blocked ? "/game/street-fighter/Sounds/basic_block.wav" : "/game/street-fighter/Sounds/basic_hit_sword.wav", 0.7);
            }
          } else if (aiAction === "attack" && p2.attackCooldown <= 0) {
            p2.anim = "attack";
            p2.frameIndex = 0;
            p2.frameTimer = 0;
            p2.attackCooldown = 0.42;
            p2.lungeOffset = p2.facing * 20;
            playSound("/game/street-fighter/Sounds/basic_swing_sword.wav", 0.5);

            if (dist < 130) {
              const blocked = p1.isBlocking;
              const dmg = blocked ? 2 : 12;
              p1.hp = Math.max(0, p1.hp - dmg);
              p1.hitFlashTimer = 0.15;
              p1.anim = p1.hp <= 0 ? "ko" : "hit";
              p1.x += p2.facing * (blocked ? 8 : 20);
              p2.rage = Math.min(100, p2.rage + 18);
              localCombo = 0;
              setComboCount(0);
              spawnSparks((p1.x + p2.x) / 2, p1.y - 60, "#ffea00");
              playSound(blocked ? "/game/street-fighter/Sounds/basic_block.wav" : "/game/street-fighter/Sounds/basic_hit_sword.wav", 0.6);
            }
          } else if (aiAction === "approach") {
            p2.vx = p2.facing * 160;
            p2.anim = "walk";
          } else if (aiAction === "retreat") {
            p2.vx = -p2.facing * 140;
            p2.anim = "walk";
          } else if (p2.isBlocking) {
            p2.anim = "block";
            p2.vx = 0;
          } else {
            p2.vx = 0;
            p2.anim = p2.isGrounded ? "idle" : "jump";
          }
        }
      }

      // Check KO
      if (!isGameOver) {
        if (p1.hp <= 0 && p2.hp <= 0) {
          isGameOver = true;
          setMatchResult("draw");
          bannerText = "DOUBLE K.O.!";
          bannerTimer = 999;
        } else if (p2.hp <= 0) {
          isGameOver = true;
          setMatchResult("p1_win");
          bannerText = "K.O. - YOU WIN!";
          bannerTimer = 999;
          p2.anim = "ko";
          playSound("/game/street-fighter/Sounds/basic_hit_splash.wav", 0.8);
        } else if (p1.hp <= 0) {
          isGameOver = true;
          setMatchResult("p2_win");
          bannerText = "K.O. - CPU WINS!";
          bannerTimer = 999;
          p1.anim = "ko";
          playSound("/game/street-fighter/Sounds/basic_hit_splash.wav", 0.8);
        }
      }

      // Physics integration
      [p1, p2].forEach((f) => {
        // Gravity
        if (!f.isGrounded) {
          f.vy += 950 * dt;
          f.y += f.vy * dt;
          if (f.y >= GROUND_Y) {
            f.y = GROUND_Y;
            f.vy = 0;
            f.isGrounded = true;
            if (f.anim === "jump") f.anim = "idle";
          }
        }

        // Horizontal movement
        f.x += f.vx * dt;
        // Clamp to screen bounds
        f.x = Math.max(60, Math.min(CANVAS_WIDTH - 60, f.x));

        // Damage lag easing
        if (f.lagHp > f.hp) f.lagHp -= Math.max(0.4, (f.lagHp - f.hp) * 0.08);
        if (f.lagHp < f.hp) f.lagHp = f.hp;

        // Flash timer
        if (f.hitFlashTimer > 0) f.hitFlashTimer -= dt;

        // Lunge recovery
        if (f.lungeOffset !== 0) f.lungeOffset *= 0.85;
      });

      // Maintain facing directions
      if (p1.hp > 0 && p2.hp > 0) {
        p1.facing = p1.x <= p2.x ? 1 : -1;
        p2.facing = p2.x >= p1.x ? -1 : 1;
      }

      // ----------------- Animation Frame Updates -----------------
      [p1, p2].forEach((f) => {
        const frameCount = f.def.frames[f.anim] || 1;
        const duration = f.anim === "attack" ? 0.08 : f.anim === "special" ? 0.1 : 0.12;

        f.frameTimer += dt;
        if (f.frameTimer >= duration) {
          f.frameTimer = 0;
          f.frameIndex++;

          // Hold last frame or loop
          if (f.frameIndex >= frameCount) {
            if (f.anim === "attack" || f.anim === "special" || f.anim === "hit") {
              f.anim = f.isGrounded ? "idle" : "jump";
              f.frameIndex = 0;
            } else if (f.anim === "ko") {
              f.frameIndex = frameCount - 1; // stay down
            } else {
              f.frameIndex = 0;
            }
          }
        }
      });

      // ----------------- Rendering -----------------
      ctx.save();

      // Screen shake translation
      if (screenShake > 0) {
        ctx.translate((Math.random() - 0.5) * screenShake, (Math.random() - 0.5) * screenShake);
      }

      // Draw Stage Background
      const stage = STAGES[stageIndex];
      const stageImg = getImage(stage.src);
      if (stageImg) {
        ctx.drawImage(stageImg, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        // Fallback gradient sky & ground
        const skyGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        skyGrad.addColorStop(0, "#1a162b");
        skyGrad.addColorStop(0.7, "#392b4a");
        skyGrad.addColorStop(1, "#18141f");
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      // Shadow under fighters
      [p1, p2].forEach((f) => {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(f.x + f.lungeOffset, GROUND_Y, 36, 10, 0, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
        ctx.fill();
        ctx.restore();
      });

      // Render Fighter helper
      const renderFighter = (f: FighterState) => {
        const sheetSrc = `${f.def.spritesDir}/${f.anim}.png`;
        const img = getImage(sheetSrc);
        const frameCount = f.def.frames[f.anim] || 1;

        ctx.save();
        const drawX = f.x + f.lungeOffset;
        const drawY = f.y;

        ctx.translate(drawX, drawY);
        ctx.scale(f.facing, 1);

        if (img) {
          const frameWidth = Math.floor(img.naturalWidth / frameCount);
          const frameHeight = img.naturalHeight;
          const currentFrame = Math.min(f.frameIndex, frameCount - 1);
          const sx = currentFrame * frameWidth;
          const sy = 0;

          const destW = frameWidth * f.def.scale;
          const destH = frameHeight * f.def.scale;

          // Red hit flash filter
          if (f.hitFlashTimer > 0) {
            ctx.filter = "brightness(2) drop-shadow(0 0 10px #ff3333)";
          }

          ctx.drawImage(img, sx, sy, frameWidth, frameHeight, -destW / 2, -destH + f.def.originYOffset, destW, destH);
        } else {
          // Retro Stylized Vector Fighter Fallback
          ctx.fillStyle = f.def.id === "Ninja" ? "#3b82f6" : f.def.id === "Baller" ? "#ef4444" : "#10b981";
          ctx.fillRect(-22, -90, 44, 90);
          ctx.fillStyle = "#ffddaa";
          ctx.beginPath();
          ctx.arc(0, -105, 16, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      // Draw P1 then P2
      renderFighter(p1);
      renderFighter(p2);

      // Render Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life -= dt * 3;
        if (s.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }
        ctx.save();
        ctx.beginPath();
        ctx.arc(s.x, s.y, 4 * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      // Cut-in banner overlay during Special Moves
      if (cutInTimer > 0 && cutInFighter) {
        const cutInImg = getImage(`${cutInFighter.spritesDir}/cutin.png`);
        if (cutInImg) {
          ctx.save();
          ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
          ctx.fillRect(0, 140, CANVAS_WIDTH, 120);

          const slideX = (1 - cutInTimer / 0.6) * 40;
          ctx.drawImage(cutInImg, 0, 0, cutInImg.naturalWidth, cutInImg.naturalHeight, -50 + slideX, 140, CANVAS_WIDTH + 100, 120);
          ctx.restore();
        }
      }

      // ----------------- Retro HUD -----------------
      // P1 Health Bar
      const barW = 270;
      const barH = 18;

      // P1 Container
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.strokeStyle = "#444";
      ctx.lineWidth = 2;
      ctx.fillRect(40, 30, barW, barH);
      ctx.strokeRect(40, 30, barW, barH);

      // P1 Lag Bar (Orange/Red)
      const p1LagW = (p1.lagHp / p1.maxHp) * (barW - 4);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(42, 32, p1LagW, barH - 4);

      // P1 Actual HP Bar (Green to Yellow gradient)
      const p1ActualW = (p1.hp / p1.maxHp) * (barW - 4);
      const p1Grad = ctx.createLinearGradient(40, 0, 40 + barW, 0);
      p1Grad.addColorStop(0, "#22c55e");
      p1Grad.addColorStop(1, "#eab308");
      ctx.fillStyle = p1Grad;
      ctx.fillRect(42, 32, p1ActualW, barH - 4);

      // P1 Fighter Name
      ctx.font = "bold 15px 'Courier New', monospace";
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "#000000";
      ctx.shadowBlur = 4;
      ctx.fillText(`${p1.def.name.toUpperCase()} (P1)`, 42, 24);

      // P1 Super Meter
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(40, 52, 140, 8);
      ctx.strokeRect(40, 52, 140, 8);
      ctx.fillStyle = p1.rage >= 50 ? "#38bdf8" : "#0284c7";
      ctx.fillRect(41, 53, (p1.rage / 100) * 138, 6);
      if (p1.rage >= 50) {
        ctx.font = "bold 10px monospace";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("SUPER READY", 42, 70);
      }

      // P2 Health Bar
      const p2X = CANVAS_WIDTH - 40 - barW;
      ctx.fillStyle = "rgba(0,0,0,0.75)";
      ctx.fillRect(p2X, 30, barW, barH);
      ctx.strokeRect(p2X, 30, barW, barH);

      // P2 Lag Bar
      const p2LagW = (p2.lagHp / p2.maxHp) * (barW - 4);
      ctx.fillStyle = "#f97316";
      ctx.fillRect(p2X + barW - 4 - p2LagW, 32, p2LagW, barH - 4);

      // P2 Actual HP
      const p2ActualW = (p2.hp / p2.maxHp) * (barW - 4);
      const p2Grad = ctx.createLinearGradient(p2X, 0, p2X + barW, 0);
      p2Grad.addColorStop(0, "#eab308");
      p2Grad.addColorStop(1, "#22c55e");
      ctx.fillStyle = p2Grad;
      ctx.fillRect(p2X + barW - 4 - p2ActualW, 32, p2ActualW, barH - 4);

      // P2 Fighter Name
      ctx.textAlign = "right";
      ctx.fillText(`CPU (${p2.def.name.toUpperCase()})`, p2X + barW, 24);

      // P2 Super Meter
      ctx.fillRect(p2X + barW - 140, 52, 140, 8);
      ctx.strokeRect(p2X + barW - 140, 52, 140, 8);
      ctx.fillStyle = p2.rage >= 50 ? "#38bdf8" : "#0284c7";
      ctx.fillRect(p2X + barW - 140 + (1 - p2.rage / 100) * 138, 53, (p2.rage / 100) * 138, 6);
      ctx.textAlign = "left";

      // Round Timer (Center)
      ctx.save();
      ctx.fillStyle = "rgba(15, 15, 20, 0.85)";
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(CANVAS_WIDTH / 2, 40, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 22px 'Courier New', monospace";
      ctx.fillStyle = roundTimer <= 10 ? "#ef4444" : "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(String(roundTimer), CANVAS_WIDTH / 2, 40);
      ctx.restore();

      // Combo Display
      if (localCombo >= 2) {
        ctx.save();
        ctx.font = "italic 900 24px 'Impact', sans-serif";
        ctx.fillStyle = "#facc15";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4;
        ctx.strokeText(`${localCombo} HITS!`, 70, 115);
        ctx.fillText(`${localCombo} HITS!`, 70, 115);
        ctx.restore();
      }

      // Large Banner (ROUND 1 / FIGHT / K.O.)
      if (bannerText) {
        ctx.save();
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "900 44px 'Impact', sans-serif";
        ctx.fillStyle = "#facc15";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 6;
        ctx.strokeText(bannerText, CANVAS_WIDTH / 2, 180);
        ctx.fillText(bannerText, CANVAS_WIDTH / 2, 180);
        ctx.restore();
      }

      ctx.restore();

      animFrameId = requestAnimationFrame(loop);
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [selectedP1, selectedP2, stageIndex, soundEnabled, gameKey]);

  // Virtual touch button triggers for mobile
  const triggerKey = (code: string, pressed: boolean) => {
    keysDown.current[code] = pressed;
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      {/* Top Header & Toggles */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-moss/40 bg-moss/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-moss">
              <Gamepad2 className="h-3.5 w-3.5" />
              Retro Arcade
            </span>
            <span className="rounded-full border border-line px-2 py-0.5 text-xs text-steel dark:border-moss dark:text-paper">
              C# / .NET WinForms Port
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink dark:text-paper sm:text-3xl">
            Street Fighter Arena
          </h1>
          <p className="text-xs text-steel dark:text-paper sm:text-sm">
            Interactive web edition of the 2D fighting game developed in Visual Studio with C# &amp; WinForms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-medium text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-moss" /> : <VolumeX className="h-4 w-4 text-steel" />}
            <span>{soundEnabled ? "Sound ON" : "Muted"}</span>
          </button>

          <button
            type="button"
            onClick={resetMatch}
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-xs font-medium text-ink shadow-sm transition hover:border-moss dark:border-moss dark:bg-ink dark:text-paper"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Rematch</span>
          </button>
        </div>
      </div>

      {/* Main Arcade Frame */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-line bg-ink shadow-2xl dark:border-moss">
        {/* Canvas Screen */}
        <div className="relative aspect-[16/9] w-full bg-black">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="h-full w-full object-contain [image-rendering:pixelated]"
          />
        </div>

        {/* Mobile / Touch Controller */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line/40 bg-paper/10 p-4 backdrop-blur md:hidden">
          {/* D-Pad */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onPointerDown={() => triggerKey("KeyA", true)}
              onPointerUp={() => triggerKey("KeyA", false)}
              onPointerLeave={() => triggerKey("KeyA", false)}
              className="h-11 w-11 rounded-lg border border-white/20 bg-white/10 text-sm font-bold text-white active:bg-moss active:text-ink"
            >
              ◀
            </button>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onPointerDown={() => triggerKey("KeyW", true)}
                onPointerUp={() => triggerKey("KeyW", false)}
                onPointerLeave={() => triggerKey("KeyW", false)}
                className="h-11 w-11 rounded-lg border border-white/20 bg-white/10 text-sm font-bold text-white active:bg-moss active:text-ink"
              >
                ▲
              </button>
              <button
                type="button"
                onPointerDown={() => triggerKey("KeyS", true)}
                onPointerUp={() => triggerKey("KeyS", false)}
                onPointerLeave={() => triggerKey("KeyS", false)}
                className="h-11 w-11 rounded-lg border border-white/20 bg-white/10 text-sm font-bold text-white active:bg-moss active:text-ink"
              >
                ▼
              </button>
            </div>
            <button
              type="button"
              onPointerDown={() => triggerKey("KeyD", true)}
              onPointerUp={() => triggerKey("KeyD", false)}
              onPointerLeave={() => triggerKey("KeyD", false)}
              className="h-11 w-11 rounded-lg border border-white/20 bg-white/10 text-sm font-bold text-white active:bg-moss active:text-ink"
            >
              ▶
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onPointerDown={() => triggerKey("KeyS", true)}
              onPointerUp={() => triggerKey("KeyS", false)}
              onPointerLeave={() => triggerKey("KeyS", false)}
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full border border-sky-400/40 bg-sky-950/60 text-xs font-bold text-sky-300 active:scale-95"
            >
              <Shield className="h-4 w-4" />
              <span>BLK</span>
            </button>
            <button
              type="button"
              onPointerDown={() => triggerKey("KeyF", true)}
              onPointerUp={() => triggerKey("KeyF", false)}
              onPointerLeave={() => triggerKey("KeyF", false)}
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full border border-amber-400/40 bg-amber-950/60 text-xs font-bold text-amber-300 active:scale-95"
            >
              <Swords className="h-4 w-4" />
              <span>ATK</span>
            </button>
            <button
              type="button"
              onPointerDown={() => triggerKey("KeyG", true)}
              onPointerUp={() => triggerKey("KeyG", false)}
              onPointerLeave={() => triggerKey("KeyG", false)}
              className="flex h-12 w-12 flex-col items-center justify-center rounded-full border border-rose-400/40 bg-rose-950/60 text-xs font-bold text-rose-300 active:scale-95"
            >
              <Zap className="h-4 w-4" />
              <span>SPCL</span>
            </button>
          </div>
        </div>
      </div>

      {/* Roster & Stage Selection */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Fighter Select */}
        <div className="rounded-xl border border-line bg-white p-5 shadow-sm dark:border-moss dark:bg-ink">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-steel dark:text-paper">
            Select Your Fighter (P1)
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(Object.keys(FIGHTERS) as FighterId[]).map((fId) => {
              const f = FIGHTERS[fId];
              const isSelected = selectedP1 === fId;
              return (
                <button
                  key={fId}
                  type="button"
                  onClick={() => {
                    setSelectedP1(fId);
                    resetMatch();
                  }}
                  className={`group relative flex flex-col items-center rounded-lg border p-3 text-center transition ${
                    isSelected
                      ? "border-moss bg-moss/10 shadow-sm"
                      : "border-line bg-paper/40 hover:border-moss dark:border-moss/40 dark:bg-ink"
                  }`}
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-full border border-line bg-ink/10 dark:border-moss">
                    <Image
                      src={f.portrait}
                      alt={f.name}
                      fill
                      className="object-cover object-top"
                    />
                  </div>
                  <span className="mt-2 text-sm font-bold text-ink dark:text-paper">{f.name}</span>
                  <span className="text-[10px] text-steel dark:text-paper">{f.title}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-3 text-xs text-steel dark:border-moss/40 dark:text-paper">
            <span>Opponent (CPU):</span>
            <select
              value={selectedP2}
              onChange={(e) => {
                setSelectedP2(e.target.value as FighterId);
                resetMatch();
              }}
              className="rounded border border-line bg-transparent px-2 py-1 text-xs font-medium text-ink dark:border-moss dark:text-paper"
            >
              {(Object.keys(FIGHTERS) as FighterId[]).map((fId) => (
                <option key={fId} value={fId} className="dark:bg-ink">
                  {FIGHTERS[fId].name} — {FIGHTERS[fId].title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage & Controls Guide */}
        <div className="space-y-4 rounded-xl border border-line bg-white p-5 shadow-sm dark:border-moss dark:bg-ink">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-steel dark:text-paper">
              Stage Environment
            </h3>
            <div className="flex gap-1.5">
              {STAGES.map((s, idx) => (
                <button
                  key={s.name}
                  type="button"
                  onClick={() => setStageIndex(idx)}
                  className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                    stageIndex === idx
                      ? "bg-ink text-white dark:bg-paper dark:text-ink"
                      : "border border-line text-steel hover:text-ink dark:border-moss dark:text-paper"
                  }`}
                >
                  {s.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-t border-line/60 pt-3 dark:border-moss/40">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-moss">Desktop Controls</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-line/60 bg-paper/50 p-2 dark:border-moss/30 dark:bg-paper/5">
                <span className="font-mono font-bold text-ink dark:text-paper">[A] / [D]</span> : Walk Left / Right
              </div>
              <div className="rounded border border-line/60 bg-paper/50 p-2 dark:border-moss/30 dark:bg-paper/5">
                <span className="font-mono font-bold text-ink dark:text-paper">[W]</span> : Jump into Air
              </div>
              <div className="rounded border border-line/60 bg-paper/50 p-2 dark:border-moss/30 dark:bg-paper/5">
                <span className="font-mono font-bold text-ink dark:text-paper">[S]</span> : Guard / Block (80% mitigation)
              </div>
              <div className="rounded border border-line/60 bg-paper/50 p-2 dark:border-moss/30 dark:bg-paper/5">
                <span className="font-mono font-bold text-ink dark:text-paper">[F] or [Space]</span> : Basic Attack Strike
              </div>
              <div className="col-span-2 rounded border border-amber-300/40 bg-amber-50/50 p-2 dark:border-amber-400/20 dark:bg-amber-950/20">
                <span className="font-mono font-bold text-amber-700 dark:text-amber-300">[G] or [K]</span> :{" "}
                <span className="text-steel dark:text-paper">Special Attack Move (requires 50% Super Meter)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}