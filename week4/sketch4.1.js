
//let wavesPerCanvas=8
//let amplitude=50
//let offset=0
//let yLoc
//let speed=0.1

function setup(){
    createCanvas(windowWidth,windowHeight)

    //yLoc=height/2

    noFill()
}

function draw(){
    background(230)
    
  sinWave(4,150,height/2,0.05)
    sinWave(8,80,height*0.8,0.2)
    
}

function sinWave(wavesPerCanvas,amplitude,offset,yLoc,speed){
    let offset=frameCount*speed

    push()
    translate(0,yLoc)

    beginShape()
    for(let i=0; i<width;i++){
        mappedI=map(i,0,width,0,wavesPerCanvas*TWO_PI)

        let y=sin(mappedI+offset)*amplitude
        let x=i
        vertex(x,y)
    }
    endShape()
   
    pop()
    
    
}