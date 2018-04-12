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

const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const CheckboxGroup = Checkbox.Group;
const FormItem = Form.Item;
const {TextArea} = Input;

@Form.create()
export default class RoleEdit extends PureComponent {
    state = {
        checkedMenus: [],
        menu:[],
    };
    getMenus=(menus)=>{
        const {menusData} = this.props;
        var m = menus.filter(x=>x.toString().indexOf("operate_")===-1);
        var o = menus.filter(x=>x.toString().indexOf("operate_")!==-1);
        //将有上下级关系的菜单展开为一维数组
        var allMenus=[];
        const loop=(ms)=>{
            ms.forEach(item => {
                allMenus.push({
                    id:item.id.toString(),
                    parentId:item.parentId.toString(),
                });
                if(item.children&&item.children.length>0){
                    loop(item.children);
                }                
            });
        };
        loop(menusData);
        //检测并追加上级菜单
        const checkParentMenu=(val)=>{
            var tmp=allMenus.filter(x=>x.id==val);
            if(tmp){
                var item=tmp[0];
                if(m.indexOf(item.id)==-1){
                    m.push(item.id);
                };
                if(item.parentId!=="0"){
                    checkParentMenu(item.parentId);
                }
            }
        };
        var reg=/^operate\_(\d+)\_.+$/;
        //遍历操作项，查找相关菜单权限
        o.forEach(item => {
            var tmp=reg.exec(item);
            if(tmp.length==2){
                var t=tmp[1];
                checkParentMenu(t);
            }
        });
        return m;
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this
            .props
            .form
            .validateFields((err, values) => {
                if (!err) {
                    let {checkedMenus} = this.state;
                    checkedMenus=checkedMenus.length>0?checkedMenus:this.state.menu;
                    var senddata = {
                        ...values,
                        id: this.state.id,
                        menu: this.getMenus(checkedMenus).join(","),
                        operate: checkedMenus.filter(x=>x.toString().indexOf("operate_")!==-1).join(","),
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
        const {menusData} = this.props;
        var datainfo = this.state;
        const loop = (data) => data.map((item) => {
            if (item.id == this.state.id) {
                return null;
            }
            var nodeitem = <span className="node-item">
                <span>{item.name}</span>
                {item.id == datainfo.parentId && <Checkbox checked={true}/>
}</span>
            if (item.children && item.children.length > 0) {
                return <TreeNode key={item.id} title={nodeitem}>{loop(item.children)}</TreeNode>;
            }
            if (item.operate && item.operate.length > 0) {
                var operates=item.operate.map(x=>{
                    if(x.id.indexOf("operate_")===-1){
                        x.id="operate_"+item.id+"_"+x.id;
                    }
                    return x;});
                return <TreeNode key={item.id} title={nodeitem}>{loop(operates)}</TreeNode>;
            }
            return <TreeNode key={item.id} title={nodeitem}/>;
        });
        //resetFields
        return (
            <Modal
                title={datainfo.id
                ? "编辑角色"
                : "新建角色"}
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
                        label="角色名称">
                        {getFieldDecorator('name', {
                            initialValue: datainfo.name,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入角色名称!'
                                }
                            ]
                        })(<Input placeholder="请输入角色名称"/>)}
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="角色描述">
                        {getFieldDecorator('describe', {
                            initialValue: datainfo.describe,
                            rules: [
                                {
                                    required: true,
                                    message: '必须输入角色描述!'
                                }
                            ]
                        })(<Input placeholder="请输入角色描述"/>)}
                    </FormItem>
                    <FormItem
                        labelCol={{
                        span: 5
                    }}
                        wrapperCol={{
                        span: 15
                    }}
                        label="菜单权限">
                        <Tree
                            checkable={true}
                            defaultCheckedKeys={datainfo.menu.filter(x=>x.indexOf("operate_")!==-1)}
                            onCheck={ev => {
                                this.setState({checkedMenus:ev});
                            }}>
                            {loop(menusData)}
                        </Tree>
                    </FormItem>

                </Form>
            </Modal>
        );
    }
}