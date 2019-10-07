import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';

import styles from './style.less';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import { isEqual, uniqueId } from 'lodash';
import { getImg } from '@/utils/utils';
import { uploadCateImg } from '@/pages/shop/service';

export interface CategoryImageUploadProps {
  value?: string;
  onChange?: (value: string) => void;
}

export interface CategoryImageUploadState {
  value?: string;
  fileList?: UploadFile[];
  loading?: boolean;
}

function getBase64(img: RcFile, callback: Function) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file: any) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('你只能上传 JPG/PNG 文件!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('文件大小不能超过 2MB!');
  }
  return isJpgOrPng && isLt2M;
}

class CategoryImageUpload extends Component<CategoryImageUploadProps, CategoryImageUploadState> {
  state = {
    loading: false,
    fileList: [] as UploadFile[],
    value: '',
  };

  static getDerivedStateFromProps(
    nextProps: CategoryImageUploadProps,
    prevState: CategoryImageUploadState,
  ) {
    if (!prevState || (nextProps && !isEqual(nextProps.value, prevState.value))) {
      const { value } = nextProps;
      return {
        loading: false,
        value: nextProps.value,
        fileList: value && [{
          uid: uniqueId(),
          url: getImg(value),
          status: 'done',
        }] || []
      };
    }
    return null;
  }

  constructor(props: CategoryImageUploadProps) {
    super(props);
  }

  customRequest = (e: any) => {
    uploadCateImg(e.file as RcFile).then((res: any) => {
      const name = res.data.name as string;
      const { fileList=[] } = this.state;

      if (fileList.length > 0) {
        fileList[0].url = getImg(name);
        fileList[0].status = 'done';
      } else {
        fileList.push({
          ...e.file,
          status: 'done',
          url: getImg(name),
          uid: uniqueId(),
        });
      }
      const { onChange } = this.props;
      if (onChange) {
        onChange(name);
      }
      this.setState({
        fileList: this.state.fileList,
        loading: false,
        value: name,
      });
    });
  };

  handleRemove = (file: UploadFile) => {

    const { onChange } = this.props;
    if (onChange) {
      onChange('');
    }
    this.setState({
      fileList: [],
      value: '',
    });
  };

  handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, () =>
        this.setState({
          loading: false,
        }),
      );
    }
  };

  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus-circle'} style={{ fontSize: 26 }} />
      </div>
    );

    const { fileList } = this.state;

    return (
      <Upload
        name="file"
        multiple={true}
        fileList={fileList}
        listType="picture-card"
        customRequest={this.customRequest}
        beforeUpload={beforeUpload}
        onChange={this.handleChange}
        onRemove={this.handleRemove}
        className={styles.imagesUploader}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
    );
  }
}

export default CategoryImageUpload;
