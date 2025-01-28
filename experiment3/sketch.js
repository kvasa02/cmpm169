let raindrops = []; // Array to store raindrops
let windOffset = 0; // Offset for Perlin noise-based wind
let lightningTimer = 0; // Timer to control lightning duration
let lightningFlashDuration = 5; // Duration of the lightning flash
let lightningProbability = 0.01; // Probability of a lightning strike each frame
let thunderSound; // Variable to store the thunder sound

function preload() {
  // Preload the thunder sound
  thunderSound = loadSound('thunder.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Initialize audio context
  getAudioContext().resume();
  
  for (let i = 0; i < 200; i++) {
    raindrops.push(new Raindrop());
  }
}

function draw() {
  // If there's a lightning flash, we make the background white
  if (lightningTimer > 0) {
    background(255); // Flash the sky white
    lightningTimer--; // Decrease the timer
  } else {
    background(30, 30, 50); // Dark sky background
  }

  // Random chance for a lightning strike
  if (random() < lightningProbability) {
    lightningTimer = lightningFlashDuration; // Trigger a flash
    if (!thunderSound.isPlaying()) {
      thunderSound.setVolume(0.5); // Reduced volume to 50%
      thunderSound.play(); // Play the thunder sound
    }
  }

  let wind = map(noise(windOffset), 0, 1, -1, 1); // Wind direction from Perlin noise
  windOffset += 0.01;

  for (let drop of raindrops) {
    drop.applyWind(wind);
    drop.update();
    drop.show();
  }
}

// Handle mouse press to ensure audio context is started
function mousePressed() {
  getAudioContext().resume();
}

// Raindrop class
class Raindrop {
  constructor() {
    this.x = random(width);
    this.y = random(-500, height);
    this.z = random(0, 20); // Depth effect
    this.size = map(this.z, 0, 20, 3, 8); // Smaller teardrop size
    this.speed = map(this.z, 0, 10, 4, 10); // Speed varies with depth
    this.windEffect = 0;
  }

  applyWind(wind) {
    this.windEffect = wind * map(this.z, 0, 20, 0.5, 2); // Wind impact varies with depth
  }

  update() {
    this.y += this.speed;
    this.x += this.windEffect;

    // Reset raindrop if it moves off-screen
    if (this.y > height || this.x < 0 || this.x > width) {
      this.y = random(-200, -50);
      this.x = random(width);
      this.z = random(0, 20);
      this.size = map(this.z, 0, 20, 3, 8);
      this.speed = map(this.z, 0, 20, 10, 30);
    }
  }

  show() {
    noStroke();
    fill(0, 191, 255, map(this.z, 0, 20, 100, 255)); // Blue rain with transparency

    // Draw teardrop shape
    beginShape();
    let baseSize = this.size / 2;
    vertex(this.x, this.y); // Top point of the teardrop
    vertex(this.x - baseSize, this.y + this.size); // Bottom left
    vertex(this.x + baseSize, this.y + this.size); // Bottom right
    endShape(CLOSE);
  }
}