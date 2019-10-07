import React, { Component } from 'react';
import { ProductSkuProp, ProductSkuPropValue } from '../../../data';
import styles from './style.less';
import { Button, Icon, Input, Tooltip } from 'antd';
import { isEqual, uniqueId, find } from 'lodash';
import classNames from 'classnames';

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
    skuProps: []
  };


  handleAddProp(e: React.MouseEvent<HTMLElement, MouseEvent>): void {
    e.preventDefault();
    const newSkuProp = {
      key: uniqueId('prop'),
      propName: '',
      propValues: [{ key: uniqueId('value'), value: '' }],
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
    const newPropValue = { key: uniqueId('value'), value: '' };
    const { skuProps = [] } = this.state;
    const newSkuProps = skuProps.map((prop: ProductSkuProp) => ({...prop, propValues: [...prop.propValues as ProductSkuPropValue[]]})) as ProductSkuProp[];

    const propValues = newSkuProps[index].propValues as ProductSkuPropValue[];
    newSkuProps[index].propValues = [...propValues, newPropValue];
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
    const newSkuProps = skuProps.map((prop: ProductSkuProp) => ({...prop, propValues: [...prop.propValues as ProductSkuPropValue[]]})) as ProductSkuProp[];
    const propValues = newSkuProps[index].propValues as ProductSkuPropValue[];

    const oldErrorObj = find(propValues, (value: ProductSkuPropValue, i: number) => i !== idx && value.value === propValues[idx].value && value.isError) as ProductSkuPropValue;
    if (oldErrorObj) {
      oldErrorObj.isError = false;
    }

    const fi = propValues.findIndex((prop: ProductSkuPropValue) => prop.value && prop.value === e.target.value);
    propValues[idx].value = e.target.value;

    fi !== -1 && (propValues[idx].isError = true) || (propValues[idx].isError = false);
    this.setState({
      skuProps: newSkuProps,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
  }

  handleChangeProp(e: React.ChangeEvent<HTMLInputElement>, index: number): void {
    e.preventDefault();
    const { skuProps = [] } = this.state;
    const newSkuProps = [...skuProps] as ProductSkuProp[];

    const oldErrorObj = find(newSkuProps, (prop: ProductSkuProp, i: number) => i !== index && prop.propName === newSkuProps[index].propName && prop.isError) as ProductSkuProp;
    if (oldErrorObj) {
      oldErrorObj.isError = false;
    }

    const fi = skuProps.findIndex((prop: ProductSkuProp) => prop.propName && prop.propName === e.target.value);
    newSkuProps[index].propName = e.target.value;
    fi !== -1 && (newSkuProps[index].isError = true) || (newSkuProps[index].isError = false);
    this.setState({
      skuProps: newSkuProps,
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(newSkuProps);
    }
  }

  renderPropValue = (propValues: ProductSkuPropValue[], index: number) => {
    if (propValues.length === 1) {
      return (
        <div className={styles.textRow} key={propValues[0].id || propValues[0].key}>
          <div className={styles.editTitle}>属性值</div>
          <div className={styles.editText}>
            <Tooltip placement="top" title="属性值重复" trigger="focus" visible={propValues[0].isError}>
              <Input
                value={propValues[0].value}
                onChange={e => this.handleChangePropValue(e, index, 0)}
              />
            </Tooltip>
          </div>
        </div>
      );
    }
    return propValues.map((skuPropValue: ProductSkuPropValue, idx) => (
      <div className={styles.textRow} key={skuPropValue.id || skuPropValue.key}>
        <div className={styles.editTitle}>{(idx === 0 && '属性值') || ' '}</div>
        <div className={classNames(styles.editText, styles.isError)}>
          <Tooltip placement="top" title="属性值重复" trigger="focus" visible={skuPropValue.isError}>
            <Input
              value={skuPropValue.value}
              onChange={e => this.handleChangePropValue(e, index, idx)}
            />
          </Tooltip>
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
                    <Tooltip placement="top" title="属性名重复" trigger="focus" visible={skuProp.isError}>
                      <Input
                        value={skuProp.propName}
                        onChange={e => this.handleChangeProp(e, index)}
                      />
                    </Tooltip>
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
                      添加属性值  
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
