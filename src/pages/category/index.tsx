import { Row, Col, Card, Table, Button, Avatar } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { Dispatch } from 'redux';
import { connect } from 'dva';

import { Category } from './data.d';
import arrayToTree from 'array-to-tree';
import CategoryForm from './category-form';
import { StateType } from './model';

import { sortBy, find, filter } from 'lodash';




class CateTable extends Table<Category> {}
class CateColumn extends Table.Column<Category> {}

interface CategoryState {
  maxLevel: number;
  currentCate: Partial<Category>;
  parentList: Array<Partial<Category>>;
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
  maxLevel = 3;
  state = {
    maxLevel: 3,
    currentCate: {},
    parentList: []
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'categoryList/fetch',
    });
  }

  componentDidUpdate() {
    console.log("update");
  }

  createNewCate = (e: React.MouseEvent ,parentId: number|string) => {
    e.preventDefault();
    const { data: { list } } = this.props.categoryList;
    const parentList = filter(list, ele => ele.level < this.maxLevel);
    this.setState({
      currentCate: { parentId: parentId },
      parentList: parentList,
    });
  }

  handleEditCate = (id?: number | string) => {
    if (!id) {
      
      return;
    }
    const { data: { list } } = this.props.categoryList;
    if (!list || list.length === 0) {
      return;
    }
    const cate = find(list, ele => ele.id === id);
    if (!cate) {
      return;
    }
    const parentList = filter(list, ele => ele.level < this.maxLevel && ele.id != cate.id);
    this.setState({
      currentCate: cate,
      parentList: parentList,
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
    console.log('render');
    const { 
      categoryList: { data },
      loading 
    } = this.props;
    const { currentCate={}, parentList=[] } = this.state;
    let datasource: Category[] = [];
    if (data && data.list) {
      const flist:Category[] = data.list.filter(e => e.parentId >= 0);
      datasource = arrayToTree(
        sortBy(flist, ele => -ele.priority), {
          parentProperty: 'parentId',
          customID: 'id'
      });
    }
    return (
      <GridContent>
        <Row gutter={24}>
          <Col lg={16} md={24}>
           
            <Card bordered={false} loading={loading}>
              <Button 
                type="primary" 
                style={{ marginBottom: 16 }}
                onClick={ (e) => this.createNewCate(e, 0) }>
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
                        <Button 
                          size="small" 
                          type="link" 
                          disabled={ record.level >= this.maxLevel }
                          onClick={ (e) => this.createNewCate(e, record.id as number) }>添加</Button>
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
                    handleUpdate={ this.handleUpdateCate }
                    parentList={ parentList }></CategoryForm>
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