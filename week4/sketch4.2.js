let r = 0
let numRects = 20
let w
let h


function setup(){

    createCanvas(windowWidth, windowHeight, SVG)

    rectMode(CENTER)
    angleMode(DEGREES)

    noFill()
    strokeWeight(3)

    w = width / numRects
    h = height / numRects
}


function draw(){

    background(40, 55, 40)

    drawPattern()

    r += 3
}


function drawPattern(){

    let warmColor = color(255, 100, 30)
    let coldColor = color(40, 150, 255)

    push()

    translate(w/2, h/2)

    for(let x = 0; x < numRects; x++){

        for(let y = 0; y < numRects; y++){

            let px = w * x
            let py = h * y

            let d = dist(mouseX, mouseY, px, py)

            d = map(d, 0, 1000, 1, 0)
            d = constrain(d, 0, 1)

            let c = lerpColor(warmColor,coldColor,d)

            stroke(c)

            push()

            translate(px, py)

            let size = map(d,0,1,0.5,2.5)

            let round = map(d,0,1,0,25)

            rotate(r * d)

            rect(0,0,w * size,h * size,round)

            pop()
        }
    }

    pop()
}


function keyPressed(){

    if(key === 's' || key === 'S'){
        save("generative-pattern.svg")
    }

}


function saveSVG(){

    beginRecordSVG(
        this,
        "generative-pattern.svg"
    )

    drawPattern()

    endRecordSVG()

}