import { Row, Col, Card, Table, Icon, Menu, Dropdown } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';
import PageLoading from './components/PageLoading';
import styles from './style.less';
import { Shop } from '../data';

const data: Shop[] = [{
  id: 10000,
  cateName: '服装',
  shopName: '鹿马旗舰店',
  website: 'http://www.luma.com',
  status: 1,
  isDel: 0,
  logo: 'LUMA',
}];

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" href="javascript:;">
        编辑
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" href="javascript:;">
        关闭
      </a>
    </Menu.Item>
  </Menu>
);

class ShopTable extends Table<Shop> {}
class ShopColumn extends Table.Column<Shop> {}

class ShopList extends Component {
  render() {
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={16} md={24}>
            <Card>
              <ShopTable dataSource={data} rowKey="id">
                <ShopColumn key="id" title="ID" dataIndex="id" />
                <ShopColumn key="logo" title="LOGO" dataIndex="logo" />
                <ShopColumn key="shopName" title="店铺名称" dataIndex="shopName"/>
                <ShopColumn key="website" title="主页" dataIndex="website"/>
                <ShopColumn key="status" title="状态" dataIndex="status"/>
                <ShopColumn key="operation" title="操作" dataIndex="operation"
                  render={() => (
                    <Dropdown overlay={menu}>
                      <a className="ant-dropdown-link" href="#">
                        操作<Icon type="down" />
                      </a>
                    </Dropdown>
                  )}
                />
              </ShopTable>
            </Card>
          </Col>

          <Col lg={8} md={24}>
            <Card></Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default ShopList;