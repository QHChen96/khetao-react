import React, { Component, Fragment } from 'react';
import { Upload } from 'antd';

export interface ProductPropImagesUploadProps {
  value?: string[];
  onChange?: (value: string[]) => void;
}

class ProductPropImagesUpload extends Component<ProductPropImagesUploadProps> {
  render() {
    return (
      <Fragment>
        <Upload></Upload>
      </Fragment>
    );
  }
}

export default ProductPropImagesUpload;
