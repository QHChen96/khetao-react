import React, { Component, Dispatch, Fragment, LegacyRef, ReactElement } from "react";

import { connect } from "dva";
import { Button, Table, Avatar, Popconfirm, Icon, Modal, message } from "antd";
import { CustomCategory } from "@/pages/shop/data";
import arrayToTree from "array-to-tree";
import { sortBy } from "lodash";
import CustomCategoryForm, { CustomCategoryFormProps, BasicCustomCategoryForm } from "./customCategoryForm";

const list: CustomCategory[] = [
  {
    id: 1,
    cateName: '裤子',
    parentId: 0,
    level: 1,
    priority: 10,
    i18n: 'kuzi',
    imageUrls: [],
  },
  {
    id: 2,
    cateName: '短裤',
    parentId: 1,
    level: 1,
    priority: 10,
    i18n: 'kuzi',
    imageUrls: [],
  }
];

interface CustomCategoryState {
  modalVisible: boolean;
  currentCate: Partial<CustomCategory>;
  parentCates: Partial<CustomCategory>[];
}

interface CustomCategoryProps {
  // loading: boolean; 
  // dispatch: Dispatch<any>;
  // customCategoryList: CustomCategory[];
}

class CateTable extends Table<CustomCategory> {}
class CateColumn extends Table.Column<CustomCategory> {}

@connect()
class CustomCategoryList extends Component<CustomCategoryProps, CustomCategoryState> {

  cateformRef: BasicCustomCategoryForm | undefined = undefined;

  maxLevel = 2;

  state = {
    modalVisible: false,
    currentCate: {},
    parentCates: []
  }

  constructor(props: CustomCategoryProps) {
    super(props);
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'customCategory/fetch',
    // });
  }

  handleCreate = (e: React.MouseEvent<HTMLElement>, parentId: number) => {
    e.preventDefault();
    const parentCates = list.filter(cate => cate.level < this.maxLevel);
    this.setState({
      currentCate: { parentId },
      modalVisible: true,
      parentCates
    });
  }

  handleDelete = (e: React.MouseEvent<HTMLElement>, record: CustomCategory) => {
    e.preventDefault();
  }

  handleEditCate = (e: React.MouseEvent<HTMLElement>, record: CustomCategory) => {
    e.preventDefault();

  }

  handleUpdate = (cate: Partial<CustomCategory>) => {
    message.info(JSON.stringify(cate));
  }




  render() {
    const { currentCate={}, parentCates=[], modalVisible } = this.state;
    const datasource: CustomCategory[] = [];
    if (list) {
      const flist:CustomCategory[] = list.filter(e => e.parentId >= 0);
      datasource.push(...arrayToTree(
        sortBy(flist, ele => -ele.priority), {
          parentProperty: 'parentId',
          customID: 'id'
      }));
    };
    
    return (
      <Fragment>
        <Button 
          type="primary" 
          style={{ marginBottom: 16 }}
          onClick={ (e) => this.handleCreate(e, 0) }>
          添加分类
        </Button>
        <CateTable 
          dataSource={datasource}
          rowKey="id"
        >
          <CateColumn key="id" title="ID" dataIndex="id"></CateColumn>
          <CateColumn key="imageUrls" title="图标" dataIndex="imageUrls" 
            render={
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
                  onClick={ (e) => this.handleCreate(e, record.id as number) }>添加</Button>
                <Button size="small" type="link" onClick={(e) => this.handleEditCate(e, record)}>编辑</Button>
                <Popconfirm
                  title="确认要删除吗？"
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                  onConfirm={e => this.handleDelete(e as React.MouseEvent<HTMLElement>, record)}
                >
                  <Button size="small" type="link">删除</Button>
                </Popconfirm>
              </span>)
            }
          />
        </CateTable>
        <Modal 
          width={480}
          destroyOnClose
          title={currentCate && '编辑分类' || '新建分类'}
          visible={modalVisible}
          onOk={(e) => this.cateformRef.handleSubmit(e)}
        >
          <CustomCategoryForm
            wrappedComponentRef={(form: BasicCustomCategoryForm) => (this.cateformRef = form)}
            handleSubmit={this.handleUpdate}
            currentCate={currentCate}
            parentCates={parentCates}
          />
        </Modal>
      </Fragment>
    )
  }

}

export default CustomCategoryList;