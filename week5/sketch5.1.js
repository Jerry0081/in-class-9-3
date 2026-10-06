let font
let students=['1','2','3','4','5','6',]
let student=''
let col = 0

async function setup(){
    createCanvas(windowWidth,windowHeight)
    //font=await
    //loadFont('ARCADE_N.TTF')
    //textFont(font)
    //textAlign(CENTER)



}

function draw(){
    background(0)
    fill(col)
    //text("test",width/2,height/2)
    text(student,width/2,height/2)

    col *= 0.99
}

function mousePressed(){
    
    let length = students.length
    let i = floor(random(length-1))

    if (students.length > 0){
    student=students[i]
    students.splice(i,1)
}
    print(students)
    col = 255

    student=students[i]
    
    //print(student)

}