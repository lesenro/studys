import React, { PureComponent } from 'react';
import moment from 'moment';
import { Table, Alert, Badge, Divider,Tag } from 'antd';
import { OperateHelper } from '../Operate/OperateSetting';

const statusMap = ['default', 'processing', 'success', 'error'];

class StandardTable extends PureComponent {
  state = {
    selectedRowKeys: [],
    totalCallNo: 0,
  };

  componentWillReceiveProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      this.setState({
        selectedRowKeys: [],
        totalCallNo: 0,
      });
    }
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const totalCallNo = selectedRows.reduce((sum, val) => {
      return sum + parseFloat(val.callNo, 10);
    }, 0);

    if (this.props.onSelectRow) {
      this.props.onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, totalCallNo });
  }

  handleTableChange = (pagination, filters, sorter) => {
    this.props.onChange(pagination, filters, sorter);
  }

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  }

  render() {
    const { selectedRowKeys, totalCallNo } = this.state;
    const { data: { list, pagination }, loading } = this.props;


    const columns = [
      {
        title: '用户名',
        dataIndex: 'loginName',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '手机',
        dataIndex: 'mobile',
      },
      {
        title: '创建日期',
        dataIndex: 'createTime',
        render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
      },
      {
        title: '状态',
        render:(text, record, index)=>(
          <div>
            {record.state==0&&
            <Tag color="green">正常</Tag>}
            {record.state==1&&
            <Tag color="red">禁用</Tag>}
          </div>
        )        
      },      
      {
        title: '操作',
        render: (text, record, index) => (
          OperateHelper.operateButtonShow(this.props.operateBtns,this.props.onButtonClick,record)
        ),
      },
    ];
    const paginationProps = {
      ...pagination,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
    };

    return (
      <div>
        <Table
          loading={loading}
          rowKey={record => record.id}
          rowSelection={rowSelection}
          dataSource={list}
          columns={columns}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }
}

export default StandardTable;
