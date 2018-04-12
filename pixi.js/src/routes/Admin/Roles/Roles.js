import React, { PureComponent } from 'react';
import { stringify } from 'qs';
import { connect } from 'dva';
import { Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
import styles from '../admin.less';
import RoleList from './RoleList';
import RoleEdit from './RoleEdit';
import { OperateHelper } from '../Operate/OperateSetting';

const confirm = Modal.confirm;
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(state => ({
  rule: state.roles,
}))
@Form.create()
export default class Roles extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    editInfo:{},
    adminMenus:[],
    pageNum:1,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'roles/roleMenuList',
      callback:result=>{
        if(result.code==="success"){
            this.setState({adminMenus:result.data})
        }
      }
    });
    this.getDataList();
  }
  //获取分页数据
  getDataList=(pageNum)=>{
    pageNum=pageNum||this.state.pageNum;
    this.setState({pageNum:pageNum});
    const { dispatch } = this.props;
    var temp=Object.assign({},this.state.formValues);
    if(temp.createTime){
      temp.createTime=temp.createTime.format("YYYY-MM-DD");
    }
    dispatch({
      type: 'roles/getList',
      payload: {
        pageNum:pageNum,
        searchCondition: stringify(temp)
      },
    });
  };
  //分页修改
  handleTableChange=(pagination, filters, sorter)=>{
    this.getDataList(pagination.current);
  };
  //重置筛选
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {}
    },()=>{
      this.getDataList(1);
    });
    
  };
  //切换显示筛选表单
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };
  //操作
  handleActionClick = (e) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    switch (e.code) {
      case 'add':
          this.setState({
            editInfo:{
              name:"",
              code:"",
              templateContent:"",
            },
            modalVisible:true
          });
          break;      
      case 'edit':
          dispatch({
            type: 'roles/getInfo',
            payload:{
              id:e.record.id
            },
            callback:(result)=>{
              if(result.code==="success"){
                  var datainfo=result.data.role;
                  datainfo.menu=result.data.menu;
                  this.setState({
                    modalVisible:true,
                    editInfo:datainfo
                  });
              }
            }
          });
          
          break;
      case 'save':
          if(e.data.id){
            dispatch({
              type: 'roles/update',
              payload:e.data,
              callback:(result)=>{
                if(result.code==="success"){
                  this.getDataList();
                }
              }
            });
          }else{
            dispatch({
              type: 'roles/addSave',
              payload:e.data,
              callback:(result)=>{
                if(result.code==="success"){
                  this.getDataList(1);
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
                type: 'roles/remove',
                payload: {
                  id: selectedRows.map(row => row.id).join(','),
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
  //选择记录
  handleSelectRows = (rows) => {
    this.setState({
      selectedRows: rows,
    });
  }
  //搜索
  handleSearch = (e) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      },()=>{
        this.getDataList(1);
      });
      
    });
  }
  //工具条渲染
  renderToolsbar() {
    const { getFieldDecorator } = this.props.form;
    const { rule: { data} } = this.props;
    return (
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
          <div className={styles.tableListOperator}>
          {OperateHelper.operateButtonShow(data.operateAuthorities,this.handleActionClick,null)}
          </div>
          </Col>
          <Col md={8} sm={24} className={"text-right"}>
            <span className={styles.submitButtons}>
              {this.state.formValues.hasOwnProperty("updatedAt")&&
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
              }
              {this.state.expandForm?
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                收起 <Icon type="up" />
              </a>
              :
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                筛选 <Icon type="down" />
              </a>
              }
            </span>
          </Col>
        </Row>
    );
  }
  //筛选表单
  renderAdvancedForm() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="角色名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="角色描述">
              {getFieldDecorator('describe')(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="创建日期">
              {getFieldDecorator('createTime')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入创建日期" />
              )}
            </FormItem>
          </Col>
          <Col md={3} sm={24}>
            <Button type="primary" htmlType="submit">查询</Button>
          </Col>          
        </Row>
      </Form>
    );
  }

  render() {
    const { rule: { loading: ruleLoading, data} } = this.props;
    const { selectedRows, modalVisible, editInfo,adminMenus } = this.state;
    return (
      <PageHeaderLayout title="操作管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              {this.renderToolsbar()}
            </div>
            {this.state.expandForm&&<div className={styles.tableListForm}>
                {this.renderAdvancedForm()}
             </div>            }
             <RoleList
              selectedRows={selectedRows}
              loading={ruleLoading}
              data={data}
              onSelectRow={this.handleSelectRows}
              onButtonClick={this.handleActionClick}
              onChange={this.handleTableChange}
              operateBtns={data.operateAuthorities}
            />
          </div>
        </Card>
        {modalVisible&&
        <RoleEdit modalVisible={true} onSubmit={ev=>{
          this.setState({modalVisible:false});
          if(ev.type==="success"){
              this.handleActionClick({
                code:"save",
                data:ev.data,
              })
          }
          
        }}
          menusData={adminMenus}
          data={editInfo||{}}
        />
      }
      </PageHeaderLayout>
    );
  }
}
