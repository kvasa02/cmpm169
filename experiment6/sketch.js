let mic;
let fft;
let volume = 0;
let targetSize = 30;
let currentSize = 30;
let currentWord = "silence";
let targetWord = "silence";
let lastWordChangeTime = 0;
let smoothedVolume = 0;
let smoothedPitch = 0;
let micPermission = false;

// Expanded word lists with emotional mapping
const wordCategories = {
  whisper: ["whisper", "hush", "gentle", "quiet", "soft", "subtle", "flutter", "drift", "float", "mist"],
  calm: ["calm", "peace", "serene", "tranquil", "steady", "flow", "balance", "still", "breath", "ease"],
  moderate: ["speak", "talk", "voice", "sound", "echo", "rhythm", "pulse", "wave", "beat", "hum"],
  loud: ["shout", "roar", "thunder", "blast", "boom", "crash", "surge", "rush", "storm", "burst"],
  intense: ["explosive", "erupt", "blast", "lightning", "tempest", "fury", "power", "force", "rage", "wild"]
};

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textFont("Georgia");
  
  // Initialize with silence
  currentWord = random(wordCategories.whisper);
  targetWord = currentWord;
  lastWordChangeTime = millis();
  
  // Set up microphone with user interaction
  mic = new p5.AudioIn();
  fft = new p5.FFT(); // Create FFT analyzer

  // Create a button to request microphone access
  let button = createButton('Click to start microphone');
  button.position(10, 10);
  button.mousePressed(() => {
    // Get user audio permission
    mic.start(() => {
      console.log('Microphone started');
      fft.setInput(mic); // Connect FFT to microphone
      micPermission = true;
      button.hide();
    }, () => {
      console.log('Microphone permission denied');
      button.html('Microphone access denied');
    });
  });
}

function draw() {
  // Create gradient background based on volume
  let bgColor = map(smoothedVolume, 0, 1, 30, 60);
  background(bgColor);
  
  if (micPermission) {
    // Get current microphone volume and frequency data
    volume = mic.getLevel();
    smoothedVolume = lerp(smoothedVolume, volume, 0.1);

    let spectrum = fft.analyze();
    let centroid = fft.getCentroid(); // Get spectral centroid (pitch estimate)

    // Normalize pitch to range 0-1 (assuming human voice range)
    let minPitch = 100;  // Low voice pitch (Hz)
    let maxPitch = 4000; // High voice pitch (Hz)
    let pitchNormalized = constrain(map(centroid, minPitch, maxPitch, 0, 1), 0, 1);
    smoothedPitch = lerp(smoothedPitch, pitchNormalized, 0.1);

    // Update word selection based on pitch every 500ms
    let currentTime = millis();
    if (currentTime - lastWordChangeTime >= 500) {
      targetWord = selectNewWord(smoothedPitch);
      lastWordChangeTime = currentTime;
    }
  } else {
    // Display instruction if no microphone access
    push();
    fill(255);
    textSize(16);
    text('Click the button above to enable microphone', width/2, height/2 - 50);
    pop();
  }
  
  // Smooth text size transitions
  targetSize = map(smoothedPitch, 0, 1, 30, 120);
  currentSize = lerp(currentSize, targetSize, 0.1);
  
  // Create dynamic color based on pitch
  let hue = map(smoothedPitch, 0, 1, 180, 0);  // Blue to red
  let saturation = map(smoothedPitch, 0, 1, 50, 100);
  let brightness = map(smoothedPitch, 0, 1, 80, 100);
  colorMode(HSB);
  let textColor = color(hue, saturation, brightness);
  colorMode(RGB);
  
  // Add subtle movement
  let xOffset = map(noise(frameCount * 0.01), 0, 1, -5, 5);
  let yOffset = map(noise(frameCount * 0.01 + 1000), 0, 1, -5, 5);
  
  // Display text with effects
  push();
  translate(width/2 + xOffset, height/2 + yOffset);
  
  // Add shadow for depth
  fill(0, 100);
  text(targetWord, 2, 2);
  
  // Main text
  fill(textColor);
  textSize(currentSize);
  text(targetWord, 0, 0);
  
  // Optional particle effect for high pitches
  if (micPermission && smoothedPitch > 0.5) {
    drawParticles(smoothedPitch);
  }
  pop();
}

function selectNewWord(pitch) {
  if (pitch < 0.1) return random(wordCategories.whisper);
  if (pitch < 0.3) return random(wordCategories.calm);
  if (pitch < 0.5) return random(wordCategories.moderate);
  if (pitch < 0.7) return random(wordCategories.loud);
  return random(wordCategories.intense);
}

function drawParticles(pitch) {
  let particleCount = map(pitch, 0.5, 1, 5, 15);
  for (let i = 0; i < particleCount; i++) {
    let angle = random(TWO_PI);
    let radius = random(50, 150) * pitch;
    let x = cos(angle) * radius;
    let y = sin(angle) * radius;
    let size = random(2, 6);
    
    fill(255, map(pitch, 0.5, 1, 100, 200));
    noStroke();
    ellipse(x, y, size, size);
  }
}
