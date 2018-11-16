import React from 'react';
import { Layout, Menu } from 'antd';

const { Header, Content} = Layout;

const CustomLayout = (props) => {
  return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={['1']}
            style={{ lineHeight: '64px' }}
          >
            <Menu.Item key="1">Yahoo Fantasy Matchup</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>

          <div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
            {props.children}
          </div>
        </Content>
      </Layout>
    );
}

export default CustomLayout;