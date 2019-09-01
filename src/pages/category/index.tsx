import { Row, Col, Card, Table, Button, Avatar } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';

import { Category } from './data.d';
import arrayToTree from 'array-to-tree';
import CategoryForm from './category-form';
import { StateType } from './model';

import { sortBy, find } from 'lodash';




class CateTable extends Table<Category> {}
class CateColumn extends Table.Column<Category> {}

interface CategoryState {
  maxLevel: number;
  currentCate?: Category
}

interface CategoryProps {
  loading: boolean; 
  dispatch: Dispatch<any>;
  categoryList: StateType;
}
@connect(
  ({
    categoryList,
    loading,
  }: {
    categoryList: StateType;
    loading: {
      models: { [key: string]: any };
    };
  }) => ({
    categoryList,
    loading: loading.models.category,
  })
)
class CategoryList extends Component<
  CategoryProps,
  CategoryState
> {
  state: CategoryState = {
    maxLevel: 3,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/fetch',
    })
  }

  handleEditCate = (id?: number | string) => {
    if (!id) {
      return;
    }
    const cate = find(this.props.categoryList.data.list, ele => ele.id === id);
    if (!cate) {
      return;
    }
    this.setState({
      currentCate: cate
    });
  }

  handleUpdateCate = (category: Partial<Category>) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/save',
      payload: category,
    })
  }

  render() {
    const { 
      categoryList: { data }, 
      loading 
    } = this.props;
    const { maxLevel, currentCate } = this.state;

    const datasource = arrayToTree(sortBy(data.list, ele => -ele.priority), {
      parentProperty: 'parentId',
      customID: 'id'
    })

    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={16} md={24}>
           
            <Card bordered={false} loading={loading}>
              <Button type="primary" style={{ marginBottom: 16 }}>
                添加分类
              </Button>
              {!loading ? (
                <CateTable 
                  dataSource={datasource} 
                  rowKey="id"
                >
                  <CateColumn key="id" title="ID" dataIndex="id"/>
                  <CateColumn key="imageUrls" title="图标" dataIndex="imageUrls" render={
                    (imageUrls) =>
                    (imageUrls && imageUrls.length > 0) && (<Avatar size={52} src={imageUrls[0].url} shape="square"/>)
                      || (<Avatar size={52} shape="square"/>)
                  }/>
                  <CateColumn key="cateName" title="分类名称" dataIndex="cateName"/>
                  <CateColumn key="i18n" title="国际化" dataIndex="i18n"/>
                  <CateColumn key="priority" title="排序" dataIndex="priority"/>
                  <CateColumn align="center" key="operation" title="操作" dataIndex="operation" 
                    render={(text, record, index) =>
                      (<span>
                        <Button size="small" type="link" disabled={ record.level >= maxLevel }>添加</Button>
                        <Button size="small" type="link" onClick={() => this.handleEditCate(record.id)}>编辑</Button>
                        <Button size="small" type="link">删除</Button>
                      </span>)
                    }
                  />
                </CateTable>
              ) : null}
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card title="分类信息">
              {
                currentCate && (
                  <CategoryForm 
                    currentCate={ currentCate }
                    handleUpdate={ this.handleUpdateCate }></CategoryForm>
                )
              }
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }

}

export default CategoryList;