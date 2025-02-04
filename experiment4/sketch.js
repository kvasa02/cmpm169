
'use strict';

let img, sound, fft, filter;
let playing = false;

function preload() {
  img = loadImage('img.JPG');  // Replace with your image
  sound = loadSound('music.mp3'); // Replace with your music file
}

function setup() {
  createCanvas(650, 450);
  fft = new p5.FFT();
  filter = new p5.LowPass(); // Low-pass filter for smooth audio changes
  sound.disconnect();
  sound.connect(filter);
  noLoop();
}

function draw() {
  background(0);
  
  let spectrum = fft.analyze();
  let bass = fft.getEnergy("bass");
  let treble = fft.getEnergy("treble");

  let tileCountX = int(map(mouseX, 0, width, 3, 20)); // MouseX controls grid size
  let tileCountY = int(map(mouseY, 0, height, 3, 20));
  let stepX = width / tileCountX;
  let stepY = height / tileCountY;
  
  for (let y = 0; y < height; y += stepY) {
    for (let x = 0; x < width; x += stepX) {
      
      let glitchOffsetX = int(random(-bass / 15, bass / 15));
      let glitchOffsetY = int(random(-bass / 15, bass / 15));
      let rotationAmount = random(-PI / (20 + bass / 50), PI / (20 + bass / 50));
      let alphaValue = map(treble, 0, 255, 150, 255);

      push();
      translate(x + stepX / 2, y + stepY / 2);
      rotate(rotationAmount);
      tint(random(150, 255), random(150, 255), random(150, 255), alphaValue);
      image(img, glitchOffsetX - stepX / 2, glitchOffsetY - stepY / 2, stepX, stepY);
      pop();
    }
  }

  // **Audio Control**
  let playbackSpeed = map(mouseX, 0, width, 0.5, 2); // Speed from 0.5x to 2x
  sound.rate(playbackSpeed);
  
  let filterFreq = map(mouseY, 0, height, 100, 2000); // Muffled at low, clear at high
  filter.freq(filterFreq);
}

function mousePressed() {
  if (!playing) {
    sound.loop();
    playing = true;
    loop();
  } else {
    sound.stop();
    playing = false;
    noLoop();
  }
}

function keyReleased() {
  if (key == 's' || key == 'S') saveCanvas('glitch-audio-visual', 'png');
}

