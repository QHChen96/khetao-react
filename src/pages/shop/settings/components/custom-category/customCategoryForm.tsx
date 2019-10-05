import React, { Component, Fragment } from 'react';
import { Form, Select, InputNumber, Input, Upload, message, Icon, Modal } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { CustomCategory } from '@/pages/shop/data';
import { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import { uploadCateImg } from '@/pages/shop/service';
import { getBase64, getImg } from '@/utils/utils';

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

  customRequest = (object: object) => {
    const { file, onProgress, onSuccess } = object as UploadFileResp;
    const { setFields } = this.props.form;
    uploadCateImg(file as RcFile)
      .then(
        response => {
          onProgress({ percent: 100 }, file as UploadFile);
          onSuccess(response, file as UploadFile);
        },
        err => {
          setFields({
            imageFiles: {
              value: [],
              errors: [new Error('upload error!')],
            },
          });
        },
      )
      .catch(err => {
        onProgress({ percent: 100 }, file as UploadFile);
        setFields({
          imageFiles: {
            value: [],
            errors: [new Error('upload error!')],
          },
        });
      });
  };

  handleSubmit = (event: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const { form, handleSubmit, currentCate } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (handleSubmit) {
          const icon = values.imageFiles.map((f: any) => f.name).join(',');
          const newCate = { ...currentCate, ...values, icon: icon };
          handleSubmit(newCate);
          if (!currentCate.id) {
            form.resetFields();
          }
        }
      }
    });
  };

  handlePreview = async (file: UploadFile) => {
    const { previewImage } = this.state;
    let preview: any = '';
    if (!file.url && !previewImage) {
      preview = await getBase64(file.originFileObj as File);
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
  };

  handleCancel = () => {
    this.setState({ previewVisible: false });
  };

  handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      return;
    }
    // if (info.file.status === 'done') {
    //   const { response } = info.file;
    //   if (response && response.data) {
    //     const { setFieldsValue } = this.props.form;
    //     const newFile = [{
    //       uid: response.data.uid,
    //       status: 'done',
    //       name: response.data.name,
    //       url: getImg(response.data.name)
    //     }];
    //     setFieldsValue({
    //       imageFiles: newFile
    //     });
    //   }
    // }
  };

  handleUploadRemove = (file: UploadFile) => {
    const { setFieldsValue } = this.props.form;
    setFieldsValue({
      imageFiles: [],
    });
  };

  handleSuccess = (response: any, file: UploadFile) => {
    if (response && response.data) {
      const { setFieldsValue } = this.props.form;
      const newFile = [
        {
          uid: response.data.uid,
          status: 'done',
          name: response.data.name,
          url: getImg(response.data.name),
        },
      ];
      setFieldsValue({
        imageFiles: newFile,
      });
    }
  };

  beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  normFile = (e: UploadChangeParam) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldValue },
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
          <Form.Item key="imageFiles" label="图片">
            {getFieldDecorator('imageFiles', {
              rules: [
                {
                  required: false,
                },
              ],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
              initialValue: currentCate.imageFiles,
            })(
              <Upload
                accept="image/jpg,image/png"
                customRequest={this.customRequest}
                listType="picture-card"
                onPreview={this.handlePreview}
                beforeUpload={this.beforeUpload}
                onChange={this.handleUploadChange}
                onRemove={this.handleUploadRemove}
                onSuccess={this.handleSuccess}
              >
                {(!getFieldValue('imageFiles') || getFieldValue('imageFiles').length === 0) && (
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传</div>
                  </div>
                )}
              </Upload>,
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
