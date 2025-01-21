let ringColors = [];
let colorActive = [];
let colorNames = ["anger", "fear", "surprise", "disgust", "happy", "sad"];
let ringRadius;
let rotationAngle = 0;

// Variables for displaying color name
let displayColorName = false;
let displayColorIndex = -1;
let displayStartTime = 0;
const displayDuration = 500; // 1 second

function setup() {
  createCanvas(800, 480);
  
  ringColors[0] = color(255, 0, 0);
  ringColors[1] = color(255, 127, 0);
  ringColors[2] = color(0, 0, 255);
  ringColors[3] = color(255, 255, 0);
  ringColors[4] = color(255, 0, 255);
  ringColors[5] = color(0, 255, 255);

  colorActive = Array(ringColors.length).fill(false);

  ringRadius = height / 2.5;
}

function draw() {
  background(244, 223, 198);

  translate(width / 2, height / 2);
  
  // Increment the rotation angle over time (adjust the speed as needed)
  rotationAngle += 0.005;

  // Draw the ring with active colors and rotation
  drawRing();

  // Display color name if needed
  if (displayColorName && millis() - displayStartTime < displayDuration) {
    displayColor(colorNames[displayColorIndex], colorActive[displayColorIndex]);
  } else {
    displayColorName = false;
  }
}

function displayColor(colorName, isActive) {
  textAlign(CENTER, CENTER);
  textSize(160);
  fill(0);
  if (isActive) {
    text(colorName, 0, 0);
  } else {
    // Display color name with strike-through if inactive
    let textHeightHalf = textAscent() / 8;
    let strikeThroughY = textHeightHalf - 8; // Adjusted to ensure strike-through is centered vertically
    strokeWeight(8); // Increased stroke weight for better visibility
    stroke(0); // Set stroke color to match text color
    strokeCap(SQUARE);
    line(-textWidth(colorName) / 2, strikeThroughY, textWidth(colorName) / 2, strikeThroughY);
    noStroke();
    text(colorName, 0, 0);
  }
}


function keyPressed() {
  let colorIndex = int(key);
  if (colorIndex >= 0 && colorIndex <= 5) {
    // Toggle the state of the color
    if (colorActive[colorIndex]) {
      colorActive[colorIndex] = false;
    } else {
      colorActive[colorIndex] = true;
    }
    
    displayColorName = true;
    displayColorIndex = colorIndex;
    displayStartTime = millis();
    redraw(); // Redraw the canvas when color distribution is updated
  }
}

function drawRing() {
  let activeColors = ringColors.filter((color, index) => colorActive[index]);
  let activeColorCount = activeColors.length;
  let angleStep = TWO_PI / activeColorCount;

  for (let i = 0; i < activeColorCount; i++) {
    let currentAngle = i * angleStep + rotationAngle;
    let colorIndex = i % activeColorCount;
    let color1 = activeColors[colorIndex];
    let color2 = activeColors[(colorIndex + 1) % activeColorCount];

    // Draw ring color
    fill(color1);
    noStroke();
    arc(0, 0, ringRadius * 2, ringRadius * 2, currentAngle, currentAngle + angleStep, PIE);

    // Draw smooth gradient between rings
    drawGradient(currentAngle, currentAngle + angleStep, ringRadius, color1, color2);
  }
}

function drawGradient(startAngle, endAngle, radius, color1, color2) {
  let gradientSteps = 1000;
  let angleStep = (endAngle - startAngle) / gradientSteps;
  for (let i = 0; i < gradientSteps; i++) {
    let angle = startAngle + i * angleStep;
    let lerpedColor = lerpColor(color1, color2, i / (gradientSteps - 1));
    let x1 = cos(angle) * radius;
    let y1 = sin(angle) * radius;
    let x2 = cos(angle) * (radius - 100); // Increase the width for smoother gradient
    let y2 = sin(angle) * (radius - 100);
    strokeWeight(2);
    stroke(lerpedColor);
    line(x1, y1, x2, y2);
  }

  fill(244, 223, 198);
  noStroke();
  ellipse(0, 0, ringRadius);
}
