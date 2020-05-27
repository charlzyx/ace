import React, { FC, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Table } from 'antd';
import { Link, RouteComponentProps, useParams } from '@reach/router';
import * as Api from '../server/tag';
import { Tag } from '../server/vo';
import Ctx from '../Nav/ctx';
import { TYPE } from '../db';

const { Item } = Form;
const { Group: RadioGroup } = Radio;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const List: FC<RouteComponentProps> = () => {
  const [list, setList] = useState<Tag[]>([]);
  const ctx = useContext(Ctx);
  const params = useParams();
  const [form] = Form.useForm();
  const trigger = useCallback(() => {
    setList(Api.list({ space_id: +params.space_id }));
    ctx.update();
  }, [ctx, params.space_id]);
  useEffect(() => {
    trigger();
  }, [trigger]);
  const toSubmit = useCallback(
    (values) => {
      console.log('values', values);
      values.space_id = +params.space_id;
      if (values.id) {
        Api.update(values);
      } else {
        Api.add(values);
      }
      trigger();
    },
    [params.space_id, trigger],
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
            { key: 'type', dataIndex: 'type', title: 'TYPE' },
            {
              key: 'space_alias',
              dataIndex: 'space_alias',
              title: 'SPACE_ALIAS',
            },
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
                    <Link to={`/ace/group/${params.space_id}/${row.id}`}>
                      <Button>编辑GROUP</Button>
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
          <Item name="type" label="TYPE" required>
            <RadioGroup
              options={[
                {
                  label: TYPE.USER,
                  value: TYPE.USER,
                },
                {
                  label: TYPE.ROLE,
                  value: TYPE.ROLE,
                },
                {
                  label: TYPE.DATA,
                  value: TYPE.DATA,
                },
                {
                  label: TYPE.RESOURCE,
                  value: TYPE.RESOURCE,
                },
              ]}
            ></RadioGroup>
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
