import React, { Component} from 'react'
import { Layout, Menu, Dropdown,Avatar, message} from 'antd';
import { withRouter} from 'react-router-dom'
import { adminRoutes } from '../../../router'
import { createFromIconfontCN } from '@ant-design/icons';
// import { Link } from 'react-router-dom';
// import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
const routes=adminRoutes.filter(route=>route.isShow)
const IconFont = createFromIconfontCN({
  scriptUrl: [
"//at.alicdn.com/t/font_1999223_iwovvyhxqdk.js"
  ], 
});

interface IProps {
  history: any,
  location:any
}

interface IState {
  collapsed: boolean,
  root:any
}

 class AppHome extends Component<IProps,IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
          collapsed: false,
          root:''
      }
   }
   componentDidMount() {
     if (this.props.location.root) { 
          this.setState({
       root:this.props.location.root.jurisdiction
     })
    }
   }
 public  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
   };
   render() {
     const popMenus = (<Menu onClick={(item:any) => { 
       if (item.key === "out") { 
         this.props.history.push("/login")
       } else {
         message.warning('item.key')
       }
     }}>
       <Menu.Item key="xinxi">个人中心</Menu.Item>
       {/* <Menu.Item key="setting">设置</Menu.Item> */}
       <Menu.Item key="out">退出</Menu.Item>
     </Menu>)
    return (
      <Layout style={{ minHeight: '100vh' }}>
                <div style={{      
          height: '60px',
          overflow: "hidden",
}}>
    <Header className="header" style={{textAlign:'center',backgroundColor:'#320f38',position:'fixed',zIndex:99, height: "60px",width:"100%",
              // display: 'flex',
              // justifyContent:"space-between",
            }}>
          <div className="logo" />
          <img src="https://zhtj.youth.cn/zhtj/static/img/web_logo.png" alt="" style={{ height:'60px',width:'60px'}}/>
          <span style={{ color:"rgb(102 150 174)" , verticalAlign: "middle",  font:'italic bold 24px Georgia,serif'}}>智慧团建网站</span>
            <Dropdown overlay={popMenus}>
              <div style={{
                                  position: "absolute",
                                  right: "20px",
                                  top: "-3px",
              }}>
                <Avatar style={{
                  backgroundColor:'#3c234b'
                }}>root</Avatar>
                <span style={{
                  color: "#b2b264",
                }}>
                 您好，尊敬的{this.state.root}
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
          <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} style={{
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
                      {route.routes.map((item: any) => (<Menu.Item key={item.path}  onClick={() => { this.props.history.push(item.path)
                       }}>
                        {item.icon?<IconFont type={ item.icon} />:''} {item.title}
                       </Menu.Item>))}
                    </SubMenu> : (<Menu.Item key={route.path} title={route.title}  icon={ route.icon ? <IconFont type={ route.icon}/>:''} onClick={() => { this.props.history.push(route.path) }}>
                      {route.title}
                      </Menu.Item>)
                  ))
                }
        </Menu>
            </Sider>
          </div>
          {this.state.collapsed ?<Layout style={{ padding: '0 24px 24px', marginLeft: "-118px" ,   transition: "background-color 0.3s ease 0s, min-width 0.3s ease 0s, max-width 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) 0s"}}>
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
          
  </Layout>
    );
  }
}
export default withRouter(AppHome as any)