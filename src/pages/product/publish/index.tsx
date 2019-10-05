import { Row, Col, Input, Steps, Icon, Upload, Form, Radio, Button, Select } from 'antd';
import React, { Component } from 'react';

import { GridContent } from '@ant-design/pro-layout';
import styles from './style.less';
import { ProdSku, SkuPropName } from '../data';
import { FormComponentProps } from 'antd/es/form';

import SkuForm from './sku-form';

function getBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

const steps = [
  {
    title: '编辑基本信息',
  },
  {
    title: '编辑商品详情',
  },
];

// 当前级别 、 剩余级别 、 归并

const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">添加图片</div>
  </div>
);

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

class MyProdPublishForm extends Component<ProdPublishFormProps, ProdPublishFormState> {
  state = {
    skuProps: [],
  };

  render() {
    const { skuProps } = this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <div className={styles.stepsContent}>
        <Form {...formItemLayout}>
          <h3>基本信息</h3>
          <Form.Item label="产品名" required>
            <Input type="text" placeholder="请输入产品名" />
          </Form.Item>
          <Form.Item label="标题" required>
            <Input type="text" placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="商品图" required>
            <Upload listType="picture-card"></Upload>
          </Form.Item>
          <Form.Item label="商品类目" required>
            <Select></Select>
          </Form.Item>
          <Form.Item label="店铺分类" required>
            <Select></Select>
          </Form.Item>
          <h3>价格库存</h3>
          <Form.Item label="商品规格" required>
            {getFieldDecorator('skuProps', {
              initialValue: skuProps,
            })(<SkuForm />)}
          </Form.Item>
          <Form.Item label="价格" required>
            <Input />
          </Form.Item>
          <Form.Item label="划线价格">
            <Input />
          </Form.Item>
          <Form.Item label="减库存的方式" required>
            <Radio.Group>
              <Radio value={1}>拍下减库存</Radio>
              <Radio value={2}>付款减库存</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const ProdPublishForm = Form.create<ProdPublishFormProps>()(MyProdPublishForm);

interface ProdPublishFormProps extends FormComponentProps {
  className?: string;
}

interface ProdPublishFormState {
  skus?: ProdSku[];
  skuProps: SkuPropName[];
}

export interface ProductPublishProps {
  className?: string;
  defaultCurrent: number;
}

interface ProductPublishState {
  current: number;
}

class ProductPublish extends Component<ProductPublishProps, ProductPublishState> {
  static defaultProps = {
    className: '',
    defaultCurrent: 0,
    onNext: () => {},
    onPrev: () => {},
  };

  constructor(props: ProductPublishProps) {
    super(props);
    this.state = {
      current: props.defaultCurrent,
    };
  }

  onNext = () => {
    const current = this.state.current + 1;
    this.setState({ current });
  };

  onPrev = () => {
    const current = this.state.current - 1;
    this.setState({ current });
  };

  handleSubmit = (e: React.FormEvent) => {};

  handleChangeSku = () => {};

  render() {
    const { current } = this.state;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col span={24}>
            <div className={styles.stepsMain}>
              <Steps progressDot current={current}>
                {steps.map(item => (
                  <Steps.Step key={item.title} title={item.title}></Steps.Step>
                ))}
              </Steps>
              <ProdPublishForm></ProdPublishForm>
              <div className={styles.stepsFooter}>
                {current > 0 && (
                  <Button style={{ marginRight: 8 }} onClick={this.onPrev}>
                    上一步
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button type="primary" onClick={this.onNext}>
                    下一步
                  </Button>
                )}
                {current === steps.length - 1 && <Button type="primary">完成</Button>}
              </div>
            </div>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default ProductPublish;
