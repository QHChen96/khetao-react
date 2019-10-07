import React, { Component, Fragment } from 'react';
import { Dispatch } from 'redux';

import { connect } from 'dva';
import { Button, Table, Avatar, Popconfirm, Icon, Modal, message } from 'antd';

import arrayToTree from 'array-to-tree';
import { sortBy, find } from 'lodash';
import CustomCategoryForm, { BasicCustomCategoryForm } from './customCategoryForm';
import { CustomCategory } from '../../../data';
import { CurrentShop } from '@/models/shop';
import { ShopModelState } from '@/models/shop';
import { getImg } from '@/utils/utils';

interface CustomCategoryState {
  modalVisible: boolean;
  currentCate: Partial<CustomCategory>;
  parentCates: Partial<CustomCategory>[];
}

interface CustomCategoryProps {
  // loading: boolean;
  dispatch?: Dispatch<any>;
  customCategoryList?: CustomCategory[];
  currentShop?: CurrentShop;
}

class CateTable extends Table<CustomCategory> {}
class CateColumn extends Table.Column<CustomCategory> {}

@connect(({ customCategorySettings, shop }: { customCategorySettings: {
  list: CustomCategory[]
}; shop: ShopModelState }) => ({
  customCategoryList: customCategorySettings.list,
  currentShop: shop.currentShop,
}))
class CustomCategoryList extends Component<CustomCategoryProps, CustomCategoryState> {
  cateformRef: BasicCustomCategoryForm | undefined = undefined;

  maxLevel = 2;

  state = {
    modalVisible: false,
    currentCate: {},
    parentCates: [],
  };

  constructor(props: CustomCategoryProps) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'customCategorySettings/fetch',
      });
    }
  }

  handleCreate = (e: React.MouseEvent<HTMLElement>, parentId: number) => {
    e.preventDefault();
    const { id: shopId } = this.props.currentShop as CurrentShop;
    const {
      customCategoryList=[]
    } = this.props;
    const parentCates = customCategoryList.filter(cate => cate.level < this.maxLevel);
    this.setState({
      currentCate: { parentId, shopId },
      modalVisible: true,
      parentCates,
    });
  };

  handleDelete = (e: React.MouseEvent<HTMLElement>, record: CustomCategory) => {
    e.preventDefault();
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'customCategorySettings/delete',
        payload: record.id,
      });
    }
  };

  handleEditCate = (e: React.MouseEvent<HTMLElement>, record: CustomCategory) => {
    e.preventDefault();
    const {
      customCategoryList=[],
    } = this.props;
    const parentCates = customCategoryList.filter(cate => cate.level < this.maxLevel);
    let currentCate = find(customCategoryList, cate => cate.id == record.id) as CustomCategory;
    currentCate = { ...currentCate };
    this.setState({
      currentCate: currentCate,
      modalVisible: true,
      parentCates,
    });
  };

  handleUpdate = (cate: Partial<CustomCategory>) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'customCategorySettings/save',
        payload: cate,
        callback: () => {
          message.success('操作成功!');
        },
      });
      this.setState({
        modalVisible: false,
      });
    }
  };

  handleClose = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { currentCate = {}, parentCates = [], modalVisible } = this.state;
    const {
      customCategoryList,
    } = this.props;
    const datasource: CustomCategory[] = [];
    if (customCategoryList) {
      const flist: CustomCategory[] = customCategoryList.filter(e => e.parentId >= 0);
      datasource.push(
        ...arrayToTree(sortBy(flist, ele => -ele.priority), {
          parentProperty: 'parentId',
          customID: 'id',
        }),
      );
    }

    return (
      <Fragment>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={e => this.handleCreate(e, 0)}>
          添加分类
        </Button>
        <CateTable dataSource={datasource} rowKey="id">
          <CateColumn key="id" title="ID" dataIndex="id"></CateColumn>
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
                  onClick={e => this.handleCreate(e, record.id as number)}
                >
                  添加
                </Button>
                <Button size="small" type="link" onClick={e => this.handleEditCate(e, record)}>
                  编辑
                </Button>
                <Popconfirm
                  title="确认要删除吗？"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  onConfirm={e => this.handleDelete(e as React.MouseEvent<HTMLElement>, record)}
                >
                  <Button size="small" type="link">
                    删除
                  </Button>
                </Popconfirm>
              </span>
            )}
          />
        </CateTable>
        <Modal
          width={480}
          destroyOnClose
          title={(currentCate && '编辑分类') || '新建分类'}
          visible={modalVisible}
          onOk={e => this.cateformRef && this.cateformRef.handleSubmit(e)}
          onCancel={e => this.handleClose(e)}
        >
          <CustomCategoryForm
            wrappedComponentRef={(form: BasicCustomCategoryForm) => (this.cateformRef = form)}
            handleSubmit={this.handleUpdate}
            currentCate={currentCate}
            parentCates={parentCates}
          />
        </Modal>
      </Fragment>
    );
  }
}

export default CustomCategoryList;
