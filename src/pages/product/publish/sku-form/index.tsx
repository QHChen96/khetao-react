import React, { Fragment, PureComponent } from "react";
import { SkuPropName, ProdSku, SkuProp, SkuPropVal } from "../../data";
import { Form, Card, Icon, Table, Input, Button } from "antd";



import styles from './style.less';
import { isEqual, reduce, each, map, last, filter, trim, sortBy, keyBy, findIndex } from "lodash";

const formSubItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const renderSkuColum = (size: number, i: number) => (value: string | SkuProp[], row: ProdSku, index: number) => {
  let val = value;
  if (Array.isArray(value)) {
    val = value[i].propVal;
  }
  const obj = {
    children: val,
    props: {
      rowSpan: 1
    },
  }
  if (index % size) {
    obj.props.rowSpan = 0;
  } else {
    obj.props.rowSpan = size;
  }
  return obj;
}

class ProdSkuTable extends Table<ProdSku> { }
class ProdSkuColumn extends Table.Column<ProdSku> { }

interface SkuColums {
  title: string;
  rowSpan: number;
}

export interface SkuFormProps {
  className?: string;
  value?: SkuPropName[];
  skuPropNames?: SkuPropName[];
  onChange?: (value: SkuPropName[]) => void;
}

interface SkuFormState {
  value?: SkuPropName[];
  skuPropNames?: SkuPropName[];
  skus?: ProdSku[];
  skuColums?: SkuColums[];
}

class SkuForm extends PureComponent<SkuFormProps, SkuFormState> {

  deep: number = 4;

  static getDerivedStateFromProps(nextProps: SkuFormProps, preState: SkuFormState) {
    if (isEqual(nextProps.value, preState.value)) {
      return null;
    }
    return {
      skuPropNames: nextProps.value,
      value: nextProps.value,
    };
  }

  constructor(props: SkuFormProps) {
    super(props);
    this.state = {
      skuPropNames: props.value as SkuPropName[],
    }
  }

  componentDidMount() { }

  componentWillUnmount() { }


  addProp = () => {
    const { skuPropNames = [] } = this.state;
    if (skuPropNames.length === this.deep) {
      return;
    }
    const score = skuPropNames.length ? (last(skuPropNames) as SkuPropName).score + 10 :
      10;
    skuPropNames.push({
      propName: '',
      propVals: [],
      key: `PROP_${score}`,
      score: score,
      propCount: 0
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  addPropVal = (propIndex: number) => {
    const { skuPropNames = [] } = this.state;
    const skuProp = skuPropNames[propIndex];
    const pos = (this.deep - propIndex) * 2;
    const score = skuProp.propVals.length ?
      (last(skuProp.propVals) as SkuPropVal).score + Math.pow(10, pos - 1) :
      Math.pow(10, pos);
    skuProp.propVals.push({
      propVal: '',
      key: `PROP_VAL_${score}`,
      score: score
    });
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  handleSkuPropChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const value = trim(e.target.value);
    const { skuPropNames = [] } = this.state;
    skuPropNames[index].propName = value;
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  handleSkuPropValChange = (e: React.ChangeEvent<HTMLInputElement>, propIndex: number, index: number) => {
    e.preventDefault();
    const value = trim(e.target.value);
    const { skuPropNames = [] } = this.state;
    const skuProp = skuPropNames[propIndex];
    const newVal = { ...skuProp.propVals[index], propVal: value };
    skuProp.propVals[index] = newVal;
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>, key: string, name: string) => {
    e.preventDefault();
    const { skus=[] } = this.state;
    const index = findIndex(skus, ele => ele.key === key);
    const value = trim(e.target.value);
    if (index < 0) {
      return;
    }
    const newSkus = map(skus, ele =>({...ele}) );
    newSkus[index][name] = value;
    this.setState({ skus:newSkus });
  }

  handleSkuPropValPress = (e: React.KeyboardEvent, propIndex: number, index: number) => {
    // TODO
  }

  handleSkuPropPress = (e: React.KeyboardEvent, index: number) => {
    // TODO
  }

  delProp(index: number) {
    const { skuPropNames = [] } = this.state;
    skuPropNames.splice(index, 1);
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  delPropValue(propIndex: number, index: number) {
    const { skuPropNames = [] } = this.state;
    const skuProp = skuPropNames[propIndex];
    skuProp.propVals.splice(index, 1);
    const { onChange } = this.props;
    if (onChange) {
      onChange(skuPropNames);
    }
    this.reduceSku();
  }

  filterSkuPropNames = (skuPropNames: SkuPropName[]):SkuPropName[] => {
    return filter(skuPropNames, (ele) => ele.propName && this.filterSkuPropVals(ele.propVals).length) as SkuPropName[];
  }

  filterSkuPropVals = (skuPropVals: SkuPropVal[]): SkuPropVal[] => {
    return filter(skuPropVals, ele => ele.propVal) as SkuPropVal[];
  }

  renderInput = (name: string) => (value: string, row: ProdSku, index: number) => {
    return <Input value={value} onChange={(e) => this.handleSkuChange(e, row.key, name)} />;
  }

  reduceSku = () => {
    const { skuPropNames = [], skus = [] } = this.state;
    const { filterSkuPropNames, filterSkuPropVals } = this;
    const propNames = filterSkuPropNames(skuPropNames);
    const skuProps: SkuProp[][] = map(propNames, (skuPropName) => {
      return map(filterSkuPropVals(skuPropName.propVals), (skuPropVal) => {
        return {
          propName: skuPropName.propName,
          propVal: skuPropVal.propVal,
          score: skuPropVal.score,
          key: skuPropVal.key
        };
      });
    });

    const newSkus = sortBy(reduce(skuProps, (result: ProdSku[], value: SkuProp[]) => {
      const ret: ProdSku[] = [];
      each(result, (res) => {
        each(value, (next) => {
          ret.push({
            ...res,
            propList: [...res.propList, next],
            key: `${res.key}${next.key}`,
            score: res.score + next.score
          });
        });
      });
      return ret;
    }, [{
      key: '',
      propList: [] as SkuProp[],
      price: undefined,
      quantity: undefined,
      itemNo: undefined,
      score: 0
    }] as ProdSku[]), ele => ele.score);


    if (skus.length && newSkus.length) {
      const oldSkuMap = keyBy(skus, 'key');
      let sku:ProdSku;
      each(newSkus, (ele, i) => {
        sku = oldSkuMap[ele.key]; 
        sku && (newSkus[i] = (ele = {
          ...ele, 
          price: sku.price, 
          picUrl: sku.picUrl, 
          quantity: sku.quantity,
          itemNo: sku.itemNo
        }));
      });
    }

    const skuColums:SkuColums[] = [];
    for (let i = 0, len = propNames.length; i < len; i++) {
      let rowSpan = 1;
      for (let j = i + 1; j < len; j++) {
        rowSpan *= propNames[j].propVals.length;
      }
      skuColums.push({
        title: propNames[i].propName,
        rowSpan: rowSpan
      });
    }
    this.setState({ skuColums, skus: newSkus });
     
  }

  render() {
    const { skuPropNames = [], skus = [], skuColums } = this.state;
    return (
      <Fragment>
        <h3>价格库存</h3>
        <Form.Item label="商品规格" required>
          <Card actions={[<Button disabled={skuPropNames.length === this.deep} onClick={this.addProp}>添加规格项目</Button>]} >
            {
              skuPropNames.map((skuProp, skuPropIndex) =>
                (<div key={skuProp.key} className={styles.skuPropWarp}>
                  <Form.Item
                    {...formSubItemLayout}
                    label="规格名"
                    required={true}
                    style={{ backgroundColor: '#e8e8e8' }}
                  >
                    {(
                      <Input
                        autoFocus={true}
                        className={styles.skuProp}
                        value={skuProp.propName}
                        onChange={e => this.handleSkuPropChange(e, skuPropIndex)}
                        onKeyPress={e => this.handleSkuPropPress(e, skuPropIndex)} />
                    )}
                    <Icon onClick={() => this.delProp(skuPropIndex)} className={styles.skuPropDel} type="close-circle" theme="filled" />
                  </Form.Item>
                  <Form.Item {...formSubItemLayout} label="规格值">
                    <div>
                      {
                        skuProp.propVals && skuProp.propVals.map((propValue, propValueIndex) =>
                          (<span key={propValue.key} className={styles.skuPropItem}>
                            <div className={styles.skuPropWrap}>
                              <Input
                                autoFocus={true}
                                value={propValue.propVal}
                                onChange={e => this.handleSkuPropValChange(e, skuPropIndex, propValueIndex)}
                                onKeyPress={e => this.handleSkuPropValPress(e, skuPropIndex, propValueIndex)} />
                              <Icon onClick={() => this.delPropValue(skuPropIndex, propValueIndex)} className={styles.skuPropValDel} type="close-circle" theme="filled" />
                            </div>
                          </span>)
                        )
                      }
                      <a href="javascript:;" onClick={() => this.addPropVal(skuPropIndex)}>添加规格值</a>
                    </div>
                  </Form.Item>
                </div>)
              )
            }
          </Card>
        </Form.Item>
        {
          (skuColums && skuColums.length > 0) && (
            <Form.Item label="规格明细" required>
              <ProdSkuTable dataSource={skus} pagination={false} bordered>
                {
                  skuColums.map((column, i) =>
                    (<ProdSkuColumn key={'propList[' + i + '].key'} title={column.title} dataIndex={'propList[' + i + '].propVal'} render={renderSkuColum(column.rowSpan, i)}></ProdSkuColumn>)
                  )
                }
                <ProdSkuColumn title="价格" dataIndex="price" render={this.renderInput('price')}></ProdSkuColumn>
                <ProdSkuColumn title="库存" dataIndex="quantity" render={this.renderInput('quantity')}></ProdSkuColumn>
                <ProdSkuColumn title="规格编码" dataIndex="itemNo" render={this.renderInput('itemNo')}></ProdSkuColumn>
              </ProdSkuTable>
            </Form.Item>)
        }
      </Fragment>
    );
  }
}
export default SkuForm;