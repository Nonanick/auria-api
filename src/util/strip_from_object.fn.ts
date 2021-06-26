export function StripFromObject(obj: any, keys: string[]) {
  const nObj = Object.assign({}, obj);

  keys.forEach(k => {
    delete nObj[k];
  });

  return nObj;
}