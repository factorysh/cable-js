
class Cables {
    constructor(svg) {
        this.snap = Snap("#zone svg")
        this.boxes = {}
        this.snap.selectAll(".box").forEach(box => {
            this.boxes[box.node.id] = box
            box.node.style.display = "None"
            console.log("box", box)
        })
    }
    newBox(name, type) {
        let b = this.boxes[type].clone()
        b.node.style.display = 'inherit'
        b.select(".name").node.textContent = name
        b.drag()
        console.log("new box", b)
        return b
    }
}

cables = new Cables("#zone svg")
cables.newBox("/", "route")
cables.newBox("web", "public")
cables.newBox("php", "private")
cables.newBox("db", "private")


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
    console.log(document.querySelector(`#paths svg circle.${this.id}_start`))
    const p = `#paths svg circle.${this.id}`
    document.querySelectorAll(p).forEach(c => {
        c.style.visibility = 'visible'
    })
}

function dragEnd(e) {
    console.log("drag end")
    let self = boxes[this.id]
    self.initialX = self.currentX
    self.initialY = self.currentY

    self.active = false
    dragged = null
    document.querySelectorAll("#paths svg circle").forEach(c => {
        c.style.visibility = 'hidden'
    })
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
        drawPathsHorizontal(document.querySelector("#box1"),
            document.querySelector("#box2"))
        drawPathsVertical(document.querySelector("#box2"),
            document.querySelector("#box3"))
    }
}

class Boxx {
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

function drawPathsHorizontal(box1, box2) {
    const path = document.getElementById("1_2")
    const path_back = document.getElementById("1_2_back")
    const x1 = box1.offsetWidth + box1.offsetLeft + boxes[box1.id].currentX
    const y1 = (box1.offsetHeight/2) + boxes[box1.id].currentY + box1.offsetTop
    const x2 = boxes[box2.id].currentX + box2.offsetLeft
    const y2 = (box2.offsetHeight/2) + boxes[box2.id].currentY + box2.offsetTop

    const ratio = 0.5
    const x3 = x1 + ((x2-x1) * ratio)
    const y3 = Math.max(y1, y2)+pendouillage
    let delta3 = Math.max(delta, Math.abs(y2-y1)/2)
    if (x2 < x1) { delta3 = -delta3 }
    const d = `M${x1} ${y1}
    C ${x1+delta} ${y1} ${x3-delta3} ${y3} ${x3} ${y3}
    C ${x3+delta3} ${y3} ${x2-delta} ${y2} ${x2} ${y2}
    `.replace(/\s+/gm, " ")
    path.setAttribute("d", d)
    path_back.setAttribute("d", d)
    circleStart = document.getElementById("1_2_start")
    circleStartHalo = document.getElementById("1_2_start_halo")
    circleEnd = document.getElementById("1_2_end")
    circleEndHalo = document.getElementById("1_2_end_halo")
    circleStart.setAttribute("cx", x1)
    circleStart.setAttribute("cy", y1)
    circleStartHalo.setAttribute("cx", x1)
    circleStartHalo.setAttribute("cy", y1)
    circleEnd.setAttribute("cx", x2)
    circleEnd.setAttribute("cy", y2)
    circleEndHalo.setAttribute("cx", x2)
    circleEndHalo.setAttribute("cy", y2)
}

function drawPathsVertical(box1, box2) {
    const path = document.getElementById("2_3")
    const path_back = document.getElementById("2_3_back")
    const x1 = (box1.offsetWidth/2) + box1.offsetLeft + boxes[box1.id].currentX
    const y1 = box1.offsetHeight + boxes[box1.id].currentY + box1.offsetTop
    const x2 = (box2.offsetWidth/2) + boxes[box2.id].currentX + box2.offsetLeft
    const y2 = boxes[box2.id].currentY + box2.offsetTop

    const x3 = (x1+x2)/2
    const y3 = (y1+y2)/2+pendouillage
    let delta3 = Math.max(delta, Math.abs(y2-y1)/2)
    if (x2 < x1) { delta3 = -delta3 }
    const d = `M${x1} ${y1}
    C ${x1} ${y1+delta} ${x3-delta3} ${y3} ${x3} ${y3}
    C ${x3+delta3} ${y3} ${x2} ${y2-delta} ${x2} ${y2}
    `.replace(/\s+/gm, " ")
    path.setAttribute("d", d)
    path_back.setAttribute("d", d)

    circleStart = document.getElementById("2_3_start")
    circleEnd = document.getElementById("2_3_end")
    circleStartHalo = document.getElementById("2_3_start_halo")
    circleEndHalo = document.getElementById("2_3_end_halo")
    circleStart.setAttribute("cx", x1)
    circleStart.setAttribute("cy", y1)
    circleStartHalo.setAttribute("cx", x1)
    circleStartHalo.setAttribute("cy", y1)
    circleEnd.setAttribute("cx", x2)
    circleEnd.setAttribute("cy", y2)
    circleEndHalo.setAttribute("cx", x2)
    circleEndHalo.setAttribute("cy", y2)
}

var boxes = {}
var dragged
const delta = 40
const pendouillage = 20

/*
document.querySelectorAll(".box").forEach(box => {
    console.log(box)
    boxes[box.id] = new Box(box)
})
drawPathsHorizontal(document.querySelector("#box1"),
            document.querySelector("#box2"))
drawPathsVertical(document.querySelector("#box2"),
            document.querySelector("#box3"))

let paths = document.querySelector("#paths")
let zone = document.querySelector("#zone")
*/