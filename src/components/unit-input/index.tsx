import React, { Component } from 'react';
import { Input } from 'antd';
import styles from './style.less';

export interface UnitInputProps {
  value?: string;
  className?: any;
  placeholder?: string;
  unit?: string;
  style?: any;
  onChange?: (value: string) => void;
}

class UnitInput extends Component<UnitInputProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { onChange } = this.props;
    if (onChange) {
      let value = e.target.value;
      value = /^\d+\.?\d{0,2}$/.test(value) ? value : value.substring(0, value.length - 1);
      onChange(value);
    }
  };

  handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    let value = e.currentTarget.value;
    value = /^\d+\.?\d{0,2}$/.test(value) ? value : value.substring(0, value.length - 1);
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    const { unit } = this.props;
    return (
      <Input
        {...this.props}
        suffix={unit}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}

export default UnitInput;
