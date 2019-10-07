import { Form, Input, InputNumber, Button, TreeSelect } from 'antd';
import React, { Component } from 'react';
import Upload from 'antd/lib/upload';
import { Category } from '../data';
import { FormComponentProps } from 'antd/es/form';

import { isEqual, map } from 'lodash';
import { TreeNode } from 'antd/lib/tree-select';
import CategoryImageUpload from '../components/image-upload';



const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

interface BasicCategoryFormState {
  loading?: boolean;
  currentCate: Partial<Category>;
}

interface BasicCategoryFormProps extends FormComponentProps {
  handleUpdate: (value: Partial<Category>) => void;
  className?: string;
  currentCate: Partial<Category>;
  parentList: Category[];
}

class BasicCategoryForm extends Component<BasicCategoryFormProps, BasicCategoryFormState> {
  uploadRef: Upload | undefined = undefined;

  static getDerivedStateFromProps(
    nextProps: BasicCategoryFormProps,
    prevState: BasicCategoryFormState,
  ) {
    if (isEqual(nextProps.currentCate, prevState.currentCate)) {
      return null;
    }
    nextProps.form.resetFields();
    return {
      currentCate: nextProps.currentCate,
    };
  }

  static defaultProps = {
    handleUpdate: () => {},
    currentCate: {},
  };

  constructor(props: BasicCategoryFormProps) {
    super(props);
    this.state = {
      currentCate: props.currentCate,
    };
  }

  handleReset = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.form.resetFields();
  };


  handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, handleUpdate } = this.props;
    const { currentCate } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (handleUpdate) {
          const newCate = { ...currentCate, ...values };
          handleUpdate(newCate);
          if (!currentCate.id) {
            form.resetFields();
          }
        }
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { currentCate } = this.state;
    const { parentList } = this.props;

    let treeData: Array<TreeNode> = [];
    if (parentList && parentList.length > 0) {
      treeData = map(parentList, cate => {
        return {
          value: cate.id,
          parentId: cate.parentId,
          title: cate.cateName,
          level: cate.level,
        };
      });
    }

    return (
      <Form {...formItemLayout}>
        {getFieldDecorator('id', { initialValue: currentCate.id })}
        {getFieldDecorator('icon', { initialValue: currentCate.icon })}
        <Form.Item key="parentId" label="上级分类">
          {getFieldDecorator('parentId', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: currentCate.parentId,
          })(
            <TreeSelect
              disabled={true}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeData={treeData}
              treeDataSimpleMode={{ id: 'value', pId: 'parentId' }}
              placeholder="请选择分类"
              treeDefaultExpandAll
            />,
          )}
        </Form.Item>
        <Form.Item key="cateName" label="分类名称">
          {getFieldDecorator('cateName', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: currentCate.cateName,
          })(<Input placeholder="请输入分类名称" autoFocus />)}
        </Form.Item>
        <Form.Item key="i18n" label="国际化">
          {getFieldDecorator('i18n', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: currentCate.i18n,
          })(<Input placeholder="请输入国际化" />)}
        </Form.Item>
        <Form.Item key="priority" label="排序">
          {getFieldDecorator('priority', {
            rules: [
              {
                required: true,
              },
            ],
            initialValue: currentCate.priority,
          })(<InputNumber min={0} />)}
        </Form.Item>
        <Form.Item key="icon" label="图片">
          {getFieldDecorator('icon', {
            rules: [
              {
                required: false,
              },
            ],
            initialValue: currentCate.icon,
          })(
            <CategoryImageUpload />
          )}
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 8 }}>
          <Button type="primary" onClick={this.handleSubmit}>
            保存
          </Button>
          <Button type="default" onClick={this.handleReset}>
            重置
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create<BasicCategoryFormProps>()(BasicCategoryForm);
