import { Component } from 'react'
// import { Input, DatePicker, Button, ConfigProvider, message, Select } from 'antd'
import { Card, Form, Input, Button, DatePicker, ConfigProvider, message,Select } from 'antd'
import { createFromIconfontCN } from '@ant-design/icons';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import { FormInstance } from 'antd/lib/form';
import 'moment/locale/zh-cn';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import BraftEditor from 'braft-editor';
import React from 'react';
import './note.css'

const { Option } = Select;
const { RangePicker } = DatePicker;
//使用阿里云图标
const IconFont = createFromIconfontCN({
    scriptUrl: [
  "  //at.alicdn.com/t/font_1999223_yl4n0qasc3.js"
    ],
  });

interface IProps {
  location: any,
  history:any
}

interface IState {
    startTime: any,
    endTime: any,
    timedata: any,
    editorState: any,
    userSchool: string,
    cardTitle:string
}

export default class Main extends Component<IProps, IState>{
    formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(null),
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
            userSchool: '',
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
           axios.post("http://www.test.com/gonggao/selectList.php",didData).then((res: any) => {  
                    if (res.data.code === 200) {
                        const { title, school, startTime, endTime, userSchool,content } = res.data.data.data[0]
                        this.formRef.current!.setFieldsValue({title});
                        this.formRef.current!.setFieldsValue({school});
                        this.setState({
                            startTime,
                            endTime,
                            userSchool,
                            editorState: BraftEditor.createEditorState(content),
                           timedata: [moment(startTime,"YYYY年MM月DD日"), moment( endTime,"YYYY年MM月DD日")] 
                        })
                    }
                }).catch((err) =>{
                    console.log(err); 
                })
        }
    }
    // 内容变化
    public handleEditorChange = (editorState:any) => {
        this.setState({ editorState })
    };
    public userChange = (value:any) => {
        this.setState({
            userSchool:value
        }, () => {
            console.log(this.state.userSchool);
            
        })
    }
    //公示时间变化
    public dateChange = (date: any, dateString: any) => {
        console.log(date, dateString);
        console.log(typeof (dateString));
        console.log(dateString[0]);
            this.setState({
                startTime:dateString[0],
                endTime:dateString[1],
                timedata: [moment(dateString[0],"YYYY年MM月DD日"), moment( dateString[1],"YYYY年MM月DD日")]
            })
    }
    //发布
    public onFinish =  (values: any) => {
      if (this.state.userSchool) {
        if (!this.state.editorState.isEmpty()) {
          if (this.props.location.data.title === '新增公告发布') {
            let noticeData = qs.stringify({
              ...values,
              content: this.state.editorState.toHTML(),
              reading: "未读",
              startTime: this.state.startTime,
              endTime: this.state.endTime,
              userSchool:this.state.userSchool
          })
            axios.post("http://www.test.com/gonggao/notices.php",noticeData).then((res: any) => {
              if (res.data.code === 200) {
                message.success('新增公告成功')
                this.props.history.push('/admin/NewsConstruction/notice')
              }
            }).catch((err) => {
              console.log(err);
            })
          } else {
            let editNoticeData = qs.stringify({
              ...values,
              list: this.props.location.data.list,
              content: this.state.editorState.toHTML(),
              reading: "未读",
              startTime: this.state.startTime,
              endTime: this.state.endTime,
              userSchool:this.state.userSchool
          })
            axios.post("http://www.test.com/gonggao/update.php",editNoticeData).then((res: any) => {
              if (res.data.code === 200) {
                message.success('修改公告成功')
                this.props.history.push('/admin/NewsConstruction/notice')
              }
            }).catch((err) => {
              console.log(err);
            })
           }
        } else {
          message.warning('公告内容不能为空')
        }
      } else {
        message.warning('请选择发布对象')
      }
       
    }
    public onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
      };
    //清空
    public empty = () => {
        this.setState({
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
        })
    }
    
    render() {
        const options = [
            { label: '初中团支部', value: '初中团支部' },
            { label: '高中团支部', value: '高中团支部' },
            {label:'大学团支部',value:'大学团支部'}
          ]
        return (
            <div className="noticeEdit">
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
            label={<p>标题</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="title"  
            rules={[{  required: true,message: '请输入公告的标题' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入公告的标题"/>
      </Form.Item>
      </div>
        <div style={{display:'inline-block',width:'45%'}}>
      <Form.Item
            label={<p >发布对象</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
         <Select value={this.state.userSchool?this.state.userSchool:undefined}
            placeholder="请选择公告的发布对象"
                  allowClear   
                  style={{
                      width: "80%",
                         }}
          onChange={this.userChange}>
        { options.map((item:any) =>(
       <Option value={ item.value}>{item.label}</Option>
         ))}
              </Select>
             </div>
           </div>
        <div style={{
           marginLeft:'50px'
              }}>
      <div style={{ display: 'inline-block', width: '45%' }}>
        <Form.Item
            label={<p>发布单位</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
      <Form.Item 
            name="school"  
            rules={[{  required: true, message: '请输入公告的发布单位' }]}>
          <Input style={{
                                width:'80%'
                            }} prefix={<IconFont type="iconxin" />} placeholder="请输入公告的发布单位"/>
                                </Form.Item>   </div>
                            <div style={{ display: 'inline-block', width: '45%' }}>
          <Form.Item
            label={<p>公示时间</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
       </Form.Item>
                    <ConfigProvider locale={zh_CN}>
                        <RangePicker style={{width:'80%' }}
                            format="YYYY年MM月DD日"
                            onChange={this.dateChange}
                            separator="~"
                            value={this.state.startTime === "" || this.state.endTime === "" ? null : this.state.timedata}
                        />
                    </ConfigProvider>              

      </div>
                        </div>
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