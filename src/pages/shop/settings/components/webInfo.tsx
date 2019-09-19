import React,{ Component, Fragment } from "react";
import { FormComponentProps } from "antd/es/form";
import { CurrentShop } from "@/models/shop";

import { Form, Input, message, Upload, Button, Select } from 'antd';
import FormItem from "antd/lib/form/FormItem";
import styles from './webInfo.less';
import { ConnectState } from "@/models/connect";
import { connect } from "dva";
import TextArea from "antd/es/input/TextArea";
import { Dispatch } from 'redux';


const selectBefore = (
  <Select defaultValue="http://" style={{ width: 100 }}>
    <Select.Option value="http://">Http://</Select.Option>
    <Select.Option value="https://">Https://</Select.Option>
  </Select>
);
const selectAfter = (
  <Select defaultValue=".com" style={{ width: 80 }}>
    <Select.Option value=".com">.com</Select.Option>
    <Select.Option value=".jp">.ltd</Select.Option>
    <Select.Option value=".cn">.cn</Select.Option>
    <Select.Option value=".org">.org</Select.Option>
  </Select>
);



interface WebInfoViewProps extends FormComponentProps {
  currentShop?: CurrentShop;
  dispatch?: Dispatch;
}

@connect(({ shop }: ConnectState) => ({
  currentShop: shop.currentShop,
}))
class WebInfoView extends Component<WebInfoViewProps> {
  view: HTMLDivElement | undefined = undefined;

  componentDidMount() {

  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  }

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, dispatch, currentShop } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (dispatch) {
          dispatch({
            type: "shop/saveWebInfo",
            payload: {...currentShop, ...values}
          })
        }
        message.success("修改成功");
      }
    })
  }

  render() {
    const {
      form: { getFieldDecorator },
      currentShop = {}
    } = this.props;

    return (
      <div className={styles.webInfo} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="标题">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.title
              })(<Input />)}
            </FormItem>
            <FormItem label="网址">
              {getFieldDecorator('website', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.website
              })(<Input />)}
            </FormItem>
            <FormItem label="keyword">
              {getFieldDecorator('keyword', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.keyword
              })(<Input />)}
            </FormItem>
            <FormItem label="description">
              {getFieldDecorator('description', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.description
              })(<TextArea
                autosize={{ minRows: 2, maxRows: 6 }}
              />)}
            </FormItem>
          

            <Button type="primary" onClick={this.handlerSubmit}>
              提交资料
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}

export default Form.create<WebInfoViewProps>()(WebInfoView);