let frames=[]
let counter=0

async function setup(){
    createCanvas(windowWidth,windowHeight)
    frameRate(30)
    imageMode(CENTER)

    for(let i=1;i<=36;i++){
        let num=String(i).padStart(4,"0")
        let img=await loadImage("png_frames/frame_"+num+".png")
        frames.push(img)
    }
}

function draw(){
    background(200)

    let currentFrame=frames[counter%frames.length]

    let scaleFactor=max(width/currentFrame.width,height/currentFrame.height)
    let w=currentFrame.width*scaleFactor
    let h=currentFrame.height*scaleFactor

    image(currentFrame,width/2,height/2,w,h)

    counter++
}