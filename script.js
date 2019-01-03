

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
    }
}

var boxes = {}
var dragged

document.querySelectorAll(".box").forEach(box => {
    console.log(box)
    boxes[box.id] = new Box(box)
})