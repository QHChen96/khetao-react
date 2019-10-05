import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { ProductDimension } from '@/pages/product/data';
import UnitInput from '../../../../../components/unit-input/index';

export interface DimensionInputProps {
  value?: ProductDimension;
  onChange?: (value: ProductDimension) => void;
}

const inputProps = {
  className: styles.dimensionInput,
};

class DimensionInput extends Component<DimensionInputProps> {
  handleChangeWidth = (val: string) => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        width: val,
      });
    }
  };

  handleChangeLength = (val: string) => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        length: val,
      });
    }
  };

  handleChangeHeight = (val: string) => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        height: val,
      });
    }
  };

  render() {
    const { value = { length: '', width: '', height: '' } } = this.props;
    return (
      <Fragment>
        <UnitInput
          onChange={this.handleChangeLength}
          unit="cm"
          placeholder="长"
          {...inputProps}
          value={value.length as string}
        />
        <UnitInput
          onChange={this.handleChangeWidth}
          unit="cm"
          placeholder="宽"
          {...inputProps}
          value={value.width as string}
        />
        <UnitInput
          onChange={this.handleChangeHeight}
          unit="cm"
          placeholder="高"
          {...inputProps}
          value={value.height as string}
        />
      </Fragment>
    );
  }
}

export default DimensionInput;
