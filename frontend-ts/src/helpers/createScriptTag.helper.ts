export function createScriptTag(src: string, type = 'module') {
  const script = document.createElement('script');
  script.type = type;
  script.src = src;
  return script;
}
