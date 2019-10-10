import { GridContent } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import { Row, Col, Form, Card, Button, Input } from 'antd';

import styles from './style.less';
import { FormComponentProps } from 'antd/lib/form';
import { ProductSpu} from '../data';

import ProductSkuPropInput from './components/sku-prop-input';
import ProductSkuList from './components/sku-list/';
import DimensionInput from './components/dimension-input';
import { connect } from 'dva';
import CurrencyInput from '../../../components/currency-input';
import IntegerInput from '@/components/integer-input';
import ProductImagesUpload from '@/pages/product/form/components/images-upload';
import ProductPropImagesUpload from './components/prop-images-upload';
import ProductWholesalesInput from './components/wholesales-input';
import UnitInput from '@/components/unit-input';
import CategorySelect from '@/components/category-select';
import CustomCategorySelect from '@/components/custom-category-select';
import { ConnectState } from '@/models/connect';
import TextArea from 'antd/es/input/TextArea';

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


export interface ProductFormProp extends FormComponentProps {
  currency?: string;
}

interface ProductFormState {
  product: Partial<ProductSpu>;
}

@connect(({
  settings
}: ConnectState) => ({
  currency: settings.currency
}))
class ProductForm extends Component<ProductFormProp, ProductFormState> {

  constructor(props: ProductFormProp) {
    super(props);
    this.state = {
      product: {} as Partial<ProductSpu>,
    };
  }

  componentDidMount() {}

  handleSubmitAndPubish(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  handleSubmitAndDelist(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  handleCancel(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    this.props.form.resetFields();
  }

  render() {
    const { currency } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { product } = this.state;

    return (
      <GridContent>
        <Row gutter={24}>
          <Col span={20}>
            <Form {...formItemLayout}>
              <Card title={'基本信息'} {...cardProps}>
                <FormItem label={'产品名'} required>
                  {getFieldDecorator('productName', {
                    rules: [{ required: true, message: '请输入产品名称' }],
                    initialValue: product.productName,
                  })(<Input />)}
                </FormItem>
                <FormItem label={'产品描述'}>
                  {getFieldDecorator('productDesc', {
                    initialValue: product.productDesc,
                  })(<TextArea rows={3} />)}
                </FormItem>
                <FormItem label={'所属类目'} required>
                  {getFieldDecorator('categoryPath', {
                    rules: [{ required: true, message: '请选择所属类目' }],
                    initialValue: product.categoryPath,
                  })(<CategorySelect className={styles.categorySelect} placeholder="请选择所属类目"/>)}
                </FormItem>
                <FormItem label={'店铺分类'}>
                  {getFieldDecorator('shopCatePath', {
                    initialValue: product.shopCatePath,
                  })(<CustomCategorySelect className={styles.categorySelect} placeholder="请选择店铺分类" />)}
                </FormItem>
              </Card>

              <Card title={'销售信息'} {...cardProps}>
                {(!getFieldValue('skuProps') || getFieldValue('skuProps').length === 0) && (
                  <Fragment>
                    <FormItem label={'价格'} required>
                      {getFieldDecorator('price', {
                        rules: [{ required: true, message: '请输入价格' }],
                        initialValue: product.price,
                      })(
                        <CurrencyInput
                          className={styles.productNumberInput}
                          placeholder="价格"
                          currency={currency}
                        />,
                      )}
                    </FormItem>
                    <FormItem label={'库存'} required>
                      {getFieldDecorator('stock', {
                        rules: [{ required: true, message: '请输入库存' }],
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
                {
                  (getFieldValue('skuProps') && getFieldValue('skuProps').length > 0) && (
                    <FormItem label={'库存列表'}>
                      {getFieldDecorator('skus', {
                        initialValue: product.skus,
                      })(<ProductSkuList currency={currency} skuProps={getFieldValue('skuProps')}/>)}
                    </FormItem>
                  )
                }
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
              <Card title={'SEO'} {...cardProps}>
                <FormItem label={'标题'}>
                  {getFieldDecorator('title', {
                    initialValue: product.title,
                  })(<Input placeholder="title"/>)}
                </FormItem>
                <FormItem label={'关键字'}>
                  {getFieldDecorator('keyword', {
                    initialValue: product.keyword,
                  })(<Input placeholder="keyword" />)}
                </FormItem>
                <FormItem label={'详情'}>
                  {getFieldDecorator('description', {
                    initialValue: product.description,
                  })(<TextArea rows={2} placeholder="description" />)}
                </FormItem>

              </Card>

              <FormItem>
                <Button className={styles.optionButton} onClick={(e) => this.handleCancel(e)}>取消</Button>
                <Button className={styles.optionButton} onClick={(e) => this.handleSubmitAndDelist(e)}>保存并下架</Button>
                <Button className={styles.optionButton} type="primary" onClick={(e) => this.handleSubmitAndPubish(e)}>保存并发布</Button>
              </FormItem>
            </Form>
          </Col>
          <Col span={4}>{/* 帮助 */}</Col>
        </Row>
      </GridContent>
    );
  }
  
}

export default Form.create({ name: 'productForm' })(ProductForm);
