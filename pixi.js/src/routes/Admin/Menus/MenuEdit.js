import React, {PureComponent} from 'react';
import {
    Form,
    Icon,
    Input,
    Button,
    Checkbox,
    Modal,
    Select,
    Tree
} from 'antd';
import {iconArray} from '../Operate/OperateSetting';

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const {TextArea} = Input;
var iconsOption = iconArray.map(x => {
    return <Option key={x} value={x}><Icon type={x}/> {x}
    </Option>
});
@Form.create()
export default class MenuEdit extends PureComponent {
    state = {
        operates: []
    };

    handleSubmit = (e) => {
        e.preventDefault();
        this
            .props
            .form
            .validateFields((err, values) => {
                if (!err) {
                    const {parentId, operates} = this.state;
                    var checkedOperates=operates||[];
                    var senddata = {
                        ...values,
                        id: this.state.id,
                        parentId: parentId,
                        operate: checkedOperates.join(",")
                    }
                    this
                        .props
                        .onSubmit({type: "success", data: senddata});
                }
            });
    }
    //   componentWillReceiveProps(nextProps) {     //this.props.form.resetFields();
    //     this.setState({...nextProps.data},()=>{     });   }
    componentDidMount() {
        this.setState({
            ...this.props.data
        });
    }
    render() {
        const {getFieldDecorator} = this.props.form;
        var datainfo = this.state;
        const operateList = this
            .props
            .operates
            .map(item => {
                return <Checkbox key={item.id} value={item.id}>{item.name}</Checkbox>
            });
        const menusData = [
            {
                name: "顶级菜单",
                id: "0",
                children: this.props.menusData
            }
        ];
        const loop = (data, level = 0) => data.map((item) => {
            if (item.id == this.state.id) {
                return null;
            }
            var nodeitem = <span className="node-item">
                <span>{item.name}</span>
                {item.id == datainfo.parentId && <Checkbox checked={true}/>
}</span>
            if (item.children && item.children.length > 0) {
                return <TreeNode key={item.id} title={nodeitem}>{loop(item.children, level + 1)}</TreeNode>;
            }
            return <TreeNode key={item.id} title={nodeitem}/>;
        });
        //resetFields
        return (
            <Modal
                title={datainfo.id
                ? "编辑菜单项"
                : "新建菜单项"}
                visible={this.props.modalVisible}
                onOk={this.handleSubmit}
                onCancel={() => {
                this
                    .props
                    .onSubmit({type: "cancel"});
            }}
                afterClose={() => {
                this
                    .props
                    .form
                    .resetFields();
            }}>
                <Form className="edit-form">
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="菜单名称">
                        {getFieldDecorator('name', {
                            initialValue: datainfo.name,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入菜单名称!'
                                }
                            ]
                        })(<Input placeholder="请输入菜单名称"/>)}
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="菜单编码">
                        {getFieldDecorator('code', {
                            initialValue: datainfo.code,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入菜单编码!'
                                }
                            ]
                        })(<Input placeholder="请输入菜单编码"/>)}
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="菜单地址">
                        {getFieldDecorator('url', {
                            initialValue: datainfo.url,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入菜单地址!'
                                }
                            ]
                        })(<Input placeholder="请输入菜单地址"/>)}
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="菜单图标">
                        {getFieldDecorator('icon', {initialValue: datainfo.icon})(
                            <Select
                                style={{
                                width: 200
                            }}
                                onChange={ev => {
                                this.setState({icon: ev});
                            }}>
                                <Option value="">
                                    无图标
                                </Option>
                                {iconsOption}
                            </Select>
                        )}

                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="上级菜单">
                        <Tree
                            defaultSelectedKeys={[datainfo.parentId]}
                            defaultExpandedKeys={["0"]}
                            onSelect={ev => {
                            if (ev.length > 0) {
                                this.setState({parentId: ev[0]});
                            }
                        }}>
                            {loop(menusData)}
                        </Tree>
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 19
                    }}
                        label="功能操作">
                        <CheckboxGroup
                            onChange={(ev) => {
                            this.setState({operates: ev});
                        }}
                            value={datainfo.operates}>
                            {operateList}
                        </CheckboxGroup>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}