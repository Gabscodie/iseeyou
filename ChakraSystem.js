/*
 * This class defines 7 Chakras of our body
 * Each of them represents different colours and impact 
 * different parts of a person's well-being
 * MIND/CROWN HEAD - Indigo
 * EYES/THIRD-EYE  - Violet
 * THROAT          - Blue
 * HEART           - Green
 * STOMACH         - Yellow                   
 * BACK            - Orange    
 * LEGS            - Red 
 *
 * The cursor is defined a separate chakra that is white,
 * representing our brightest chakra - mindfulness 
 */
class ChakraSystem {
  constructor(x, y, name, col) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.col = col;
    this.size = 3;
    // Each chakra system has an array of particles
    this.particles = [];
  }

  //Maintaining the particle array a size of three particles when every frame drawn 
  emit() {
    for (let i = 0; i < this.size; i++) {
      this.particles.push(new ChakraParticle(this.x, this.y, this.col));
    }
  }

  // Updates the particle in the particles array to create the emission effect
  update() {
    // Explosion effect for each particle
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      // Delete faded light to clean space
      if (this.particles[i].isFaded()) {
        this.particles.splice(i, 1);
      }
    }
  }

  //Announce if the particles array is out of particle 
  isFinished() {
    return this.particles.length == 0;
  }

  //Display the chakra particles 
  show() {
    // Explosion effect for each particle
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }
}
