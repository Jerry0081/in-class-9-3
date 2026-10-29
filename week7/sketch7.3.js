
let pMapper
let quadMaps=[]
let tunnelBuf,transitionBuf,eyeBuf,mushroomBuf,flowerBuf
let video
let isPlaying=false
let calibrationMode=false

let tunnelFlowers=[]
let cards=[]
let eyes=[]
let mushrooms=[]
let spores=[]
let flowers=[]
let paintBrush

let snakeX=[]
let snakeY=[]
let snakeTime=0
let tunnelRotation=0
let cardTimer=0
let eyeTime=0
let eyeOffset=0
let mushroomTime=0

function setup(){
    createCanvas(windowWidth,windowHeight,WEBGL)
    angleMode(DEGREES)

    pMapper=createProjectionMapper(this)

    let sizes=[
        [600,600],
        [600,400],
        [600,400],
        [600,400],
        [450,338],
        [600,400]
    ]

    for(let size of sizes){
        quadMaps.push(pMapper.createQuadMap(size[0],size[1],20,20))
    }

    tunnelBuf=createGraphics(600,600)
    transitionBuf=createGraphics(600,400)
    eyeBuf=createGraphics(600,400)
    mushroomBuf=createGraphics(600,400)
    flowerBuf=createGraphics(600,400)

    tunnelBuf.angleMode(DEGREES)
    transitionBuf.angleMode(DEGREES)
    eyeBuf.angleMode(DEGREES)
    mushroomBuf.angleMode(DEGREES)
    flowerBuf.angleMode(DEGREES)

    for(let i=0;i<250;i++){
        snakeX.push(300)
        snakeY.push(300)
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

    for(let i=0;i<8;i++){
        eyes.push({
            p:i*0.12,
            angle:random(360),
            tilt:random(-20,20),
            seed:random(360)
        })
    }

    for(let i=0;i<12;i++){
        mushrooms.push(makeMushroom())
    }

    for(let i=0;i<70;i++){
        spores.push({
            x:random(600),
            y:random(400),
            size:random(2,6),
            speed:random(0.3,1.2),
            phase:random(360)
        })
    }

    for(let i=0;i<10;i++){
        flowers.push(new Flower(random(600),random(400)))
    }

    paintBrush=new PaintBrush(flowerBuf)

    video=createVideo(['alice.mp4'])
    video.hide()
    video.volume(0)
}

function draw(){
    background(0)

    rabbitTunnelSketch(tunnelBuf)
    transitionSketch(transitionBuf)
    eyeTunnelSketch(eyeBuf)
    mushroomForestSketch(mushroomBuf)
    flowerRoseSketch(flowerBuf)

    quadMaps[0].displayTexture(tunnelBuf)
    quadMaps[1].displayTexture(transitionBuf)
    quadMaps[2].displayTexture(eyeBuf)
    quadMaps[3].displayTexture(mushroomBuf)

    if(isPlaying&&video&&video.elt&&video.elt.readyState>=2){
        quadMaps[4].displayTexture(video)
    }

    quadMaps[5].displayTexture(flowerBuf)
}

function rabbitTunnelSketch(pg){
    pg.background(35,20,55)

    pg.push()
    pg.translate(300,300)
    pg.noFill()
    pg.strokeWeight(4)

    for(let i=0;i<12;i++){
        let r=30+i*55+(frameCount%70)

        pg.stroke(150+i*7,100+i*5,200+i*4)

        pg.push()
        pg.rotate(tunnelRotation+i*12)
        pg.ellipse(0,0,r*1.2,r)
        pg.pop()
    }

    pg.pop()

    tunnelRotation+=0.5
    snakeTime+=0.01

    for(let i=snakeX.length-1;i>0;i--){
        snakeX[i]=snakeX[i-1]
        snakeY[i]=snakeY[i-1]
    }

    snakeX[0]=pg.width*noise(snakeTime+10)
    snakeY[0]=pg.height*noise(snakeTime)

    pg.noStroke()

    for(let i=snakeX.length-1;i>=0;i--){
        let t=map(i,0,snakeX.length-1,0,180)
        let d=max(0,100*sin(t))
        let r=255*sin(t)

        pg.fill(r,255-r,180,210)
        pg.circle(snakeX[i],snakeY[i],d)
    }

    for(let f of tunnelFlowers){
        f.move()
        f.display(pg)
    }

    drawRabbit(pg,300,300)
}

function drawRabbit(pg,x,y){
    pg.push()
    pg.translate(x,y)
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
    pg.circle(-5,-13,3)
    pg.circle(5,-13,3)

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
        this.r=random(180,255)
        this.g=random(130,210)
        this.b=random(186,255)
    }

    move(){
        this.distance+=this.speed
        this.angle+=0.2
        this.rotation+=this.rotationSpeed

        if(this.distance>450){
            this.reset()
        }
    }

    display(pg){
        pg.push()
        pg.translate(
            300+cos(this.angle)*this.distance,
            300+sin(this.angle)*this.distance
        )
        pg.rotate(this.rotation)
        pg.noStroke()
        pg.fill(this.r,this.g,this.b)

        for(let i=0;i<6;i++){
            pg.push()
            pg.rotate(i*60)
            pg.ellipse(this.size/2,0,this.size,this.size/2)
            pg.pop()
        }

        pg.fill(255,220,120)
        pg.circle(0,0,this.size/2)
        pg.pop()
    }
}

function transitionSketch(pg){
    pg.background(3,0,8)

    cardTimer=(cardTimer+1)%260

    for(let c of cards){
        let open=constrain((cardTimer-c.delay-12)/25,0,1)
        let close=constrain((cardTimer-165-c.delay)/25,0,1)
        let eyeOpen=open*(1-close)

        pg.push()
        pg.translate(c.x,c.y)
        drawBatEyes(pg,eyeOpen)
        pg.pop()
    }

    for(let c of cards){
        let open=constrain((cardTimer-c.delay)/35,0,1)
        let close=constrain((cardTimer-165-c.delay)/35,0,1)
        let progress=open*(1-close)

        if(progress>=1) continue

        let w=65*abs(cos(progress*90))

        pg.push()
        pg.translate(c.x,c.y)
        pg.rectMode(CENTER)
        pg.stroke(180,20,50)
        pg.strokeWeight(3)
        pg.fill(35,0,15)
        pg.rect(0,0,w,135,7)

        if(w>15){
            pg.noStroke()
            pg.fill(170,15,45)

            for(let y=-50;y<=50;y+=20){
                for(let x=-20;x<=20;x+=20){
                    let px=x*w/65

                    pg.quad(
                        px,y-6,
                        px+5*w/65,y,
                        px,y+6,
                        px-5*w/65,y
                    )
                }
            }
        }

        pg.pop()
    }
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
    eyeTime++
    eyeOffset+=0.007

    pg.background(22,6,38)
    pg.noStroke()

    for(let i=18;i>=0;i--){
        let r=6*pow(1.38,i+eyeOffset)
        let ring=i-floor(eyeOffset)

        if(ring%2===0){
            pg.fill(110,8,28)
        }else{
            pg.fill(22,6,38)
        }

        let previousX=0
        let previousY=0
        let firstX=0
        let firstY=0

        for(let a=0;a<=360;a+=5){
            let wobble=0.12*sin(a*5+ring*50+eyeTime)
            let rr=r*(1+wobble)
            let x=300+cos(a)*rr
            let y=200+sin(a)*rr

            if(a===0){
                firstX=x
                firstY=y
            }else{
                pg.triangle(
                    300,200,
                    previousX,previousY,
                    x,y
                )
            }

            previousX=x
            previousY=y
        }

        pg.triangle(
            300,200,
            previousX,previousY,
            firstX,firstY
        )
    }

    if(eyeTime%130===0){
        eyes.push({
            p:0,
            angle:random(360),
            tilt:random(-20,20),
            seed:random(360)
        })
    }

    for(let i=eyes.length-1;i>=0;i--){
        let e=eyes[i]
        e.p+=0.001

        let d=pow(e.p,1.9)*550
        let x=300+cos(e.angle)*d
        let y=200+sin(e.angle)*d
        let size=0.02+pow(e.p,1.7)*0.6

        pg.push()
        pg.translate(x,y)
        pg.rotate(e.tilt)
        pg.scale(size)

        drawOneEye(pg,-70,0)
        drawOneEye(pg,70,0)

        pg.pop()

        if(e.p>=1){
            eyes.splice(i,1)
        }
    }
}

function drawOneEye(pg,x,y){
    pg.push()
    pg.translate(x,y)
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

    pg.fill(140,50,140)
    pg.arc(0,0,90,90,50,130,CHORD)
    pg.arc(0,0,90,90,210,330,CHORD)

    pg.pop()
}

function makeMushroom(){
    return {
        x:random(600),
        y:random(150,340),
        size:random(0.6,1.5),
        hue:random([285,320,190,45])
    }
}

function mushroomForestSketch(pg){
    pg.background(15,8,35)

    mushroomTime++

    if(frameCount%90===0){
        mushrooms.push(makeMushroom())

        if(mushrooms.length>40){
            mushrooms.shift()
        }
    }

    pg.noStroke()

    for(let i=5;i>0;i--){
        pg.fill(90,30,150,8)
        pg.ellipse(
            300,220,
            600*i*0.35,
            400*i*0.25
        )
    }

    pg.fill(20,12,42)
    pg.rect(0,328,600,72)

    for(let m of mushrooms){
        drawMushroom(pg,m)
    }

    for(let s of spores){
        s.y-=s.speed
        s.x+=sin(mushroomTime*0.7+s.phase)*0.4

        if(s.y<-10){
            s.y=410
            s.x=random(600)
        }

        pg.noStroke()
        pg.fill(180,130,255,25)
        pg.circle(s.x,s.y,s.size*5)

        pg.fill(
            220,200,255,
            140+100*sin(mushroomTime*3+s.phase)
        )
        pg.circle(s.x,s.y,s.size)
    }

    drawRabbit(
        pg,
        120+sin(mushroomTime*0.5)*40,
        300
    )
}

function drawMushroom(pg,m){
    pg.push()
    pg.translate(m.x,m.y)
    pg.scale(m.size)

    let pulse=1+0.08*sin(mushroomTime*2+m.x)
    let capWidth=65*pulse

    pg.noStroke()

    for(let i=5;i>0;i--){
        pg.fill(150,70,255,9)
        pg.ellipse(
            0,-55,
            capWidth+i*18,
            35+i*12
        )
    }

    pg.fill(205,190,225)
    pg.rect(-9,-55,18,55,8)

    if(m.hue===285) pg.fill(165,85,235)
    if(m.hue===320) pg.fill(245,80,180)
    if(m.hue===190) pg.fill(50,200,200)
    if(m.hue===45) pg.fill(255,180,80)

    pg.ellipse(0,-55,capWidth,32*pulse)

    pg.fill(255,230,255)
    pg.circle(-15,-58,7)
    pg.circle(10,-53,5)
    pg.circle(22,-60,4)

    pg.pop()
}

function flowerRoseSketch(pg){
    pg.background(20,35,29)

    paintBrush.move(pg)

    let rotationInfluence=map(mouseX,0,width,-2,2)

    for(let flower of flowers){
        flower.move(pg,rotationInfluence)
        flower.paint(paintBrush.tipX,paintBrush.tipY)
        flower.display(pg)
    }

    paintBrush.display(pg)
}

function roseBezier(a,b,c,d,t){
    let u=1-t
    return u*u*u*a+3*u*u*t*b+3*u*t*t*c+t*t*t*d
}

class Flower{
    constructor(x,y){
        this.x=x
        this.y=y
        this.size=random(0.65,1.1)
        this.rotations=random(360)
        this.rV=random(-0.5,0.5)
        this.xV=random(-1.2,1.2)
        this.yV=random(-1.2,1.2)
        this.petals=[]

        this.addLayer(5,7,20,18)
        this.addLayer(8,20,29,25)
        this.addLayer(10,36,37,31)
    }

    addLayer(count,radius,length,petalWidth){
        for(let i=0;i<count;i++){
            this.petals.push({
                angle:360/count*i+random(-12,12),
                radius:radius,
                length:length,
                width:petalWidth,
                painted:random()<0.08?1:0,
                dots:random()<0.3
            })
        }
    }

    move(pg,d){
        this.x+=this.xV
        this.y+=this.yV
        this.rotations+=this.rV*d

        if(this.x>pg.width+100) this.x=-100
        if(this.x<-100) this.x=pg.width+100
        if(this.y>pg.height+100) this.y=-100
        if(this.y<-100) this.y=pg.height+100
    }

    paint(brushX,brushY){
        for(let p of this.petals){
            let a=this.rotations+p.angle

            let px=this.x+
                cos(a)*(p.radius+p.length*0.25)*this.size

            let py=this.y+
                sin(a)*(p.radius+p.length*0.25)*this.size

            if(dist(px,py,brushX,brushY)<19*this.size){
                p.painted=min(1,p.painted+0.045)
            }
        }
    }

    display(pg){
        pg.push()
        pg.translate(this.x,this.y)
        pg.rotate(this.rotations)
        pg.scale(this.size)

        pg.noStroke()
        pg.fill(55,105,58)

        for(let i=0;i<5;i++){
            pg.push()
            pg.rotate(i*72)
            pg.triangle(-3,5,4,12,13,2)
            pg.pop()
        }

        for(let p of this.petals){
            this.drawPetal(pg,p)
        }

        pg.noFill()
        pg.stroke(105,27,37)
        pg.strokeWeight(2)

        let previousX=0
        let previousY=0

        for(let a=0;a<540;a+=8){
            let r=map(a,0,540,1,11)
            let x=cos(a)*r
            let y=sin(a)*r

            if(a>0){
                pg.line(previousX,previousY,x,y)
            }

            previousX=x
            previousY=y
        }

        pg.noStroke()
        pg.fill(238,190,73)
        pg.circle(-3,-2,2.5)
        pg.circle(4,3,2.5)

        pg.pop()
    }

    drawPetal(pg,p){
        pg.push()
        pg.rotate(p.angle)
        pg.translate(p.radius,0)

        let white=color(255,244,224)
        let red=color(190,27,48)

        pg.fill(lerpColor(white,red,p.painted))
        pg.noStroke()

        let x0=-p.width*0.3
        let y0=-p.width*0.15
        let x1=p.length
        let y1=0

        let points=[]

        for(let i=0;i<=24;i++){
            let t=i/24

            points.push({
                x:roseBezier(
                    x0,
                    -p.width*0.7,
                    p.length*0.35,
                    x1,t
                ),
                y:roseBezier(
                    y0,
                    -p.width*1.1,
                    -p.width*1.05,
                    y1,t
                )
            })
        }

        for(let i=1;i<=24;i++){
            let t=i/24

            points.push({
                x:roseBezier(
                    x1,
                    p.length*0.5,
                    -p.width*0.6,
                    x0,t
                ),
                y:roseBezier(
                    y1,
                    p.width*0.9,
                    p.width*0.8,
                    y0,t
                )
            })
        }

        for(let i=1;i<points.length-1;i++){
            pg.triangle(
                points[0].x,points[0].y,
                points[i].x,points[i].y,
                points[i+1].x,points[i+1].y
            )
        }

        pg.stroke(112,49,49)
        pg.strokeWeight(1)
        pg.noFill()

        for(let i=0;i<points.length;i++){
            let a=points[i]
            let b=points[(i+1)%points.length]

            pg.line(a.x,a.y,b.x,b.y)
        }

        if(p.dots){
            pg.noStroke()
            pg.fill(p.painted>0.5?white:red)
            pg.circle(
                p.length*0.3,
                -p.width*0.15,
                3.5
            )
            pg.circle(
                p.length*0.58,
                p.width*0.12,
                4
            )
        }

        pg.pop()
    }
}

class PaintBrush{
    constructor(pg){
        this.x=0
        this.y=pg.height*0.5
        this.tipX=0
        this.tipY=this.y
        this.previousX=0
        this.previousY=0
        this.angle=0
    }

    move(pg){
        this.previousX=this.x
        this.previousY=this.y

        this.x=frameCount*2.5%(pg.width+120)-60

        this.y=pg.height*0.5+
            sin(frameCount*1.2)*pg.height*0.28+
            sin(frameCount*0.45)*35

        let dx=this.x-this.previousX
        let dy=this.y-this.previousY

        if(abs(dx)>100) dx=2.5

        this.angle=atan2(dy,dx)
        this.tipX=this.x-cos(this.angle)*44
        this.tipY=this.y-sin(this.angle)*44
    }

    display(pg){
        pg.push()
        pg.translate(this.x,this.y)
        pg.rotate(this.angle+90)

        pg.noStroke()
        pg.fill(0,0,0,65)
        pg.ellipse(4,0,12,65)

        pg.stroke(112,67,35)
        pg.strokeWeight(10)
        pg.strokeCap(ROUND)
        pg.line(0,-35,0,18)

        pg.stroke(214,155,83)
        pg.strokeWeight(2)
        pg.line(-2,-30,-2,10)

        pg.stroke(185,184,157)
        pg.strokeWeight(9)
        pg.line(0,14,0,26)

        pg.stroke(95,93,80)
        pg.strokeWeight(1)
        pg.line(-4,18,4,18)
        pg.line(-4,23,4,23)

        pg.noStroke()
        pg.fill(190,27,48)

        let brushPoints=[]

        for(let i=0;i<=16;i++){
            let t=i/16

            brushPoints.push({
                x:roseBezier(-5,-6,-3,0,t),
                y:roseBezier(25,32,40,44,t)
            })
        }

        for(let i=1;i<=16;i++){
            let t=i/16

            brushPoints.push({
                x:roseBezier(0,3,6,5,t),
                y:roseBezier(44,40,32,25,t)
            })
        }

        for(let i=1;i<brushPoints.length-1;i++){
            pg.triangle(
                brushPoints[0].x,brushPoints[0].y,
                brushPoints[i].x,brushPoints[i].y,
                brushPoints[i+1].x,brushPoints[i+1].y
            )
        }

        pg.fill(242,105,116)
        pg.ellipse(-1,32,2,7)

        pg.pop()
    }
}

function mousePressed(){
    if(!calibrationMode&&video&&!isPlaying){
        video.loop()
        isPlaying=true
    }
}

function keyPressed(){
    if(!pMapper) return

    let k=key.toLowerCase()

    if(k==='c'){
        pMapper.toggleCalibration()
        calibrationMode=!calibrationMode
        return false
    }

    if(k==='s'){
        pMapper.save('map.json')
        return false
    }

    if(k==='l'){
        pMapper.load('maps/map.json')
        return false
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight)
}
