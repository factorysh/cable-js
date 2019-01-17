#!/usr/bin/env python

from jinja2 import Environment, FileSystemLoader, select_autoescape
from flask import Flask

import prepare


env = Environment(
    loader=FileSystemLoader('templates'),
    autoescape=select_autoescape(['html', 'xml'])
)


app = Flask(__name__)


@app.route("/")
def hello():
    return env.get_template('index.html.j2').render(elements=prepare.elements())


if __name__ == '__main__':
    app.run(host='0.0.0.0')