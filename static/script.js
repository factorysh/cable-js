import { Cables } from "./lib/cable.js"


let cables = new Cables("#zone svg")
cables.newBox("home", "route")
cables.newBox("web", "public")
cables.cable("home", "web")
cables.newBox("php", "private")
cables.cable("web", "php")
cables.newBox("db", "private")
cables.cable("php", "db")
cables.newBox("memcache", "private")
cables.cable("php", "memcache")