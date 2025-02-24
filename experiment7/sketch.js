let mic, fft;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 255);
  
  // Initialize microphone input
  mic = new p5.AudioIn();
  mic.start();
  
  // Setup FFT to analyze the sound input
  fft = new p5.FFT();
  fft.setInput(mic);
  
  noFill();
  strokeWeight(2);
}

function draw() {
  // Create a fading background for trails
  background(0, 20);
  
  // Get the frequency spectrum from the microphone input
  let spectrum = fft.analyze();
  
  let total = 0;
  for (let i = 0; i < spectrum.length; i++) {
    total += spectrum[i];
  }
  let avgAmplitude = total / spectrum.length;
  
  // Map the average amplitude to a hue value (0-255)
  let hueVal = map(avgAmplitude, 0, 255, 0, 255);
  // Set the stroke color dynamically based on sound level
  stroke(hueVal, 255, 255, 200);
  
  let noiseScale = 0.02;
  let maxRadius = min(width, height) * 0.4;
  
  translate(width / 2, height / 2);
  beginShape();
  
  for (let i = 0; i < spectrum.length; i++) {
    let amplitude = spectrum[i];
    let r = map(amplitude, 0, 255, maxRadius * 0.5, maxRadius);
    
    let angle = map(i, 0, spectrum.length, 0, TWO_PI);
    
    let noiseVal = noise(i * noiseScale, frameCount * noiseScale);
    let offset = map(noiseVal, 0, 1, -50, 50);
    
    let x = (r + offset) * cos(angle);
    let y = (r + offset) * sin(angle);
    vertex(x, y);
  }
  endShape(CLOSE);
}
