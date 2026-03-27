/*
 * Define the light effect which represents the connection 
 * between the body Chakra and the star in the galaxy
 *
 * The connection display randomly with three effects when the mouse is clicked
 * "spreading" - harmonizing with our emotion
 * "hugging" - energy falling to hug our body
 * "connecting" - remotely connecting our mind and our body  
 *
 */
class LightEffectSystem {
  constructor(x, y, chakra, animation) {
    // x-pos where the effect starts running
    this.x = x;
    this.animation = animation;

    // Horizontal spreading effect takes place at the chakra's y-pos
    if (animation == "spreading") {
      this.y = chakra.y;

      // Hugging effect takes place at the center of the galaxy
    } else if (animation == "hugging") {
      this.x = width / 2;
      this.y = height / 2;

      // The explosion effect takes place whereever the mouse is clicked on the canvas
    } else {
      this.y = y;
    }

    // This is the chakra system
    this.edge = chakra.y;
    this.col = chakra.col;

    // Reduced from 100 to 60 for performance, same visual density due to flicker
    this.size = 60;

    this.particles = [];

    // Light Emission effect 
    for (let i = 0; i < this.size; i++) {
      // Particle at effect origin
      this.particles.push(new LightParticle(this.x, this.y, this.col, this.animation));

      // For connecting effect, also spawn from chakra
      if (this.animation == "connecting") {
        this.particles.push(new LightParticle(chakra.x, chakra.y, this.col, this.animation));
      }
    }

    // Cache gravity vector so we don't recreate it every frame
    this.gravity = createVector(0, 0.2);
  }

  // Update light particles
  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {

      // Only used for "hugging" effect for now
      if (this.animation == "hugging") {
        this.particles[i].edges(this.edge);
        this.particles[i].applyForce(this.gravity);
      }

      // Update particle x and y after every frame
      this.particles[i].update();

      // Delete faded light
      if (this.particles[i].isFaded()) {
        this.particles.splice(i, 1);
      }
    }
  }

  // Delete effect that has been done
  isFinished() {
    return this.particles.length == 0;
  }

  // Display effect on screen
  show() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}
