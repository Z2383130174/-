
//用户账号管理组件
import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider, Popconfirm,Tooltip} from 'antd';
import React, { Component } from 'react'
import { SettingTwoTone, EditTwoTone, EyeInvisibleOutlined, EyeTwoTone,BulbOutlined,SearchOutlined,ReloadOutlined,UserAddOutlined } from '@ant-design/icons';
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
  deleteData: any,
  optionSchool: any,
  schoolClass: any,
  disabled: boolean,
  disabled2: boolean,
}
export default class Login extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
      this.state = {
        disabled: true,
        disabled2: true,
        optionSchool: [],                            //所有团支部
        schoolClass: ['大一','大二','大三','大四'],    //所属年级
        deleteData: [],
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
            userSchool: '',
            rootname: '',
            userClass:'',
          },
          //新增修改账号
          userData: {
            id: '',
            password:'',
            jurisdiction: '',
            userSchool: '',       //所属团支部
            rootname: '',
            userClass:'',         //所在年级
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
  //获取团支部
  public getorganization = () => {
    axios.post("http://www.test.com/adminuser/selectOrganization.php").then((res: any) => {   
      if (res.data.code === 200) {
      const arr=  res.data.data.data.map((item:any) => {
            return item.name
      })
        this.setState({
          loading: false,
          optionSchool: [...arr],
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
  //重置用户密码
  public resetPassword = (record :any) => {
    let newpPassword = qs.stringify({
      list:record.list,
      password:'a123456789'
    });
    axios.post("http://www.test.com/adminuser/updateNewpassword.php",newpPassword).then((res: any) => {
      if (res.data.code === 200) { 
        message.success('重置密码成功')
        this.refer()
      }
       }).catch((err) =>{
        console.log(err); 
    })
  }
//批量删除用户数据
public anyDelete = () => { 
  if (this.state.selectedRowKeys.length > 0) {
    let deleteData = qs.stringify({
      list:[...this.state.selectedRowKeys]
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
  });
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
              userschool: '',
              rootname: '',
              userClass:''
            },
            disabled2:true
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
            userSchool: '',
            rootname: '',
            userClass:''
          },
          disabled2:true
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
        this.getorganization()
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
            userSchool: '',
            rootname: '',
            userClass:''
      },
      disabled:true
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
      title: '新增账号',
      userData: {
        id:'',
        password: 'a123456789',
        jurisdiction: '',
        userSchool:'',
        rootname: '',
        userClass:''
      },
    })
  })
   //打开修改弹窗
  public openModal = (record:any) => {
    this.setState({
      userData: {
        id: record.id,
        password: record.password,
        jurisdiction: record.jurisdiction,
        userSchool: record.userSchool,
        rootname: record.rootname,
        userClass:record.userClass
      },
      disabled2:false,
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
  public referSelectchange = (value: any) => {
    if (value === undefined) {
      value=''
    }
      this.setState({
        referData: {...this.state.referData,jurisdiction:value}
      })

  }
  //查询所属团支部
  public userChange = (value: any) => {
    if (value ===undefined) {
      this.setState({
        referData: { ...this.state.referData, userSchool: '',userClass:''},
        disabled:true
         })
    } else {
      this.setState({
        referData: {
          ...this.state.referData, userSchool: value,
          userClass: '大一'
        },
        disabled:false
         })
    }
  }
   //查询所在年级
  public userClassChange = (value: any) => {
    if (value === undefined) {
      value=''
    }
    this.setState({
      referData: {...this.state.referData, userClass:value}  
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
  // public passwordChange = (e: any) => { 
  //   let value = e.target.value
  //     this.setState({
  //       userData: {...this.state.userData,password:value}
  //     })
  // }
  //新增修改账号触发事件
  public rootnameChange= (e: any) => { 
    let value = e.target.value
      this.setState({
        userData: {...this.state.userData,rootname:value}
      })
  }
  public ReferrootnameChange= (e: any) => { 
    let value = e.target.value
      this.setState({
        referData: {...this.state.referData,rootname:value} 
      })
  }
  
  //新增修改账号权限下拉框改变
  public selectchange = (value: any) => {
    this.setState({
      userData: {...this.state.userData,jurisdiction:value}
    }, () => {
        console.log(this.state.userData);     
    })
  }
  //新增修改账号所属组织下拉框改变
  public userselectChange = (value: any) => {
    if (value ===undefined) {
      this.setState({
        userData: { ...this.state.userData, userSchool: '',userClass:''},
        disabled2:true
         })
    } else {
      this.setState({
        userData: { ...this.state.userData, userSchool: value,  userClass: '大一'},
        disabled2:false
         })
    }
  }
  public ClassChange = (value: any) => {
    this.setState({
      userData: { ...this.state.userData, userClass: value }
    })
  }

  //弹窗确定
  public handleOk = () => {
    const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
    if (this.state.userData.id&&this.state.userData.id.length > 8) {
      if (this.state.userData.password&&this.state.userData.password.length > 8 &&reg.test(this.state.userData.password)) {
        if (this.state.userData.rootname&&this.state.userData.rootname.length > 0) {
          if (this.state.userData.jurisdiction && this.state.userData.jurisdiction.length > 0) {
            if (this.state.userData.userSchool && this.state.userData.userSchool.length > 0) {
              if (this.state.userData.userClass && this.state.userData.userClass.length > 0) {
                // eslint-disable-next-line no-lone-blocks
                { this.state.title === '新增账号' ? this.addData() : this.updateData() }
              } else {
                message.warning('请选择账号所在年级');
              }
          }else {
            message.warning('请选择账号的所属团支部');
          }
        } else {
          message.warning('请选择账号的对应权限');
          }
        } else {
          message.warning('请输入用户的姓名')
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
        userSchool: '',
        rootname: '',
        userClass:''
      },
      disabled2:true
    })
  }
  //多选数据
  public onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    // eslint-disable-next-line array-callback-return
          this.setState({
            selectedRowKeys,
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
      { label: '基层团干部', value: '基层团干部' },
      {label:'普通团员',value:'普通团员'}
    ]
        const columns:any = [
            {
              title: '序号',
              dataIndex: 'number',
              align: 'center ' as 'center',
              width:'8%',
              render: (text: any,record:any,index:any) => `${(this.state.pagenumber-1)*this.state.referData.limit+index+1}`,
            },
            {
              title: '账号',
              dataIndex: 'id',
              align: 'center ' as 'center',
              width:'15%',
          },
          {
            title: '姓名',
            dataIndex: 'rootname',
            align: 'center ' as 'center',
            width:'10%',
          },
            {
              title: '密码',
              dataIndex: 'password',
              align: 'center ' as 'center',
              width:'15%',
              render: (text: any,record:any,index:any) => (
                <Input.Password
                  bordered={ false}
                  value={text}
                  readOnly
                  visibilityToggle={ false}
              iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
             />)
            },         
            {
              title: '权限',
              width:'12%',
              dataIndex: 'jurisdiction',
              align:'center 'as 'center',
              render: (text: any) => (
                <span style={{
                   color:'blue'
                }}>{ text}</span>
              ),
          },
          {
            title: '所属团支部',
            dataIndex: 'userSchool',
            align: 'center ' as 'center',
            width: '12%',
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
                  )
          },
          {
            title: '所在年级',
            dataIndex: 'userClass',
            align: 'center ' as 'center',
            width:'8%',
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
                  <Popconfirm title="确定重置此用户密码"
                     okText="Yes"
                     cancelText="No"
                    onCancel={() => {
                      console.log("用户取消重置")
                    }}
                    onConfirm={() => {      
                      this.resetPassword(record)
                    }}>
                    <a> <SettingTwoTone />重置密码</a>
                  </Popconfirm>
                </Space>
              ),
            },
        ]; 
    return (
      <div className="user">
        <Row gutter={ 96} style={{ marginBottom: '15px' }}>
        <Col span={7} style={{
                  marginLeft: '79px',
                  marginBottom:"20px"
          }}><label>账号：</label><Input value={this.state.referData.id} onChange={this.referIdChange} style={{width:'80%'}}></Input></Col>
          <Col span={7} ><label>权限：</label><Select value={this.state.referData.jurisdiction}
          allowClear   
          style={{
          width: "80%"
          }}
          onChange={this.referSelectchange}>
        { options.map((item:any,index:any) =>(
          <Option value={item.value} key={index }>{item.label}</Option>
         ))}
          </Select></Col>
          <Col span={7} style={{
            marginBottom:"20px"
          }}><label>姓名：</label><Input value={this.state.referData.name} onChange={this.ReferrootnameChange} style={{width:'80%'}}></Input></Col>
          <Col span={9} style={{
            marginLeft:'36px'
          }}><label >所属团支部：</label><Select value={this.state.referData.userSchool}
          allowClear   
          style={{
          width: "58%"
          }}
          onChange={this.userChange}>
        { this.state.optionSchool.map((item:any,index:any) =>(
       <Option value={ item} key={index }>{item}</Option>
         ))}
            </Select></Col>
            <Col span={8} style={{
            marginLeft:'-94px'
          }}><label >所在年级：</label><Select value={this.state.referData.userClass}
            allowClear
            style={{
              width: "67%"
            }}
            disabled={ this.state.disabled}
            onChange={this.userClassChange}>
        { this.state.schoolClass.map((item:any,index:any) =>(
       <Option value={ item} key={index }>{item}</Option>
         ))}
          </Select></Col>
          <div style={{marginLeft:'63px'}}>
              <Button type="primary" icon={<SearchOutlined />} style={{marginRight:'67px'}}onClick={ this.refer}>查询</Button>
              <Button type="dashed" icon={<ReloadOutlined />}   onClick={ this.reset}>重置</Button></div>
            </Row>
        <Button type="primary" icon={ <UserAddOutlined />} style={{ float: 'right', marginBottom: '10px' }} onClick={this.add}>新增账号</Button>
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
                visibilityToggle={false}
                disabled
                className="inputPassword"
                value={
                    this.state.userData.password}
                    // onChange={this.passwordChange}
                    maxLength={20}
                  {...addStyle} ></Input.Password></Col>
          </Row>
          <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">姓名：</label>
              <Input
                value={
                    this.state.userData.rootname}
                    onChange={this.rootnameChange}
                    maxLength={20}
                  {...addStyle} ></Input></Col>
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
              { this.state.optionSchool.map((item:any,index:any) =>(
             <Option value={item} key={index}>{item}</Option>
               ))}
            </Select></Col>
            <Col span={18} offset={3} ><label className="FormLabelStyle">所在年级：</label><Select value={this.state.userData.userClass}
                allowClear
              {...addStyle}
              disabled={this.state.disabled2}
                onChange={this.ClassChange}>
              { this.state.schoolClass.map((item:any,index:any) =>(
             <Option value={item} key={index}>{item}</Option>
               ))}
            </Select></Col>
       </Row>         
      </Modal>
            </div>
        )
    }
}




