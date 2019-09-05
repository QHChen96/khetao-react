import React,{ Component, Dispatch } from "react";
import { Shop } from "../data";
import { GridContent } from "@ant-design/pro-layout";
import { List } from "antd";


interface ShopManagerProps {
  className?: string;
  listShopList: null;
  dispatch: Dispatch<any>;
  loading: boolean;
}

interface ShopManagerState {

}

class ShopManager extends Component<ShopManagerProps, ShopManagerState> {
  

  componentDidMount() {
    const { dispatch } = this.props;
  }
  
  render() {
    return (
      <GridContent>
        {/* <List<Partial<CardListItemDataType>>
            rowKey="id"
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={[nullData, ...list]}
            renderItem={item => {
              if (item && item.id) {
                return (
                  <List.Item key={item.id}>
                    <Card
                      hoverable
                      className={styles.card}
                      actions={[<a key="option1">操作一</a>, <a key="option2">操作二</a>]}
                    >
                      <Card.Meta
                        avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                        title={<a>{item.title}</a>}
                        description={
                          <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                            {item.description}
                          </Paragraph>
                        }
                      />
                    </Card>
                  </List.Item>
                );
              }
              return (
                <List.Item>
                  <Button type="dashed" className={styles.newButton}>
                    <Icon type="plus" /> 新增产品
                  </Button>
                </List.Item>
              );
            }} 
          />*/}
      </GridContent>
    );
  }
  
}

export default ShopManager;
