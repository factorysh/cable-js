

function dragStart(e) {
    let self = boxes[this.id]
    console.log("drag start self", self)
    if (e.type === "touchstart") {
        self.initialX = e.touches[0].clientX - self.xOffset
        self.initialY = e.touches[0].clientY - self.yOffset
    } else {
        self.initialX = e.clientX - self.xOffset
        self.initialY = e.clientY - self.yOffset
    }
    self.active = true
    dragged = this
}

function dragEnd(e) {
    console.log("drag end")
    let self = boxes[this.id]
    self.initialX = self.currentX
    self.initialY = self.currentY

    self.active = false
    dragged = null
}

function drag(e) {
    let self = boxes[this.id]
    if (self.active) {
        e.preventDefault()

        if (e.type === "touchmove") {
            self.currentX = e.touches[0].clientX - self.initialX
            self.currentY = e.touches[0].clientY - self.initialY
        } else {
            console.log(e.clientX, e.clientY, dragged)
            self.currentX = e.clientX - self.initialX
            self.currentY = e.clientY - self.initialY
        }

        self.xOffset = self.currentX
        self.yOffset = self.currentY

        dragged.style.transform = `translate3d(${self.currentX}px, ${self.currentY}px, 0)`
        console.log(`translate3d(${self.currentX}px, ${self.currentY}px, 0)`)
        drawPaths(document.querySelector("#box1"),
            document.querySelector("#box2"))
    }
}

class Box {
    constructor(box) {
        console.log("constructor", box)
        this.box = box
        box.addEventListener("touchstart", dragStart, false)
        box.addEventListener("touchend", dragEnd, false)
        box.addEventListener("touchmove", drag, false)
        box.addEventListener("mousedown", dragStart, false)
        box.addEventListener("mouseup", dragEnd, false)
        box.addEventListener("mousemove", drag, false)
        this.active = false
        this.xOffset = 0
        this.yOffset = 0
        this.currentX = 0
        this.currentY = 0
    }
}

function drawPaths(box1, box2) {
    console.log(box1.offsetTop, box1.offsetLeft)
    let path = document.getElementById("1_2")
    let path_back = document.getElementById("1_2_back")
    console.log(boxes[box1.id])
    const x1 = box1.offsetWidth + box1.offsetLeft + boxes[box1.id].currentX
    const y1 = (box1.offsetHeight/2) + boxes[box1.id].currentY + box1.offsetTop
    const x2 = boxes[box2.id].currentX + box2.offsetLeft
    const y2 = (box2.offsetHeight/2) + boxes[box2.id].currentY + box2.offsetTop

    const delta = 40
    const pendouillage = 20
    const x3 = (x1+x2)/2
    const y3 = Math.max(y1, y2)+pendouillage
    let delta3 = Math.max(delta, Math.abs(y2-y1)/2)
    if (x2 < x1) { delta3 = -delta3 }
    const d = `M${x1} ${y1}
    C ${x1+delta} ${y1} ${x3-delta3} ${y3} ${x3} ${y3}
    C ${x3+delta3} ${y3} ${x2-delta} ${y2} ${x2} ${y2}
    `.replace(/\s+/gm, " ")
    path.setAttribute("d", d)
    path_back.setAttribute("d", d)
    console.log(d, path)
}

var boxes = {}
var dragged

document.querySelectorAll(".box").forEach(box => {
    console.log(box)
    boxes[box.id] = new Box(box)
})
drawPaths(document.querySelector("#box1"),
            document.querySelector("#box2"))

let paths = document.querySelector("#paths")
let zone = document.querySelector("#zone")