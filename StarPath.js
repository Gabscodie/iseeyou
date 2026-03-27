/* 
 * The galaxy is drawn by rotating 800 ellipses in a constant rotating scale to create the spiral effect.
 * This rotating scale differs after every frame when the mouse move around Canvas.
 * Each elliptical path has 3 - 8 stars travelling on
 */
class StarPath {
  constructor(w, t, rot) {
    // wide and tall of each elliptical path
    this.wide = w;
    this.tall = t;

    // Rotating angle of each path
    this.rotAngle = rot;

    // Cache stroke color so we don't recreate it every frame
    this.pathStroke = color(182, 211, 182, 5);

    // The star system of each path
    this.myStars = [];
    let starCount = floor(random(3, 8));   // compute once, not every frame
    for (let i = 0; i < starCount; i++) {
      this.myStars.push(new Star(this));
    }
  }

  show() {
    push();

    //Add up after every frame with push() and pop()
    rotate(this.rotAngle);

    // Blurring path displayed
    stroke(this.pathStroke);
    noFill();
    ellipse(0, 0, this.wide, this.tall);

    // Draw stars
    for (let i = 0; i < this.myStars.length; i++) {
      this.myStars[i].show();
    }

    pop();
  }

  update() {
    // Update star positions in the star system
    // Instead of random(rotOffset) every frame (very expensive),
    // we use a smooth oscillation that still reacts to mouse movement.
    this.rotAngle += rotOffset;

    for (let i = 0; i < this.myStars.length; i++) {
      this.myStars[i].update();
    }
  }
}
