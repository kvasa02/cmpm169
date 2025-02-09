let boxes = [];
let gravity;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  gravity = createVector(0, 0.1, 0);
  
  // Allow scrolling
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";

  // Create a container for the instructions
  let instructions = document.createElement("div");
  instructions.id = "instructions";
  instructions.innerHTML = "<h2>Here in my experiment, click on the screen below to see some cool 3D physics:</h2>";
  instructions.style.position = "relative";
  instructions.style.marginTop = "20px";
  instructions.style.color = "blue";
  instructions.style.textAlign = "center";
  document.body.appendChild(instructions);
  
  // Create a container for the canvas
  let container = document.createElement("div");
  container.id = "canvas-container";
  container.style.position = "relative";
  container.style.margin = "auto";
  container.style.marginTop = "20px";
  container.style.width = "fit-content";
  container.style.border = "2px solid white";
  container.style.padding = "10px";
  container.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
  document.body.appendChild(container);
  
  let cnv = document.querySelector("canvas");
  container.appendChild(cnv);
}

function draw() {
  background(50);
  lights();
  
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].applyForce(gravity);
    boxes[i].update();
    for (let j = i + 1; j < boxes.length; j++) {
      if (boxes[i].checkCollision(boxes[j])) {
        boxes[i].changeColor();
        boxes[j].changeColor();
      }
    }
    boxes[i].checkWallCollision();
    boxes[i].display();
  }
}

function mousePressed() {
  let b = new Box(mouseX - width / 2, mouseY - height / 2, 0);
  boxes.push(b);
}

class Box {
  constructor(x, y, z) {
    this.position = createVector(x, y, z);
    this.velocity = createVector(0, 0, 0);
    this.acceleration = createVector(0, 0, 0);
    this.size = random(20, 50);
    this.color = color(random(255), random(255), random(255));
  }
  
  applyForce(force) {
    this.acceleration.add(force);
  }
  
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    
    if (this.position.y > height / 2 - this.size / 2) {
      this.position.y = height / 2 - this.size / 2;
      this.velocity.y *= -0.6;
    }
  }
  
  checkCollision(other) {
    let distance = dist(this.position.x, this.position.y, this.position.z, other.position.x, other.position.y, other.position.z);
    let minDist = (this.size + other.size) / 2;
    if (distance < minDist) {
      let collisionNormal = p5.Vector.sub(other.position, this.position).normalize();
      let relativeVelocity = p5.Vector.sub(other.velocity, this.velocity);
      let speed = relativeVelocity.dot(collisionNormal);
      if (speed > 0) return false;
      let impulse = collisionNormal.mult(-1.5 * speed);
      this.velocity.add(impulse);
      other.velocity.sub(impulse);
      return true;
    }
    return false;
  }
  
  checkWallCollision() {
    let halfWidth = width / 2;
    let halfHeight = height / 2;
    
    if (this.position.x > halfWidth - this.size / 2) {
      this.position.x = halfWidth - this.size / 2;
      this.velocity.x *= -0.6;
    }
    if (this.position.x < -halfWidth + this.size / 2) {
      this.position.x = -halfWidth + this.size / 2;
      this.velocity.x *= -0.6;
    }
    if (this.position.y > halfHeight - this.size / 2) {
      this.position.y = halfHeight - this.size / 2;
      this.velocity.y *= -0.6;
    }
    if (this.position.y < -halfHeight + this.size / 2) {
      this.position.y = -halfHeight + this.size / 2;
      this.velocity.y *= -0.6;
    }
  }
  
  changeColor() {
    this.color = color(random(255), random(255), random(255));
  }
  
  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    fill(this.color);
    box(this.size);
    pop();
  }
}
