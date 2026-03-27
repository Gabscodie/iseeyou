/*
 * This class defines the particles of each chakra system 
 * They combine to create the emission effect
 */
class ChakraParticle {
  constructor(x, y, col) {

    // The position of the effect
    this.pos = createVector(x, y);
    this.size = 5;
    this.col = col;

    // Cache random velocity and acceleration once
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(random(-0.05, 0.05), random(-0.05, 0.05));

    // The lifetime of the effect
    this.age = 255;

    // Precompute a flicker offset for smooth variation
    this.flickerOffset = random(1000);
  }

  /*
   * Reset particle when reused from pool
   */
  reset(x, y, col) {
    this.pos.set(x, y);
    this.col = col;

    // Reset motion
    this.vel.set(random(-1, 1), random(-1, 1));
    this.acc.set(random(-0.05, 0.05), random(-0.05, 0.05));

    // Reset lifetime
    this.age = 255;

    // New flicker pattern
    this.flickerOffset = random(1000);
  }

  /*
   * This class announces if the light of each chakra particle is faded
   */
  isFaded() {
    return this.age < 0;
  }

  /*
   * Update particle position
   */
  update() {
    this.pos.add(this.vel);
    this.vel.add(this.acc);

    // Fade smoothly
    this.age -= 15;
  }

  /*
   * Display particle light and set the alpha to match its age
   */
  show() {
    noStroke();

    // Set alpha based on age
    this.col.setAlpha(this.age);
    fill(this.col);

    // Smooth flicker instead of random() every frame
    let flicker = this.size * (0.7 + 0.3 * abs(sin(frameCount * 0.3 + this.flickerOffset)));

    ellipse(this.pos.x, this.pos.y, flicker, flicker);
  }
}
