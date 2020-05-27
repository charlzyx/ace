import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Tree } from 'antd';
import { RouteComponentProps, useParams } from '@reach/router';
import * as Api from '../server/group';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const List: FC<RouteComponentProps> = () => {
  const [tree, setTree] = useState<any>([]);
  const params = useParams();
  const [form] = Form.useForm();
  const trigger = useCallback(() => {
    const tree = Api.root({
      space_id: +params.space_id,
      type_id: +params.type_id,
    });
    console.log('tree', tree);
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
    setTree(tree.map((x) => transfer(x)));
  }, [form, params.space_id, params.type_id]);
  useEffect(() => {
    trigger();
  }, [trigger]);
  const toSubmit = useCallback(
    (values) => {
      console.log('values', values);
      if (values.id) {
        Api.update(
          { id: values.id },
          { ...values, space_id: +params.space_id, type_id: +params.type_id },
        );
      } else {
        Api.add({
          group: {
            ...values,
            space_id: +params.space_id,
            type_id: +params.type_id,
          },
          parentPath: values.parentPath,
        });
      }
      trigger();
    },
    [params.space_id, params.type_id, trigger],
  );
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <Tree autoExpandParent defaultExpandAll showLine treeData={tree}></Tree>
      </div>
      <div style={{ flex: 1 }}>
        <h1>编辑区</h1>
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
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default List;
