#!/usr/bin/env python3
"""Reject mismatched explicit HTML nesting before browser error recovery hides it."""
from html.parser import HTMLParser
from pathlib import Path
import sys

VOID = set('area base br col embed hr img input link meta param source track wbr'.split())

class Structure(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.stack = []
    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        pass
    def handle_endtag(self, tag):
        expected = self.stack[-1] if self.stack else None
        if expected != tag:
            raise ValueError(f'line {self.getpos()[0]}: expected </{expected}>, received </{tag}>')
        self.stack.pop()
    def finish(self):
        self.close()
        if self.stack:
            raise ValueError(f'unclosed elements: {self.stack}')

def validate(path):
    parser = Structure()
    parser.feed(path.read_text())
    parser.finish()

if __name__ == '__main__':
    paths = [Path(name) for name in sys.argv[1:]] or sorted(Path(__file__).resolve().parents[1].glob('*.html'))
    for path in paths:
        try:
            validate(path)
        except ValueError as error:
            raise SystemExit(f'{path.name}: {error}') from error
    print(f'{len(paths)} HTML documents have balanced explicit nesting')
