import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Tree } from 'antd';
import { RouteComponentProps, useParams } from '@reach/router';
import * as Api from '../server/group';
import { TYPE } from '../db';
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
const List: FC<RouteComponentProps> = () => {
  const [tree, setTree] = useState<any>([]);
  const [dataSource, setDataSource] = useState<any>({});
  const params = useParams();
  const [form] = Form.useForm();
  const trigger = useCallback(() => {
    const root = Api.query({
      space_id: +params.space_id,
      tag_id: +params.tag_id,
      is_root: true,
    });
    console.log('root', root);
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
                neo.parentPath = node.path;
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
    setTree([transfer(root || {})]);
  }, [form, params.space_id, params.tag_id]);
  useEffect(() => {
    trigger();
  }, [trigger]);
  const toSubmit = useCallback(
    (values) => {
      console.log('values', values);
      if (values.id) {
        Api.update({
          ...values,
          space_id: +params.space_id,
          tag_id: +params.tag_id,
        });
      } else {
        Api.add(
          {
            ...values,
            space_id: +params.space_id,
            tag_id: +params.tag_id,
          },
          values.parentPath,
        );
      }
      trigger();
    },
    [params.space_id, params.tag_id, trigger],
  );

  const tags = useCallback(() => {
    if (!tree[0]) return;
    const types = watedTypes(tree[0].type);
    const trees = types.reduce((o: any, type) => {
      const nodes = Api.list({ type });
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
      console.log(`treeeeee${type}`, tree);
      o[type] = tree;
      return o;
    }, {});
    setDataSource(trees);
    console.log('trees', trees);
  }, [tree]);
  useEffect(() => {
    tags();
  }, [tags]);
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Tree autoExpandParent defaultExpandAll showLine treeData={tree}></Tree>
      </div>
      <div style={{ flex: 1 }}>
        <h3>编辑区</h3>
        <Form {...layout} form={form} onFinish={toSubmit}>
          <Item name="id" label="ID" required>
            <Input disabled></Input>
          </Item>
          <Item name="parentPath" label="PARENT_PATH" required>
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
              <div>
                <h2>{type}</h2>
                <div>
                  {Object.keys(dataSource[type]).map((alias) => {
                    return (
                      <Item
                        name={`${type}.${alias}`}
                        label={`${type}.${alias}`}
                      >
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
      </div>
    </div>
  );
};

export default List;
