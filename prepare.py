#!/usr/bin/env python3

from lxml import etree, objectify


def layers(dessin: etree.Element) -> (str, etree.Element):
    for layer in dessin.findall('{http://www.w3.org/2000/svg}g'):
        label = layer.get('{http://www.inkscape.org/namespaces/inkscape}label')
        yield label, layer


def main(path='dessin.svg'):
    dessin = etree.fromstring(open(path, 'rb').read())
    for label, layer in layers(dessin):
        layer.attrib['id'] = label
        visit(layer, clean)
        #objectify.deannotate(layer, cleanup_namespaces=True)
        print(etree.tostring(layer, pretty_print=True), "\n")


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