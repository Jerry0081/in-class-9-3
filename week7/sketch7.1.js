let pMapper
let quadMap,quadMap2,quadMap3,quadMap4

let starBuf,animationBuf,transitionBuf,flowerBuf

let frames=[]
let flowers=[]

let rotation=0
let animationCounter=0

let transitionMeteors=[]
let transitionCounter=0
let transitionScene=1
let transitionX=0
let transitionRotation=0

async function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL)

    pMapper=createProjectionMapper(this)

    quadMap=pMapper.createQuadMap(400,400,20,20)
    quadMap2=pMapper.createQuadMap(600,400,20,20)
    quadMap3=pMapper.createQuadMap(600,400,20,20)
    quadMap4=pMapper.createQuadMap(500,500,20,20)

    starBuf=createGraphics(400,400)
    animationBuf=createGraphics(600,400)
    transitionBuf=createGraphics(600,400)
    flowerBuf=createGraphics(500,500)

    starBuf.angleMode(DEGREES)
    transitionBuf.angleMode(DEGREES)
    flowerBuf.angleMode(DEGREES)

    animationBuf.imageMode(CENTER)
    transitionBuf.imageMode(CENTER)

    for(let i=1;i<=36;i++){
        let num=String(i).padStart(4,"0")
        let img=await loadImage("png_frames/frame_"+num+".png")
        frames.push(img)
    }

    for(let i=0;i<15;i++){
        flowers.push(new Flower(random(flowerBuf.width),random(flowerBuf.height)))
    }

    transitionX=-transitionBuf.width
}

function draw(){
    background(0)

    sinStarSketch(starBuf)
    animationSketch(animationBuf)
    transitionSketch(transitionBuf)
    flowerSketch(flowerBuf)

    quadMap.displayTexture(starBuf)
    quadMap2.displayTexture(animationBuf)
    quadMap3.displayTexture(transitionBuf)
    quadMap4.displayTexture(flowerBuf)
}

function sinStarSketch(pg){
    pg.background(0)

    let d=dist(mouseX,mouseY,width/2,height/2)
    let speed=map(d,0,300,3,0.1)
    speed=constrain(speed,0.1,3)

    rotation+=speed

    pg.push()
    pg.translate(pg.width/2,pg.height/2)

    pg.stroke(255)
    pg.strokeWeight(0.5)
    pg.noFill()

    for(let i=0;i<12;i++){
        let wave=sin(frameCount*2+i*30)
        let radius=30+i*10+wave*8

        pg.push()
        pg.rotate(rotation*(i+1)*0.15)
        star(pg,radius)
        pg.pop()
    }

    pg.pop()
}

function animationSketch(pg){
    pg.background(200)

    if(frames.length===0){
        return
    }

    let frameIndex=floor(animationCounter)%frames.length
    let currentFrame=frames[frameIndex]

    let scaleFactor=max(pg.width/currentFrame.width,pg.height/currentFrame.height)
    let w=currentFrame.width*scaleFactor
    let h=currentFrame.height*scaleFactor

    pg.image(currentFrame,pg.width/2,pg.height/2,w,h)

    animationCounter+=0.5
}

function transitionSketch(pg){

    if(transitionScene==1){
        transitionAnimation(pg)
    }

    if(transitionScene==2){
        pg.background(255)
        transitionMeteor(pg)
    }
}

function transitionAnimation(pg){
    pg.background(200)

    if(frames.length===0){
        return
    }

    let currentFrame=frames[min(floor(transitionCounter),frames.length-1)]
    let scene1X=0

    if(transitionCounter>=12){
        transitionX=map(transitionCounter,12,35,-pg.width,0)
        transitionX=constrain(transitionX,-pg.width,0)
        scene1X=transitionX+pg.width
    }

    drawTransitionFrame(pg,currentFrame,scene1X)

    if(transitionCounter>=12){
        pg.push()

        pg.translate(transitionX,0)

        pg.fill(255)
        pg.noStroke()
        pg.rect(0,0,pg.width,pg.height)

        transitionMeteor(pg)

        pg.pop()
    }

    transitionCounter++

    if(transitionCounter>=frames.length){
        transitionX=0
        transitionScene=2
    }
}

function drawTransitionFrame(pg,img,x){
    let scaleFactor=max(pg.width/img.width,pg.height/img.height)
    let w=img.width*scaleFactor
    let h=img.height*scaleFactor

    pg.image(img,pg.width/2+x,pg.height/2,w,h)
}

function transitionMeteor(pg){

    let speed=1
    transitionRotation+=speed

    if(random(1)<0.15){
        transitionMeteors.push(new TransitionMeteor(random(pg.width*0.3,pg.width+200),random(-200,-50)))
    }

    for(let i=transitionMeteors.length-1;i>=0;i--){
        transitionMeteors[i].move()
        transitionMeteors[i].display(pg)

        if(transitionMeteors[i].y>pg.height+300||transitionMeteors[i].x<-300){
            transitionMeteors.splice(i,1)
        }
    }
}

function flowerSketch(pg){
    pg.background(0)

    for(let i=0;i<flowers.length;i++){
        flowers[i].move(pg)
        flowers[i].display(pg)
    }
}

function star(pg,radius){
    pg.triangle(0,-radius,-radius*0.8,radius/2,radius*0.8,radius/2)
    pg.triangle(0,radius,-radius*0.8,-radius/2,radius*0.8,-radius/2)
}

function transitionStar(pg,radius){
    pg.triangle(0,-radius,-radius*0.8,radius/2,radius*0.8,radius/2)
    pg.triangle(0,radius,-radius*0.8,-radius/2,radius*0.8,-radius/2)
}

class TransitionMeteor{

    constructor(x,y){
        this.x=x
        this.y=y
        this.speed=random(5,10)
        this.scale=random(0.25,0.6)
        this.offset=random(360)
        this.col=color(random(255),random(255),random(255))
        this.weight=random(0.5,2)
    }

    move(){
        this.x-=this.speed*0.5
        this.y+=this.speed
    }

    display(pg){
        pg.push()

        pg.translate(this.x,this.y)
        pg.scale(this.scale)

        pg.stroke(this.col)
        pg.strokeWeight(this.weight)
        pg.noFill()

        for(let i=0;i<12;i++){
            let wave=sin(frameCount*2+i*30+this.offset)
            let radius=30+i*10+wave*8

            pg.push()
            pg.rotate(transitionRotation*(i+1)*0.15)
            transitionStar(pg,radius)
            pg.pop()
        }

        pg.pop()
    }
}

class Flower{

    constructor(x,y){
        this.x=x
        this.y=y
        this.numPetals=random(3,16)
        this.petalWidth=random(20,40)
        this.petalLength=random(30,80)
        this.centerDiameter=random(30,40)
        this.centerCol=color(random(255),random(255),random(255))
        this.petalCol=color(random(255),random(255),random(255))
        this.xV=random(-3,3)
        this.yV=random(-3,3)
        this.rV=random(-3,3)
        this.rotations=0
    }

    move(pg){
        this.x+=this.xV
        this.y+=this.yV
        this.rotations+=this.rV

        if(this.x<0||this.x>pg.width){
            this.xV*=-1
        }

        if(this.y<0||this.y>pg.height){
            this.yV*=-1
        }
    }

    display(pg){
        pg.push()

        pg.translate(this.x,this.y)
        pg.rotate(this.rotations)

        pg.noStroke()
        pg.fill(this.petalCol)

        for(let r=0;r<this.numPetals;r++){
            pg.push()
            pg.rotate((360/this.numPetals)*r)
            pg.translate(this.petalLength/2,0)
            pg.ellipse(0,0,this.petalLength,this.petalWidth)
            pg.pop()
        }

        pg.fill(this.centerCol)
        pg.ellipse(0,0,this.centerDiameter)

        pg.pop()
    }
}

function mouseDragged(){
    if(transitionScene==2){
        transitionMeteors.push(new TransitionMeteor(random(transitionBuf.width),random(transitionBuf.height)))
    }

    flowers.push(new Flower(random(flowerBuf.width),random(flowerBuf.height)))
}

function keyPressed(){

    if(key=="c"){
        pMapper.toggleCalibration()
    }

    if(key=="s"){
        pMapper.save("map.json")
    }

    if(key=="l"){
        pMapper.load("maps/map.json")
    }

    if(key=="f"){
        fullscreen(!fullscreen())
    }

    if(key=="r"||key=="R"){
        transitionCounter=0
        transitionX=-transitionBuf.width
        transitionMeteors=[]
        transitionScene=1
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight)
}