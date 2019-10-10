import { Row, Col, Card, Table, Button, Avatar, message, Icon, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import { connect } from 'dva';
import arrayToTree from 'array-to-tree';
import CategoryForm from './components/category-form';
import { sortBy, find, filter } from 'lodash';
import { getImg } from '@/utils/utils';
import { Dispatch } from '@/models/connect';
import { Category } from '@/models/category';

class CateTable extends Table<Category> {}
class CateColumn extends Table.Column<Category> {}

interface CategoryState {
  maxLevel: number;
  currentCate: Partial<Category>;
  parentList: Array<Partial<Category>>;
}

interface CategoryProps {
  loading: boolean;
  dispatch: Dispatch;
  categoryList: Category[];
}
@connect(
  ({
    categorySettings,
    loading,
  }: {
    categorySettings: {
      list: Category[];
    };
    loading: any;
  }) => {
 
    const { list } = categorySettings;
    return {
      categoryList: list,
      loading: loading.models.categorySettings,
    };
  },
)
class CategoryList extends Component<CategoryProps, CategoryState> {
  maxLevel = 3;
  state = {
    maxLevel: 3,
    currentCate: {},
    parentList: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: "categorySettings/fetch"
      })
    }
  }

  createNewCate = (e: React.MouseEvent<HTMLElement>, parentId: number | string) => {
    e.preventDefault();

    const {
      categoryList,
    } = this.props;
    const parentList = filter(categoryList, ele => ele.level < this.maxLevel);
    console.log(parentList);
    this.setState({
      currentCate: { parentId: parentId },
      parentList: parentList,
    });
  };

  handleDelete = (e: React.MouseEvent<HTMLElement>, record: Category) => {
    e.preventDefault();
    const id = record.id;
    if (!id) {
      return;
    }
    const isParent = record.children && record.children.length > 0;
    if (isParent) {
      message.error('请删除子类后再试!');
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'categorySettings/delete',
      payload: id,
    });
  };

  handleEditCate = (e: React.MouseEvent<HTMLElement>, record: Category) => {
    e.preventDefault();
    const id = record.id;
    if (!id) {
      return;
    }
    const {
      categoryList,
    } = this.props;
    if (!categoryList || categoryList.length === 0) {
      return;
    }
    let cate = find(categoryList, ele => ele.id === id) as Category;
    if (!cate) {
      return;
    }
    cate = { ...cate };
    const parentList = filter(categoryList, ele => ele.level < this.maxLevel && ele.id != cate.id);
    this.setState({
      currentCate: cate,
      parentList: parentList,
    });
  };

  handleUpdateCate = (category: Partial<Category>) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'categorySettings/save',
      payload: category,
      callback: () => {
        message.success('操作成功!');
      },
    });
  };

  render() {
    const {
      categoryList=[],
      loading,
    } = this.props;
    const { currentCate = {}, parentList = [] } = this.state;
    let datasource: Category[] = [];
    if (categoryList && categoryList.length > 0) {
      const flist: Category[] = categoryList.filter(e => e.parentId >= 0);
      datasource = arrayToTree(sortBy(flist, ele => -ele.priority), {
        parentProperty: 'parentId',
        customID: 'id',
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
                onClick={e => this.createNewCate(e, 0)}
              >
                添加分类
              </Button>
              {!loading ? (
                <CateTable dataSource={datasource} rowKey="id">
                  <CateColumn key="id" title="ID" dataIndex="id" />
                  <CateColumn
                    key="icon"
                    title="图标"
                    dataIndex="icon"
                    render={icon => <Avatar size={52} src={getImg(icon)} shape="square" />}
                  />
                  <CateColumn key="cateName" title="分类名称" dataIndex="cateName" />
                  <CateColumn key="i18n" title="国际化" dataIndex="i18n" />
                  <CateColumn key="priority" title="排序" dataIndex="priority" />
                  <CateColumn
                    align="center"
                    key="operation"
                    title="操作"
                    dataIndex="operation"
                    render={(text, record, index) => (
                      <span>
                        <Button
                          size="small"
                          type="link"
                          disabled={record.level >= this.maxLevel}
                          onClick={e => this.createNewCate(e, record.id as number)}
                        >
                          添加
                        </Button>
                        <Button
                          size="small"
                          type="link"
                          onClick={e => this.handleEditCate(e, record)}
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="确认要删除吗？"
                          icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                          onConfirm={e =>
                            this.handleDelete(e as React.MouseEvent<HTMLElement>, record)
                          }
                        >
                          <Button size="small" type="link">
                            删除
                          </Button>
                        </Popconfirm>
                      </span>
                    )}
                  />
                </CateTable>
              ) : null}
            </Card>
          </Col>
          <Col lg={8} md={24}>
            <Card title="分类信息">
              {currentCate && (
                <CategoryForm
                  currentCate={currentCate}
                  handleUpdate={this.handleUpdateCate}
                  parentList={parentList}
                ></CategoryForm>
              )}
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default CategoryList;
