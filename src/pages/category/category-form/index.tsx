import { Form, Icon, Modal, Input, InputNumber, Button, message, TreeSelect } from 'antd';
import React, { Component } from 'react';
import Upload, { UploadChangeParam } from 'antd/lib/upload';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import { Category } from '../data';
import { FormComponentProps } from 'antd/es/form';

import { isEqual, map } from 'lodash';
import { TreeNode } from 'antd/lib/tree-select';
import { getBase64, getImg } from '@/utils/utils';
import { uploadCateImg } from '../service';

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
  uploadLoading: boolean;
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
      previewVisible: false,
      previewImage: '',
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
      previewVisible: false,
      previewImage: '',
      uploadLoading: false,
    };
  }

  saveUploadRef = (uploadRef: Upload) => {
    this.uploadRef = uploadRef;
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

  handleSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, handleUpdate } = this.props;
    const { currentCate } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        if (handleUpdate) {
          const icon = values.imageFiles.map((f: any) => f.name).join(',');
          const newCate = { ...currentCate, ...values, icon: icon };
          handleUpdate(newCate);
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
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { currentCate, previewVisible, previewImage } = this.state;
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
              ref={(ref: Upload) => this.saveUploadRef(ref)}
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
          <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
            <img alt="图片" style={{ width: '100%' }} src={previewImage} />
          </Modal>
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
