import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row,Spin, Col,Tree, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../admin.less';
import MenuEdit from './MenuEdit';
import { OperateHelper } from '../Operate/OperateSetting';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const TreeNode = Tree.TreeNode;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  rule: state.menus,
}))
@Form.create()
export default class Menus extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editInfo:{},
    menusData:[],
    operateList:[]
  };
  //获取菜单数据
  getDataList=()=>{
    const { dispatch } = this.props;
    dispatch({
      type: 'menus/getList',
    }).then(resp=>{
      const { rule: { data} } = this.props;
      this.setState({menusData:data.list});
    });
  };
  componentDidMount() {
    const { dispatch } = this.props;
    this.getDataList();
    dispatch({
      type: 'menus/operateFindAll',
      callback:resp=>{
        this.setState({operateList:resp.data});
      }
    });
  }

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  handleActionClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    switch (e.code) {
      case 'add':
          this.setState({
            editInfo:{
              name:"",
              code:"",
              icon:"",
              url:"",
              parentId:"0",
              operates:[],
            },
            modalVisible:true
          });
          break;      
      case 'edit':
          dispatch({
            type: 'menus/getInfo',
            payload:{
              id:e.record.id
            },
            callback:(result)=>{
              if(result.code==="success"){
                  this.setState({
                    modalVisible:true,
                    editInfo:{
                      ...result.data.menu,
                      operates:result.data.operate
                    }
                  });
              }
            }
          });
          
          break;
      case 'saveMenuSort':
          var senddata=[];
          const loop = (data, save) => {
            data.forEach((item, index, arr) => {
              var newitem={
                id:item.id,
              };
              if (item.children&&item.children.length>0) {
                newitem.children=[];
                loop(item.children, newitem.children);
              }
              save.push(newitem);
            });
          };
          loop(this.state.menusData,senddata);
          dispatch({
            type: 'menus/saveMenuSort',
            payload:{
              json:JSON.stringify(senddata),
            },
            callback:(result)=>{
              if(result.code==="success"){
                message.success("菜单排序保存成功");
              }
            }
          });
          break;
      case 'save':
          if(e.data.id){
            dispatch({
              type: 'menus/update',
              payload:e.data,
              callback:(result)=>{
                if(result.code==="success"){
                  this.getDataList();
                }
              }
            });
          }else{
            dispatch({
              type: 'menus/addSave',
              payload:e.data,
              callback:(result)=>{
                if(result.code==="success"){
                  this.getDataList();
                }
              }
            });
          }
          break; 
      case 'remove':
          if (!selectedRows||selectedRows.length===0) {
            message.warning("请先选中要删除的记录");
            return;
          };
          var self=this;
          confirm({
            title: '删除提示',
            content: '确定要删除选中的 '+selectedRows.length+' 条记录吗?',
            onOk() {
              dispatch({
                type: 'menus/remove',
                payload: {
                  id: selectedRows.join(','),
                },
                callback: (result) => {
                  self.setState({
                    selectedRows: [],
                  });
                  if(result.code==="success"){
                    self.getDataList();
                  }
                },
              });
            },
            onCancel() {},
          });
          break;                   
      default:
        break;
    }
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { rule: { data} } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={24} sm={24}>
          <div className={styles.tableListOperator}>
          {OperateHelper.operateButtonShow(data.operateAuthorities,this.handleActionClick,null)}
          </div>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { rule: { loading: ruleLoading, data} } = this.props;
    const { selectedRows, modalVisible, editInfo } = this.state;
    const loop = (menuitems,level=0) => menuitems.map((item) => {
      var nodeitem=<div className="node-item" style={{"minWidth":(500-level*18)+"px"}}> <div className="pull-right">
        {OperateHelper.operateButtonShow(data.operateAuthorities,this.handleActionClick,item)}
        </div> {item.name}</div>
      if (item.children && item.children.length>0) {
        return <TreeNode key={item.id} title={nodeitem}>{loop(item.children,level+1)}</TreeNode>;
      }
      return <TreeNode key={item.id} title={nodeitem} />;
    });
    return (
      <PageHeaderLayout>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <Spin spinning={ruleLoading} delay={500} >
            <div className={styles.tableListForm}>
              {this.renderSimpleForm()}
            </div>
            {this.state.menusData.length>0&&
            <Tree
              className="draggable-tree"
              defaultExpandAll={true}
              checkable={true}
              draggable={true}
              onDragEnter={this.onDragEnter}
              onDrop={this.onDrop}
              checkedKeys={this.state.selectedRows}
              onCheck={(checkedKeys)=>{
                this.setState({selectedRows:checkedKeys});
              }}
            >
              {loop(this.state.menusData)}
            </Tree>
            }
            </Spin>
          </div>
        </Card>
        {modalVisible&&
        <MenuEdit modalVisible={true} onSubmit={ev=>{
          this.setState({modalVisible:false});
          if(ev.type==="success"){
              this.handleActionClick({
                code:"save",
                data:ev.data,
              })
          }
        }}
          operates={this.state.operateList}
          data={editInfo||{}}
          menusData={this.state.menusData}
        />}
      </PageHeaderLayout>
    );
  }
  onDragEnter = (info) => {
    //console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  }
  onDrop = (info) => {
    //console.log(info);
    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
    // const dragNodesKeys = info.dragNodesKeys;
    const loop = (data, key, callback) => {
      data.forEach((item, index, arr) => {
        if (item.id === key) {
          return callback(item, index, arr);
        }
        if (item.children) {
          return loop(item.children, key, callback);
        }
      });
    };
    const data = [...this.state.menusData];
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });
    if (info.dropToGap) {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        // drag node and drop node in the same level
        // and drop to the last node
        if (dragKey.length === dropKey.length && ar.length - 1 === i) {
          i += 2;
        }
        ar.splice(i - 1, 0, dragObj);
      }
    } else {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到尾部，可以是随意位置
        item.children.push(dragObj);
      });
    }
    this.setState({
      menusData: data,
    });
  }
}
