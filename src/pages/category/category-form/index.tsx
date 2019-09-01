import { Form, Icon, Modal, Input, InputNumber, Button, message } from "antd";
import React, { Component, PureComponent } from 'react';
import Upload, { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";
import { Category } from "../data";
import { FormComponentProps } from "antd/es/form";

import { isEqual } from "lodash";


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
  previewVisible: boolean;
  currentCate: Partial<Category>;
  previewImage: string | undefined;
}

interface BasicCategoryFormProps extends FormComponentProps {
  handleUpdate: (value: Partial<Category>) => void;
  className?: string;
  currentCate: Partial<Category>;
}


class BasicCategoryForm extends Component<BasicCategoryFormProps, BasicCategoryFormProps> {

  static getDerivedStateFromProps(nextProps: BasicCategoryFormProps, prevState: BasicCategoryFormState) {
    if (isEqual(nextProps.currentCate, prevState.currentCate)) {
      return null;
    }
    nextProps.form.resetFields();
    return {
      currentCate: nextProps.currentCate,
      previewVisible: false,
      previewImage: ''
    }
  }

  static defaultProps = {
    handleUpdate: () => { },
    currentCate: {}
  }

  constructor(props: BasicCategoryFormProps) {
    super(props);
    this.state = {
      currentCate: props.currentCate,
      previewVisible: false,
      previewImage: '',
    };
  }

  handleReset = (event: React.MouseEvent) => {
    event.preventDefault();
    this.props.form.resetFields();
  }

  handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, handleUpdate } = this.props;
    const { currentCate } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        message.success("操作成功!");
        if (handleUpdate) {
          const newCate = { ...currentCate, ...values }
          handleUpdate(newCate);
        }
      }
    });
  }

  getBase64 = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handlePreview = async (file: UploadFile) => {
    const { previewImage } = this.state;
    let preview: any = '';
    if (!file.url && !previewImage) {
      preview = await this.getBase64(file.originFileObj as File);
      this.setState({
        previewImage: preview,
        previewVisible: true,
      });
    } else if (!previewImage) {
      this.setState({
        previewImage: file.url,
        previewVisible: true,
      });
    } else {
      this.setState({
        previewVisible: true,
      });
    }
  }

  handleCancel = () => {
    this.setState({ previewVisible: false });
  }

  normFile = (e: UploadChangeParam) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }


  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { previewVisible, previewImage, currentCate } = this.state;
    return (
      <Form {...formItemLayout} >
        <Form.Item
          key="parentName"
          label="上级分类"
        >
          {
            getFieldDecorator('parentName')(
              <Input readOnly />
            )
          }
        </Form.Item>
        <Form.Item
          key="cateName"
          label="分类名称"
        >
          {
            getFieldDecorator('cateName', {
              rules: [
                {
                  required: true
                }
              ],
              initialValue: currentCate.cateName
            })(
              <Input placeholder="请输入分类名称" autoFocus />
            )
          }
        </Form.Item>
        <Form.Item
          key="i18n"
          label="国际化"
        >
          {
            getFieldDecorator('i18n', {
              rules: [
                {
                  required: true
                }
              ],
              initialValue: currentCate.i18n
            })(
              <Input placeholder="请输入国际化" />
            )
          }
        </Form.Item>
        <Form.Item
          key="priority"
          label="排序"
        >
          {
            getFieldDecorator('priority', {
              rules: [
                {
                  required: true
                }
              ],
              initialValue: currentCate.priority
            })(
              <InputNumber min={0} />
            )
          }
        </Form.Item>
        <Form.Item
          key="imageUrls"
          label="图片"
        >
          {
            getFieldDecorator('imageUrls', {
              rules: [
                {
                  required: true
                }
              ],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: currentCate.imageUrls
            })(
              <Upload
                listType="picture-card"
                onPreview={this.handlePreview}
              >
                {
                  (!getFieldValue("imageUrls") || getFieldValue("imageUrls").length === 0)
                  &&
                  (<div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传</div>
                  </div>)

                }
              </Upload>
            )
          }
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="图片" style={{ width: '100%' }} src={previewImage} />
          </Modal>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
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