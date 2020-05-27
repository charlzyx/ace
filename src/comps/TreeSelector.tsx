import React, { FC, useState } from 'react';
import { Tree } from 'antd';

type Props = {
  value?: string[];
  onChange?: (value: string[]) => void;
  tree: any[];
};

const TreeSelector: FC<Props> = ({ value, onChange, tree }) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  // const [checkedKeys, setCheckedKeys] = useState<string[]>();
  // const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeys: any) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys: any) => {
    console.log('onCheck', checkedKeys);
    // setCheckedKeys(checkedKeys);
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
