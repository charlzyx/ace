import React, { FC, useCallback, useEffect, useState } from 'react';
import { Button, Form, Input, Table } from 'antd';
import { Link, RouteComponentProps } from '@reach/router';
import * as Api from '../server/space';
import { Space } from '../server/vo';

const { Item } = Form;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const List: FC<RouteComponentProps> = () => {
  const [list, setList] = useState<Space[]>([]);
  const [form] = Form.useForm();
  const trigger = useCallback(() => {
    setList(Api.list());
  }, []);
  useEffect(() => {
    trigger();
  }, [trigger]);
  const toSubmit = useCallback(
    (values) => {
      console.log('values', values);
      if (values.id) {
        Api.update({ id: values.id }, values);
      } else {
        Api.add(values.alias);
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
              form.setFieldsValue({ alias: '', id: -1 });
            }}
          >
            新增
          </Button>
        </div>
        <Table
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
                    <Link to={`/type/${row.id}`}>
                      <Button>编辑TYPE</Button>
                    </Link>
                  </div>
                );
              },
            },
          ]}
        ></Table>
      </div>
      <div style={{ flex: 1 }}>
        <h1>编辑区</h1>
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