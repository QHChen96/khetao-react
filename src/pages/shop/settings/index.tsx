import React,{ Component, Dispatch } from "react";
import { GridContent } from "@ant-design/pro-layout";
import { CurrentShop } from "@/models/shop";

import styles from './style.less';
import { Menu } from "antd";
import { connect } from 'dva';
import { ConnectState } from "@/models/connect";

import BasicView from './components/basic';
import WebInfo from "./components/webInfo";
import CustomCategory from './components/custom-category/CustomCategory';
const { Item } = Menu;


type SettingsStateKeys = 'basic' | 'webInfo' | 'customCate';

interface ShopSettingsProps {
  dispatch: Dispatch<any>;
  className?: string;
  currentShop: CurrentShop;
}

interface ShopSettingsState {
  mode: 'inline' | 'horizontal';
  menuMap: {
    [key: string]: React.ReactNode;
  };
  selectKey: SettingsStateKeys;
}

@connect(({ shop }: ConnectState) => ({
  currentShop: shop.currentShop,
}))
class ShopSettings extends Component<ShopSettingsProps, ShopSettingsState> {
  
  main: HTMLDivElement | undefined = undefined;

  constructor(props: ShopSettingsProps) {
    super(props);
    const menuMap = {
      basic: "基础信息",
      webInfo: "网站信息",
      customCate: "店铺分类"
    };
    this.state = {
      mode: 'inline',
      menuMap,
      selectKey: 'basic'
    }
  }

 

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'shop/fetchCurrent',
    });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  getMenu = () => {
    const { menuMap } = this.state;
    return Object.keys(menuMap).map(
      item => <Item key={item}>{menuMap[item]}</Item>
    );
  }

  renderChildren = () => {
    const { selectKey } = this.state;
    switch (selectKey) {
      case 'basic':
        return <BasicView/>;
      case 'webInfo':
        return <WebInfo/>;
      case 'customCate':
        return <CustomCategory />;
      default: 
        break;
    }
    return null;
  }

  getRightTitle = () => {
    const { selectKey, menuMap } = this.state;
    return menuMap[selectKey];
  }

  selectKey = (key: SettingsStateKeys) => {
    this.setState({
      selectKey: key,
    });
  }

  resize = () => {
    if (!this.main) {
      return;
    }
    requestAnimationFrame(() => {
      if (!this.main) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const { offsetWidth } = this.main;
      if (this.main.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      this.setState({
        mode,
      });
    });
  };

  render() {
    const { currentShop={} } = this.props;
    if (!currentShop.id) {
      return '';
    }
    const { mode, selectKey } = this.state;
    return (
      <GridContent>
        <div
          className={styles.main}
          ref={ref => {
            if (ref) {
              this.main = ref;
            }
          }}
        >
          <div className={styles.leftMenu}>
            <Menu
              mode={mode}
              selectedKeys={[selectKey]}
              onClick={({ key }) => this.selectKey(key as SettingsStateKeys)}
            >
              {this.getMenu()}
            </Menu>
          </div>
          <div className={styles.right}>
            <div className={styles.title}>{this.getRightTitle()}</div>
            {this.renderChildren()}
          </div>
        </div>
      </GridContent>
    );
  }
  
}


export default ShopSettings;