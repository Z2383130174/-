import { Component } from 'react'
// import { Input, DatePicker, Button, ConfigProvider, message, Select } from 'antd'
import { Card, Form, Input, Button, DatePicker, ConfigProvider, message, } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { FormInstance } from 'antd/lib/form';
import 'moment/locale/zh-cn';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import BraftEditor from 'braft-editor';
import React from 'react';
import './logging.css'
//使用阿里云图标
const IconFont = createFromIconfontCN({
    scriptUrl: [
  " //at.alicdn.com/t/font_1999223_k1aezr3mvn.js"
    ],
  });

interface IProps {
  location: any,
  history:any
}

interface IState {
    Time: any,
    timedata: any,
    editorState: any,
    cardTitle:string
}

export default class Main extends Component<IProps, IState>{
  formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            Time: '',
            timedata: moment(null, "YYYY年MM月DD日"),
            cardTitle:'',
        }
    }
  componentDidMount() {
            if (this.props.location.data) { 
              this.setState({
                cardTitle:this.props.location.data.title
              })
              let didData = qs.stringify({
                list: this.props.location.data.list
                });
           axios.post("http://www.test.com/logging/selectList.php",didData).then((res: any) => {  
                    if (res.data.code === 200) {
                        const { loggingType, loggingTitle, Time, loggingUser,content } = res.data.data.data[0]
                      this.formRef.current!.setFieldsValue({loggingType});
                      this.formRef.current!.setFieldsValue({ loggingTitle });
                      this.formRef.current!.setFieldsValue({loggingUser});
                        this.setState({
                            Time,
                            editorState: BraftEditor.createEditorState(content),
                            timedata:moment(Time,"YYYY年MM月DD日")
                        })
                    }
                }).catch((err) =>{
                    console.log(err); 
                })
        }
    }
    // 内容变化
    public handleEditorChange = (editorState:any) => {
      this.setState({ editorState }, () => {
        console.log(this.state.editorState);
        
      })
    };
    //公示时间变化
    public dateChange = (date: any, dateString: any) => {
        console.log(date, dateString);
        console.log(typeof (dateString));
        console.log(dateString);
            this.setState({
                Time:dateString,
                timedata: moment(dateString,"YYYY年MM月DD日")
            })
    }
    //发布
    public onFinish =  (values: any) => {
        if (!this.state.editorState.isEmpty()) {
          if (this.state.Time) {
            if (this.props.location.data.title === '新增日志') {
              let noticeData = qs.stringify({
                ...values,
                content: this.state.editorState.toHTML(),
                Time: this.state.Time,
            })
              axios.post("http://www.test.com/logging/addLogging.php",noticeData).then((res: any) => {
                if (res.data.code === 200) {
                  message.success('新增日志成功')
                  this.props.history.push('/admin/logging')
                }
              }).catch((err) => {
                console.log(err);
              })
            } else {
              let editNoticeData = qs.stringify({
                ...values,
                list: this.props.location.data.list,
                content: this.state.editorState.toHTML(),
                Time: this.state.Time,
            })
              axios.post("http://www.test.com/logging/update.php",editNoticeData).then((res: any) => {
                if (res.data.code === 200) {
                  message.success('修改日志成功')
                  this.props.history.push('/admin/logging')
                }
              }).catch((err) => {
                console.log(err);
              })
             }
          } else {
            message.warning('请选择日志时间')
          }
        } else {
          message.warning('日志内容不能为空')
        }
    }
    public onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
    //清空
  public empty = () => {
    this.formRef.current!.setFieldsValue({ loggingTitle:'' });
    this.formRef.current!.setFieldsValue({ loggingType:'' }); 
    this.formRef.current!.setFieldsValue({ loggingUser: '' });
        this.setState({
          Time: '',
          timedata: moment(null, "YYYY年MM月DD日"),
          editorState: BraftEditor.createEditorState(null),
        })
    }
    
    render() {
        return (
            <div className="logging">
            <Card title={ this.state.cardTitle}>
              <Form 
          ref={this.formRef}
          name="title"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
    >
                        <div style={{
                            marginLeft:'50px'
                        }}>
                        <div style={{display:'inline-block',width:'45%'}}>
        <Form.Item
            label={<p>日志标题</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="loggingTitle"  
            rules={[{  required: true,message: '请输入日志的标题' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入日志的标题"/>
      </Form.Item>
      </div>
                  <div style={{ display: 'inline-block', width: '45%' }}>
                  <Form.Item
            label={<p>日志类型</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="loggingType"  
            rules={[{  required: true,message: '请输入日志的类型' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入日志的类型"/>
      </Form.Item>
             </div>
           </div>
        <div style={{
           marginLeft:'50px'
              }}>
      <div style={{ display: 'inline-block', width: '45%' }}>
        <Form.Item
            label={<p>发布人</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
      <Form.Item 
            name="loggingUser"  
            rules={[{  required: true, message: '请输入日志的发布人' }]}>
          <Input style={{
                                width:'80%'
                            }} prefix={<IconFont type="iconxin" />} placeholder="请输入日志的发布人"/>
                                </Form.Item>   </div>
                            <div style={{ display: 'inline-block', width: '45%' }}>
          <Form.Item
            label={<p>发布时间</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
       </Form.Item>
                    <ConfigProvider locale={zh_CN}>
                        <DatePicker style={{width:'80%' }}
                            format="YYYY年MM月DD日"
                            onChange={this.dateChange}
                            // separator="~"
                            value={this.state.Time === ""  ? null : this.state.timedata}
                        />
                    </ConfigProvider>              
      </div>
                </div>
                <Form.Item label={<p>您需要在下面输入此次日志的内容</p>}
                  style={{
                    marginBottom: '20px',   
                    marginLeft: '50px'
                  }} >
                </Form.Item>
         <Form.Item>
         <BraftEditor
                    value={this.state.editorState}
                    onChange={this.handleEditorChange}
          />
      </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={ this.empty} style={{ width: '20%' ,float:'left'}}>
                    清空全部内容
        </Button>
            <Button type="primary" htmlType="submit" style={{ width: '20%' ,float:'right'}}>
               { this.state.cardTitle}
        </Button>
      </Form.Item>
    </Form>
                    </Card>
            </div>
        );
    }

}