import React, { Component } from 'react';
// import {Link} from 'react-router-dom'
import { Form, Input, Button, Row, Col, message } from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import { withRouter, } from 'react-router-dom'
import cookie from 'react-cookies'
import axios from 'axios'
import qs from 'qs';
import './login.css'
interface IProps {
         history:any
}

interface IState {
        fromtype: string,
        code:string,
}

//使用阿里云图标
const IconFont = createFromIconfontCN({
  scriptUrl: [
"  //at.alicdn.com/t/font_1999223_yl4n0qasc3.js"
  ],
});

export class Login extends Component <IProps,IState>{
  // private myRef:any
  constructor(props: IProps) {
    super(props)
    this.state = {
      fromtype: "login",
      code: '',
    }
    // this.myRef= React.createRef();
}
  componentDidMount() { 
    this.generatedCode()
  }
  
  // 生成验证码
  public generatedCode = () => {
    let code = ''
    const array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < 4; i++) {
      let index = Math.floor(Math.random() * 36);//随机0-35
      code += array[index]
    }
    this.setState({
      code
    })
  }
 
  render() {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18,offset:3 },
    };
    const tailLayout = {
      labelCol:{ offset:3},
      wrapperCol: { offset:3 ,span: 24 },
    };

    const onFinish = (values: any) => {
      console.log('Success:', values);
        let loginData = qs.stringify({
               ...values
        });  
      if (values['code'] !== this.state.code) {
        message.error('验证码输入错误');
        this.generatedCode()
      } else {
        axios.post("http://www.test.com/adminuser/login.php", loginData).then((res: any) => {
          if (res.data.code === 200) {
            let inFifteenMinutes = new Date(new Date().getTime() + 100 * 24 * 3600 * 1000);//一天
            cookie.save('root',res.data.data.data,{ expires: inFifteenMinutes }) 
            if (res.data.data.data.jurisdiction === '管理员') {
              this.props.history.push({  pathname: "/admin", query:{
                root: { ...res.data.data.data}
            }       })
            } else if (res.data.data.data.jurisdiction === '校团委') {
              console.log('校团委');
            } else if (res.data.data.data.jurisdiction === '基层干部') {
              console.log('基层干部');
            } else {
              console.log('团员');
            }
          } else {
            message.error('账号或密码输入错误')
            this.generatedCode()
          }
        }).catch((err) =>{
          console.log(err); 
      })
      }
    };
    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };
    
    const labelStyle = {
      style: {
        fontSize:'15px',fontFamily:'Cursive ',color:'#666'
      }
    }
    
    return (
   
      <div>  
        <h3>登录</h3>
        <Form
          {...layout}
          name="basic"
          // initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          // ref={this.myRef}
    >
          <Form.Item
            label={<span {...labelStyle}>账号</span>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item style={{
            marginBottom:'-3px'
          }}
            name="username"  
            rules={[{  required: true,pattern: /^[1-9][0-9]{8,20}$/, message: '账号为非0开头且8~20位的纯数字' }]}>
          <Input prefix={<IconFont type="iconxin" />} placeholder="请输入您的账号"/>
      </Form.Item>

      <Form.Item
       label={<span {...labelStyle}>密码</span>}
        style={{
              marginBottom:'-2px'
            }}
      >
      </Form.Item>
      <Form.Item  style={{
              marginBottom:'-3px'
            }}
          name="password"
           rules={[{  required: true,pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码为8~20位，且需要同时含有数字和字母' }]}>
          <Input.Password prefix={<IconFont type="iconicon-test" />} placeholder="请输入您的密码"/>
      </Form.Item>
          

      <Form.Item {...tailLayout} style={{
              marginBottom:'-2px'
            }}
            label={<span {...labelStyle}>验证码</span>}>
          </Form.Item>
          <Form.Item {...tailLayout} >
          <Row >
          <Col  span={14}>
            <Form.Item
                  name="code"
                  style={{
                    marginBottom: '-3px'
                  }}
                  rules={[{ required: true,message:'请输入正确的验证码'}]}
            >
              <Input  prefix={<IconFont type="iconxin2" />} placeholder="请输入右侧的验证码"/>
            </Form.Item>
          </Col>
          <Col span={8}>
                <span className="code" onClick={this.generatedCode}>{ this.state.code}</span>
          </Col>
        </Row>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
             登录
        </Button>
      </Form.Item>
    </Form>
      </div>
    );
  }
}

export default withRouter(Login as any)





