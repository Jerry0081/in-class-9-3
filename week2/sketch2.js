  let x,y
    let diameter = 100
    let yV=10,xV=20
function setup(){
    createCanvas(windowWidth,windowHeight)
   
    y=diameter/2
    x=width/2
}

function draw(){
    background(50)
    ellipse(x,y,diameter)
    
    x+=xV
    y+=yV

    if(y>height-diameter/2){
        fill(255,0,0)
        yV = -yV
        xV = random(-10,20)

    }
    if(y<diameter/2){
        fill(0,255,0)
        yV = -yV
        xV = random(-10,20)
    }
    if(x>width-diameter/2){
        fill(0,0,255)
        xV = -xV
        yV = random(-10,20)
    }
    if(x<diameter/2){
        xV = -xV
        yV = random(-10,20)
    }
}
