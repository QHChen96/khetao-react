import React, { Component, Fragment } from 'react';
import { Form, Select, InputNumber, Input, Upload, message, Icon, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { CustomCategory } from '@/pages/shop/data';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import { uploadCateImg } from '@/pages/shop/service';
import { getBase64, getImg } from '@/utils/utils';
import CategoryImageUpload from '../image-upload';

interface UploadFileResp {
  data: object;
  file: RcFile | UploadFile;
  headers: object;
  filename: string;
  onSuccess: (response: any, file: UploadFile) => void;
  onProgress: (
    e: {
      percent: number;
    },
    file: UploadFile,
  ) => void;
  onError: (error: Error, response: any, file: UploadFile) => void;
}

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

  handleReset = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.form.resetFields();
  };


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
