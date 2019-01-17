// draw a rope between two points
function cable_path(x1, y1, x2, y2) {
    const ratio = 0.5
    const pendouillage = 20
    const delta = -40
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
    let bbox = element.getBBox()
    let y = (bbox.y + bbox.y2) / 2
    return {
        x: bbox.x,
        x2: bbox.x2,
        y: y
    }
}

// Room full of boxes and cables
class Cables {
    constructor(svg) {
        this.snap = Snap("#zone svg")
        this.boxes = {} // layers found in the inkscape file
        this.snap.selectAll(".box").forEach(box => {
            this.boxes[box.node.id] = box
            box.node.style.display = "None"
            console.log("box", box)
        })
    }
    // Add a new box, with a type
    newBox(name, type) {
        let b = this.boxes[type].clone()
        b.node.style.display = 'inherit'
        b.node.id = name
        b.select(".name").node.textContent = name
        b.drag()
        console.log("new box", b)
        return b
    }
    // Link a cable, between two boxes
    cable(left, right) {
        let box_l = this.snap.select(`#${left}`)
        let box_r = this.snap.select(`#${right}`)
        let c_l = cable_pos(box_l)
        let c_r = cable_pos(box_r)
        let path = this.snap.path()
        path.attr({
            class: `l_${left} r_${right} cable`,
            'stroke-width': 2,
            stroke: 'black',
            fill: 'none'
        })
        function draw() {
            c_l = cable_pos(box_l)
            c_r = cable_pos(box_r)
            const p = cable_path(c_r.x, c_r.y, c_l.x2, c_l.y)
            path.attr({
                d: p
            })
        }
        for (let box of [box_l, box_r]) {
            box.drag((x, y, event) => { // onmove
                draw()
            }, () => { // onstart
                path.attr({
                    stroke: 'red'
                })
             },
            () => { // onend
                path.attr({
                    stroke: 'black'
                })
            })
        }
        draw() // initial draw
    }
}

cables = new Cables("#zone svg")
cables.newBox("home", "route")
cables.newBox("web", "public")
cables.cable("home", "web")
cables.newBox("php", "private")
cables.cable("web", "php")
cables.newBox("db", "private")
cables.cable("php", "db")
cables.newBox("memcache", "private")
cables.cable("php", "memcache")
