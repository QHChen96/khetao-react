import React, { Component } from 'react';
import { Cascader } from 'antd';
import isEqual from 'lodash/isEqual';
import { connect } from 'dva';
import { Dispatch } from '@/models/connect';
import arrayToTree from 'array-to-tree';
import { CustomCategory } from '@/models/custom-category';



export interface CustomCategorySelectProps {
  className?: string;
  value?: string[] | number[];
  cateList?: CustomCategory[];
  dispatch?: Dispatch;
  loading?: boolean;
  placeholder?: string;
  onChange?: (value: string[] | number[]) => void;
}

interface CustomCategorySelectState {
  catePath?: string[] | number[];
}

const mapStateToProps = ({
  customCategorySettings,
  loading,
}: {
  customCategorySettings: {
  cateList?: CustomCategory[];
    list: CustomCategory[];
  };
  loading: any;
}) => {
 
  const { list } = customCategorySettings;
  return {
    cateList: list,
    loading: loading.models.customCategorySettings,
  };
}

@connect(
  mapStateToProps
)
class CustomCategorySelect extends Component<CustomCategorySelectProps, CustomCategorySelectState> {

  static getDerivedStateFromProps(nextProps: CustomCategorySelectProps, prevState: CustomCategorySelectState) {
    if (!isEqual(nextProps.value, prevState.catePath)) {
      return {
        catePath: nextProps.value
      }
    }
    return null;
  }

  constructor(props: CustomCategorySelectProps) {
    super(props);
  }

  state = {
    catePath: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: "customCategorySettings/fetch"
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

export default CustomCategorySelect;
