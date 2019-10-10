import React,{ Component, Fragment } from "react";
import { FormComponentProps } from "antd/es/form";
import { CurrentShop } from "@/models/shop";

import { Form, Input, message, Upload, Button } from 'antd';
import FormItem from "antd/lib/form/FormItem";
import styles from './basic.less';
import { ConnectState } from "@/models/connect";
import { connect } from "dva";
import ServiceTimeView from "./ServiceTimeView";
import { Dispatch } from "redux";
import { RcFile } from 'antd/lib/upload/interface';
import { getImg } from '@/utils/utils';

const LogoView = ({ logo, customRequest, }: { logo: string; customRequest: (object: any) => void; }) => (
  <Fragment>
    <div className={styles.logo_title}>
      LOGO
    </div>
    <div className={styles.logo}>
      <img src={logo} alt="logo" />
    </div>
    <Upload customRequest={customRequest} accept="image/png,image/jpg" fileList={[]}>
      <div className={styles.button_view}>
        <Button icon="upload">
          更换LOGO
        </Button>
      </div>
    </Upload>
  </Fragment>
);

interface SelectItem {
  label: string;
  key: string;
}


const validatorGeographic = (
  _: any,
  value: {
    province: SelectItem;
    city: SelectItem;
  },
  callback: (message?: string) => void,
) => {
  const { province, city } = value;
  if (!province.key) {
    callback('请选择省份');
  }
  if (!city.key) {
    callback('请选择城市');
  }
  callback();
};

const validatorPhone = (rule: any, value: string, callback: (message?: string) => void) => {
  const values = value.split('-'); 
  if (!values[0]) {
    callback('请输入区号!');
  }
  if (!values[1]) {
    callback('请输入手机号!');
  }
  callback();
};

interface BasicViewProps extends FormComponentProps {
  currentShop?: CurrentShop,
  dispatch?: Dispatch
}

@connect(({ shop }: ConnectState) => ({
  currentShop: shop.currentShop,
}))
class BasicView extends Component<BasicViewProps> {
  view: HTMLDivElement | undefined = undefined;

  getLogoUrl = () => {
    const { currentShop } = this.props;
    if (currentShop) {
      if (currentShop.avatar) {
        return getImg(currentShop.avatar);
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;      
    }
    return '';
  }

  getViewDom = (ref: HTMLDivElement) => {
    this.view = ref;
  }

  customRequest = (object: any) => {
    const file  = object.file as RcFile;
    const { dispatch, currentShop } = this.props;
    if (dispatch) {
      dispatch({
        type: 'shop/uploadLogo',
        payload: {
          file: file,
          shopId: (currentShop as CurrentShop).id
        },
      });
    }
  };

  handlerSubmit = (event: React.MouseEvent) => {
    event.preventDefault();
    const { form, currentShop={}, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        if (dispatch) {
          dispatch({
            type: "shop/saveBasic",
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
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" hideRequiredMark>
            <FormItem label="名称">
              {getFieldDecorator('shopName', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.shopName
              })(<Input />)}
            </FormItem>
            <FormItem label="邮箱">
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.email
              })(<Input />)}
            </FormItem>
            <FormItem label="地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.address
              })(<Input />)}
            </FormItem>
            <FormItem label="联系人">
              {getFieldDecorator('contacts', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.contacts
              })(<Input />)}
            </FormItem>
            <FormItem label="客服电话">
              {getFieldDecorator('servicePhone', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.servicePhone
              })(<Input />)}
            </FormItem>
            <FormItem label="客服时间">
              {getFieldDecorator('serviceTime', {
                rules: [
                  {
                    required: true,
                  }
                ],
                initialValue: currentShop.serviceTime
              })(<ServiceTimeView />)}
            </FormItem>

            <Button type="primary" onClick={this.handlerSubmit}>
              提交资料
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <LogoView logo={this.getLogoUrl()} customRequest={this.customRequest}/>
        </div>
      </div>
    );
  }
}

export default Form.create<BasicViewProps>()(BasicView);