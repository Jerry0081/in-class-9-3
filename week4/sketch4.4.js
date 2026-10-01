let rotation=0

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
    let speed=map(d,0,30,3,0.1)
    speed=constrain(speed,0.1,3)

    rotation+=speed

    push()
    translate(width/2,height/2)

    for(let i=0;i<12;i++){
        let wave=sin(frameCount*2+i*30)
        let radius=30+i*10+wave*8

        push()

        rotate(rotation*(i+1)*0.15)
        star(radius)

        pop()
    }

    pop()
}

function star(radius){

    triangle(0,-radius,-radius*0.8,radius/2,radius*0.8,radius/2)
    triangle(0,radius,-radius*0.8,-radius/2,radius*0.8,-radius/2)
}

function keyPressed(){

    if(key==='s'||key==='S'){
        save("sin-star-pattern.svg")
    }
}