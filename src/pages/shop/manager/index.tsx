import React,{ Component } from "react";
import { Shop } from "../data";
import { GridContent } from "@ant-design/pro-layout";


interface ShopManagerProps {
  className?: string;
  shopList?: Shop[];
}

interface ShopManagerState {

}

class ShopManager extends Component<ShopManagerProps, ShopManagerState> {
  
  render() {
    return (
      <GridContent>
        <div>管理</div>
      </GridContent>
    );
  }
  
}

export default ShopManager;