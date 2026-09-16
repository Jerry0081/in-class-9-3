let x
let y
let xV = 5
let yV = 5
let diameter = 100

function setup() {
    createCanvas(windowWidth, windowHeight)
    noStroke()
    y = diameter / 2
    x = width / 2
}

function draw() {

    let r = map(y, diameter / 2, height - diameter / 2, 0, 255)
    let b = map(x,diameter / 2, height - diameter / 2, 0, 255)
   
    fill(r, 0, b)
    ellipse(x, y, diameter)
    x+=xV
    y+=yV

    if (y > height - diameter/2){
        yV = -yV
    }
    if (y < diameter/2){
        yV = -yV
    }
    if (x > width - diameter/2){
        xV = -xV
    }
    if (x < diameter/2){
        xV = -xV
    }

}
function keyPressed(){
    background(255)
}