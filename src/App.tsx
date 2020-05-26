import React from 'react';
import { Stack } from '@fluentui/react';
import { Menus } from './Menus';
import { Router } from '@reach/router';
import Form from './Form';
import Space from './Space';
import Group from './Group';

export const App: React.FunctionComponent = () => {
  return (
    <Stack horizontal verticalFill>
      <Stack verticalFill>
        <Menus></Menus>
      </Stack>
      <Stack verticalFill>
        <Router>
          <Form path="form"></Form>
          <Space path="space/:id"></Space>
          <Group path="group/:id/:gid"></Group>
        </Router>
      </Stack>
    </Stack>
  );
};
