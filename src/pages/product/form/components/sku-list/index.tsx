import React, { Component } from 'react';
import { ProductSku } from '../../../data';
import { isEqual } from 'lodash';

import styles from './style.less';
import CurrencyInput from '@/components/currency-input';
import Input from 'antd/es/input';
import IntegerInput from '@/components/integer-input';
import { Button } from 'antd/es/radio';
import classNames from 'classnames';

export interface ProductSkuListProps {
  value?: ProductSku[];
}

interface ProductSkuListState {
  productSkuList?: ProductSku[];
}

class ProductSkuList extends Component<ProductSkuListProps, ProductSkuListState> {
  static getDerivedStateFromProps(nextProps: ProductSkuListProps, prevState: ProductSkuListState) {
    if (isEqual(nextProps.value, prevState.productSkuList)) {
      return {
        productSkuList: nextProps.value,
      };
    }
    return null;
  }

  constructor(props: ProductSkuListProps) {
    super(props);
  }

  state = {
    productSkuList: [],
  };

  render() {
    return (
      <div className={styles.productSku}>
        <div className={styles.productSkuApply}>
          <div className={styles.productSkuApplyWrapper}>
            <span className={styles.productSkuApplyPrice}>
              <CurrencyInput currency="CNY" placeholder="价格" />
            </span>
            <span className={styles.productSkuApplyStock}>
              <IntegerInput placeholder="库存" />
            </span>
            <span className={styles.productSkuApplySku}>
              <Input placeholder="货号" />
            </span>
            <span className={styles.productSkuApplyButtonWrapper}>
              <Button className={styles.productSkuApplyButton}>应用全部</Button>
            </span>
            <span className={styles.clearFloat}></span>
          </div>
        </div>
        <div className={styles.productSkuPanel}>
          <div className={styles.productSkuTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>color</div>
              <div className={styles.tableCell}>size</div>
              <div className={styles.tableCells}>
                <div className={styles.tableCell}>价格</div>
                <div className={styles.tableCell}>库存</div>
                <div className={styles.tableCell}>货号</div>
              </div>
            </div>
            <div className={styles.tableBody}>
              <div className={classNames(styles.tableRow, styles.isLast)}>
                <div className={styles.tableCell}>color</div>
                <div className={styles.tableCell}>size</div>
                <div className={styles.tableCells}>
                  <div className={styles.tableCell}>
                    <CurrencyInput currency="CNY" placeholder="价格" />
                  </div>
                  <div className={styles.tableCell}>
                    <IntegerInput placeholder="库存" />
                  </div>
                  <div className={styles.tableCell}>
                    <Input placeholder="货号" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductSkuList;
