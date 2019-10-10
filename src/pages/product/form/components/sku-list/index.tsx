import React, { Component } from 'react';
import { ProductSku, ProductSkuProp, ProductSkuPropValue } from '../../../data';
import { isEqual, reduce, each, find } from 'lodash';

import styles from './style.less';
import CurrencyInput from '@/components/currency-input';
import Input from 'antd/es/input';
import IntegerInput from '@/components/integer-input';
import { Button } from 'antd/es/radio';
import classNames from 'classnames';


const reduceSku = (skuProps: ProductSkuProp[], isNew: boolean = true) => {
  const skuPropValues: ProductSkuPropValue[][] = 
    skuProps
      .map(prop => prop.propValues) as ProductSkuPropValue[][];

  const skus: ProductSku[] = reduce(skuPropValues, (result: ProductSku[], value: ProductSkuPropValue[]) => {
    const ret:ProductSku[] = [];
    each(result, (res: ProductSku) => {
      each(value, (val: ProductSkuPropValue) => {
        const { propValues=[], skuName='', key='' } = res;
        ret.push({
          ...res,
          key: `${key}+${val.key}`,
          skuName: skuName && `${skuName},${val.value}` || val.value,
          propValues: propValues.concat(val)
        });
      });
    });
    return ret;
  }, [{}] as ProductSku[]);
  return skus;
}

export interface ProductSkuListProps {
  value?: ProductSku[];
  skuProps?: ProductSkuProp[];
  currency?: string;
  onChange?: (value: ProductSku[]) => void;
}

interface ProductSkuListState {
  productSkuList?: ProductSku[];
  skuProps?: ProductSkuProp[];
  applyPrice?: number | string;
  applyStock?: number | string;
  applySkuCode?: string;
}

class ProductSkuList extends Component<ProductSkuListProps, ProductSkuListState> {
  static getDerivedStateFromProps(nextProps: ProductSkuListProps, prevState: ProductSkuListState) {
    if (!isEqual(nextProps.skuProps, prevState.skuProps) || !isEqual(nextProps.value, prevState.productSkuList)) {
      const { value=[], skuProps=[] } = nextProps;
      const newSkuProps = skuProps.filter((prop) => (prop.propName && prop.propName.length > 0) || (prop.propValues && prop.propValues.length > 0));
      const { productSkuList=[], skuProps:oldSkuProps=[] } = prevState;
      let newProductSkuList: ProductSku[] = [];
      if (productSkuList.length === 0 && oldSkuProps.length === 0) {
        newProductSkuList = value;
      } else {
        newProductSkuList = reduceSku(newSkuProps);
        newProductSkuList = newProductSkuList.map(sku => {
          const oldSku = find(productSkuList, (oldSku) => isEqual(oldSku.propValues, sku.propValues)) as ProductSku;
          if (oldSku) {
            return {...oldSku};
          } 
          return sku;
        });
      }
      return {
        productSkuList: newProductSkuList,
        skuProps: newSkuProps,
      };
    }
    return null;
  }

  constructor(props: ProductSkuListProps) {
    super(props);
  }

  state = {
    productSkuList: [],
    skuProps: [],
    applyPrice: '', 
    applyStock: '', 
    applySkuCode: ''
  };

 

  handleChangeSkuCode(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
    e.preventDefault();
    const { productSkuList } = this.state;
    const newProductSkuList = [...productSkuList] as ProductSku[];
    newProductSkuList[index].skuCode = e.target.value;

    const { onChange } = this.props;
    if (onChange) {
      onChange(newProductSkuList);
    }

    this.setState({
      productSkuList: newProductSkuList
    });
  }

  handleChangeStock(stock: number | string | undefined, index: number): void {
    const { productSkuList } = this.state;
    const newProductSkuList = [...productSkuList] as ProductSku[];
    newProductSkuList[index].stock = stock;

    const { onChange } = this.props;
    if (onChange) {
      onChange(newProductSkuList);
    }

    this.setState({
      productSkuList: newProductSkuList
    });
  }

  handleChangePrice(price: number | string | undefined, index: number): void {
    const { productSkuList } = this.state;
    const newProductSkuList = [...productSkuList] as ProductSku[];
    newProductSkuList[index].price = price;

    const { onChange } = this.props;
    if (onChange) {
      onChange(newProductSkuList);
    }

    this.setState({
      productSkuList: newProductSkuList
    });
  }

  handleChangeApplyPrice = (applyPrice?: string | number) => {
    this.setState({
      applyPrice
    });
  }

  handleChangeApplyStock = (applyStock?: string | number) => {
    this.setState({
      applyStock
    });
  }

  handleChangeApplySkuCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    this.setState({
      applySkuCode: e.target.value
    });
  }

  handleApply = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const { productSkuList, applyPrice, applyStock, applySkuCode } = this.state;
    const newSkuList = productSkuList.map((sku: ProductSku) => ({
      ...sku,
      price: applyPrice ? applyPrice: sku.price,
      stock: applyStock ? applyStock: sku.stock,
      skuCode: applySkuCode ? applySkuCode : sku.skuCode
    }));

    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuList);
    }
    this.setState({
      productSkuList: newSkuList
    });
  }

  render() {
    const { productSkuList=[], skuProps=[], applyPrice, applyStock, applySkuCode } = this.state;
    const { currency } = this.props;
    return  (
      skuProps.length > 0 &&
      <div className={styles.productSku}>
        <div className={styles.productSkuApply}>
          <div className={styles.productSkuApplyWrapper}>
            <span className={styles.productSkuApplyPrice}>
              <CurrencyInput currency={currency} placeholder="价格" value={applyPrice} onChange={this.handleChangeApplyPrice}/>
            </span>
            <span className={styles.productSkuApplyStock} >
              <IntegerInput placeholder="库存" value={applyStock} onChange={this.handleChangeApplyStock}/>
            </span>
            <span className={styles.productSkuApplySku}>
              <Input placeholder="货号"  value={applySkuCode} onChange={this.handleChangeApplySkuCode}/>
            </span>
            <span className={styles.productSkuApplyButtonWrapper}>
              <Button className={styles.productSkuApplyButton} onClick={this.handleApply}>应用全部</Button>
            </span>
            <span className={styles.clearFloat}></span>
          </div>
        </div>
        <div className={styles.productSkuPanel}>
          <div className={styles.productSkuTable}>
            <div className={styles.tableHeader}>
              {
                skuProps.map((skuProp: ProductSkuProp) => (
                  <div className={styles.tableCell} key={skuProp.id || skuProp.key}>{skuProp.propName ? skuProp.propName : "属性名"}</div>
                ))
              }
              <div className={styles.tableCells}>
                <div className={styles.tableCell}>价格</div>
                <div className={styles.tableCell}>库存</div>
                <div className={styles.tableCell}>货号</div>
              </div>
            </div>
            <div className={styles.tableBody}>
              {
                productSkuList.map((sku: ProductSku, index: number) => (
                  <div className={(index+1) === productSkuList.length && classNames(styles.tableRow, styles.isLast) || styles.tableRow} key={sku.id || sku.key}>
                    {
                      sku.propValues && sku.propValues.map((propValue: ProductSkuPropValue) => (
                        <div className={styles.tableCell} key={propValue.id || propValue.key}>{propValue.value ? propValue.value : "属性值"}</div>
                      ))
                    }
                    <div className={styles.tableCells}>
                      <div className={styles.tableCell}>
                        <CurrencyInput currency={currency} placeholder="价格" value={sku.price} onChange={(price) => this.handleChangePrice(price, index)}/>
                      </div>
                      <div className={styles.tableCell}>
                        <IntegerInput placeholder="库存" value={sku.stock} onChange={(stock) => this.handleChangeStock(stock, index)}/>
                      </div>
                      <div className={styles.tableCell}>
                        <Input placeholder="货号" value={sku.skuCode} onChange={(e) => this.handleChangeSkuCode(e, index)}/>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
  
}

export default ProductSkuList;
