import React, { Component, Fragment } from 'react';
import { ProductWholesale } from '../../../data';
import { Icon, Button } from 'antd';
import styles from './style.less';
import IntegerInput from '@/components/integer-input';
import { isEqual, uniqueId, max } from 'lodash';
import CurrencyInput from '../../../../../components/currency-input/index';

const getMin = (minNum: any, maxNum: any): string => {
  if (!minNum && !maxNum) {
    return '';
  }
  if (!maxNum) {
    return +minNum + 1 + '';
  }
  let _min = +max([minNum, maxNum]) + 1;
  return _min + '';
};

export interface ProductSkuPropInputProps {
  value?: ProductWholesale[];
  onChange?: (value: ProductWholesale[]) => void;
}

interface ProductSkuPropInputState {
  wholesales?: ProductWholesale[];
}

class ProductWholesalesInput extends Component<ProductSkuPropInputProps, ProductSkuPropInputState> {
  static getDerivedStateFromProps(
    nextProps: ProductSkuPropInputProps,
    prevState: ProductSkuPropInputState,
  ) {
    if (!isEqual(nextProps.value, prevState.wholesales)) {
      return {
        wholesales: nextProps.value,
      };
    }
    return null;
  }

  state = {
    wholesales: [],
  };

  constructor(props: ProductSkuPropInputProps) {
    super(props);
  }

  handleAdd = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    const { wholesales = [] } = this.state;
    let min: any = '';
    if (wholesales && wholesales.length) {
      const wholesale = wholesales[wholesales.length - 1] as ProductWholesale;
      min = getMin(wholesale.min, wholesale.max);
    }
    const newWholesale = {
      min: min,
      max: '',
      price: '',
    };
    const newWholesales = [...wholesales, newWholesale];
    const { onChange } = this.props;
    if (onChange) {
      onChange(newWholesales);
    }
    this.setState({
      wholesales: newWholesales,
    });
  };

  handleRemove(e: React.MouseEvent<HTMLElement, MouseEvent>, index: number): void {
    e.preventDefault();
    const { wholesales = [] } = this.state;
    const newWholesales = wholesales.filter((v, i) => i !== index);
    if (index > 0 && index < wholesales.length - 1) {
      const wholesale = wholesales[index - 1] as ProductWholesale;
      const min = getMin(wholesale.min, wholesale.max);
      (newWholesales[index] as ProductWholesale).min = min;
    }
    const { onChange } = this.props;
    if (onChange) {
      onChange(newWholesales);
    }
    this.setState({
      wholesales: newWholesales,
    });
  }

  hanleChangeMax(max: string, index: number): void {
    const { wholesales = [] } = this.state;
    const newWholesales = [...wholesales];
    if (index < wholesales.length - 1) {
      const wholesale = wholesales[index] as ProductWholesale;
      const min = getMin(wholesale.min, max);
      (newWholesales[index + 1] as ProductWholesale).min = min;
    }
    (newWholesales[index] as ProductWholesale).max = max;
    const { onChange } = this.props;
    if (onChange) {
      onChange(newWholesales);
    }
    this.setState({
      wholesales: newWholesales,
    });
  }

  hanleChangePrice(price: string, index: number): void {
    const { wholesales = [] } = this.state;
    const newWholesales = [...wholesales];
    (newWholesales[index] as ProductWholesale).price = price;
    const { onChange } = this.props;
    if (onChange) {
      onChange(newWholesales);
    }
    this.setState({
      wholesales: newWholesales,
    });
  }

  hanleChangeMin(min: string, index: number): void {
    const { wholesales = [] } = this.state;
    const newWholesales = wholesales.map(v => v);
    if (index < wholesales.length - 1) {
      const wholesale = wholesales[index] as ProductWholesale;
      const _min = getMin(min, wholesale.max);
      (newWholesales[index + 1] as ProductWholesale).min = _min;
    }
    (newWholesales[index] as ProductWholesale).min = min;
    const { onChange } = this.props;
    if (onChange) {
      onChange(newWholesales);
    }
    this.setState({
      wholesales: newWholesales,
    });
  }

  render() {
    const { wholesales = [] } = this.state;
    return (
      <div className={styles.wholesales}>
        {wholesales.length > 0 && (
          <Fragment>
            <div className={styles.wholesaleHeader}>
              <div className={styles.name}> </div>
              <div className={styles.title}>最小</div>
              <div className={styles.title}>最大</div>
              <div className={styles.title}>价格</div>
            </div>
            <div className={styles.repeaterContainer}>
              <div className={styles.repeaterWrapper}>
                <div className={styles.repeater}>
                  {wholesales.map((wholesale: ProductWholesale, index) => (
                    <div className={styles.repeaterItem} key={index}>
                      <div className={styles.wholesaleItemCount}>{index + 1}.</div>
                      <div className={styles.wholesaleItemName}>价格段{index + 1}</div>
                      <div className={styles.wholesaleInput}>
                        <div className={styles.wholesaleInputItem}>
                          <IntegerInput
                            placeholder="最小"
                            value={wholesale.min as string}
                            onChange={min => this.hanleChangeMin(min, index)}
                          />
                        </div>
                        <div className={styles.wholesaleInputItem}>
                          <IntegerInput
                            placeholder="最大"
                            value={wholesale.max as string}
                            onChange={max => this.hanleChangeMax(max, index)}
                          />
                        </div>
                        <div className={styles.wholesaleInputItem}>
                          <CurrencyInput
                            currency={'CNY'}
                            placeholder="价格"
                            value={wholesale.price as string}
                            onChange={price => this.hanleChangePrice(price, index)}
                          />
                        </div>
                      </div>
                      <div className={styles.repeaterRemove}>
                        <Icon type="delete" onClick={e => this.handleRemove(e, index)} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Fragment>
        )}
        <Button className={styles.wholesaleButton} icon="plus-circle" onClick={this.handleAdd}>
          添加价格段
        </Button>
      </div>
    );
  }
}

export default ProductWholesalesInput;
