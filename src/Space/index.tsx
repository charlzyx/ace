import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Table, message } from 'antd';
import { Link, RouteComponentProps } from '@reach/router';
import Ctx from '../Nav/ctx';
import * as Api from '../server/space';
import { SpaceVO } from '../server/vo';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const List: FC<RouteComponentProps> = () => {
  const ctx = useContext(Ctx);
  const [list, setList] = useState<SpaceVO[]>([]);
  const [form] = Form.useForm();
  const trigger = useCallback(() => {
    const list = Api.list();
    setList(list);
    ctx.update();
  }, [ctx]);
  useEffect(() => {
    trigger();
  }, [trigger]);
  const toSubmit = useCallback(
    (values) => {
      console.log('values', values);
      if (values.id) {
        Api.update(values);
        message.success('更新完成');
      } else {
        Api.add(values);
        message.success('保存成功');
      }
      trigger();
    },
    [trigger],
  );
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <div>
          <Button
            type="primary"
            onClick={() => {
              form.setFieldsValue({ alias: '', id: '' });
            }}
          >
            新增
          </Button>
        </div>
        <Table
          rowKey="id"
          dataSource={list}
          columns={[
            { key: 'id', dataIndex: 'id', title: 'ID' },
            { key: 'alias', dataIndex: 'alias', title: 'ALIAS' },
            {
              key: '__op__',
              render(row) {
                return (
                  <div>
                    <Button
                      onClick={() => {
                        Api.del({ id: row.id });
                        trigger();
                      }}
                      type="dashed"
                    >
                      删除
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => {
                        form.setFieldsValue(row);
                      }}
                    >
                      修改
                    </Button>
                    <Link to={`/ace/tag/${row.id}`}>
                      <Button>编辑TAG</Button>
                    </Link>
                  </div>
                );
              },
            },
          ]}
        ></Table>
      </div>
      <div style={{ flex: 1 }}>
        <h3>编辑区</h3>
        <Form {...layout} form={form} onFinish={toSubmit}>
          <Item name="id" label="ID" required>
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
