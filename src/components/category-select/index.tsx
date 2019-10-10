import React, { Component } from 'react';
import { Cascader } from 'antd';
import isEqual from 'lodash/isEqual';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import arrayToTree from 'array-to-tree';
import { Category } from '@/models/category';



export interface CategorySelectProps {
  className?: string;
  value?: string[] | number[];
  cateList?: Category[];
  dispatch?: Dispatch;
  loading?: boolean;
  placeholder?: string;
  onChange?: (value: string[] | number[]) => void;
}

interface CategorySelectState {
  catePath?: string[] | number[];
}

const mapStateToProps = ({
  categorySettings,
  loading,
}: {
  categorySettings: {
    list: Category[];
  };
  loading: any;
}) => {
 
  const { list } = categorySettings;
  return {
    cateList: list,
    loading: loading.models.categorySettings,
  };
}

@connect(
  mapStateToProps
)
class CategorySelect extends Component<CategorySelectProps, CategorySelectState> {

  static getDerivedStateFromProps(nextProps: CategorySelectProps, prevState: CategorySelectState) {
    if (!isEqual(nextProps.value, prevState.catePath)) {
      return {
        catePath: nextProps.value
      }
    }
    return null;
  }

  constructor(props: CategorySelectProps) {
    super(props);
  }

  state = {
    catePath: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: "categorySettings/fetch"
      })
    }
  }

  handleChange = (value: string[]) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
    this.setState({
      catePath: value
    });
  }


  render() {
    const { catePath } = this.state;
    const { cateList=[], className, placeholder } = this.props;

    const cateOptions = arrayToTree(cateList.filter(cate => cate.id != 0), {
      parentProperty: 'parentId',
      customID: 'id',
    });
    return (
      <Cascader
        placeholder={placeholder}
        className={className}
        fieldNames={{ label: 'cateName', value: 'id', children: 'children' }}
        defaultValue={catePath} 
        options={cateOptions} 
        onChange={this.handleChange}>
      </Cascader>
    );
  }
  
}

export default CategorySelect;
