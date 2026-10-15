let flowers = []

function setup(){
    createCanvas(windowWidth,windowHeight)
    angleMode(DEGREES)
}

function draw(){
    background(0)

    for(let i=0;i<flowers.length;i++){
        flowers[i].move()
        flowers[i].display()
    }
}

function mouseDragged(){
    flowers.push(new Flower(mouseX,mouseY))
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
        this.xV=random(-5,5)
        this.yV=random(-5,5)
        this.rV=random(-5,5)
        this.rotations=0
    }

    move(){
        this.x+=this.xV
        this.y+=this.yV
        this.rotations+=this.rV
    }

    display(){
        push()
        translate(this.x,this.y)
        rotate(this.rotations)

        fill(this.petalCol)

        for(let r=0;r<this.numPetals;r++){
            push()
            rotate((360/this.numPetals)*r)
            translate(this.petalLength/2,0)
            ellipse(0,0,this.petalLength,this.petalWidth)
            pop()
        }

        fill(this.centerCol)
        ellipse(0,0,this.centerDiameter)

        pop()
    }
}
