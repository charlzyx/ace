import React, { FC, useEffect, useRef, useState } from 'react';
import { Tree } from 'antd';

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  tree: any[];
};

const keys = (tree: any[]): string[] => {
  let arr: string[] = [];
  if (Array.isArray(tree)) {
    tree.forEach((node) => {
      arr.push(node.key);
      const child = keys(node.children);
      if (child) {
        arr = arr.concat(child);
      }
    });
  } else {
    return [];
  }
  return arr;
};

const TreeSelector: FC<Props> = ({ value, onChange, tree }) => {
  const expanded = useRef(false);
  const [expandedKeys, setExpandedKeys] = useState<string[]>(() => keys(tree));
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  useEffect(() => {
    if (expanded.current) return;
    if (Array.isArray(value)) {
      expanded.current = true;
      setExpandedKeys(value);
    }
  }, [value]);

  const onCheck = (checkedKeys: any) => {
    if (onChange) {
      onChange(checkedKeys);
    }
  };

  return (
    <Tree
      checkable
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      autoExpandParent={autoExpandParent}
      onCheck={onCheck}
      checkedKeys={value}
      treeData={tree}
    />
  );
};

export default TreeSelector;
