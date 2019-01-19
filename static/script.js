import { Cables } from "./lib/cable.js"

const cables = new Cables("#zone svg")

const home = cables.newBox("home", "route")
const web = cables.newBox("web", "public")
cables.cable(home, web)

const php = cables.newBox("php", "private")
cables.cable(web, php)

const db = cables.newBox("db", "private")
cables.cable(php, db)

const memcache = cables.newBox("memcache", "private")
cables.cable(php, memcache)