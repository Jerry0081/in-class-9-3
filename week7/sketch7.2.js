let cards=[]
let timer=0
let cycleLength=260

function setup(){
    createCanvas(900,400)
    angleMode(DEGREES)
    rectMode(CENTER)

    for(let row=0;row<2;row++){
        for(let col=0;col<7;col++){
            cards.push({
                x:90+col*120,
                y:110+row*180,
                delay:col*10+row*8
            })
        }
    }
}

function draw(){
    background(3,0,8)

    timer=(timer+1)%cycleLength

    for(let i=0;i<cards.length;i++){
        let card=cards[i]
        let open=constrain((timer-card.delay-12)/25,0,1)
        let close=constrain((timer-165-card.delay)/25,0,1)
        let eyeOpen=open*(1-close)

        push()
        translate(card.x,card.y)
        drawBatEyes(eyeOpen)
        pop()
    }

    for(let i=0;i<cards.length;i++){
        drawCard(cards[i])
    }
}

function drawCard(card){
    let open=constrain((timer-card.delay)/35,0,1)
    let close=constrain((timer-165-card.delay)/35,0,1)
    let progress=open*(1-close)

    let w=90*abs(cos(progress*90))

    if(progress>=1){
        return
    }

    push()
    translate(card.x,card.y)

    fill(35,0,15)
    stroke(180,20,50)
    strokeWeight(3)
    rect(0,0,w,135,7)

    if(w>15){
        noStroke()
        fill(170,15,45)

        for(let y=-50;y<=50;y+=20){
            for(let x=-30;x<=30;x+=20){
                let px=x*w/90
                quad(px,y-6,px+5*w/90,y,px,y+6,px-5*w/90,y)
            }
        }
    }

    pop()
}

function drawBatEyes(open){
    let h=13*open

    noStroke()

    fill(160,0,20,25*open)
    ellipse(-18,0,50,h*3)
    ellipse(18,0,50,h*3)

    fill(220,0,25,100*open)
    ellipse(-18,0,32,h*1.8)
    ellipse(18,0,32,h*1.8)

    fill(255,15,30,255*open)
    ellipse(-18,0,25,h)
    ellipse(18,0,25,h)

    fill(15,0,0)
    ellipse(-16,0,5,h*0.8)
    ellipse(16,0,5,h*0.8)
}

function keyPressed(){
    if(key==="r"||key==="R"){
        timer=0
    }
}