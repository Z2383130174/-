/* eslint-disable array-callback-return */

import { Component } from 'react'
import { Table, Space, Popconfirm } from 'antd'
import axios from 'axios'
import { createFromIconfontCN } from '@ant-design/icons';
const IconFont = createFromIconfontCN({
    scriptUrl: [
"//at.alicdn.com/t/font_1999223_k1aezr3mvn.js"
    ], 
  });
interface IProps {   

}

interface IState {
    Data: any[],
    loading:boolean
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            Data: [],
            loading:false
        }
    }
    componentDidMount() {
        this.refer()
    }
    public refer = () => {
        axios.post("http://www.test.com/database/database.php").then((res: any) => {
          if (res.data.code === 200) {
            let arr: any[] = []
            arr = res.data.data.data.map((item: any, index: number) => {
              item.creatTime = res.data.data.creatTimeData[index].CREATE_TIME
              item.updateTime =  res.data.data.updateTimeData[index].UPDATE_TIME
              item.belong = 'demo'
                 return item 
               })
                this.setState({
                    Data:[...arr]     
                })
            }
          }).catch((err: any) => {
            console.log(err);
          })
  }
  public deleteData = (record:any) => {
    console.log(record); 
    
  }
    render() {
        const columns = [
            {
              title: '序号',
              dataIndex: 'number',
              align: 'center ' as 'center',
              width:'15%',
              render: (text: any,record:any,index:any) => `${index+1}`,
            },
            {
              title: '库表名称',
              dataIndex: 'Tables_in_demo',
              align: 'center ' as 'center',
              width:'18%',
          },
          {
            title: '最初创建时间',
            dataIndex: 'creatTime',
            align: 'center ' as 'center',
            width:'20%',
          },
            {
              title: '最终修改时间',
              width:'20%',
              dataIndex: 'updateTime',
              align:'center 'as 'center',
          },
          {
            title: '所属数据库',
            dataIndex: 'belong',
            align: 'center ' as 'center',
              width: '10%',
              render: (text: any) => (
                <span style={{
                   color:'blue'
                }}>{ text}</span>
              ),
          },
            {
              title: '操作',
              width:'20%',
              align:'center 'as 'center',
              render: (text:any, record:any) => (
                <Space size="middle">                 
                  <a><IconFont type="iconbeifen" style={{
      fontSize: "15px",
         }} />备份</a>
                  <Popconfirm title="确认删除此项"
                     okText="Yes"
                     cancelText="No"
                    onCancel={() => {
                      console.log("用户取消删除")
                    }}
                    onConfirm={() => {      
                      this.deleteData(record)
                    }}>
                  <a> <IconFont type="icontubiaozhizuomobanyihuifu-" style={{
      fontSize: "15px",
         }} />删除</a>
                 </Popconfirm>
                </Space>
              ),
            },
        ]; 
        return (
            <div>
            <Table columns={columns} dataSource={this.state.Data} loading={this.state.loading} rowKey={record => record.list} pagination={false} /> 
            </div>
        );
    }

}