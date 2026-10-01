let cols=6
let rows=4
let cellSize=96
let saveSvg=false

function setup(){
    createCanvas(576,384)
    angleMode(DEGREES)
    stroke(0)
    strokeWeight(1.5)
    noFill()
}

function draw(){
    background(255)

    for(let x=0;x<cols;x++){
        for(let y=0;y<rows;y++){

            let px=x*cellSize+cellSize/2
            let py=y*cellSize+cellSize/2

            let n=noise(x*0.35,y*0.35)
            let angle=map(n,0,1,-60,60)

            let ySize=map(y,0,rows-1,0.6,1.1)

            let d=dist(mouseX,mouseY,px,py)
            let mouseEffect=map(d,0,250,1,0)
            mouseEffect=constrain(mouseEffect,0,1)

            let size=ySize+mouseEffect*0.5
            let mouseAngle=mouseEffect*70
            let spacing=map(mouseEffect,0,1,10,16)

            push()
            translate(px,py)
            rotate(angle+mouseAngle)
            scale(size)

            beginShape()
            vertex(0,-35)
            vertex(35,0)
            vertex(0,35)
            vertex(-35,0)
            endShape(CLOSE)

            line(-35,0,35,0)
            line(0,-35,0,35)

            for(let i=-2;i<=2;i++){
                let lineNoise=noise(x*0.4,y*0.4,i+10)
                let shift=map(lineNoise,0,1,-8,8)

                line(-30,i*spacing+shift,30,i*spacing-shift)
            }

            for(let i=-2;i<=2;i++){
                let lineNoise=noise(x*0.3,y*0.3,i+20)
                let shift=map(lineNoise,0,1,-8,8)

                line(i*spacing+shift,-30,i*spacing-shift,30)
            }

            pop()
        }
    }
}

function keyPressed(){

    if(key==='s'||key==='S'){
        saveSvg=true
    }
}