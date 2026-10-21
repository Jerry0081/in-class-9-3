let flowers = []
let paintBrush

function setup() {
    createCanvas(windowWidth, windowHeight)
    angleMode(DEGREES)

    for (let i = 0; i < 50; i++) {
        flowers.push(new Flower(random(width), random(height)))
    }

    paintBrush = new PaintBrush()
}

function draw() {
    background(20, 35, 29)

    // Display and animate the roses
    for (let i = 0; i < flowers.length; i++) {
        let d = map(mouseX, 0, width, -2, 2)
        flowers[i].move(d)
        flowers[i].paint(paintBrush.tipX, paintBrush.tipY)
        flowers[i].display()
    }

    // Draw the brush above the roses
    paintBrush.move()
    paintBrush.display()
}

function mouseDragged() {
    flowers.push(new Flower(mouseX, mouseY))
}

class Flower {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.size = random(0.65, 1.1)
        this.rotations = random(360)
        this.rV = random(-0.5, 0.5)

        this.xV = random(-1.2, 1.2)
        this.yV = random(-1.2, 1.2)

        // Each petal has its own painting progress
        this.petals = []

        // Inner petals curl around the rose's center
        this.addLayer(5, 7, 10, 20, 18)

        // Middle petals overlap to build the rose shape
        this.addLayer(8, 20, 15, 29, 25)

        // Outer petals open outward
        this.addLayer(10, 36, 20, 37, 31)

        this.centerCol = color(120, 35, 35)
    }

    addLayer(count, radius, width, length, petalWidth) {
        for (let i = 0; i < count; i++) {
            this.petals.push({
                angle: (360 / count) * i + random(-12, 12),
                radius: radius,
                length: length,
                width: petalWidth,
                layerWidth: width,
                painted: random() < 0.08 ? 1 : 0,
                dots: random() < 0.3
            })
        }
    }

    move(d) {
        this.x += this.xV
        this.y += this.yV
        this.rotations += this.rV * d

        if (this.x > width + 100) this.x = -100
        if (this.x < -100) this.x = width + 100
        if (this.y > height + 100) this.y = -100
        if (this.y < -100) this.y = height + 100
    }

    paint(brushX, brushY) {
        // Check whether the brush touches each petal
        for (let p of this.petals) {
            let a = this.rotations + p.angle

            let px = this.x + cos(a) * (p.radius + p.length * 0.25) * this.size
            let py = this.y + sin(a) * (p.radius + p.length * 0.25) * this.size

            let distanceToBrush = dist(px, py, brushX, brushY)

            if (distanceToBrush < 19 * this.size) {
                p.painted = min(1, p.painted + 0.045)
            }
        }
    }

    display() {
        push()
        translate(this.x, this.y)
        rotate(this.rotations)
        scale(this.size)

        // A small green calyx beneath the rose
        noStroke()
        fill(55, 105, 58)

        for (let i = 0; i < 5; i++) {
            push()
            rotate(i * 72)
            triangle(-3, 5, 4, 12, 13, 2)
            pop()
        }

        // Draw the petals from the outside inward
        for (let p of this.petals) {
            push()
            rotate(p.angle)
            translate(p.radius, 0)

            let white = color(255, 244, 224)
            let redPetal = color(190, 27, 48)
            let petalColor = lerpColor(white, redPetal, p.painted)

            // Layered, curved petal silhouette
            fill(petalColor)
            stroke(112, 49, 49)
            strokeWeight(1)

            beginShape()
            vertex(-p.width * 0.3, -p.width * 0.15)

            bezierVertex(
                -p.width * 0.7, -p.width * 1.1,
                p.length * 0.35, -p.width * 1.05,
                p.length, 0
            )

            bezierVertex(
                p.length * 0.5, p.width * 0.9,
                -p.width * 0.6, p.width * 0.8,
                -p.width * 0.3, -p.width * 0.15
            )

            endShape(CLOSE)

            // Decorative, imperfect polka dots
            if (p.dots) {
                noStroke()

                let dotColor = p.painted > 0.5
                    ? color(255, 244, 224)
                    : color(190, 27, 48)

                fill(dotColor)
                circle(p.length * 0.3, -p.width * 0.15, 3.5)
                circle(p.length * 0.58, p.width * 0.12, 4)
            }

            pop()
        }

        // Curled spiral at the center of the rose
        noFill()
        stroke(105, 27, 37)
        strokeWeight(2)

        beginShape()
        for (let a = 0; a < 540; a += 8) {
            let r = map(a, 0, 540, 1, 11)
            vertex(cos(a) * r, sin(a) * r)
        }
        endShape()

        // Small golden pollen details
        noStroke()
        fill(238, 190, 73)
        circle(-3, -2, 2.5)
        circle(4, 3, 2.5)

        pop()
    }
}

class PaintBrush {
    constructor() {
        this.x = 0
        this.y = height * 0.5
        this.tipX = this.x
        this.tipY = this.y

        this.previousX = 0
        this.previousY = 0
        this.angle = 0
    }

    move() {
        this.previousX = this.x
        this.previousY = this.y

        // Float from one side of the canvas to the other
        this.x = (frameCount * 2.5) % (width + 120) - 60

        // Gentle, Wonderland-like floating movement
        this.y = height * 0.5
            + sin(frameCount * 1.2) * height * 0.28
            + sin(frameCount * 0.45) * 35

        // Point the bristles toward the direction of travel
        this.angle = atan2(
            this.y - this.previousY,
            this.x - this.previousX
        )

        // The brush tip sits at the lower end of the handle
        this.tipX = this.x + cos(this.angle + 90) * 27
        this.tipY = this.y + sin(this.angle + 90) * 27
    }

    display() {
        push()
        translate(this.x, this.y)
        rotate(this.angle + 90)

        // Soft shadow
        noStroke()
        fill(0, 0, 0, 65)
        ellipse(4, 0, 12, 65)

        // Wooden brush handle
        stroke(112, 67, 35)
        strokeWeight(10)
        strokeCap(ROUND)
        line(0, -35, 0, 18)

        // Wooden highlight
        stroke(214, 155, 83)
        strokeWeight(2)
        line(-2, -30, -2, 10)

        // Metal ferrule
        stroke(185, 184, 157)
        strokeWeight(9)
        line(0, 14, 0, 26)

        stroke(95, 93, 80)
        strokeWeight(1)
        line(-4, 18, 4, 18)
        line(-4, 23, 4, 23)

        // Red paint-loaded bristles
        noStroke()
        fill(190, 27, 48)

        beginShape()
        vertex(-5, 25)
        bezierVertex(-6, 32, -3, 40, 0, 44)
        bezierVertex(3, 40, 6, 32, 5, 25)
        endShape(CLOSE)

        // A small wet paint highlight
        fill(242, 105, 116)
        ellipse(-1, 32, 2, 7)

        pop()
    }
}