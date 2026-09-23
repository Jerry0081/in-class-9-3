let amount=20
let spinning=false
let colorful=false
let paused=false



function setup(){

    createCanvas(600,600)

    rectMode(CENTER)
    angleMode(DEGREES)

    frameRate(5)
}

function keyPressed(){
    if(key=='r' || key=='R'){
        spinning=!spinning
    }
    if(key=='c' || key=='C'){
        colorful=!colorful
    }
    if(keyCode== UP_ARROW){
       amount+=10
    }
    if(keyCode== DOWN_ARROW){
        amount-=10
    }
    if(amount<1){
        amount=1
    } 
}

function draw(){
     background(30)
     noFill()
     

      for(let x=0; x<amount; x++){
        push()
        translate(random(0,width),random(0,height))

        if (spinning == true){
            rotate(random(0,360))
        }
        if (colorful == true){
            stroke(random(100,255),random(100,255),random(100,255))
        }
        else{
            stroke(255)
        }

        strokeWeight(random(1,5))
        rect(0,0,random(20,150),random(20,150),random(0,50))
        pop()
    }

}