//用户账号管理组件
import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider, Popconfirm} from 'antd';
import React, { Component } from 'react'
import { SettingTwoTone, EditTwoTone, EyeInvisibleOutlined, EyeTwoTone,BulbOutlined } from '@ant-design/icons';
import zhCN from 'antd/lib/locale/zh_CN';
import axios from 'axios'
import qs from 'qs';
import './index.css'
const { Option } = Select;
interface IProps {
  location:any
}

interface IState {
  openModal: boolean,
  userData: any,
  title: string,
  referData: any,
  pagenumber: number,
  Data: any,
  total: number,
  list: number,
  selectedRowKeys: any,
  loading: boolean,
  deleteData:any,
}
export default class Login extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
      this.state = {
        deleteData:[],
          selectedRowKeys: [],
          loading: false,
          total:0,
          openModal: false,
          title: '',
          pagenumber: 1,
          Data: [],
          list:0,
          //查询账号
          referData: {
            id: '',
            jurisdiction: '',
            limit: 10,
            offset: 0,
            userSchool:'',
          },
          //新增修改账号
          userData: {
            id: '',
            password:'',
            jurisdiction: '',
            userSchool:'',
          }
        }
  }
   //页面刷新表格数据请求
   componentDidMount() { 
     this.refer();
  }
  //获取所有用户数据
public gettable = () => { 
    let referData = qs.stringify({
           ...this.state.referData
    });  
    axios.post("http://www.test.com/adminuser/select.php", referData).then((res: any) => {   
      if (res.data.code === 200) { 
        this.setState({
          loading:false,
          Data: res.data.data.data,
          total: res.data.data.count
        })
      } else { 
        this.setState({
          Data: [],
          total:0,
        })
      }
    }).catch((err) =>{
      console.log(err); 
  })
  }
  //删除用户数据
  public deleteData = (record: any) => { 
    let deleteData = qs.stringify({
      list: record.list
    });
    axios.post("http://www.test.com/adminuser/delete.php",deleteData).then((res: any) => {
      if (res.data.code === 200) { 
        message.success('删除数据成功')
        this.refer()
      }
       }).catch((err) =>{
        console.log(err); 
    })
  }
//批量删除用户数据
public anyDelete = () => { 
  if (this.state.selectedRowKeys.length>0) {
    let deleteData = qs.stringify({
      list:this.state.deleteData
    }) 
    axios.post("http://www.test.com/adminuser/anydelete.php", deleteData).then((res: any) => {
      if (res.data.code === 200) {
        message.success('批量删除数据成功')
        this.refer()
        this.setState({
          deleteData:[]
          });
      }
    }).catch((err) =>{
      console.log(err); 
  })
  } else {
    message.warning('请选择数据以进行批量删除')
    }
  }

  //新增用户数据
  public addData = () => { 
  let addData = qs.stringify({
         ...this.state.userData
  });      console.log(addData);
    axios.post("http://www.test.com/adminuser/add.php", addData).then((res: any) => {
      if (res.data.code === 200) { 
        if (res.data.msg === "新增数据成功") {
          message.success('新增账号成功')
          this.setState({
            openModal: !this.state.openModal,
            userData: {
              id: '',
              password: '',
              jurisdiction: '',
              userschoo:'',
            }
          }, () => {
            this.refer()
          })
        } else { 
          message.error('数据库已有相同账号，请重新输入账号')
        }
      }
     }).catch((err) =>{
      console.log(err); 
  })
  }
  //修改用户数据
  public updateData = () => { 
    let qsData = qs.stringify({
     list:this.state.list,
     ...this.state.userData
    });
    axios.post("http://www.test.com/adminuser/update.php", qsData).then((res: any) => {
      if (res.data.code === 200) {
        message.success('修改用户数据成功')
        this.setState({
          openModal: !this.state.openModal,
          userData: {
            id: '',
            password: '',
            jurisdiction: '',
            userSchool:'',
          }
        }, () => {
          this.refer()
        })
      }
     }).catch((err) =>{
      console.log(err); 
  })
  }

  //查询账号
  public refer = () => { 
    this.setState({
      loading:true
    }, () => { 
      setTimeout(()=>{
        this.gettable()
     },500)
    })
  }
  //重置搜索内容
  public reset = () => { 
    this.setState({
      referData: {
            id: '',
            jurisdiction: '',
            limit: 10,
            offset: 0,
            userSchool:'',
      }
    }, () => {
       this.refer()
     })
  }

  //页码变化跳转
  public pageChange = (page: number, pageSize: any) => { 
    console.log("123");
    this.setState({
      loading:true,
      pagenumber:page,
      referData: {
        ...this.state.referData,
        offset: (page - 1) * this.state.referData.limit,
      },
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
          ...this.state.referData,
          limit: size,
          offset:(current-1) * size
        }
      }, () => { 
         this.refer() 
      })
    }
  )
  }

  //新增账号弹窗
  public add = (() => { 
    this.setState({
      openModal: !this.state.openModal,
      title:'新增账号'
    })
  })
   //打开修改弹窗
  public openModal = (record:any) => {
    this.setState({
      userData: {
        id: record.id,
        password: record.password,
        jurisdiction: record.jurisdiction,
        userSchool:record.userSchool
      },
      title: '修改账号', 
      list:record.list,
      openModal:!this.state.openModal
    })
  }  
  //查询账号id触发事件
  public referIdChange  = (e:any) => { 
    this.setState({
      referData: {...this.state.referData,id:e.target.value}
    })
  }
   //查询账号权限触发事件
  public referSelectchange = (value:any) => { 
    if (value === undefined) {
              value=""
    } 
      this.setState({
        referData: {...this.state.referData,jurisdiction:value}
      }, () => {
          console.log(value);
      })

  }
  //查询所属团支部
  public userChange = (value: any) => { 
    if (value === undefined) {
      value=""
      } 
    this.setState({
      referData: {...this.state.referData, userSchool:value}  
        })
    }
  //新增修改账号id触发事件
  public idChange = (e:any) => { 
    let value=e.target.value
    const reg = /^-?(|[1-9][0-9]*)(\[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.setState({
        userData: {...this.state.userData,id:value}
      }, () => {
          console.log(this.state.userData);     
      })
    }
  }
  //新增修改账号密码触发事件
  public passwordChange = (e: any) => { 
    let value = e.target.value
      this.setState({
        userData: {...this.state.userData,password:value}
      }, () => {
          console.log(this.state.userData);     
      })
  }
  
  //新增修改账号权限下拉框改变
  public selectchange = (value: any) => {
    if (value === undefined) {
              value=""
      } 
    this.setState({
      userData: {...this.state.userData,jurisdiction:value}
    }, () => {
        console.log(this.state.userData);     
    })
  }
  //新增修改账号所属组织下拉框改变
  public userselectChange = (value: any) => {
    if (value === undefined) {
      value=""
      } 
  this.setState({
    userData: {...this.state.userData,userSchool:value}
  }, () => {
      console.log(this.state.userData);     
  })
}

  //弹窗确定
  public handleOk = () => {
    const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
    if (this.state.userData.id&&this.state.userData.id.length > 8) {
      if (this.state.userData.password&&this.state.userData.password.length > 8 &&reg.test(this.state.userData.password)) {
        if (this.state.userData.jurisdiction && this.state.userData.jurisdiction.length > 0) {
          if (this.state.userData.userSchool && this.state.userData.userSchool.length > 0) {
            // eslint-disable-next-line no-lone-blocks
            { this.state.title === '新增账号' ? this.addData() : this.updateData() }
          }else {
            message.warning('请选择账号的所属团支部');
          }
        } else {
          message.warning('请选择账号的对应权限');
        }
      } else { 
        message.warning('密码格式错误，请输入8~20位的密码，且需要同时包含数字和字母');
      }
    } else {
      message.warning('账号格式错误，请输入8~20位的非0开头的数字');
    }
  }
  //关闭弹窗
  public handleCancel = () => {
    this.setState({
      openModal: !this.state.openModal,
      userData: {
        id: '',
        password:'',
        jurisdiction: '',
        userSchool:'',
      },
    })
  }
  //多选数据
  public onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    // eslint-disable-next-line array-callback-return
  selectedRowKeys.map((item:any) => {
               this.state.deleteData.push(item)
  })
   let arr1 = [...new Set(this.state.deleteData)]
   this.setState({
    selectedRowKeys,
    deleteData:arr1
  });
  };
  //清空多选数据
  public empty = () => {
    this.setState({
    selectedRowKeys:[],
    deleteData:[]
    });
  };
  render() {
    const { selectedRowKeys,pagenumber,total,openModal,title}=this.state
    const rowSelection = {
     selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const addStyle = {
      style: {  width: "80%",
      marginLeft:'34px',
    }
    }

    const options = [
      // { label: '管理员', value: '管理员' },
      { label: '校团委', value: '校团委' },
      {label:'基层团干部',value:'基层团干部'}
    ]
    const optionSchool = [
      { label: '初中团支部', value: '初中团支部' },
      { label: '高中团支部', value: '高中团支部' },
      {label:'大学团支部',value:'大学团支部'}
    ]
        const columns = [
            {
              title: '序号',
              dataIndex: 'number',
              align: 'center ' as 'center',
              width:'10%',
              render: (text: any,record:any,index:any) => `${(this.state.pagenumber-1)*this.state.referData.limit+index+1}`,
            },
            {
              title: '账号',
              dataIndex: 'id',
              align: 'center ' as 'center',
              width:'20%',
            },
            {
              title: '密码',
              dataIndex: 'password',
              align: 'center ' as 'center',
              width:'20%',
              render: (text: any,record:any,index:any) => (
                <Input.Password
                  bordered={ false}
                  value={text}
                  readOnly
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
             />)
            },         
            {
              title: '权限',
              width:'20%',
              dataIndex: 'jurisdiction',
              align:'center 'as 'center',
              render: (text: any[]) => (
                <span style={{
                   color:'blue'
                }}>{ text}</span>
              ),
          },
          {
            title: '所属团支部',
            dataIndex: 'userSchool',
            align: 'center ' as 'center',
            width:'15%',
          },
            {
              title: '操作',
              width:'20%',
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
      <div className="user">
            <Row gutter={24} style={{marginBottom:'30px'}}>
              <Col span={6}><label>账号：</label><Input value={this.state.referData.id} onChange={this.referIdChange} style={{width:'80%'}}></Input></Col>
          <Col span={6} ><label>权限：</label><Select value={this.state.referData.jurisdiction}
          allowClear   
          style={{
          width: "80%"
          }}
          onChange={this.referSelectchange}>
        { options.map((item:any,index:any) =>(
          <Option value={item.value} key={index }>{item.label}</Option>
         ))}
          </Select></Col>
          <Col span={6} ><label>所属团支部：</label><Select value={this.state.referData.userSchool}
          allowClear   
          style={{
          width: "70%"
          }}
          onChange={this.userChange}>
        { optionSchool.map((item:any,index:any) =>(
       <Option value={ item.value} key={index }>{item.label}</Option>
         ))}
          </Select></Col>
              <div style={{marginLeft:'120px'}}> 
              <Button type="primary" onClick={ this.refer}>查询</Button>
              <Button type="dashed" style={{marginLeft:'50px'}} onClick={ this.reset}>重置</Button></div>
            </Row>
            <Button type="primary" style={{ float: 'right', marginBottom: '10px' }} onClick={this.add}>新增账号</Button>
            <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.Data} loading={this.state.loading} rowKey={record => record.list} pagination={false} /> 
        <ConfigProvider locale={zhCN}>
               <Pagination
              total={total}
              showSizeChanger
              showQuickJumper
              onChange={this.pageChange}
              onShowSizeChange={this.onShowSizeChange}
              showTotal={total => `共 ${total}条数据 `}
              current={pagenumber}
              style={{
                marginTop: '30px',
                float:'right'
                }}
          />              </ConfigProvider>  
        
        <Popconfirm title="确认删除此项"
                     okText="Yes"
                     cancelText="No"
                    onCancel={() => {
                      console.log("用户取消删除")
                    }}
                    onConfirm={() => {      
                      this.anyDelete()
                    }}>
                  <Button type="primary"
            style={{
                marginTop: '30px',
                float:'left'
              }}>批量删除</Button>
                 </Popconfirm>
          
                     <Button type="primary"
            onClick={ this.empty}
            style={{
              marginTop: '30px',
              marginLeft:'50px',
                float:'left'
              }}>清空选择</Button>   

            <Modal title={title}
              visible={openModal}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              okText="确认"
              cancelText="取消"
            >
          <div
            style={{
                fontFamily: "cursive",
                backgroundColor: '#f0e29e',
                color:'#c79424',
                height: '45px',
                width: '520px',
                fontSize:'20px',
                marginLeft: '-24px',
                marginTop: '-24px',
                textAlign: 'center',
                lineHeight: '45px',
                marginBottom:'30px',
              }}>
               <BulbOutlined />请在下方输入您要{ this.state.title}的账号、密码以及权限
              </div>
              <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">账号：</label>
                  <Input
                    //纯数字15个以内，非0开头
                    value={this.state.userData.id}
                    onChange={this.idChange}
                    maxLength={20}
                    {...addStyle}
                ></Input></Col>
              </Row>
              <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">密码：</label>
              <Input.Password
                className="inputPassword"
                value={
                    this.state.userData.password}
                    onChange={this.passwordChange}
                    maxLength={20}
                  {...addStyle} ></Input.Password></Col>
              </Row>
              <Row>
                <Col span={18}  offset={3}><label className="FormLabelStyle">权限：</label><Select value={this.state.userData.jurisdiction}
                allowClear
                {...addStyle}
                onChange={this.selectchange}>
              { options.map((item:any,index:any) =>(
                <Option value={item.value} key={ index}>{item.label}</Option>
               ))}
            </Select></Col>
            <Col span={18} offset={3} ><label className="FormLabelStyle">所属团支部：</label><Select value={this.state.userData.userSchool}
                allowClear
                {...addStyle}
                onChange={this.userselectChange}>
              { optionSchool.map((item:any,index:any) =>(
             <Option value={ item.value} key={ index}>{item.label}</Option>
               ))}
                </Select></Col>
       </Row>         
      </Modal>
            </div>
        )
    }
}




