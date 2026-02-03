#!/usr/bin/env node
"use strict";

/**
 * Terminal Snake (Node.js)
 * - Controls: Arrow keys or WASD
 * - Quit: Q or Ctrl+C
 *
 * Run:
 *   node snake.js
 */

const WIDTH = 30;
const HEIGHT = 18;
const TICK_MS = 110;

const WALL = "#";
const BODY = "o";
const HEAD = "@";
const FOOD = "*";
const EMPTY = " ";

function randInt(min, max) {
  // inclusive min, exclusive max
  return Math.floor(Math.random() * (max - min)) + min;
}

function keyToDir(key, currentDir) {
  // Prevent immediate 180-degree reversals
  const opposite = (a, b) => a.x === -b.x && a.y === -b.y;

  let next = null;

  // Arrow keys come as escape sequences in raw mode
  if (key === "\u001b[A") next = { x: 0, y: -1 }; // up
  else if (key === "\u001b[B") next = { x: 0, y: 1 }; // down
  else if (key === "\u001b[C") next = { x: 1, y: 0 }; // right
  else if (key === "\u001b[D") next = { x: -1, y: 0 }; // left
  else {
    const k = key.toLowerCase();
    if (k === "w") next = { x: 0, y: -1 };
    if (k === "s") next = { x: 0, y: 1 };
    if (k === "d") next = { x: 1, y: 0 };
    if (k === "a") next = { x: -1, y: 0 };
  }

  if (!next) return currentDir;
  if (opposite(next, currentDir)) return currentDir;
  return next;
}

function posKey(p) {
  return `${p.x},${p.y}`;
}

function clearScreen() {
  // Clear + cursor home
  process.stdout.write("\x1b[2J\x1b[H");
}

function hideCursor() {
  process.stdout.write("\x1b[?25l");
}

function showCursor() {
  process.stdout.write("\x1b[?25h");
}

function draw(state) {
  const { snake, food, score, alive } = state;

  const snakeSet = new Set(snake.map(posKey));
  const headKey = posKey(snake[0]);

  let out = "";

  // Top border
  out += WALL.repeat(WIDTH + 2) + "\n";

  for (let y = 0; y < HEIGHT; y++) {
    out += WALL;
    for (let x = 0; x < WIDTH; x++) {
      const k = `${x},${y}`;
      if (k === headKey) out += HEAD;
      else if (x === food.x && y === food.y) out += FOOD;
      else if (snakeSet.has(k)) out += BODY;
      else out += EMPTY;
    }
    out += WALL + "\n";
  }

  // Bottom border
  out += WALL.repeat(WIDTH + 2) + "\n";

  out += `Score: ${score}    Controls: Arrows/WASD    Quit: Q\n`;
  if (!alive) out += `Game Over! Press R to restart or Q to quit.\n`;

  clearScreen();
  process.stdout.write(out);
}

function spawnFood(snake) {
  const snakeSet = new Set(snake.map(posKey));
  while (true) {
    const p = { x: randInt(0, WIDTH), y: randInt(0, HEIGHT) };
    if (!snakeSet.has(posKey(p))) return p;
  }
}

function initState() {
  const start = { x: Math.floor(WIDTH / 2), y: Math.floor(HEIGHT / 2) };
  const snake = [
    { x: start.x, y: start.y },
    { x: start.x - 1, y: start.y },
    { x: start.x - 2, y: start.y },
  ];
  return {
    snake,
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: spawnFood(snake),
    score: 0,
    alive: true,
  };
}

function tick(state) {
  if (!state.alive) return state;

  // apply buffered direction (from keyboard)
  state.dir = state.nextDir;

  const head = state.snake[0];
  const newHead = { x: head.x + state.dir.x, y: head.y + state.dir.y };

  // wall collision
  if (newHead.x < 0 || newHead.x >= WIDTH || newHead.y < 0 || newHead.y >= HEIGHT) {
    state.alive = false;
    return state;
  }

  // self collision (note: moving into the tail is OK if we're not growing)
  const snakeKeys = state.snake.map(posKey);
  const tailKey = snakeKeys[snakeKeys.length - 1];
  const newHeadKey = posKey(newHead);

  const hitsBody = snakeKeys.includes(newHeadKey) && newHeadKey !== tailKey;
  if (hitsBody) {
    state.alive = false;
    return state;
  }

  state.snake.unshift(newHead);

  // food?
  if (newHead.x === state.food.x && newHead.y === state.food.y) {
    state.score += 1;
    state.food = spawnFood(state.snake);
    // do NOT remove tail (growth)
  } else {
    state.snake.pop();
  }

  return state;
}

// --- Main loop / input handling ---
let state = initState();
let interval = null;

function start() {
  if (interval) clearInterval(interval);
  state = initState();
  draw(state);

  interval = setInterval(() => {
    state = tick(state);
    draw(state);
  }, TICK_MS);
}

function cleanupAndExit(code = 0) {
  if (interval) clearInterval(interval);
  showCursor();
  process.stdin.setRawMode(false);
  process.stdin.pause();
  clearScreen();
  process.exit(code);
}

process.on("SIGINT", () => cleanupAndExit(0));

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true);
}
process.stdin.resume();
process.stdin.setEncoding("utf8");
hideCursor();

process.stdin.on("data", (key) => {
  // Quit
  if (key === "\u0003") cleanupAndExit(0); // Ctrl+C
  if (key.toLowerCase() === "q") cleanupAndExit(0);

  // Restart if dead
  if (!state.alive && key.toLowerCase() === "r") {
    start();
    return;
  }

  // Direction change
  state.nextDir = keyToDir(key, state.nextDir);
});

start();
