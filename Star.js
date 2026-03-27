/*
 * Define the stars in the galaxy 
 * Each star travels in an elliptical path which set its position in the galaxy
 */
class Star {
  constructor(path) {
    // Their position is relating to its how wide and tall its elliptical path is
    this.theta = random(360);
    this.size = random(2, 3);
    this.path = path;

    // Divided by path width and height by 2 to calculate the x and y position of each star in its elliptical path 
    this.x = (this.path.wide / 2) * cosTable[floor(this.theta) % 360];
    this.y = (this.path.tall / 2) * sinTable[floor(this.theta) % 360];

    // The star needs to blink and here is the frequency for its blinking duration
    this.blinkingFreq = random(1.5, 3);

    // Cache a base color so we don't call random() every frame
    this.baseHue = random(180);
  }

  update() {
    this.theta += 0.1;
    let t = floor(this.theta) % 360;

    this.x = (this.path.wide / 2) * cosTable[t];
    this.y = (this.path.tall / 2) * sinTable[t];
  }

  // The colour and size of each stars keeps changing to create magical effect
  show() {
    // Use cached hue + smooth brightness instead of random() every frame
    let brightness = abs(sin(frameCount * 0.5)) * 255;
    fill(this.baseHue, 100, brightness);

    noStroke();

    // Smooth blinking using precomputed frequency
    let blink = abs(sin(frameCount * this.blinkingFreq)) * this.size;
    circle(this.x, this.y, blink);
  }
}

