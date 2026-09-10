  let x,y;
    let diameter = 100
    let yV=5,xV=3
function setup(){
    createCanvas(windowWidth,windowHeight)
   
    y=diameter/2
    x=width/2
}

function draw(){
    background(100)
    fill(100,50,50)
    noStroke()
    ellipse(x,y,diameter)
    //x+=3
    x+=xV
    y+=yV

    if(y>height-diameter/2){
        yV = -yV;
    }
    if(y<diameter/2){
        yV = -yV;
    }
    if(x>width-diameter/2){
        xV = -xV;
    }
    if(x<diameter/2){
        xV = -xV;
    }
}
