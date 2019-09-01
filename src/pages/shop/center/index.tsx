import { Row, Col, Card, Table, Icon, Menu, Dropdown, Avatar, Divider, Select } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import styles from './style.less';
import { Shop } from '../data';

class ShopCenter extends Component {
  render() {
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card style={{ marginBottom: 24 }}>
              <div>
                <Avatar size={64} icon="user" />
                <Select defaultValue="luma" style={{ width: 120 }}>
                  <Select.Option value="luma">luma</Select.Option>
                </Select>
              </div>
              <Divider dashed />
              
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card>

            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}
export default ShopCenter;