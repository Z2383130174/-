/* eslint-disable jsx-a11y/anchor-has-content */
import React, { Component} from 'react'
import { Layout, Menu, Dropdown, Avatar, Modal, Row, Col, Input, Select, message, Upload,Badge  } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { withRouter} from 'react-router-dom'
import { adminRoutes } from '../../../router'
import { createFromIconfontCN } from '@ant-design/icons';
import cookie from 'react-cookies'
import qs from 'qs';
import axios from 'axios';
import './index.css'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const routes=adminRoutes.filter(route=>route.isShow)
const IconFont = createFromIconfontCN({
  scriptUrl: [
"//at.alicdn.com/t/font_1999223_7h8ikv213m.js"
  ], 
});

interface IProps {
  history: any,
  location: any,
}

interface IState {
  collapsed: boolean,
  root:any,
  isModalVisible: boolean,
  isOpen: boolean,
  oldPassword: any,
  newPassword: any,
  againPassword: any,
  loading: boolean,
  pictureData: any,
}

 class AppHome extends Component<IProps,IState> {
    constructor(props: IProps) {
        super(props)
      this.state = {
          collapsed: false,
          root: '',
          isModalVisible: false,
          isOpen: false,
          oldPassword: '',
          newPassword: '',
          againPassword: '',
          loading: false,
          pictureData: {
            list:''
        },
      }
   }
   componentDidMount() {
     this.setState({
       root: cookie.load('root')
     }, () => {
       this.refer()
       this.init()
     })
   }
   public refer = () => {
    axios.post("http://www.test.com/register/select.php").then((res) => {
      if (res.data.code === 200) {
        let inFifteenMinutes = new Date(new Date().getTime() + 100 * 24 * 3600 * 1000);//一天
        cookie.save('count',res.data.data.data.length, { path: '/',expires: inFifteenMinutes })
      }
    })
  }
   public init = () => {
     let loginData = qs.stringify({
       username: this.state.root.id,
       password:this.state.root.password
     }); 
      axios.post("http://www.test.com/adminuser/selectLogin.php", loginData).then((res: any) => {
        this.setState({
          root: {
            ...this.state.root,
            picture:res.data.data.data.picture
          },
          pictureData: {
           list:res.data.data.data.list
         }
        })
      })
   }
   public onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };
   //查看个人信息弹窗
  public handleOk = () => {
  this.setState({
    isModalVisible:!this.state.isModalVisible
      })
  }
   //修改密码弹窗确认
   public handleOk2 = () => {
        const reg = /^(?![^a-zA-Z]+$)(?!\D+$)/;
     if (this.state.oldPassword === this.state.root.password) {
       if (this.state.newPassword && this.state.newPassword.length > 8 && reg.test(this.state.newPassword)) {
         if (this.state.oldPassword !== this.state.newPassword) {
          if (this.state.newPassword === this.state.againPassword) {
              console.log(this.state.root);
              let personageData = qs.stringify({
                ...this.state.root,
                  newPassword:this.state.newPassword
              });  
              axios.post("http://www.test.com/adminuser/updataPersonage.php", personageData).then((res: any) => {
                if (res.data.code === 200) {
                  this.setState({
                    isOpen: !this.state.isOpen,
                    oldPassword:'',
                    newPassword:'',
                    againPassword:'',
                  })
                  message.success('修改密码成功')
                 }
                }).catch((err) =>{
                  console.log(err); 
                })
           } else {
          message.error('你输入的两次新密码不一致，请确认后重新输入')
          } 
         } else {
          message.error('你输入的旧密码和新密码一致，请确认后重新输入')
          }
         } else {
          message.warning('新密码格式错误，请输入8~20位的密码，且需要同时包含数字和字母');
         }
       } else {
        message.error('你输入的旧密码错误，请确认后重新输入')
      }
   }
   //修改密码弹窗打开关闭
   public handleCancel = () => {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }
   //输入老密码
   public oldPassword = (e:any) => {
     this.setState({
           oldPassword:e.target.value
         })
   }
   //输入新密码
   public againPassword =(e:any) => {
    this.setState({
      againPassword:e.target.value
    })
   }
    //确认输入的新密码
   public newPassword =(e:any) => {
    this.setState({
      newPassword:e.target.value
    })
   }
   //上传个人头像
   public  handleChange = ({ file }: any) => {
     if (file.status === 'uploading') {
      this.setState({
        loading:true
      })
     }
     if (file.status === "done") {
      this.setState({
        loading:false
      })
        message.success('头像上传成功');
       console.log(file);
       this.init()
   
        // this.props.onOk({ code, msg, data });
     } else if (file.status === "error") {
      this.setState({
        loading:false
      })
        message.error('头像上传失败');
      }
   }
   
  
   render() {
     const { collapsed, root, isModalVisible,isOpen, oldPassword, newPassword, againPassword,loading,pictureData } = this.state
     const uploadButton = (
      <div>
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传个人头像</div>
      </div>
    );
     const popMenus = (<Menu onClick={(item:any) => {
       if (item.key === "out") {
         cookie.remove('root')
         this.props.history.push("/login")
       } else if (item.key === "circularize") {
         this.props.history.push('/admin/circularize')
       } else if (item.key === "personage") {
         this.handleOk()
       } else if (item.key === "revamp") {
         this.handleCancel()
       }
     }}>
       <Menu.Item key="personage" style={{
       fontSize: "15px",
     }}><IconFont type="iconUser" style={{
      fontSize: "15px",
         }} />个人中心</Menu.Item>
         <Menu.Item key="circularize" style={{
       fontSize: "15px",
     }}><IconFont type="icon-" style={{
      fontSize: "15px",
         }} />账号注册审核
     <Badge count={cookie.load('count')} overflowCount={10} size="small" offset={ [12,-5]}>
      <a href="#" className="head-example" />
    </Badge></Menu.Item>
       <Menu.Item key="revamp" style={{
       fontSize: "15px",
     }}><IconFont type="iconedit" style={{
      fontSize: "15px",
    }}/>修改密码</Menu.Item>
       <Menu.Item key="out" style={{
       fontSize: "15px",
     }}><IconFont type="iconsignout" style={{
      fontSize: "15px",
    }}/>退出</Menu.Item>
     </Menu>)
    return (
      <Layout style={{ minHeight: '100vh' }}>
                <div style={{      
          height: '60px',
          overflow: "hidden",
}}>
    <Header className="header" style={{textAlign:'center',backgroundColor:'##002140',position:'fixed',zIndex:99, height: "60px",width:"100%",
            }}>
          <div/>
          <img src="https://zhtj.youth.cn/zhtj/static/img/web_logo.png" alt="" style={{ height:'60px',width:'60px'}}/>
          <span style={{ color:"rgb(102 150 174)" , verticalAlign: "middle",  font:'italic bold 24px Georgia,serif'}}>智慧团建网站</span>
            <Dropdown overlay={popMenus} arrow>
              <div style={{
                                  position: "absolute",
                                  right: "20px",
                                  top: "-3px",
              }}>
                <Avatar shape="square" size={26} src={root.picture?root.picture:"./1.jpg"} />
                <span style={{
                  color: "#b2b264",
                }}>
                  您好，尊敬的{root.jurisdiction}
                  <Badge count={cookie.load('count')} overflowCount={10} size="small" style={{
                    position: "absolute",
                    right: "158px",
                    top: "-17px",
                  }}>
      <a href="#" className="head-example" />
    </Badge>
                </span>
              </div>
      </Dropdown>
          </Header>
        </div>
        <Layout>
          <div style={{
          width: "208px",
          overflow: "hidden",
          flex: "0 0 208px",
          maxWidth: "208px",
          minWidth: "208px",
          transition: "background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s"
}}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse} style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
          }}>
        <Menu
          mode="inline"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          style={{ height: '90%', borderRight: 0 ,  overflowX: "hidden",}}
              >
                 {
                  routes.map((route: any) => (
                    route.routes ? <SubMenu key={route.path} icon={ route.icon ? <IconFont type={ route.icon}/>:''} title={route.title}>
                      {route.routes.map((item: any) => (<Menu.Item key={item.path} onClick={() => {
                        this.props.history.push({ pathname: item.path, root: {...this.state.root}})
                       }}>
                        {item.icon?<IconFont type={ item.icon} />:''} {item.title}
                       </Menu.Item>))}
                    </SubMenu> : (<Menu.Item key={route.path} title={route.title}  icon={ route.icon ? <IconFont type={ route.icon}/>:''} onClick={() => { this.props.history.push({ pathname: route.path, root: {...this.state.root}}) }}>
                      {route.title}
                      </Menu.Item>)
                  ))
                }
        </Menu>
            </Sider>
          </div>
          {collapsed ?<Layout style={{ padding: '0 24px 24px', marginLeft: "-118px" ,   transition: "background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s"}}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
              { this.props.children}
        </Content>
      </Layout>:<Layout style={{ padding: '0 24px 24px'}}>
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
              { this.props.children}
        </Content>
      </Layout>} 
        </Layout>
        <Modal title="个人信息" visible={isModalVisible} onOk={this.handleOk} onCancel={this.handleOk}>
          <div className="admin">
          <Row>
              <Col span={18} offset={3}><label className="FormLabelStyle">上传你喜爱的照片作为您的头像：</label>
                
              <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader" 
        showUploadList={false}
        data={pictureData}
        action="http://www.test.com/adminuser/setPicture.php"
        onChange={this.handleChange}
      >
        {this.state.root.picture ? <img src={this.state.root.picture} alt="avatar" style={{ width: 200,height:200 }} /> : uploadButton}
                </Upload>
              </Col >
              </Row>
          <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">账号：</label>
              <Input
             defaultValue={root.id}
             style={{
              width: "80%",
              marginLeft:'34px',
            }}   disabled
                ></Input></Col>
              </Row>
              <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">密码：</label>
              <Input.Password
                defaultValue={root.password}
                style={{
                width: "80%",
                marginLeft:'34px',
              }}   disabled></Input.Password></Col>
          </Row>
          <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">姓名：</label>
              <Input
             defaultValue={root.rootname}
              style={{
                width: "80%",
                marginLeft:'34px',
              }}   disabled
                 ></Input></Col>
              </Row>
              <Row>
            <Col span={18} offset={3}><label className="FormLabelStyle">权限：</label><Select
              defaultValue={root.jurisdiction}
              style={{
                width: "80%",
                  marginLeft:'34px',
              }} disabled>
            </Select></Col>
            <Col span={18} offset={3} ><label className="FormLabelStyle">所属团支部：</label><Select
               defaultValue={root.userSchool}
                   style={{
                    width: "80%",
                    marginLeft:'34px',
                  }}   disabled
            >
                </Select></Col>
       </Row>  
       </div>
        </Modal>
        <Modal title="修改密码" visible={isOpen} onOk={this.handleOk2} onCancel={this.handleCancel}>
        <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">账号：</label>
              <Input
             defaultValue={root.id}
             style={{
              width: "80%",
              marginLeft:'34px',
            }}   disabled
                ></Input></Col>
              </Row>
              <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">旧密码：</label>
              <Input.Password value={oldPassword}
                style={{
                  width: "80%",
                  marginLeft: '34px',
                }}
                onChange={ this.oldPassword}
                 ></Input.Password></Col>
          </Row>
          <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">新密码：</label>
             <Input.Password value={newPassword}
                style={{
                  width: "80%",
                  marginLeft: '34px',
                }}
                onChange={ this.newPassword}
                 ></Input.Password></Col>
          </Row>
          <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">确认新密码：</label>
              <Input.Password value={againPassword}
              style={{
                width: "80%",
                marginLeft: '34px',
              }}
              onChange={ this.againPassword}
                 ></Input.Password></Col>
              </Row>
      </Modal>  
  </Layout>
    );
  }
}
export default withRouter(AppHome as any)