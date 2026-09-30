let r = 0
let numRects = 5
let w
let h


function setup(){

    createCanvas(windowWidth, windowHeight, SVG)

    angleMode(DEGREES)

    noFill()
    strokeWeight(3)

    w = width / numRects
    h = height / numRects
}


function draw(){

    background(40, 55, 40)

    drawPattern()

    r += 3
}


function drawPattern(){

    let warmColor = color(255, 100, 30)
    let coldColor = color(40, 150, 255)

    push()

    translate(w/2, h/2)

    for(let x = 0; x < numRects; x++){

        for(let y = 0; y < numRects; y++){

            let px = w * x
            let py = h * y


            
            let d = dist(
                px + w/2,
                py + h/2,
                width/2,
                height/2
            )


            
            let maxD = dist(
                0,
                0,
                width/2,
                height/2
            )


            
            let centerD = map(
                d,
                0,
                maxD,
                1,
                0
            )

            centerD = constrain(centerD, 0, 1)


            
            let numCircles = floor(
                map(centerD, 0, 1, 1, 10)
            )


            
            let c = lerpColor(
                warmColor,
                coldColor,
                centerD
            )

            stroke(c)


            push()

            translate(px, py)


         
            for(let i = 0; i < numCircles; i++){

                let size = map(
                    i,
                    0,
                    numCircles,
                    w * 0.2,
                    w * 1.5
                )

                circle(
                    0,
                    0,
                    size
                )
            }


            pop()
        }
    }

    pop()
}


function keyPressed(){

    if(key === 's' || key === 'S'){
        save("generative-pattern.svg")
    }

}