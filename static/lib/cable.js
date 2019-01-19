
// draw a rope between two points
function cable_path(x1, y1, x2, y2) {
    const length = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
    const ratio = 0.5
    const pendouillage = Math.min(40, length) /5
    const delta = - Math.min(40, length/8)
    const x3 = x1 + ((x2-x1) * ratio)
    const y3 = Math.max(y1, y2)+pendouillage
    let delta3 = Math.max(delta, Math.abs(y2-y1)/2)
    if (x2 < x1) { delta3 = -delta3 }
    return `M${x1} ${y1}
    C ${x1+delta} ${y1} ${x3-delta3} ${y3} ${x3} ${y3}
    C ${x3+delta3} ${y3} ${x2-delta} ${y2} ${x2} ${y2}
    `.replace(/\s+/gm, " ")
}

// find cable plugs pos of a box
function cable_pos(element) {
    const bbox = element.getBBox()
    const y = (bbox.y + bbox.y2) / 2
    return {
        x: bbox.x,
        x2: bbox.x2,
        y: y
    }
}

// Room full of boxes and cables
export class Cables {
    constructor(svg) {
        this.snap = Snap("#zone svg")
        this.boxes = {} // layers found in the inkscape file
        this.colums = {}
        this.snap.selectAll(".box").forEach(box => {
            this.boxes[box.node.id] = box
            box.node.style.display = "None"
            console.log("box", box)
            this.colums[box.node.id] = 0
        })
    }
    // Add a new box, with a type
    newBox(name, type) {
        const column_length = 250
        const column_height = 100

        const b = this.boxes[type].clone()
        const rank = [ "route", "public", "private"].indexOf(type)
        const line = this.colums[type]++
        b.node.style.display = 'inherit'
        b.node.id = name
        b.select(".name").node.textContent = name
        b.drag()

        const bb = b.getBBox()
        const matrix = new Snap.Matrix();
        matrix.translate(-bb.x + (rank*column_length) + 5,
            -bb.y + (line * column_height))

        b.transform(matrix.toTransformString())
        console.log("new box", b)
        return b
    }
    // Link a cable, between two boxes
    cable(left, right) {
        const cable_width = 2
        const line_width = 2

        let c_l = cable_pos(left)
        let c_r = cable_pos(right)
        const back_path = this.snap.path().attr({
            class: `l_${left.node.id} r_${right.node.id} back_cable`,
            'stroke-width': cable_width + 2*line_width,
            stroke: 'black',
            fill: 'none'
        })
        const path = this.snap.path().attr({
            class: `l_${left.node.id} r_${right.node.id} cable`,
            'stroke-width': cable_width,
            stroke: 'white',
            fill: 'none'
        })
        function draw() {
            c_l = cable_pos(left)
            c_r = cable_pos(right)
            const p = cable_path(c_r.x, c_r.y, c_l.x2, c_l.y)
            back_path.attr({
                d: p
            })
            path.attr({
                d: p
            })
        }
        for (let box of [left, right]) {
            box.drag((x, y, event) => { // onmove
                draw()
            }, () => { // onstart
                path.attr({
                    stroke: 'red'
                })
             },
            () => { // onend
                path.attr({
                    stroke: 'white'
                })
            })
        }
        draw() // initial draw
    }
}