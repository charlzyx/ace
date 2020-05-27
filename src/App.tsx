import React from 'react';
import Nav from './Nav';
import { RouteComponentProps, Router } from '@reach/router';
import Space from './Space';
import Type from './Type';
import Group from './Group';

let Home = (props: RouteComponentProps) => <div>Home</div>;

export const App: React.FunctionComponent = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          padding: '8px',
          boxShadow: '0px 0px 12px #cecece',
        }}
      >
        <h2>Access Control Evolved</h2>
      </div>
      <div style={{ flex: 1, display: 'flex', padding: '16px' }}>
        <div style={{ width: '200px', height: '100vh' }}>
          <Nav></Nav>
        </div>
        <div style={{ height: '100vh', width: '100%', padding: '0 8px' }}>
          <Router>
            <Home path="/"></Home>
            <Space path="/space"></Space>
            <Type path="/type/:space_id"></Type>
            <Group path="/group/:space_id/:type_id"></Group>
          </Router>
        </div>
      </div>
    </div>
  );
};
