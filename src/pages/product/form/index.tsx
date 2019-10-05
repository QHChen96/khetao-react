import { GridContent } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Card, Button, Input } from 'antd';

import styles from './style.less';
import { FormComponentProps } from 'antd/es/form';
import { ProductSpu } from '../data';

import ProductSkuPropInput from './components/sku-prop-input';
import ProductSkuList from './components/sku-list/';
import DimensionInput from './components/dimension-input';
import { connect } from 'dva';
import CurrencyInput from '../../../components/currency-input/index';
import IntegerInput from '@/components/integer-input';
import ProductImagesUpload from '@/pages/product/form/components/images-upload';
import ProductPropImagesUpload from './components/prop-images-upload';
import ProductWholesalesInput from './components/wholesales-input';
import UnitInput from '../../../components/unit-input/index';

const { Item: FormItem } = Form;

const cardProps = {
  className: styles.cardItem,
  headStyle: { border: 'none' },
  bordered: false,
};

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

const images: string[] = [
  'http://img.khetao.com/avatar/ec5ec0a93577f768/5d86efc57a6c94059a424e4b.jpeg',
  'http://img.khetao.com/c1/ec5ec0a93577f768/5d87000b7a6cc4bf0ea45582.jpeg',
];

export interface ProductFormProp extends FormComponentProps {
  localConfig?: {
    currency: string;
  };
}

interface ProductFormState {
  product: Partial<ProductSpu>;
}

@connect()
class ProductForm extends Component<ProductFormProp, ProductFormState> {
  static defaultProps = {
    localConfig: {
      currency: 'CNY',
    },
  };

  constructor(props: ProductFormProp) {
    super(props);
    this.state = {
      product: {} as Partial<ProductSpu>,
    };
  }

  componentDidMount() {}

  render() {
    const { localConfig = { currency: 'USD' } } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { product } = this.state;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col span={20}>
            <Form {...formItemLayout}>
              <Card title={'基本信息'} {...cardProps}>
                <FormItem label={'产品名'}>
                  {getFieldDecorator('productName', {
                    rules: [{ required: true, message: '请输入产品名称' }],
                    initialValue: product.productName,
                  })(<Input />)}
                </FormItem>
                <FormItem label={'所属类目'}>
                  {getFieldDecorator('categoryPath', {
                    rules: [{ required: true, message: '请选择所属类目' }],
                    initialValue: product.categoryPath,
                  })}
                  <span>服装饰品 > 男装 > T恤</span>
                  <Button type={'link'}>编辑</Button>
                </FormItem>
                <FormItem label={'店铺分类'}>
                  {getFieldDecorator('shopCatePath', {
                    initialValue: product.shopCatePath,
                  })}
                  <span>男装 > T恤</span>
                  <Button type={'link'}>编辑</Button>
                </FormItem>
              </Card>

              <Card title={'销售信息'} {...cardProps}>
                {(!getFieldValue('wholesales') || getFieldValue('wholesales').length === 0) && (
                  <Fragment>
                    <FormItem label={'价格'} required>
                      {getFieldDecorator('price', {
                        initialValue: product.price,
                      })(
                        <CurrencyInput
                          className={styles.productNumberInput}
                          placeholder="价格"
                          currency={localConfig.currency}
                        />,
                      )}
                    </FormItem>
                    <FormItem label={'库存'} required>
                      {getFieldDecorator('stock', {
                        initialValue: product.stock,
                      })(<IntegerInput className={styles.productNumberInput} placeholder="库存" />)}
                    </FormItem>
                  </Fragment>
                )}

                <FormItem label={'销售属性'}>
                  {getFieldDecorator('skuProps', {
                    initialValue: product.skuProps,
                  })(<ProductSkuPropInput />)}
                </FormItem>

                <FormItem label={'库存列表'}>
                  {getFieldDecorator('skus', {
                    initialValue: product.skus,
                  })(<ProductSkuList />)}
                </FormItem>

                <FormItem label={'批发属性'}>
                  {getFieldDecorator('wholesales', {
                    initialValue: product.wholesales,
                  })(<ProductWholesalesInput />)}
                </FormItem>
              </Card>

              <Card title={'图片管理'} {...cardProps}>
                <FormItem label={'产品图片'}>
                  {getFieldDecorator('images', {
                    initialValue: product.images,
                  })(<ProductImagesUpload />)}
                </FormItem>
                {product.skuProps && product.skuProps.length && (
                  <FormItem label={'规格图片'}>
                    {getFieldDecorator('skuProps[0].images', {
                      initialValue: product.skuProps[0].images,
                    })(<ProductPropImagesUpload />)}
                  </FormItem>
                )}
              </Card>

              <Card title={'运送'} {...cardProps}>
                <FormItem label={'重量'}>
                  {getFieldDecorator('weight', {
                    initialValue: product.weight,
                  })(<UnitInput unit="kg" placeholder="重量" style={{ width: 366 }} />)}
                </FormItem>
                <FormItem label={'包装大小'}>
                  {getFieldDecorator('dimension', {
                    initialValue: product.dimension,
                  })(<DimensionInput />)}
                </FormItem>
              </Card>
              <Card title={'其他'} {...cardProps}></Card>
            </Form>
            <div>
              <Button>取消</Button>
              <Button>保存并下架</Button>
              <Button type="primary">保存并发布</Button>
            </div>
          </Col>
          <Col span={4}>{/* 帮助 */}</Col>
        </Row>
      </GridContent>
    );
  }
}

export default Form.create({ name: 'productForm' })(ProductForm);
