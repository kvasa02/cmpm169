let shapes = []; // This will store all the rotating shapes we create.

function setup() {
  createCanvas(windowWidth, windowHeight); // Make the canvas the size of the browser window.
  colorMode(HSB, 360, 100, 100, 100); // Use HSB color mode for easy gradients.
  background(20, 20, 20); // Start with a dark background.
}

function draw() {
  // The background has some transparency to leave trails of previous frames.
  background(20, 20, 20, 10);

  // Go through all the shapes and make them rotate and show up on the canvas.
  shapes.forEach((shape) => {
    shape.update(); // Make the shape rotate a bit.
    shape.display(); // Draw the shape on the screen.
  });
}

function mousePressed() {
  // Add a new rotating shape at the mouse position when you click.
  shapes.push(new RotatingShape(mouseX, mouseY));
}

// This is a blueprint for the rotating shapes.
class RotatingShape {
  constructor(x, y) {
    this.x = x; // The x position of the shape.
    this.y = y; // The y position of the shape.
    this.rotation = random(TWO_PI); // Start the shape at a random angle.
    this.speed = random(0.01, 0.05); // How fast it rotates (a small random speed).
    this.radius = random(50, 150); // How far the small circles are from the center.
    this.numShapes = int(random(6, 12)); // How many small circles to draw in the pattern.
    this.colorOffset = random(360); // Random start point for the color gradient.
  }

  update() {
    this.rotation += this.speed; // Slowly rotate the shape over time.
  }

  display() {
    push(); // Save the current canvas settings.

    // Move to where the shape should be and rotate it.
    translate(this.x, this.y); 
    rotate(this.rotation);

    // Loop through and draw the small circles around the center.
    for (let i = 0; i < this.numShapes; i++) {
      let angle = (TWO_PI / this.numShapes) * i; // Spread the circles evenly in a circle.
      let x = cos(angle) * this.radius; // X position of each small circle.
      let y = sin(angle) * this.radius; // Y position of each small circle.

      // Pick a color that changes with time for a gradient effect.
      let gradientColor = color((frameCount + this.colorOffset) % 360, 80, 100);
      fill(gradientColor); // Fill the small circles with this color.
      noStroke(); // Don't draw outlines around the circles.

      ellipse(x, y, 20, 20); // Draw the small circle.
    }
    pop(); // Restore the canvas settings so the next shape isn't affected.
  }
}
