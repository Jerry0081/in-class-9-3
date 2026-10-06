let xLoc=[]
let yLoc=[]
let numSegments=100



function setup(){
    createCanvas(windowWidth,windowHeight)

    for (let i=0; i<numSegments;i++){
        xLoc[i]=width/2
        yLoc[i]=height/2

    }

   
}
let counter=0

function draw() {
    background(0)
    stroke(255)
    fill(0)
    xLoc[numSegments-1]= width*noise(counter)
    yLoc[numSegments-1]= height*noise(counter+10)

    for (let i=0; i<numSegments-1; i++){
        xLoc[i]=xLoc[i+1]
        yLoc[i]=yLoc[i+1]

        let diameter=200*sin(map(i,0,numSegments-1,0,TWO_PI))

        let r = diameter
        let g = 200-diameter
        let b = 200*cos(map(i,0,numSegments-1,0,TWO_PI))

        stroke(r,g,b)

        ellipse(xLoc[i],yLoc[i], diameter)

    }

counter += 0.01

}