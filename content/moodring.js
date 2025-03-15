function initMoodRing() {
    let ringColors = [];
    let colorActive = [];
    let colorNames = ["anger", "fear", "surprise", "disgust", "happy", "sad"];
    let ringRadius;
    let rotationAngle = 0;
    let buttons = [];

    const NUMBER_SQUARE_SIZE = 60;
    const TEXT_MARGIN = 20;
    const BUTTON_WIDTH = NUMBER_SQUARE_SIZE + TEXT_MARGIN + 160;
    const BUTTON_HEIGHT = 60;
    const BUTTON_MARGIN = 20;
    const BUTTON_RADIUS = 15;
    const INACTIVE_COLOR = 220;
    const DEFAULT_RING_COLOR = 180; // Grey color for inactive ring
    const SIDE_MARGIN = 100;
    const VERTICAL_OFFSET = 235; // Increased slightly to make room for text

    function drawRing(p) {
        let activeColors = ringColors.filter((color, index) => colorActive[index]);
        let activeColorCount = activeColors.length;

        if (activeColorCount === 0) {
            // Draw grey ring when no colors are active
            p.fill(DEFAULT_RING_COLOR);
            p.noStroke();
            p.arc(0, 0, ringRadius * 2, ringRadius * 2, 0, p.TWO_PI, p.PIE);
            
            // Draw grey gradient
            let gradientSteps = 1000;
            for (let i = 0; i < gradientSteps; i++) {
                let angle = (i / gradientSteps) * p.TWO_PI;
                p.strokeWeight(2);
                p.stroke(DEFAULT_RING_COLOR);
                let x1 = p.cos(angle) * ringRadius;
                let y1 = p.sin(angle) * ringRadius;
                let x2 = p.cos(angle) * (ringRadius - 100);
                let y2 = p.sin(angle) * (ringRadius - 100);
                p.line(x1, y1, x2, y2);
            }

            // Clear center
            p.push();
            p.drawingContext.globalCompositeOperation = 'destination-out';
            p.fill(255);
            p.noStroke();
            p.ellipse(0, 0, ringRadius);
            p.pop();
            
            return;
        }

        let angleStep = p.TWO_PI / activeColorCount;

        for (let i = 0; i < activeColorCount; i++) {
            let currentAngle = i * angleStep + rotationAngle;
            let colorIndex = i % activeColorCount;
            let color1 = activeColors[colorIndex];
            let color2 = activeColors[(colorIndex + 1) % activeColorCount];

            p.fill(color1);
            p.noStroke();
            p.arc(0, 0, ringRadius * 2, ringRadius * 2, currentAngle, currentAngle + angleStep, p.PIE);

            drawGradient(p, currentAngle, currentAngle + angleStep, ringRadius, color1, color2);
        }
    }

    function drawGradient(p, startAngle, endAngle, radius, color1, color2) {
        let gradientSteps = 1000;
        let angleStep = (endAngle - startAngle) / gradientSteps;
        for (let i = 0; i < gradientSteps; i++) {
            let angle = startAngle + i * angleStep;
            let lerpedColor = p.lerpColor(color1, color2, i / (gradientSteps - 1));
            let x1 = p.cos(angle) * radius;
            let y1 = p.sin(angle) * radius;
            let x2 = p.cos(angle) * (radius - 100);
            let y2 = p.sin(angle) * (radius - 100);
            p.strokeWeight(2);
            p.stroke(lerpedColor);
            p.line(x1, y1, x2, y2);
        }

        p.push();
        p.drawingContext.globalCompositeOperation = 'destination-out';
        p.fill(255);
        p.noStroke();
        p.ellipse(0, 0, radius);
        p.pop();
    }

    function drawButtons(p) {
        p.push();
        p.textSize(24);
        
        buttons.forEach((btn, index) => {
            const isRightSide = index >= 3;
            
            if (isRightSide) {
                p.noStroke();
                p.fill(colorActive[index] ? ringColors[index] : INACTIVE_COLOR);
                p.rect(btn.x, btn.y, NUMBER_SQUARE_SIZE, NUMBER_SQUARE_SIZE, BUTTON_RADIUS);
                
                p.push();
                p.textAlign(p.CENTER, p.CENTER);
                p.noStroke();
                p.fill(0);
                let numberX = btn.x + NUMBER_SQUARE_SIZE/2;
                let numberY = btn.y + NUMBER_SQUARE_SIZE/2;
                p.text(btn.number, numberX, numberY);
                p.pop();
                
                p.push();
                p.textAlign(p.LEFT, p.CENTER);
                p.noStroke();
                p.fill(0);
                p.text(btn.mood, btn.x + NUMBER_SQUARE_SIZE + TEXT_MARGIN, btn.y + NUMBER_SQUARE_SIZE/2);
                p.pop();
                
            } else {
                p.push();
                p.textAlign(p.RIGHT, p.CENTER);
                p.noStroke();
                p.fill(0);
                p.text(btn.mood, btn.x + BUTTON_WIDTH - NUMBER_SQUARE_SIZE - TEXT_MARGIN, btn.y + NUMBER_SQUARE_SIZE/2);
                p.pop();
                
                p.noStroke();
                p.fill(colorActive[index] ? ringColors[index] : INACTIVE_COLOR);
                p.rect(btn.x + BUTTON_WIDTH - NUMBER_SQUARE_SIZE, btn.y, NUMBER_SQUARE_SIZE, NUMBER_SQUARE_SIZE, BUTTON_RADIUS);
                
                p.push();
                p.textAlign(p.CENTER, p.CENTER);
                p.noStroke();
                p.fill(0);
                let numberX = btn.x + BUTTON_WIDTH - NUMBER_SQUARE_SIZE/2;
                let numberY = btn.y + NUMBER_SQUARE_SIZE/2;
                p.text(btn.number, numberX, numberY);
                p.pop();
            }
        });
        p.pop();
    }

    new p5(p => {
        function createButtons() {
            const ROWS = 3;
            
            // Calculate positions relative to the ring
            const leftColumnX = SIDE_MARGIN;
            const rightColumnX = p.width - SIDE_MARGIN - BUTTON_WIDTH;
            const startY = VERTICAL_OFFSET - (BUTTON_HEIGHT * ROWS + BUTTON_MARGIN * (ROWS - 1))/2;
            
            buttons = [];
            
            for (let i = 0; i < 6; i++) {
                let isRightSide = i >= 3;
                let row = i % 3;
                let x = isRightSide ? rightColumnX : leftColumnX;
                let y = startY + (row * (BUTTON_HEIGHT + BUTTON_MARGIN));
                
                buttons.push({
                    x: x,
                    y: y,
                    width: BUTTON_WIDTH,
                    height: BUTTON_HEIGHT,
                    number: i + 1,
                    mood: colorNames[i]
                });
            }
        }

        p.setup = function() {
            let container = document.getElementById('canvas-container');
            let canvas = p.createCanvas(1200, 800);
            canvas.parent(container);
            
            p.clear();
            
            ringColors[0] = p.color(255, 0, 0);
            ringColors[1] = p.color(255, 127, 0);
            ringColors[2] = p.color(0, 0, 255);
            ringColors[3] = p.color(255, 255, 0);
            ringColors[4] = p.color(255, 0, 255);
            ringColors[5] = p.color(0, 255, 255);

            colorActive = Array(ringColors.length).fill(false);
            ringRadius = p.height / 4;
            
            createButtons();
        };

        p.draw = function() {
            p.clear();
            p.translate(p.width / 2, VERTICAL_OFFSET);
            
            rotationAngle += 0.005;
            drawRing(p);
            
            p.resetMatrix();
            drawButtons(p);
            
            let isOverButton = buttons.some(btn => 
                p.mouseX >= btn.x && p.mouseX <= btn.x + btn.width &&
                p.mouseY >= btn.y && p.mouseY <= btn.y + btn.height
            );
            p.cursor(isOverButton ? 'pointer' : 'default');
        };

        p.mousePressed = function() {
            buttons.forEach((btn, index) => {
                if (p.mouseX >= btn.x && p.mouseX <= btn.x + btn.width &&
                    p.mouseY >= btn.y && p.mouseY <= btn.y + btn.height) {
                    colorActive[index] = !colorActive[index];
                }
            });
        };

        p.keyPressed = function() {
            let colorIndex = parseInt(p.key) - 1;
            if (colorIndex >= 0 && colorIndex <= 5) {
                colorActive[colorIndex] = !colorActive[colorIndex];
            }
        };
    }, 'canvas-container');
}

// Initialize immediately when script loads
initMoodRing();
