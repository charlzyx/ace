import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Input, Row, Tree, message } from 'antd';
import { RouteComponentProps, useLocation, useParams } from '@reach/router';
import * as Api from '../server/group';
import { TYPE } from '../db';
import { GroupVO } from '../server/vo';
import TreeSelector from '../comps/TreeSelector';
import { transfer } from '../utils';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const watedTypes = (type: TYPE) => {
  switch (type) {
    case TYPE.USER:
      return [TYPE.DATA, TYPE.ROLE];
    case TYPE.DATA:
      return [TYPE.USER];
    case TYPE.RESOURCE:
      return [TYPE.ROLE];
    case TYPE.ROLE:
      return [TYPE.USER, TYPE.RESOURCE];
    default:
      return [];
  }
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

const List: FC<RouteComponentProps> = () => {
  const location = useLocation();
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };
  const [tree, setTree] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>({});
  const params = useParams();
  const [form] = Form.useForm();

  const parenting = useRef<GroupVO>();
  const [now, setNow] = useState<GroupVO>();
  const [up, setUp] = useState(1);

  useEffect(() => {
    setNow({} as any);
    parenting.current = undefined;
    form.resetFields();
    setUp(-1);
    setTimeout(() => {
      setUp(1);
    });
  }, [form, location]);
  useEffect(() => {
    setUp(-1);
    setTimeout(() => {
      setUp(1);
    });
  }, [now]);

  const trigger = useCallback(() => {
    const root = Api.query({
      space_id: +params.space_id,
      tag_id: +params.tag_id,
      is_root: true,
    });
    const transfer = (node: any) => {
      node.title = (
        <Row gutter={16}>
          <Col>
            <div>{node.alias}</div>
          </Col>
          <Col>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                Api.del({ id: node.id });
                trigger();
              }}
            >
              删除
            </Button>
          </Col>
          <Col>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                form.resetFields();
                form.setFieldsValue(node);
              }}
            >
              查看
            </Button>
          </Col>
          <Col>
            <Button
              type="link"
              onClick={(e) => {
                e.stopPropagation();
                const neo: any = {};
                parenting.current = node;
                setNow(node);
                form.resetFields();
                form.setFieldsValue(neo);
              }}
            >
              添加子节点
            </Button>
          </Col>
        </Row>
      );
      node.key = node.path;
      node.children = Array.isArray(node.children)
        ? node.children.map((x: any) => transfer(x))
        : [];
      return node;
    };
    const tree = [transfer(root || {})];
    setTree(tree);
    setExpandedKeys(keys(tree));
  }, [form, params.space_id, params.tag_id]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  const toSubmit = useCallback(
    (values) => {
      if (values.id) {
        Api.update(values);
        message.success('更新完成');
      } else {
        if (!parenting.current) {
          return message.error('请先选择父节点');
        }
        Api.add(values, parenting.current);
        message.success('保存成功');
      }
      trigger();
    },
    [trigger],
  );

  const tags = useCallback(() => {
    if (!tree[0]) return;
    const types = watedTypes(tree[0].type);
    const trees = types.reduce((o: any, type) => {
      const nodes = Api.list({ type, is_root: true });
      const tree = nodes.reduce((a: any, node) => {
        if (!node) return [];
        const t = transfer(node, [
          { before: 'alias', after: 'title' },
          {
            before: 'path',
            after: 'key',
          },
        ]);
        a[node.alias] = [t];
        return a;
      }, {});
      o[type] = tree;
      return o;
    }, {});
    setDataSource(trees);
  }, [tree]);

  useEffect(() => {
    tags();
  }, [tags]);

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Tree
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          autoExpandParent={autoExpandParent}
          showLine
          treeData={tree}
        ></Tree>
      </div>
      <div style={{ flex: 1 }}>
        <h3>编辑区</h3>
        <div>
          <h4>
            当前父节点: {now?.alias} / {now?.path}
          </h4>
        </div>
        {up > 0 ? (
          <Form {...layout} form={form} onFinish={toSubmit}>
            <Item name="id" label="ID" required>
              <Input disabled></Input>
            </Item>
            <Item name="path" label="PATH" required>
              <Input disabled></Input>
            </Item>
            <Item name="alias" label="ALIAS" required>
              <Input></Input>
            </Item>
            {Object.keys(dataSource).map((type) => {
              return (
                <div key={type}>
                  <h2>{type}</h2>
                  <div>
                    {Object.keys(dataSource[type]).map((alias) => {
                      return (
                        <Item key={alias} name={['links', alias]} label={alias}>
                          <TreeSelector
                            tree={dataSource[type][alias]}
                          ></TreeSelector>
                        </Item>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form>
        ) : null}
      </div>
    </div>
  );
};

export default List;
