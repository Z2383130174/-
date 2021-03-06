import React, { Component } from 'react';
// import {Link} from 'react-router-dom'
import LoginFrom from "../Login/index"
import Register from "../Register/index"
import './index.css'
interface IProps {
}

interface IState {
         flag:boolean
}

export default class Login extends Component<IProps, IState> {
  constructor(props: IProps) {
  super(props)
  this.state = {
         flag: true
    }
  }
    render() {
    return (
      <div className='bgc'>
        {/* 这是登录
                   <Link to="/Home">跳123</Link> */}
        <div className='title'>
        <img src="https://zhtj.youth.cn/zhtj/static/img/web_logo.png" alt="" />
         <span>智慧团建</span>
        </div>
        <div  className='content'>
                { this.state.flag?<LoginFrom></LoginFrom>:<Register></Register>}
        </div>
      </div>
    );
  }
}






