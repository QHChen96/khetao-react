import React, { Component } from 'react';
import { Input } from 'antd';

export interface IntegerInputProps {
  value?: string;
  className?: any;
  placeholder?: string;
  onChange?: (value: string) => void;
}

class IntegerInput extends Component<IntegerInputProps> {
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { onChange } = this.props;
    if (onChange) {
      const value = e.target.value.replace(/[^\d]/g, '');
      onChange(value);
    }
  };

  render() {
    return <Input {...this.props} onChange={this.handleChange} />;
  }
}

export default IntegerInput;
