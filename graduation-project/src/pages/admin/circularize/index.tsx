/* eslint-disable no-restricted-globals */
/* eslint-disable jsx-a11y/anchor-has-content */

import { Component } from 'react'
import { Card, List,Button,Input, Select, message } from 'antd'
import Modal from 'antd/lib/modal/Modal';
import { BulbOutlined } from '@ant-design/icons';
import qs from 'qs'
import axios from 'axios'
import cookie from 'react-cookies'
const { Option } = Select;
const { TextArea } = Input;

interface IProps {

}

interface IState {
  isModalVisible: boolean,  
  audit: any,
  reason: any,
  data: any[],
  userData: any,
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
          isModalVisible: false,
          audit: '',
          reason: '',
          data: [],
          userData: {}
        }
  }
  componentDidMount() {
      this.refer()
  }
  public refer = () => {
    axios.post("http://www.test.com/register/select.php").then((res) => {
      if (res.data.code === 200) {
        this.setState({
          data:res.data.data.data
        })
      }
    })
  }
  public refer2= () => {
    axios.post("http://www.test.com/register/select.php").then((res) => {
      if (res.data.code === 200) {
        this.setState({
          data:res.data.data.data
        }, () => {
          let inFifteenMinutes = new Date(new Date().getTime() + 100 * 24 * 3600 * 1000);//一天
          cookie.save('count', res.data.data.data.length, { path: '/', expires: inFifteenMinutes })
          parent.window.location.reload()
        })
      }
    })
  }
  public audit = (item:any) => {
    this.setState({
      userData:item,
      isModalVisible:true
    })
  }
  public handleOk = () => {
    if (this.state.audit) {
      if (this.state.audit==='审核通过') {
          let addData = qs.stringify({
            ...this.state.userData,
          });
          let deleteData = qs.stringify({
            list:this.state.userData.list
          });
          axios.post("http://www.test.com/register/delete.php", deleteData).then((res: any) => {
            if (res.data.code === 200) {
              this.refer2()
              axios.post("http://www.test.com/register/add.php", addData).then((res: any) => {
                if (res.data.code === 200) {
                  message.success('审核操作成功')
                  this.setState({
                    isModalVisible: false,
                    reason: '',
                    audit: '',
                    userData: '',
                  })
                }
              })
            }
          })
      } else {
        if (this.state.reason) {
            let addData = qs.stringify({
              ...this.state.userData,
              reason: this.state.reason
            });
            let deleteData = qs.stringify({
              list:this.state.userData.list
            });
            axios.post("http://www.test.com/register/delete.php",deleteData).then((res: any) => {
              if (res.data.code === 200) {
              this.refer2()
              axios.post("http://www.test.com/register/addNotUsers.php", addData).then((res: any) => {
                if (res.data.code === 200) {
                  message.success('审核操作成功')
                  this.setState({
                    isModalVisible: false,
                    reason: '',
                    audit: '',
                    userData: '',
                  })
                }
              })
            }
          })
        } else {
          message.warning('请输入不通过审核的理由')
        }
      }
    } else {
      message.warning('请选择是否通过审核')
    }
  }
  public handleCancel = () => {
    this.setState({
      reason: '',
      audit: '',
      userData: '',
      isModalVisible: false,
    })
  }
  public auditChange = (value:any) => {
    this.setState({
      audit:value
    })
  }
  public reasonChange = (e:any) => {
    this.setState({
      reason:e.target.value
    })
  }
  render() {
    const options = [
      { label: '审核通过', value: '审核通过' },
      {label:'审核不通过',value:'审核不通过'}
    ]
        return (
          <div>
            <Card title="账号注册审核" >
 <List
      header={<div>审核账号</div>}
      bordered
      dataSource={this.state.data}
      renderItem={(item ,index)=> (
          <List.Item>
          <p style={{
            position:'absolute'
          }}>{index+1}</p>
          <div style={{
          paddingLeft:'100px'
          }}>   <Input disabled bordered style={{ width: ((item.rootname.length ) * 16+20) + 'px' }}
          value={item.rootname}></Input>申请注册
             <span style={{ color: "#d91414" }}>
              账号为:<Input disabled bordered style={{ width: ((item.id.length ) * 9+20) + 'px' }}
                value={item.id}></Input></span>
                <span style={{ color: "#d91414" }}>
              密码为:<Input disabled bordered style={{ width: ((item.password.length ) * 9+20) + 'px' }}
                value={item.password}></Input></span>
                <span style={{ color: "#d91414" }}>
                权限为:<Input disabled bordered style={{ width: ((item.jurisdiction.length ) * 16+20) + 'px' }}
                value={item.jurisdiction}></Input></span>
                <span style={{ color: "#d91414" }}>
              所属团支部为:<Input disabled bordered style={{ width: ((item.userSchool.length ) * 16+20) + 'px' }}
                value={item.userSchool}></Input></span><span style={{ color: "#d91414" }}>
                所在年级为:<Input disabled bordered style={{ width: ((item.userClass.length ) * 16+20) + 'px' }}
                  value={item.userClass}></Input></span></div>
          <Button size="small" onClick={() => { this.audit(item)}}>审核</Button>

        </List.Item>
      )}
    /> 
          </Card>
            <Modal title='审核注册账号' visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}  okText="提交" cancelText="取消">
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
               <BulbOutlined /> 此注册账号是否满足注册条件，如果不满足请输入理由
              </div>
                <span style={{marginLeft:'38px'}}>该账号审核是否通过：</span><Select
                style={{
                  width: '30%',
                  marginLeft:'35px'
                }}
                 value={this.state.audit}
                 onChange={this.auditChange}>
                 { options.map((item:any,index:any) =>(
                   <Option value={item.value} key={index }>{item.label}</Option>
                  ))}
              </Select>
              {this.state.audit === "审核不通过" ?  <TextArea style={{ width: 380, marginLeft: 40,marginTop:20 }} placeholder="请输入审核不通过的理由" onChange={this.reasonChange} value={this.state.reason} autoSize={{ minRows: 3, maxRows: 3 }}/> : null}
            </Modal>
           </div>
        );
    }

}
  