function setup(){
    createCanvas(windowWidth,windowHeight)
    background(255)
    fill(100,0,0)
    strokeWeight(5)
    stroke(200,100,0)
    let c
}


function mouseDragged(){
    let blue = color(0, 0, 200)
    let green = color(0, 200, 0)
    let red = color(200, 0, 0)
     if(mouseY < height / 2){
        let amount = map(mouseY, 0, height / 2, 0, 1)
        c = lerpColor(blue, green, amount)
    } else {
        let amount = map(mouseY, height / 2, height, 0, 1)
        c = lerpColor(green, red, amount)
    }

    stroke(c)
    line(mouseX, mouseY, pmouseX, pmouseY)
}



function keyPressed(){
    background(255)
}