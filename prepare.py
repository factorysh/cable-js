#!/usr/bin/env python3

import re
from lxml import etree, objectify
from pyquery import PyQuery as pq


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
    # .outline has no style
    if 'class' in element.keys():
        if 'outline' in element.attrib['class'].split(' '):
            del element.attrib['style']
    # nobody has onmouseover
    if 'onmouseover' in element.keys():
        del element.attrib['onmouseover']
    # text has less style
    if element.tag == '{http://www.w3.org/2000/svg}text':
        styles = dict(i.split(':', 1) for i in
                      element.attrib['style'].split(';'))
        del styles['font-family']
        element.attrib['style'] = ";".join(":".join(i) for i in styles.items())
        
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
