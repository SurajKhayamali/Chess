// From:
// https://stackoverflow.com/questions/1197575/can-scripts-be-inserted-with-innerhtml
// https://stackoverflow.com/a/20584396

function nodeScriptClone(node: Element) {
  const script = document.createElement('script');
  script.text = node.innerHTML;

  let i = -1,
    attr: Attr;

  const attrs = node.attributes;
  while (++i < attrs.length) {
    script.setAttribute((attr = attrs[i]).name, attr.value);
  }
  return script;
}

function nodeScriptIs(node: Element) {
  return node.tagName === 'SCRIPT';
}

export function nodeScriptReplace(node: Element) {
  if (nodeScriptIs(node) === true) {
    node.parentNode?.replaceChild(nodeScriptClone(node), node);
  } else {
    const children = node.childNodes;
    let i = -1;
    while (++i < children.length) {
      nodeScriptReplace(children[i] as Element);
    }
  }

  return node;
}
