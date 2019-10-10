import React, { Component, Fragment } from 'react';
import { Form, Select, InputNumber, Input, Modal } from 'antd';
import { FormComponentProps } from 'antd/lib/form';

import CategoryImageUpload from '../image-upload';
import { CustomCategory } from '@/models/custom-category';

export interface CustomCategoryFormProps extends FormComponentProps {
  currentCate: Partial<CustomCategory>;
  parentCates?: Partial<CustomCategory>[];
  handleSubmit: (value: Partial<CustomCategory>) => void;
}

interface CustomCategoryFormState {
  previewImage: string | undefined;
  previewVisible: boolean;
}

export class BasicCustomCategoryForm extends Component<
  CustomCategoryFormProps,
  CustomCategoryFormState
> {
  state = {
    previewVisible: false,
    previewImage: '',
  };

  renderSelect = () => {
    const { parentCates = [] } = this.props;
    return (
      <Select>
        {parentCates.map((cate: Partial<CustomCategory>) => (
          <Select.Option key={cate.id} value={cate.id}>
            {cate.cateName}
          </Select.Option>
        ))}
      </Select>
    );
  };

  handleReset = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    this.props.form.resetFields();
  };

  handleCancel = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    this.setState({
      previewVisible: false,
      previewImage: '',
    });
  }

  handleSubmit = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { form, handleSubmit, currentCate } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (handleSubmit) {
          const newCate = { ...currentCate, ...values };
          handleSubmit(newCate);
          if (!currentCate.id) {
            form.resetFields();
          }
        }
      }
    });
  };


  render() {
    const {
      form: { getFieldDecorator },
      currentCate = {},
    } = this.props;
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="父分类" key="parentId">
            {getFieldDecorator('parentId', {
              initialValue: currentCate.parentId,
            })(this.renderSelect())}
          </Form.Item>
          <Form.Item label="分类名称" key="cateName">
            {getFieldDecorator('cateName', {
              initialValue: currentCate.cateName,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="国际化" key="i18n">
            {getFieldDecorator('i18n', {
              initialValue: currentCate.i18n,
            })(<Input />)}
          </Form.Item>
          <Form.Item label="排序" key="priority">
            {getFieldDecorator('priority', {
              initialValue: currentCate.priority,
            })(<InputNumber />)}
          </Form.Item>
          <Form.Item key="icon" label="图片">
            {getFieldDecorator('icon', {
              initialValue: currentCate.icon,
            })(
              <CategoryImageUpload/>
            )}
            
            <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
              <img alt="图片" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
          </Form.Item>
        </Form>
      </Fragment>
    );
  }
}

export default Form.create<CustomCategoryFormProps>()(BasicCustomCategoryForm);
