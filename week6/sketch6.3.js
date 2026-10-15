let frames=[]
let meteors=[]

let counter=0
let scene=1
let transitionX
let rotation=0

async function setup(){
    createCanvas(windowWidth,windowHeight)
    frameRate(30)
    imageMode(CENTER)
    angleMode(DEGREES)

    transitionX=-width

    for(let i=1;i<=36;i++){
        let num=String(i).padStart(4,"0")
        let img=await loadImage("png_frames/frame_"+num+".png")
        frames.push(img)
    }
}

function draw(){

    if(scene==1){
        animationSketch()
    }

    if(scene==2){
        background(255)
        meteorSketch()
    }
}

function animationSketch(){
    background(200)

    let currentFrame=frames[min(floor(counter),frames.length-1)]
    let scene1X=0

    if(counter>=12){
        transitionX=map(counter,12,35,-width,0)
        transitionX=constrain(transitionX,-width,0)
        scene1X=transitionX+width
    }

    drawAnimationFrame(currentFrame,scene1X)

    if(counter>=12){
        push()
        translate(transitionX,0)

        fill(255)
        noStroke()
        rect(0,0,width,height)

        meteorSketch()

        pop()
    }

    counter++

    if(counter>=frames.length){
        transitionX=0
        scene=2
    }
}

function drawAnimationFrame(img,x){
    let scaleFactor=max(width/img.width,height/img.height)
    let w=img.width*scaleFactor
    let h=img.height*scaleFactor

    image(img,width/2+x,height/2,w,h)
}

function meteorSketch(){

    let d=dist(mouseX,mouseY,width/2,height/2)
    let speed=map(d,0,300,3,0.1)
    speed=constrain(speed,0.1,3)

    rotation+=speed

    if(random(1)<0.15){
        meteors.push(new Meteor(random(width*0.3,width+200),random(-200,-50)))
    }

    for(let i=meteors.length-1;i>=0;i--){
        meteors[i].move()
        meteors[i].display()

        if(meteors[i].y>height+300||meteors[i].x<-300){
            meteors.splice(i,1)
        }
    }
}

function mouseDragged(){

    if(scene===2){
        meteors.push(new Meteor(mouseX,mouseY))
    }
}

class Meteor{

    constructor(x,y){
        this.x=x
        this.y=y
        this.speed=random(5,10)
        this.scale=random(0.25,0.6)
        this.offset=random(360)
        this.col=color(random(255),random(255),random(255))
        this.strokeWeight=random(0.5,2)
    }

    move(){
        this.x-=this.speed*0.5
        this.y+=this.speed
    }

    display(){
        push()

        translate(this.x,this.y)
        scale(this.scale)

        stroke(this.col)
        strokeWeight(this.strokeWeight)
        noFill()

        for(let i=0;i<12;i++){
            let wave=sin(frameCount*2+i*30+this.offset)
            let radius=30+i*10+wave*8

            push()
            rotate(rotation*(i+1)*0.15)
            star(radius)
            pop()
        }

        pop()
    }
}

function star(radius){
    triangle(0,-radius,-radius*0.8,radius/2,radius*0.8,radius/2)
    triangle(0,radius,-radius*0.8,-radius/2,radius*0.8,-radius/2)
}

function keyPressed(){

    if(scene===2&&(key==="r"||key==="R")){
        counter=0
        transitionX=-width
        meteors=[]
        scene=1
    }
}