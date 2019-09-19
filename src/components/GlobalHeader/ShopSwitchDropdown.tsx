import { Avatar, Icon, Menu, Spin } from 'antd';
import { ClickParam } from 'antd/es/menu';
import React from 'react';
import { connect } from 'dva';

import { ConnectProps, ConnectState } from '@/models/connect';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { CurrentShop } from '@/models/shop';



export interface GlobalHeaderRightProps extends ConnectProps {
  currentShop?: CurrentShop;
  shopList?: CurrentShop[];
}



class ShopSwitchDropdown extends React.Component<GlobalHeaderRightProps> {
  onMenuClick = (event: ClickParam) => {
    const { key } = event;
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'shop/switchShop',
        payload: key
      });
    }
    return;
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'shop/fetchCurrent'
      })
    }
  }

  render(): React.ReactNode {
    const { currentShop = {}, shopList=[] } = this.props;
    if (shopList.length === 0) {
      return null;
    }
    if (shopList.length === 1) {
      return (
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentShop.avatar} alt="avatar" />
          <span className={styles.name}>{currentShop.shopName}</span>
        </span>
      );
    }
    const filtedList = shopList.filter(shop => shop.id !== currentShop.id)
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        {
          filtedList.map(shop => (
            <Menu.Item key={shop.id}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={shop.avatar} alt="avatar" />
                <span className={styles.name}>{shop.shopName}</span>
              </span>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return currentShop && currentShop.shopName ? (
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar size="small" className={styles.avatar} src={currentShop.avatar} alt="avatar" />
          <span className={styles.name}>{currentShop.shopName}</span>
        </span>
      </HeaderDropdown>
    ) : (
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    );
  }
}
export default connect(({ shop }: ConnectState) => ({
  currentShop: shop.currentShop,
  shopList: shop.shopList,
}))(ShopSwitchDropdown);
