import React, { Component } from 'react';
import { Upload, Icon, message } from 'antd';

import styles from './style.less';
import { UploadFile, RcFile } from 'antd/lib/upload/interface';
import { isEqual, uniqueId } from 'lodash';
import { uploadProductImg } from '@/pages/product/service';
import { getImg } from '@/utils/utils';

export interface ProductImagesUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

export interface ProductImagesUploadState {
  value: string[];
  fileList: UploadFile[];
  loading: boolean;
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

class ProductImagesUpload extends Component<ProductImagesUploadProps, ProductImagesUploadState> {
  state = {
    loading: false,
    fileList: [] as UploadFile[],
    value: [] as string[],
  };

  static getDerivedStateFromProps(
    nextProps: ProductImagesUploadProps,
    prevState: ProductImagesUploadState,
  ) {
    if (!prevState || (nextProps && !isEqual(nextProps.value, prevState.value))) {
      const { value = [] } = nextProps;
      return {
        loading: false,
        value: nextProps.value,
        fileList: value.map((url: string) => ({
          uid: uniqueId(),
          url: getImg(url),
          status: 'done',
        })),
      };
    }
    return null;
  }

  constructor(props: ProductImagesUploadProps) {
    super(props);
  }

  customRequest = (e: any) => {
    uploadProductImg(e.file as RcFile).then((res: any) => {
      const name = res.data.name as string;
      const { fileList=[], value=[] } = this.state;
      const index = fileList.findIndex((n: UploadFile) => n.uid === e.file.uid);
      if (index > -1) {
        fileList[index].url = getImg(name);
        fileList[index].status = 'done';
        value[index] = name;
      } else {
        fileList.push({
          ...e.file,
          status: 'done',
          url: getImg(name),
          uid: uniqueId(),
        });
        value.push(name);
      }
      const { onChange } = this.props;
      if (onChange) {
        onChange(value);
      }
      this.setState({
        fileList: this.state.fileList,
        loading: false,
        value: value,
      });
    });
  };

  handleRemove = (file: UploadFile) => {
    const { fileList, value } = this.state;
    const newFileList = fileList.filter((e: UploadFile) => e.uid !== file.uid);
    const newValue = value.filter((url: string) => getImg(url) !== file.url);
    const { onChange } = this.props;
    if (onChange) {
      onChange(newValue);
    }
    this.setState({
      fileList: newFileList,
      value: newValue,
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
        {uploadButton}
      </Upload>
    );
  }
}

export default ProductImagesUpload;
