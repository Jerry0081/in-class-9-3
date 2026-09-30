let numRects = 5
let w
let h

function setup(){
    createCanvas(windowWidth,windowHeight,SVG)
    noFill()
    strokeWeight(3)

    w=width/numRects
    h=height/numRects
}

function draw(){
    background(40,55,40)
    drawPattern()
}

function drawPattern(){
    let warmColor=color(255,100,30)
    let coldColor=color(40,150,255)

    push()
    translate(w/2,h/2)

    for(let x=0;x<numRects;x++){
        for(let y=0;y<numRects;y++){

            let px=w*x
            let py=h*y

            let d=dist(px+w/2,py+h/2,mouseX,mouseY)

            d=map(d,0,800,1,0)
            d=constrain(d,0,1)

            let numCircles=floor(map(d,0,1,1,12))

            let c=lerpColor(warmColor,coldColor,d)
            stroke(c)

            push()
            translate(px,py)

            for(let i=0;i<numCircles;i++){
                let size=map(i,0,numCircles,w*0.2,w*1.5)
                circle(0,0,size)
            }

            pop()
        }
    }

    pop()
}

function keyPressed(){
    if(key==='s'||key==='S'){
        save("generative-pattern.svg")
    }
}