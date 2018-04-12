import React, { PureComponent } from 'react';
import { Form, Icon, Input, Button, Checkbox,Modal } from 'antd';
import {OperateSetting} from './OperateSetting';

const FormItem = Form.Item;
const { TextArea } = Input;

class OperateEdit extends PureComponent {
    state = {
        templateContent:""
      };

    handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        this.props.onSubmit({
            type:"success",
            data:{
                ...values,
                templateContent:this.settingFrm.getSettingString(),
                id:this.props.data.id
            }
        });
      }
    });
  }
//   componentWillReceiveProps(nextProps) {
//     //this.props.form.resetFields();
//     this.setState({...nextProps.data},()=>{
//     });
//   }  
  componentDidMount(){
    this.setState({...this.props.data});
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    var datainfo=this.props.data;
    //resetFields
    return (
        <Modal
        title={datainfo.id?"编辑操作项":"新建操作项"}
        visible={this.props.modalVisible}
        onOk={this.handleSubmit}
        onCancel={() => {
            this.props.onSubmit({type:"cancel"});
        }}
        afterClose={()=>{
            this.props.form.resetFields();
        }}
        >
            <Form className="edit-form">
                <FormItem labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="操作名称">
                {getFieldDecorator('name', {
                    initialValue:datainfo.name,
                    rules: [{ required: true, message: '必须输入操作名称!' }],
                })(
                    <Input placeholder="请输入操作名称" />
                )}
                </FormItem>
                <FormItem labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="操作编码">
                    {getFieldDecorator('code', {
                        initialValue:datainfo.code,
                        rules: [{ required: true, message: '必须输入操作编码!' }],
                    })(
                        <Input placeholder="请输入操作编码" />
                    )}
                </FormItem>
                <OperateSetting ref={e=>this.settingFrm=e} value={datainfo.templateContent}/>
            </Form>
      </Modal>
    );
  }
}
export default Form.create()(OperateEdit);