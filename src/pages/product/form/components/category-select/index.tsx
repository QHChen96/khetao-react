import React, { Component } from 'react';
import { Cascader } from 'antd';
import { Category } from '../../../../category/data';
import isEqual from 'lodash/isEqual';
import { CascaderOptionType } from 'antd/lib/cascader';


export interface ProductCategorySelectProps {
  value?: string[] | number[];
  onChange?: (value: string[] | number[]) => void;
}

interface ProductCategorySelectState {
  catePath?: string[] | number[];
  cateOptions?: Partial<Category>[];
  
}

class ProductCategorySelect extends Component<ProductCategorySelectProps, ProductCategorySelectState> {

  static getDerivedStateFromProps(nextProps: ProductCategorySelectProps, prevState: ProductCategorySelectState) {
    if (!isEqual(nextProps.value, prevState.catePath)) {
      return {
        catePath: nextProps.value
      }
    }
    return null;
  }

  constructor(props: ProductCategorySelectProps) {
    super(props);
  }

  state = {
    catePath: [],
    cateOptions: []
  }

  componentDidMount() {
    
  }

  handleChange = (value: string[], selectedOptions?: CascaderOptionType[]) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      catePath: value
    });
  }


  render() {
    const { catePath, cateOptions } = this.state;
    return (
      <Cascader options={[cateOptions]} onChange={this.handleChange}></Cascader>
    );
  }
  
}

export default ProductCategorySelect;
