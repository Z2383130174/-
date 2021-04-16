import { Component } from 'react'
import { Card, Table, Button, Space, Pagination ,Popconfirm,message,Tooltip,ConfigProvider,Input,Select} from 'antd'
import { SettingTwoTone, EditTwoTone,SearchOutlined,ReloadOutlined } from '@ant-design/icons';
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
import qs from 'qs'
const { Option } = Select
const provinceData = ['管理员', '校团委','基层团干部'];
const cityData = {
  管理员: ['校团委', '基层团干部', '团员'],
  校团委: ['基层团干部', '团员' ],
  基层团干部:['团员']
};
// import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider} from 'antd';
interface IProps {
    history:any
}

interface IState {
  loading: boolean,
  noticesData: any,
  pagenumber: number,
  referData: any,
  total: number,
  Organization: any[],
  cities: any[],
  secondCity:any[],
  disabled:boolean
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
      this.state = {
          disabled:true,
          secondCity:[],
          cities: provinceData,
          Organization:[],
          loading: false,
          noticesData: [],
          pagenumber: 1,
          referData: {
            limit: 10,
            offset: 0,
            isser:'',         //任务发布人
            accepter: '',     //任务接收人
            title: '',        //任务标题
            school: '',       //任务发布单位
            userSchool:''     //任务接收单位
          },
          total:0,
        }
  }
  componentDidMount() { 
    this.setState({
      loading:true
    }, () => {
      this.getorganization()
        setTimeout(() => {
          this.refer()
     },500)
    })
  }
  public getorganization = () => {
    axios.post("http://www.test.com/adminuser/selectOrganization.php").then((res: any) => {   
      if (res.data.code === 200) {
      const arr=  res.data.data.data.map((item:any) => {
            return item.name
      })
        this.setState({
          Organization: [...arr],
        })
      } 
    }).catch((err) =>{
      console.log(err); 
  })
  }
  //查询数据
  public refer = () => {
    let referData = qs.stringify({
           ...this.state.referData
    });  
    axios.post("http://www.test.com/task/select.php",referData).then((res: any) => {  
      if (res.data.code === 200) {
        this.setState({
          noticesData: res.data.data.data,
          total: res.data.data.count,
          loading:false
        })
      }
    }).catch((err:any)=>{ 
      console.log(err); 
    })
  }
  //页码变化跳转
   public pageChange = (page: number, pageSize: any) => { 
    console.log("123");
    this.setState({
      loading:true,
      pagenumber:page,
        ...this.state.referData,
        offset: (page - 1) * this.state.referData.limit,
    },
      () => { this.refer() }
    )
  }
  //每页数据变化跳转
  private onShowSizeChange = (current: number, size: number) => {
    console.log("456");
    this.setState({
      pagenumber: current,
    }, () => { 
        this.setState({
          loading:true,
          pagenumber: current,
          referData: {
          limit: size,
          offset:(current-1) * size
        }
      }, () => { 
         this.refer() 
      })
    }
  )
  }
    //打开修改弹窗
    public openModal = (record:any) => {
      this.props.history.push({ pathname: '/admin/work/taskManagement/edit', data:{list:record.list,title:'修改公告发布'}})
  } 
    //删除用户数据
    public deleteData = (record: any) => { 
      let deleteData = qs.stringify({
        list: record.list
      });
      axios.post("http://www.test.com/task/delete.php",deleteData).then((res: any) => {
        if (res.data.code === 200) { 
          message.success('删除数据成功')
          this.refer()
        }
         }).catch((err) =>{
          console.log(err); 
      })
  }
  public titleChange = (e:any) => {
    this.setState({
      referData: {...this.state.referData,title:e.target.value}
    })
  }
  public userSchoolChange = (value: any) => {
    if (value ===undefined) {
      this.setState({
        referData: { ...this.state.referData, userSchool: '',},
         })
    } else {
      this.setState({
        referData: {
          ...this.state.referData, userSchool: value,
        },
     })
    }
  }
  public SchoolChange = (e:any) => {
    this.setState({
      referData: {...this.state.referData,school:e.target.value}
    })
  }

    public isserCahange = (value: any) => {
      if (value === undefined) {
        this.setState({
          referData: {...this.state.referData,  isser:'',accepter:''},
          secondCity:[],
          disabled:true
        })
      } else {
        this.setState({
          referData: {...this.state.referData,  isser:value,  accepter:cityData[value][0],},
          secondCity: cityData[value],
          disabled:false
        })
      }
  }
  public accepterCahange = (value:any) => {
    this.setState({
      referData: {...this.state.referData,accepter:value}
    })
  }
  //新增公告
    public add = () => {
        this.props.history.push({ pathname: '/admin/work/taskManagement/edit', data: {title:'新增任务'}})
    }
    render() {
        const columns:any= [
            {
              title: '序号',
              dataIndex: 'number',
              align: 'center ' as 'center',
              width:'6%',
              render: (text: any,record:any,index:any) => `${(this.state.pagenumber-1)*this.state.referData.limit+index+1}`,
            },
            {
              title: '任务标题',
              dataIndex: 'title',
              align: 'center ' as 'center',
              width: '13%',
              onCell: () => {
                return {
                  style: {
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow:'ellipsis',
                    cursor: 'pointer',
                    maxWidth:'220px'
                  }
                }
              },
              render: (text: any, record: any, index: any) => (
                <Tooltip placement="top" title={text}>
                  { text}
              </Tooltip >
            ),
              
            },
            {
              title: '任务接收对象',
              dataIndex: 'userSchool',
              align: 'center ' as 'center',
              width:'11%'
            },
            {
                title: '任务发布单位',
                dataIndex: 'school',
                align: 'center ' as 'center',
                width:'11%'
          },
          {
            title: '任务发布人',
            dataIndex: 'isser',
            align: 'center ' as 'center',
            width:'10%'
          },
          {
            title: '任务接收人 ',
            dataIndex: 'accepter',
            align: 'center ' as 'center',
            width:'10%'
        },
            {
                title: '任务开始时间',
                dataIndex: 'startTime',
                align: 'center ' as 'center',
                width:'13%'
          }, 
          {
            title: '任务结束时间',
            dataIndex: 'endTime',
            align: 'center ' as 'center',
            width:'13%'
          }, 
            {
              title: '操作',
              width:'15%',
              align:'center 'as 'center',
              render: (text:any, record:any) => (
                <Space size="middle">                 
                  <a onClick={() => { this.openModal(record) }}><EditTwoTone onClick={() => {  this.openModal(record )}}/>修改</a>
                  <Popconfirm title="确认删除此项"
                     okText="Yes"
                     cancelText="No"
                    onCancel={() => {
                      console.log("用户取消删除")
                    }}
                    onConfirm={() => {      
                      this.deleteData(record)
                    }}>
                    <a> <SettingTwoTone />删除</a>
                      </Popconfirm>
                </Space>
              ),
            },
        ];
        return (
          <Card title="任务管理" extra={<Button type="primary" size="small" onClick={this.add}>新增</Button>}>
            公告标题： <Input style={{
                 marginLeft: '23px',
                 width: "20%",
                marginRight: '90px'
              }}
                value={this.state.referData.title}
                onChange={this.titleChange}
            ></Input>
             任务发布人：<Select value={this.state.referData.isser}
            placeholder="请选择任务的发布人"
                  allowClear   
                  style={{
                    width: "20%",
                    marginRight: '100px'
                         }}
              onChange={this.isserCahange}
              >
        { this.state.cities.map((item:any) =>(
       <Option value={ item}>{item}</Option>
         ))}
              </Select>
              任务接收人：<Select value={this.state.referData.accepter}
              disabled={ this.state.disabled}
            placeholder="请选择任务的接收人"
                  allowClear   
                  style={{
                      width: "20%",
                         }}
              onChange={this.accepterCahange}
              >
        { this.state.secondCity.map((item:any) =>(
       <Option value={ item}>{item}</Option>
         ))}
              </Select>
            <div style={{marginTop:'30px',marginBottom:'30px'}}>
            公告接收对象：<Select style={{ 
                width: "20%",
                marginRight: '75px'
              }}
              allowClear
                value={this.state.referData.userSchool}
                onChange={this.userSchoolChange}
              >   { this.state.Organization.map((item:any,index:any) =>(
                <Option value={item} key={ index}>{item}</Option>
             ))}
              </Select>
              公告发布单位：<Input style={{
                 width:"20%",
              }}
                value={this.state.referData.school}
                onChange={this.SchoolChange}
              >
              </Input>
            </div>
              <div style={{ float:"right",marginTop:'-32px'}}>
              <Button type="primary" icon={<SearchOutlined />} style={{marginRight:'30px'}}onClick={this.refer}>查询</Button>
                <Button type="dashed" icon={<ReloadOutlined />}
                  // onClick={this.reset}
                >重置</Button></div>
      

            <Table columns={columns} dataSource={ this.state.noticesData} loading={ this.state.loading} rowKey={record => record.list} pagination={false} /> 
            <ConfigProvider locale={zhCN}>
            <Pagination
              total={this.state.total}
              showSizeChanger
              showQuickJumper
              onChange={this.pageChange}
              onShowSizeChange={this.onShowSizeChange}
              showTotal={total => `共 ${total}条数据 `}
              current={this.state.pagenumber}
              style={{
                marginTop: '30px',
                float:'right'
                }}
            />  </ConfigProvider>
          </Card> 
        );
    }

}