
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
"//at.alicdn.com/t/font_1999223_k1aezr3mvn.js"
  ],
});

 class Login extends Component <IProps,IState>{
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
    this.clicked()
  }
  
  // 生成验证码
  public randomRgbColor=()=>{ //随机生成RGB颜色
    let r = Math.floor(Math.random() * 256); //随机生成256以内r值
    let g = Math.floor(Math.random() * 256); //随机生成256以内g值
    let b = Math.floor(Math.random() * 256); //随机生成256以内b值
    return "rgb(" + r + "," + g + "," + b + ")"; //返回rgb(r,g,b)格式颜色
}
  public clicked = () => {
    const canvas:any= document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.lineWidth = 0;//设置边框大写
    canvas.width = 85;
    canvas.height=31
    context.clearRect(0, 0, 85, 31); 
    context.strokeRect(0, 0, 85, 31);
    const aCode = "A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,1,2,3,4,5,6,7,8,9";
    const aLength = aCode.split(",").length;
    let text = '';
    for (var i = 0; i <= 3; i++) {
        var x = 5 + i * 20;
        var y = 15 + Math.random() * 4;
        var j = Math.floor(Math.random() * aLength);
        var deg = Math.random() * 90 * Math.PI / 180;//随机弧度
      var txt = aCode.split(",")[j];
      text = text + txt + '' 
        context.fillStyle = this.randomRgbColor();
        context.font = "bold 20px 微软雅黑";
        //修改坐标原点和旋转角度
        context.translate(x, y);
        context.rotate(deg);
        context.fillText(txt, 0, 0);
        //恢复坐标原点和旋转角度
        context.rotate(-deg);
        context.translate(-x, -y);
    }
    this.setState({
      code:text
    })
    //干扰线
    for (let i = 0; i < 8; i++) {
        context.strokeStyle = this.randomRgbColor();
        context.beginPath();
        context.moveTo(Math.random() * 120, Math.random() * 40);
        context.lineTo(Math.random() * 120, Math.random() * 40);
        context.stroke();
    }
    /**绘制干扰点**/
    for (let i = 0; i < 20; i++) {
        context.fillStyle = this.randomRgbColor();
        context.beginPath();
        context.arc(Math.random() * 120, Math.random() * 40, 1, 0, 2 * Math.PI);
        context.fill();
    }
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
        let loginData = qs.stringify({
               ...values
        });
      if (values['code'].toLowerCase() !== this.state.code.toLowerCase()) {
        message.error('验证码输入错误');
        this.clicked()
      } else {
        axios.post("http://www.test.com/adminuser/login.php", loginData).then((res: any) => {    
          if (res.data.code === 200) {
                   if (res.data.data.data.reason) {
                    message.warning('你的账号未通过注册,原因是'+ res.data.data.data.reason)
                  } else{
                  let inFifteenMinutes = new Date(new Date().getTime() + 100 * 24 * 3600 * 1000);//一天
                  cookie.save('root', {
                    'rootname': res.data.data.data.rootname,'id': res.data.data.data.id,
                    'jurisdiction': res.data.data.data.jurisdiction,
                    'list': res.data.data.data.list,
                    'password': res.data.data.data.password, 
                    'userClass': res.data.data.data.userClass,
                    'userSchool':res.data.data.data.userSchool,
                  }, { expires: inFifteenMinutes })
                  if (res.data.data.data.jurisdiction === '管理员') {
                    this.props.history.push({  pathname: "/admin", })
                  } else if (res.data.data.data.jurisdiction === '校团委') {
                    message.error('您没有登录的权限')
                  } else if (res.data.data.data.jurisdiction === '基层干部') {
                    message.error('您没有登录的权限')
                  } else {
                    message.error('您没有登录的权限')
                  }
            }
          } else {
            message.error('账号或密码输入错误')
            this.clicked()
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
           rules={[{  required: true,pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/, message: '密码为8~20位，且需包含数字和字母' }]}>
          <Input.Password prefix={<IconFont type="iconicon-test" />} placeholder="请输入您的密码"/>
      </Form.Item>
          

      <Form.Item {...tailLayout} style={{
              marginBottom:'-2px'
            }}
            label={<span {...labelStyle}>验证码</span>}>
          </Form.Item>
          <Form.Item {...tailLayout} >
          <Row >
          <Col  span={12}>
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
              <Col span={10}>
                <canvas id="canvas"  onClick={ this.clicked}></canvas>
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





