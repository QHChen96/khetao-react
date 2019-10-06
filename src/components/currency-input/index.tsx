import React, { Component } from 'react';
import { Input } from 'antd';

export interface CurrencyInputProps {
  value?: string | number;
  currency: string;
  className?: any;
  placeholder?: string;
  onChange?: (value: string|number) => void;
}

class CurrencyInput extends Component<CurrencyInputProps> {
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
    const { currency } = this.props;
    return (
      <Input
        {...this.props}
        suffix={currency}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}

export default CurrencyInput;
