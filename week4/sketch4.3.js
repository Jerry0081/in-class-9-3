let r=0

function setup(){
    createCanvas(windowWidth, windowHeight)
    rectMode(CENTER)
    angleMode(DEGREES)
}

function draw(){
    background(30)

    translate(width/2, height/2)

    fill(100)
    stroke(255)
    strokeWeight(5)
    rect(0,0,500,400,50)

    fill(255)
    stroke(255)
    triangle(-150,-100,-100,-100,-125,-50)
    triangle(100,-100,150,-100,125,-50)

    push()
    translate(-125,-75)
    rotate(r)
    stroke(255,0,0)
    strokeWeight(8)
    line(0,0,400,0)
    pop()

    push()
    translate(125,-75)
    rotate(-r)
    stroke(255,0,0)
    strokeWeight(8)
    line(0,0,400,0)
    pop()

    noFill()
    stroke(255)
    strokeWeight(4)
    //rect(0,90,350,130)

    let bite=sin(r*3)*20
    fill(255)
    noStroke()

    triangle(-140,40+bite,-100,40+bite,-120,90+bite)
    triangle(-80,40+bite,-40,40+bite,-60,90+bite)
    triangle(-20,40+bite,20,40+bite,0,90+bite)
    triangle(40,40+bite,80,40+bite,60,90+bite)
    triangle(100,40+bite,140,40+bite,120,90+bite)

    triangle(-110, 160-bite, -70, 160-bite, -90, 110-bite)
    triangle(-50, 160-bite, -10, 160-bite, -30, 110-bite)
    triangle(10, 160-bite, 50, 160-bite, 30, 110-bite)
    triangle(70, 160-bite, 110, 160-bite, 90, 110-bite)
    
    r++

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