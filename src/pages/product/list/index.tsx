import { Row, Col, Card, Table, Input } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import { Product } from '../data';
import Form from 'antd/es/form';
import Button from 'antd/es/button';

class ProductTable extends Table<Product> {}
class ProductColumn extends Table.Column<Product> {}

const data: Product[] = [{
  id: 10000,
  prodNo: 'adi92jj9k5',
  prodName: '花衬衫',
  summary: '2019年最新款花衬衫',
  categoryName: '衣服',
  saleType: 1,
  status: 1,
  saleVolume: 10,
  quantity: 10,
  artNo: 'HCS1000',
  saleStatus: 1,
  price: 20,
  picUrl: 'https://img.alicdn.com/tfs/TB1Z9VcaQ9E3KVjSZFGXXc19XXa-210-260.jpg',
}, {
  id: 10001,
  prodNo: 'adi92jj9k4',
  prodName: '包包',
  summary: '2019年最新款包包',
  categoryName: '衣服',
  saleType: 1,
  status: 1,
  saleVolume: 10,
  quantity: 10,
  artNo: 'HCS1000',
  saleStatus: 1,
  price: 20,
  picUrl: 'https://img.alicdn.com/tfs/TB1Z9VcaQ9E3KVjSZFGXXc19XXa-210-260.jpg',
}];

class ProductList extends Component {
  render() {
    return(
      <GridContent>
        <Row gutter={24}>
          <Col md={24}>
            <Card>
              <Form className={styles.searchForm}>
                <Form.Item label="名称" style={{ width: '20%', display: 'inline-block' }}>
                  <Input type="text" placeholder="产品名称" />
                </Form.Item>
                <Form.Item label="分类" style={{ width: '20%', display: 'inline-block' }}>
                  <Input type="text" placeholder="产品分类" />
                </Form.Item>
                <Form.Item label="标题" style={{ width: '20%', display: 'inline-block' }}>
                  <Input type="text" placeholder="产品标题" />
                </Form.Item>
                <Form.Item style={{ marginLeft: '10px', display: 'inline-block' }}>
                  <Button type="primary">搜索</Button>
                </Form.Item>
              </Form>
              <ProductTable dataSource={data} rowKey="id">
                <ProductColumn key="id" title="ID" dataIndex="id"/>
                <ProductColumn key="picUrl" title="图片" dataIndex="picUrl"
                  render={(picUrl) => (
                    <img src={picUrl} width='64px' height='64px'/>
                  )}
                />
                <ProductColumn key="prodNo" title="编号" dataIndex="prodNo"/>
                <ProductColumn key="prodName" title="产品名称" dataIndex="prodName"/>
                <ProductColumn key="summary" title="标题" dataIndex="summary"/>
                <ProductColumn key="cateName" title="所属分类" dataIndex="id"/>
                <ProductColumn key="saleVolume" title="销量" dataIndex="saleVolume"/>
                <ProductColumn key="quantity" title="库存" dataIndex="quantity"/>
                <ProductColumn key="artNo" title="货号" dataIndex="artNo"/>
                <ProductColumn key="price" title="单价" dataIndex="price"/>
              </ProductTable>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default ProductList;