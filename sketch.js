/*
 * "I SEE YOU" project is inspired from the concept  
 * "We are the universe experiencing itself" - Alan Watts
 * Everytime you run the system, you will get a message from the universe to you, and you will have a chance to watch your emotions, you thoughts dancing with the universe.
 * You are the meditator.
 * For every mouse movement or click, you are able to see the connection between you and the whole universe.
 * 
 * My ChakraParticle, ChakraSystem, LightEffectSystem, LightParticle, Star,
 * StarPath classes are inspired from the particle and particle system classes from
 * Patt Vira: https://www.youtube.com/watch?v=QlpadcXok8U&t=917s
 * The coding train: https://www.youtube.com/watch?v=syR0klfncCk&t=333s
 * I modified and played with the effects to make it suitable for showing
 * connections between us and the universe
 * 
 * I modified the galaxy logic from Understanding the Universe Through Code
 * https://www.youtube.com/watch?v=F-3Mt5avI2o
 * to simulate the milky way.
 */


// ----------------------------
// GLOBALS
// ----------------------------

// This is the meditator drawing part
let wide = 90; // Wide of the bottom
let tall = 20; // Tall of the bottom
let meditatorHeight;
let meditator = [];

// Store the lights we generate when clicking the mouse 
let myLights = [];

// Animation effect for every click
let animations = ["spreading", "hugging", "connecting"]

// Chakra system from crown to root and cursor
let chakraColors;
let chakras = [];
let chakraSize = 7;
let mindfulCursor;

/* Simulate milky way - The Spiral Galaxy
  A central bulge is a spherical or oval-shaped structure found at the center of the galaxy
*/
let centralBulgeLen = 20;  // center of galaxy
let ellipticalRatio = 0.7; // wide and tall ratio of ellipse
let starDistance = 1.4; // distance between stars
let galaxySize = 800; // number of paths


// Elliptical system of the galaxy
let starPaths = [];
let rotationScale; // constant scale to rotate every frame
let rotOffset;

// Text display part
let myLogo;
let myText;
let randMessage = [1, 2, 3, 4, 5, 6];

// Sound part
let mySound;
let started = false; // used to start the sound when mouse is clicked

// PERFORMANCE BUFFERS
let bgBuffer;
let sinTable = [];
let cosTable = [];



// ----------------------------
// PRELOAD
// ----------------------------
function preload() {
  // Picking message file
  let myFile = `message${random(randMessage)}.txt`;
  myText = loadStrings(myFile);
  myLogo = loadStrings("logo.txt");
  mySound = loadSound("You_Heal_Me.mp3");
}

// ----------------------------
// SETUP
// ----------------------------
function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);

  // Precompute trig tables
  for (let i = 0; i < 360; i++) {
    sinTable[i] = sin(i);
    cosTable[i] = cos(i);
  }

  // Cache background
  bgBuffer = createGraphics(width, height);
  drawStaticBackground(bgBuffer);

  // Set up Galaxy
  rotationScale = 360 / galaxySize;
  rotOffset = 360 / galaxySize;
  setUpGalaxy();

  // Meditator + chakras
  setUpMyself();
  setUpChakra();

  // Text display
  textFont("Quicksand");
  textSize(12);

  noCursor();
  mindfulCursor = new ChakraSystem(mouseX, mouseY, "MINDFULNESS", color("white"));
}

// ----------------------------
// DRAW LOOP
// ----------------------------
function draw() {
  image(bgBuffer, 0, 0);

  drawMyself();
  drawText();

  // Galaxy — update half per frame for speed
  // Translate origins to draw galaxy
  push();
  translate(width / 2, height / 2);
  let skip = frameCount % 2;
  for (let i = skip; i < galaxySize; i += 2) {
    starPaths[i].update();
  }
  for (let i = 0; i < galaxySize; i++) {
    starPaths[i].show();
  }
  pop();

  // Chakras
  for (let c of chakras) {
    c.emit();
    c.update();
    c.show();
  }

  // Draw mindful cursor, representing our mindfulness
  mindfulCursor.x = mouseX;
  mindfulCursor.y = mouseY;
  mindfulCursor.emit();
  mindfulCursor.update();
  mindfulCursor.show();

  // Draw and update the light effects we generate
  for (let i = myLights.length - 1; i >= 0; i--) {
    myLights[i].update();
    myLights[i].show();
    if (myLights[i].isFinished()) myLights.splice(i, 1);
  }

  // Changing the spiral direction with mouse movement
  dancing();
}

// ----------------------------
// TEXT
// ----------------------------
function drawText() {
  let alpha = 200 + 55 * sin(frameCount * 2);

  textAlign(CENTER, TOP);
  fill(255, 255, 255, alpha);
  for (let i = 0; i < myText.length; i++) {
    text(myText[i], width / 2, 40 + i * 20);// Display each line of text
  }

  textAlign(LEFT, TOP);
  for (let i = 0; i < myLogo.length; i++) {
    text(myLogo[i], 20, height - 200 + i * 15);// Display each line of text
  }
}

// ----------------------------
// SPIRAL REACTION
// This function represents the spiral dancing with regards to our mouse positions by changing the rotating scale
// ----------------------------
function dancing() {
  rotOffset = map(mouseX + mouseY, 0, width + height, -400 / galaxySize, 400 / galaxySize);
}


// ----------------------------
// CLICK
// OUR ACTIONS TO CONNECT WITH THE UNIVERSE
// ----------------------------
function mousePressed() {
  if (!started) {
    mySound.play();
    mySound.setVolume(0.5);
    started = true;
  }
  // When mouse is pressed, the light system will generate a connecting effect randomly between us and universe
  // Each effect is linked to a chakra of our body 
  myLights.push(new LightEffectSystem(mouseX, mouseY, random(chakras), random(animations)));
}

// ----------------------------
// STATIC BACKGROUND (cached)
// DRAW GALAXY BACKGROUND
// ----------------------------
function drawStaticBackground(g) {
  for (let i = 0; i < g.height; i++) {
    let noiseScale = noise(i * 0.005);
    // Purple tone
    let blueValue = map(i, 0, g.height, 50, 200 * noiseScale);
    g.stroke(noiseScale * 50, 10, blueValue);
    g.line(0, i, g.width, i);
  }
}

// ----------------------------
// GALAXY
// ----------------------------
function setUpGalaxy() {
  for (let i = 0; i < galaxySize; i++) {
    let w = centralBulgeLen + i * starDistance;
    let h = w * ellipticalRatio;
    //Add up a constant rotation angle to make create spiral effect
    starPaths.push(new StarPath(w, h, rotationScale += rotOffset));
  }
}

// ----------------------------
// MEDITATOR
// ----------------------------
function setUpMyself() {
  // Base
  for (let i = -80; i < 80; i++) {
    meditator.push(new Dot(sin(i * 2) * wide, cos(i * 3) * tall));
  }

  // Body (unchanged logic)
  let bodyLeft = meditator[0];
  let bodyRight = meditator[meditator.length - 1];
  let bodyWide = wide / 6;
  let bodyTall = tall * 2;

  for (let i = 0; i > -160; i--) {
    meditator.unshift(new Dot(sin(i) * bodyWide + bodyLeft.x, cos(i) * bodyTall + bodyLeft.y - bodyTall));
    meditator.push(new Dot(sin(map(i, 0, -160, -40, -120)) * bodyWide - bodyRight.x / 2,
      cos(map(i, 0, -160, -10, -120)) * bodyTall + bodyLeft.y - bodyTall));
    meditator.push(new Dot(sin(map(i, 0, -160, 0, 20)) * bodyWide + bodyRight.x,
      cos(map(i, 0, -160, -10, 100)) * bodyTall + bodyRight.y - bodyTall));
    meditator.push(new Dot(sin(map(i, 0, -160, 10, 160)) * bodyWide + bodyRight.x,
      cos(map(i, 0, -160, 10, 160)) * bodyTall + bodyRight.y - bodyTall));
  }

  // Neck
  let neckLeft = meditator[0];
  let neckRight = meditator[meditator.length - 1];
  let neckWide = wide / 3;
  let neckTall = wide / 3;

  for (let i = 0; i < 90; i++) {
    meditator.unshift(new Dot(sin(i) * neckWide + neckLeft.x, cos(i) * neckTall + neckLeft.y - neckTall));
    meditator.push(new Dot(sin(map(i, -180, -90, 90, 180)) * neckWide + neckRight.x,
      cos(map(i, -180, -90, 90, 180)) * neckTall + neckRight.y - neckTall));
  }

  // Head
  let headStart = meditator[0];
  let headWide = 20;
  let headTall = 25;

  for (let i = 10; i < 335; i++) {
    meditator.push(new Dot(
      sin(i) * headWide + headStart.x + headWide / 2,
      cos(i) * headTall + headStart.y - headTall
    ));
  }

  meditatorHeight = tall + bodyTall + headTall * 2 + neckTall * 2;
}

// ----------------------------
// DOT (optimized)
// ----------------------------
class Dot {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    noStroke();
    fill(255, 255, 200);
    circle(this.x + random(-2, 2), this.y + random(-2, 2), random(2));
  }
}

// ----------------------------
// DRAW MEDITATOR (global breathing motion)
// ----------------------------
function drawMyself() {
  push();
  let breatheX = sin(frameCount * 0.5) * 1.5;
  let breatheY = cos(frameCount * 0.5) * 1.5;

  translate(width / 2 + breatheX, height - 80 + breatheY);

  for (let d of meditator) d.draw();
  pop();
}

// ----------------------------
// CHAKRAS
// ----------------------------
function setUpChakra() {
  chakraColors = [
    color("rgb(250,75,250)"),
    color("rgb(168,91,224)"),
    color("rgb(123,123,243)"),
    color("rgb(138,243,138)"),
    color("rgb(243,243,144)"),
    color("rgb(255,204,111)"),
    color("rgb(231,69,69)")
  ];

  let chakraNames = ["MIND", "EYES", "THROAT", "HEART", "STOMACH", "BACK", "LEGS"];

  for (let i = 0; i < chakraSize; i++) {
    let y = map(i, 0, 6, height - 80 - meditatorHeight, height - 80);
    chakras.push(new ChakraSystem(width / 2 + 4, y, chakraNames[i], chakraColors[i]));
  }
}
