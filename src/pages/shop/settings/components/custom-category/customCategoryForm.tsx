import React, { Component, Fragment } from "react";
import { Form, Select, InputNumber, Button,Input  } from "antd";
import { FormComponentProps } from 'antd/es/form';
import { CustomCategory } from "@/pages/shop/data";

export interface CustomCategoryFormProps extends FormComponentProps {
  currentCate: Partial<CustomCategory>;
  parentCates?: Partial<CustomCategory>[];
  handleSubmit: (value: Partial<CustomCategory>) => void;
}

interface CustomCategoryFormState {

}

export class BasicCustomCategoryForm extends Component<CustomCategoryFormProps, CustomCategoryFormState> {

  

  renderSelect = () => {
    const { parentCates=[] } = this.props; 
    return (
      <Select>
        {
          parentCates.map((cate: Partial<CustomCategory>) => 
            <Select.Option key={cate.id} value={cate.id}>{cate.cateName}</Select.Option>
          )
        }
      </Select>
    )
  }

  handleSubmit = (e?: React.FormEvent<HTMLElement>) => {
    if (e) {
      e.preventDefault();
    }
    const { form, handleSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const cate = { ...values };
        if (handleSubmit) {
          handleSubmit(cate);
        }
      }
    });
  }

  render() {
    const { form:{ getFieldDecorator }, currentCate={} } = this.props;
    return (
      <Fragment>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item label="父分类" key="parentId">
            {
              getFieldDecorator('parentId', {
                initialValue: currentCate.parentId
              })(this.renderSelect())
            }
          </Form.Item>
          <Form.Item label="分类名称" key="cateName">
            {
              getFieldDecorator('cateName', {
                initialValue: currentCate.cateName
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label="国际化" key="i18n">
            {
              getFieldDecorator('i18n', {
                initialValue: currentCate.i18n
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label="排序" key="priority">
            {
              getFieldDecorator('priority', {
                initialValue: currentCate.priority
              })(<InputNumber/>)
            }
          </Form.Item>
        </Form>
      </Fragment>
    );
  }

}

export default Form.create<CustomCategoryFormProps>()(BasicCustomCategoryForm);