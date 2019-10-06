import React, { Component, Fragment } from 'react';
import { ProductSkuProp, ProductSkuPropValue } from '../../../data';
import styles from './style.less';
import { Button, Icon, Input } from 'antd';
import { isEqual, uniqueId } from 'lodash';

export interface ProductSkuPropInputProps {
  value?: ProductSkuProp[];
  onChange?: (value: ProductSkuProp[]) => void;
}

interface ProductSkuPropInputState {
  skuProps?: ProductSkuProp[];
}

class ProductSkuPropInput extends Component<ProductSkuPropInputProps, ProductSkuPropInputState> {
  static getDerivedStateFromProps(
    nextProps: ProductSkuPropInputProps,
    prevState: ProductSkuPropInputState,
  ) {
    if (!isEqual(nextProps.value, prevState.skuProps)) {
      return {
        skuProps: nextProps.value,
      };
    }
    return null;
  }

  constructor(props: ProductSkuPropInputProps) {
    super(props);
  }

  state = {
    skuProps: [],
  };

  handleAddProp(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    const newSkuProp = {
      key: uniqueId(),
      propName: '',
      propValues: [{ key: uniqueId(), value: '' }],
    };
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps, newSkuProp];
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  handleAddPropValue(e: React.MouseEvent<HTMLElement, MouseEvent>, index: number): void {
    e.preventDefault();
    const newPropValue = { key: uniqueId(), value: '' };
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps];
    ((newSkuProps[index] as ProductSkuProp).propValues as ProductSkuPropValue[]).push(newPropValue);
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  handleDelPropValue(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
    idx: number,
  ): void {
    e.preventDefault();
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps] as ProductSkuProp[];

    const newSkuPropValues = (newSkuProps[index].propValues as ProductSkuPropValue[]).filter(
      (v, i) => i !== idx,
    );
    newSkuProps[index].propValues = newSkuPropValues;

    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  handleDelProp(e: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number): void {
    e.preventDefault();
    const { skuProps = [] } = this.state;
    const newSkuProps = skuProps.filter((v, i) => i !== index);
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  handleChangePropValue(e: React.ChangeEvent<HTMLInputElement>, index: number, idx: number): void {
    e.preventDefault();
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps] as ProductSkuProp[];

    ((newSkuProps[index].propValues as ProductSkuPropValue[])[idx] as ProductSkuPropValue).value =
      e.target.value;

    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  handleChangeProp(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
    e.preventDefault();
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps] as ProductSkuProp[];
    newSkuProps[index].propName = e.target.value;
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
    this.setState({
      skuProps: newSkuProps,
    });
  }

  renderPropValue = (propValues: ProductSkuPropValue[], index: number) => {
    if (propValues.length === 1) {
      return (
        <div className={styles.textRow} key={propValues[0].id || propValues[0].key}>
          <div className={styles.editTitle}>属性值</div>
          <div className={styles.editText}>
            <Input
              value={propValues[0].value}
              onChange={e => this.handleChangePropValue(e, index, 0)}
            />
          </div>
        </div>
      );
    }
    return propValues.map((skuPropValue: ProductSkuPropValue, idx) => (
      <div className={styles.textRow} key={skuPropValue.id || skuPropValue.key}>
        <div className={styles.editTitle}>{(idx === 0 && '属性值') || ' '}</div>
        <div className={styles.editText}>
          <Input
            value={skuPropValue.value}
            onChange={e => this.handleChangePropValue(e, index, idx)}
          />
        </div>
        {idx > 0 && (
          <div
            className={styles.optionRemoveBtn}
            onClick={e => this.handleDelPropValue(e, index, idx)}
          >
            <Icon type="delete" />
          </div>
        )}
      </div>
    ));
  };

  render() {
    const { skuProps } = this.state;
    return (
      <div className={styles.productSkuProp}>
        {skuProps && skuProps.length > 0 && (
          <div className={styles.repeaterContainer}>
            {skuProps.map((skuProp: ProductSkuProp, index: number) => (
              <div className={styles.productSkuPropItem} key={skuProp.id || skuProp.key}>
                <div
                  className={styles.productSkuPropItemRemove}
                  onClick={e => this.handleDelProp(e, index)}
                >
                  <Icon type="close" />
                </div>
                <div className={styles.textRow}>
                  <div className={styles.editTitle}>属性名</div>
                  <div className={styles.editText}>
                    <Input
                      value={skuProp.propName}
                      onChange={e => this.handleChangeProp(e, index)}
                    />
                  </div>
                </div>
                {this.renderPropValue(skuProp.propValues as ProductSkuPropValue[], index)}
                <div className={styles.textRow}>
                  <div className={styles.editTitle}> </div>
                  <div className={styles.editText}>
                    <Button
                      className={styles.addOptionButton}
                      icon="plus-circle"
                      onClick={e => this.handleAddPropValue(e, index)}
                    >
                     </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Button
          className={styles.addSkuPropButton}
          icon="plus-circle"
          onClick={e => this.handleAddProp(e)}
        >
          添加属性
        </Button>
      </div>
    );
  }
}

export default ProductSkuPropInput;
