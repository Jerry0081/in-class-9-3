let pMapper
let quadMap,quadMap2,quadMap3,quadMap4,quadMap5
let tunnelBuf,wormBuf,transitionBuf,eyeBuf,mushroomBuf
let snakeLayer,wormLayer1,wormLayer2

let tunnelFlowers=[]
let cards=[]
let eyes=[]
let mushrooms=[]
let spores=[]

let rabbitX=200
let rabbitY=200
let rabbitSpeed=5

let mushroomRabbitX=120
let mushroomRabbitY=300
let mushroomRabbitSpeed=4
let mushroomRabbitAngle=0
let mushroomTime=0
let nextMushroomTime=0

let tunnelRotation=0
let tunnelSize=30

let xLoc=[]
let yLoc=[]
let numSegments=250
let snakeCounter=0

let wormXLoc=[]
let wormYLoc=[]
let wormNumSegments=100
let wormCounter=0

let cardTimer=0
let cardCycleLength=260

let eyeOffset=0
let eyeShift=0
let eyeFrame=0

function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL)
    angleMode(DEGREES)

    pMapper=createProjectionMapper(this)

    quadMap=pMapper.createQuadMap(600,600,20,20)
    quadMap2=pMapper.createQuadMap(600,400,20,20)
    quadMap3=pMapper.createQuadMap(600,400,20,20)
    quadMap4=pMapper.createQuadMap(600,400,20,20)
    quadMap5=pMapper.createQuadMap(600,400,20,20)

    tunnelBuf=createGraphics(600,600)
    wormBuf=createGraphics(600,400)
    transitionBuf=createGraphics(600,400)
    eyeBuf=createGraphics(600,400)
    mushroomBuf=createGraphics(600,400)

    snakeLayer=createGraphics(600,600)
    wormLayer1=createGraphics(600,400)
    wormLayer2=createGraphics(600,400)

    tunnelBuf.angleMode(DEGREES)
    transitionBuf.angleMode(DEGREES)
    mushroomBuf.angleMode(DEGREES)

    rabbitX=tunnelBuf.width/2
    rabbitY=tunnelBuf.height/2

    mushroomRabbitX=mushroomBuf.width*0.2
    mushroomRabbitY=mushroomBuf.height*0.75

    for(let i=0;i<numSegments;i++){
        xLoc[i]=rabbitX
        yLoc[i]=rabbitY
    }

    for(let i=0;i<wormNumSegments;i++){
        wormXLoc[i]=wormBuf.width/2
        wormYLoc[i]=wormBuf.height/2
    }

    for(let i=0;i<30;i++){
        tunnelFlowers.push(new TunnelFlower())
    }

    for(let row=0;row<2;row++){
        for(let col=0;col<7;col++){
            cards.push({
                x:45+col*85,
                y:110+row*180,
                delay:col*10+row*8
            })
        }
    }

    for(let i=7;i>=0;i--){
        eyes.push(makeEyes(i*0.13))
    }

    for(let i=0;i<12;i++){
        mushrooms.push({
            x:random(mushroomBuf.width),
            y:random(mushroomBuf.height*0.35,mushroomBuf.height*0.85),
            size:random(0.6,1.5),
            hue:random([285,320,190,45])
        })
    }

    for(let i=0;i<70;i++){
        spores.push({
            x:random(mushroomBuf.width),
            y:random(mushroomBuf.height),
            size:random(2,6),
            speed:random(0.3,1.2),
            phase:random(360)
        })
    }

    nextMushroomTime=millis()+random(1000,3000)
}

function draw(){
    background(0)

    rabbitTunnelSketch(tunnelBuf)
    plaidWormSketch(wormBuf)
    transitionSketch(transitionBuf)
    eyeTunnelSketch(eyeBuf)
    mushroomForestSketch(mushroomBuf)

    quadMap.displayTexture(tunnelBuf)
    quadMap2.displayTexture(wormBuf)
    quadMap3.displayTexture(transitionBuf)
    quadMap4.displayTexture(eyeBuf)
    quadMap5.displayTexture(mushroomBuf)
}

function rabbitTunnelSketch(pg){
    pg.background(35,20,55)

    drawTunnel(pg)
    drawSnake(pg)

    for(let i=0;i<tunnelFlowers.length;i++){
        tunnelFlowers[i].move(pg)
        tunnelFlowers[i].display(pg)
    }

    if(keyIsDown(LEFT_ARROW)) rabbitX-=rabbitSpeed
    if(keyIsDown(RIGHT_ARROW)) rabbitX+=rabbitSpeed
    if(keyIsDown(UP_ARROW)) rabbitY-=rabbitSpeed
    if(keyIsDown(DOWN_ARROW)) rabbitY+=rabbitSpeed

    rabbitX=constrain(rabbitX,15,pg.width-15)
    rabbitY=constrain(rabbitY,15,pg.height-15)

    drawRabbit(pg,rabbitX,rabbitY)
}

function drawTunnel(pg){
    pg.push()
    pg.translate(pg.width/2,pg.height/2)
    pg.noFill()
    pg.strokeWeight(4)

    for(let i=0;i<12;i++){
        let ringSize=tunnelSize+i*55

        pg.stroke(150+i*7,100+i*5,200+i*4)

        pg.push()
        pg.rotate(tunnelRotation+i*12)
        pg.ellipse(0,0,ringSize*1.2,ringSize)
        pg.pop()
    }

    pg.pop()

    tunnelRotation+=0.5
    tunnelSize+=0.8

    if(tunnelSize>100) tunnelSize=30
}

function drawSnake(pg){
    snakeLayer.clear()
    snakeLayer.noStroke()

    let x=pg.width*noise(snakeCounter+10)
    let y=pg.height*noise(snakeCounter)

    for(let i=numSegments-1;i>0;i--){
        xLoc[i]=xLoc[i-1]
        yLoc[i]=yLoc[i-1]
    }

    xLoc[0]=x
    yLoc[0]=y

    for(let i=0;i<numSegments;i++){
        let t=map(i,0,numSegments-1,0,180)
        let diameter=100*sin(t)
        let r=255*sin(t)
        let g=255-r

        snakeLayer.fill(r,g,180,210)
        snakeLayer.ellipse(xLoc[i],yLoc[i],diameter,diameter)
    }

    pg.image(snakeLayer,0,0)
    snakeCounter+=0.01
}

function drawRabbit(pg,x,y){
    pg.push()
    pg.translate(x,y)
    pg.noStroke()

    pg.fill(255,200,200)
    pg.ellipse(-8,-18,9,24)
    pg.ellipse(8,-18,9,24)

    pg.fill(225,155,175)
    pg.ellipse(-7,-17,4,16)
    pg.ellipse(7,-17,4,16)

    pg.fill(255,245,230)
    pg.ellipse(0,5,25,34)
    pg.ellipse(0,-12,22,22)

    pg.fill(255)
    pg.ellipse(0,24,10,10)

    pg.fill(55,35,55)
    pg.ellipse(-5,-13,3,3)
    pg.ellipse(5,-13,3,3)

    pg.pop()
}

class TunnelFlower{
    constructor(){
        this.reset()
    }

    reset(){
        this.angle=random(360)
        this.distance=random(20,180)
        this.speed=random(0.5,1.5)
        this.size=random(8,30)
        this.rotation=random(360)
        this.rotationSpeed=random(-1,2)
        this.petalCol=color(random(180,255),random(130,210),random(186,255))
    }

    move(pg){
        this.distance+=this.speed
        this.angle+=0.2
        this.rotation+=this.rotationSpeed

        if(this.distance>max(pg.width,pg.height)/2+50){
            this.reset()
        }
    }

    display(pg){
        pg.push()
        pg.translate(pg.width/2,pg.height/2)

        let x=cos(this.angle)*this.distance
        let y=sin(this.angle)*this.distance

        pg.translate(x,y)
        pg.rotate(this.rotation)
        pg.noStroke()
        pg.fill(this.petalCol)

        for(let i=0;i<6;i++){
            pg.push()
            pg.rotate(i*60)
            pg.ellipse(this.size/2,0,this.size,this.size/2)
            pg.pop()
        }

        pg.fill(255,220,120)
        pg.ellipse(0,0,this.size/2)

        pg.pop()
    }
}

function plaidWormSketch(pg){
    pg.background(12,3,12)

    wormLayer2.clear()
    wormLayer2.noStroke()

    let rows=9
    let cols=15
    let spacingX=pg.width/cols
    let spacingY=pg.height/rows

    for(let y=0;y<rows;y++){
        for(let x=0;x<cols;x++){
            let dotX=x*spacingX+spacingX/2
            let dotY=y*spacingY+spacingY/2

            if(y%2==1) dotX+=spacingX/2

            let flicker=Math.sin(frameCount*0.08+x*1.7+y*2.3)
            let pulse=map(flicker,-1,1,60,255)
            let distanceToMouse=dist(mouseX,mouseY,dotX,dotY)
            let spotlight=constrain(map(distanceToMouse,0,250,255,20),20,255)
            let glow=max(pulse,spotlight)
            let dotSize=10+map(flicker,-1,1,2,8)

            if((x+y)%3==0){
                wormLayer2.fill(255,45,155,glow)
            }else if((x+y)%3==1){
                wormLayer2.fill(255,145,205,glow)
            }else{
                wormLayer2.fill(180,25,100,glow)
            }

            wormLayer2.circle(dotX,dotY,dotSize)
        }
    }

    wormLayer1.clear()

    let headX=map(noise(wormCounter),0,1,pg.width*0.1,pg.width*0.9)
    let headY=map(noise(wormCounter+100),0,1,pg.height*0.1,pg.height*0.9)

    wormXLoc[wormNumSegments-1]=headX
    wormYLoc[wormNumSegments-1]=headY

    for(let i=0;i<wormNumSegments-1;i++){
        wormXLoc[i]=wormXLoc[i+1]
        wormYLoc[i]=wormYLoc[i+1]
    }

    for(let i=0;i<wormNumSegments;i++){
        let diameter=65*sin(map(i,0,wormNumSegments-1,0,180))

        if(diameter<1) continue

        let pinkBand=floor(i/8)%2==0

        if(pinkBand){
            wormLayer1.fill(255,45,155)
            wormLayer1.stroke(255,190,225)
        }else{
            wormLayer1.fill(255)
            wormLayer1.stroke(255,45,155)
        }

        wormLayer1.strokeWeight(1)
        wormLayer1.ellipse(wormXLoc[i],wormYLoc[i],diameter,diameter)

        wormLayer1.push()
        wormLayer1.translate(wormXLoc[i],wormYLoc[i])

        let drift=Math.sin(frameCount*0.01+i*0.08)*0.5

        wormLayer1.rotate(drift)
        wormLayer1.strokeWeight(1)

        if(pinkBand){
            wormLayer1.stroke(255,220,240)
        }else{
            wormLayer1.stroke(255,45,155)
        }

        for(let stripe=-diameter/2;stripe<diameter/2;stripe+=8){
            wormLayer1.line(stripe,-diameter/2,stripe,diameter/2)
            wormLayer1.line(-diameter/2,stripe,diameter/2,stripe)
        }

        wormLayer1.pop()
    }

    pg.image(wormLayer2,0,0)
    pg.image(wormLayer1,0,0)

    wormCounter+=0.003
}

function transitionSketch(pg){
    pg.background(3,0,8)

    cardTimer=(cardTimer+1)%cardCycleLength

    for(let i=0;i<cards.length;i++){
        let card=cards[i]
        let open=constrain((cardTimer-card.delay-12)/25,0,1)
        let close=constrain((cardTimer-165-card.delay)/25,0,1)
        let eyeOpen=open*(1-close)

        pg.push()
        pg.translate(card.x,card.y)
        drawBatEyes(pg,eyeOpen)
        pg.pop()
    }

    for(let i=0;i<cards.length;i++){
        drawCard(pg,cards[i])
    }
}

function drawCard(pg,card){
    let open=constrain((cardTimer-card.delay)/35,0,1)
    let close=constrain((cardTimer-165-card.delay)/35,0,1)
    let progress=open*(1-close)
    let w=65*abs(cos(progress*90))

    if(progress>=1) return

    pg.push()
    pg.translate(card.x,card.y)
    pg.rectMode(CENTER)

    pg.fill(35,0,15)
    pg.stroke(180,20,50)
    pg.strokeWeight(3)
    pg.rect(0,0,w,135,7)

    if(w>15){
        pg.noStroke()
        pg.fill(170,15,45)

        for(let y=-50;y<=50;y+=20){
            for(let x=-20;x<=20;x+=20){
                let px=x*w/65
                pg.quad(px,y-6,px+5*w/65,y,px,y+6,px-5*w/65,y)
            }
        }
    }

    pg.pop()
}

function drawBatEyes(pg,open){
    let h=13*open

    pg.noStroke()

    pg.fill(160,0,20,25*open)
    pg.ellipse(-14,0,38,h*3)
    pg.ellipse(14,0,38,h*3)

    pg.fill(220,0,25,100*open)
    pg.ellipse(-14,0,26,h*1.8)
    pg.ellipse(14,0,26,h*1.8)

    pg.fill(255,15,30,255*open)
    pg.ellipse(-14,0,20,h)
    pg.ellipse(14,0,20,h)

    pg.fill(15,0,0)
    pg.ellipse(-12,0,4,h*0.8)
    pg.ellipse(12,0,4,h*0.8)
}

function eyeTunnelSketch(pg){
    eyeFrame++

    drawEyeTunnel(pg)

    if(eyeFrame%130==0){
        eyes.push(makeEyes(0))
    }

    for(let i=eyes.length-1;i>=0;i--){
        let e=eyes[i]
        e.p+=0.001
        drawFlyingEyes(pg,e)
    }

    while(eyes.length>0&&eyes[0].p>=1){
        eyes.shift()
    }
}

function drawEyeTunnel(pg){
    pg.background(22,6,38)
    pg.noStroke()

    eyeOffset+=0.007

    if(eyeOffset>=1){
        eyeOffset-=1
        eyeShift++
    }

    let t=eyeFrame*0.012

    for(let i=18;i>=0;i--){
        let r=6*pow(1.38,i+eyeOffset)
        let ring=i-eyeShift

        if(ring%2==0){
            pg.fill(110,8,28)
        }else{
            pg.fill(22,6,38)
        }

        pg.beginShape()

        for(let a=0;a<TWO_PI;a+=0.07){
            let wobble=0.12*Math.sin(a*5+ring*0.9+t)+0.05*Math.sin(a*3-ring*0.6-t*1.3)
            let rr=r*(1+wobble)
            pg.vertex(pg.width/2+Math.cos(a)*rr,pg.height/2+Math.sin(a)*rr)
        }

        pg.endShape(CLOSE)
    }
}

function makeEyes(p){
    return {
        p:p,
        angle:random(TWO_PI),
        tilt:random(-0.3,0.3),
        seed:random(100)
    }
}

function drawFlyingEyes(pg,e){
    let maxDist=dist(0,0,pg.width/2,pg.height/2)+150
    let d=pow(e.p,1.9)*maxDist
    let x=pg.width/2+Math.cos(e.angle)*d
    let y=pg.height/2+Math.sin(e.angle)*d
    let size=0.02+pow(e.p,1.7)*0.6

    let lid=0.35+0.2*Math.sin(eyeFrame*0.03+e.seed)

    let k=(eyeFrame+floor(e.seed*10))%220

    if(k<20){
        lid=lerp(lid,HALF_PI,Math.sin((k/20)*PI))
    }

    pg.push()
    pg.translate(x,y)
    pg.rotate(e.tilt)
    pg.scale(size)

    pg.push()
    pg.translate(-70,0)
    drawOneEye(pg,lid,-1)
    pg.pop()

    pg.push()
    pg.translate(70,0)
    drawOneEye(pg,lid,1)
    pg.pop()

    pg.pop()
}

function drawOneEye(pg,lid,side){
    pg.push()
    pg.scale(1.2,1)

    pg.stroke(42,16,56)
    pg.strokeWeight(4)
    pg.fill(214,234,40)
    pg.circle(0,0,90)

    pg.noStroke()
    pg.fill(244,226,40)
    pg.circle(0,0,62)

    pg.fill(20,8,30)
    pg.ellipse(0,0,7,76)

    pg.fill(255,255,220)
    pg.circle(-14,-12,8)

    pg.stroke(42,16,56)
    pg.strokeWeight(4)
    pg.fill(140,50,140)
    pg.arc(0,0,90,90,0.85,Math.PI-0.85,CHORD)

    pg.push()
    pg.rotate(-side*0.2)
    pg.fill(140,50,140)
    pg.arc(0,0,90,90,Math.PI-lid,TWO_PI+lid,CHORD)
    pg.pop()

    pg.noFill()
    pg.circle(0,0,90)

    pg.pop()
}

function mushroomForestSketch(pg){
    pg.background(15,8,35)

    mushroomTime++

    if(millis()>nextMushroomTime){
        mushrooms.push({
            x:random(pg.width),
            y:random(pg.height*0.4,pg.height*0.82),
            size:random(0.6,1.5),
            hue:random([285,320,190,45])
        })

        nextMushroomTime=millis()+random(1000,3000)
    }

    pg.noStroke()

    for(let i=5;i>0;i--){
        pg.fill(90,30,150,8)
        pg.ellipse(pg.width*0.5,pg.height*0.55,pg.width*i*0.35,pg.height*i*0.25)
    }

    pg.fill(20,12,42)
    pg.rect(0,pg.height*0.82,pg.width,pg.height*0.18)

    for(let m of mushrooms){
        drawMushroom(pg,m)
    }

    for(let s of spores){
        s.y-=s.speed
        s.x+=sin(mushroomTime*0.7+s.phase)*0.4

        if(s.y<-10){
            s.y=pg.height+10
            s.x=random(pg.width)
        }

        let glow=140+100*sin(mushroomTime*3+s.phase)

        pg.noStroke()
        pg.fill(180,130,255,25)
        pg.circle(s.x,s.y,s.size*5)

        pg.fill(220,200,255,glow)
        pg.circle(s.x,s.y,s.size)
    }

    if(keyIsDown(LEFT_ARROW)){
        mushroomRabbitX-=mushroomRabbitSpeed
        mushroomRabbitAngle=-90
    }

    if(keyIsDown(RIGHT_ARROW)){
        mushroomRabbitX+=mushroomRabbitSpeed
        mushroomRabbitAngle=90
    }

    if(keyIsDown(UP_ARROW)){
        mushroomRabbitY-=mushroomRabbitSpeed
        mushroomRabbitAngle=0
    }

    if(keyIsDown(DOWN_ARROW)){
        mushroomRabbitY+=mushroomRabbitSpeed
        mushroomRabbitAngle=180
    }

    mushroomRabbitX=constrain(mushroomRabbitX,20,pg.width-20)
    mushroomRabbitY=constrain(mushroomRabbitY,20,pg.height-20)

    drawMushroomRabbit(pg,mushroomRabbitX,mushroomRabbitY,mushroomRabbitAngle)
}

function drawMushroom(pg,m){
    pg.push()
    pg.translate(m.x,m.y)
    pg.scale(m.size)

    let pulse=1+0.08*sin(mushroomTime*2+m.x)
    let capWidth=65*pulse
    let stemHeight=55

    pg.noStroke()

    for(let i=5;i>0;i--){
        pg.fill(150,70,255,9)
        pg.ellipse(0,-stemHeight,capWidth+i*18,35+i*12)
    }

    pg.fill(205,190,225)
    pg.rect(-9,-stemHeight,18,stemHeight,8)

    if(m.hue===285){
        pg.fill(165,85,235)
    }else if(m.hue===320){
        pg.fill(245,80,180)
    }else if(m.hue===190){
        pg.fill(50,200,200)
    }else{
        pg.fill(255,180,80)
    }

    pg.ellipse(0,-stemHeight,capWidth,32*pulse)

    pg.fill(255,230,255,230)
    pg.circle(-15,-stemHeight-3,7)
    pg.circle(10,-stemHeight+2,5)
    pg.circle(22,-stemHeight-5,4)

    pg.pop()
}

function drawMushroomRabbit(pg,x,y,angle){
    pg.push()
    pg.translate(x,y)
    pg.rotate(angle)
    pg.noStroke()

    pg.fill(255,200,215)
    pg.ellipse(-8,-18,9,24)
    pg.ellipse(8,-18,9,24)

    pg.fill(225,155,175)
    pg.ellipse(-7,-17,4,16)
    pg.ellipse(7,-17,4,16)

    pg.fill(255,245,230)
    pg.ellipse(0,5,25,34)
    pg.ellipse(0,-12,22,22)
    pg.ellipse(0,24,10,10)

    pg.fill(55,35,55)
    pg.ellipse(-5,-13,3,3)
    pg.ellipse(5,-13,3,3)

    pg.pop()
}

function mousePressed(){
    mushrooms.push({
        x:random(mushroomBuf.width),
        y:random(mushroomBuf.height),
        size:random(0.7,1.4),
        hue:random([285,320,190,45])
    })
}

function keyPressed(){
    if(key==="c"||key==="C") pMapper.toggleCalibration()
    if(key==="s"||key==="S") pMapper.save("map.json")
    if(key==="l"||key==="L") pMapper.load("maps/map.json")
    if(key==="f"||key==="F") fullscreen(!fullscreen())
    if(key==="r"||key==="R") cardTimer=0
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight)
}