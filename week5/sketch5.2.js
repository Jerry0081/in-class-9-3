let rotation=0
let amount=26

function setup(){
    createCanvas(600,600,SVG)
    angleMode(DEGREES)
    noFill()
    stroke(255)
    strokeWeight(0.5)
}

function draw(){
    background(0)

    let d=dist(mouseX,mouseY,width/2,height/2)
    let speed=map(d,0,400,3,0.1)
    speed=constrain(speed,0.1,3)

    rotation+=speed

    push()
    translate(width/2,height/2)

    for(let i=0;i<3;i++){
        push()
        rotate(i*120)
        vortex()
        pop()
    }

    pop()
}

function vortex(){

    for(let i=0;i<amount;i++){

        let angle=i*(360/amount)+rotation
        let wave=sin(frameCount*2+i*25)

        let distance=40+i*9+wave*10

        let x=cos(angle)*distance
        let y=sin(angle)*distance

        let centerD=dist(x,y,0,0)
        let centerScale=map(centerD,40,220,0.5,0.08)
        centerScale=constrain(centerScale,0.08,0.5)

        push()
        translate(x,y)
        rotate(angle+rotation*2)
        scale(centerScale+wave*0.02)

        pattern(i)

        pop()
    }
}

function pattern(offset){

    for(let i=0;i<8;i++){

        let wave=sin(frameCount*2+i*35+offset*20)
        let radius=25+i*9+wave*7

        push()
        rotate(rotation*(i+1)*0.08)
        star(radius)
        pop()
    }
}

function star(radius){
    triangle(0,-radius,-radius*0.8,radius/2,radius*0.8,radius/2)
    triangle(0,radius,-radius*0.8,-radius/2,radius*0.8,-radius/2)
}

function keyPressed(){
    if(key==='s'||key==='S'){
        save("triple-vortex.svg")
    }
}