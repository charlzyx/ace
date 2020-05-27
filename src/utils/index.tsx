export const matcher = (cond: any, item: any, boolWhenEmpty = false) => {
  if (
    Object.prototype.toString.call(cond) !== '[object Object]' ||
    Object.keys(cond).length === 0
  )
    return boolWhenEmpty;
  const is = Object.keys(cond).reduce((b: any, key) => {
    if (b === false) return false;
    const match = cond[key] === item[key];
    return match;
  }, null);
  return !!is;
};

export const transfer = (
  node: any,
  mapper: { before: string; after: string }[],
) => {
  mapper.forEach((map) => {
    node[map.after] = node[map.before];
  });
  node.children = Array.isArray(node.children)
    ? node.children.map((x: any) => transfer(x, mapper))
    : [];
  return node;
};
