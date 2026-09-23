let x=0
let lerpedMouseX = 0
let lerpedMouseY = 0

function setup(){

    createCanvas(windowWidth,windowHeight)

    rectMode(CENTER)
    angleMode(DEGREES)
}

function draw(){

    background(0)
    stroke(255)
    strokeWeight(2)
    noFill()

    //push()
   // translate(x,height/2)
   // rect(0,0,50)
    //pop()

    //push()
    //translate(0,heoight/2)
    //rect(0,0,50)
    //pop()

    //x=lerp(0,width,0.5)

  //  push()
   // translate(0,heoight/2)
   // rect(0,0,50)
  //  pop()

    lerpedMouseX=lerp(lerpedMouseX,mouseX,0.05)
    lerpedMouseY=lerp(lerpedMouseY,mouseY,0.05)

    push()
    translate(lerpedMouseX,lerpedMouseY)
    rect(0,0,50,11,10)
    pop()
}