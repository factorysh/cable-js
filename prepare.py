#!/usr/bin/env python3

import re
from lxml import etree, objectify


p_xmlns = re.compile(r"xmlns\S+\s")
parser = etree.XMLParser(remove_blank_text=True)


def layers(dessin: etree.Element) -> (str, etree.Element):
    for layer in dessin.findall('{http://www.w3.org/2000/svg}g'):
        label = layer.get('{http://www.inkscape.org/namespaces/inkscape}label')
        yield label, layer


def elements(src='dessin.svg'):
    dessin = etree.XML(open(src, 'rb').read(), parser=parser)
    for label, layer in layers(dessin):
        layer.attrib['id'] = label
        visit(layer, clean)
        # objectify.deannotate(layer, cleanup_namespaces=True)
        yield p_xmlns.sub("", etree.tostring(layer).decode('utf8'))


def main(path='dessin.svg'):
    for element in elements(path):
        print(element, '\n')


def clean(element):
    for k in element.keys():
        if k.startswith('{'):
            del element.attrib[k]


def tag_name(element):
    print(element.tag)
    print("\t", element.attrib, "\n")


def visit(node, on_element):
    on_element(node)
    for child in node:
        visit(child, on_element)

if __name__ == '__main__':
    main()