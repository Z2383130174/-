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
// import './note.css'
const provinceData = ['管理员', '校团委','基层团干部'];
const cityData = {
  管理员: ['校团委', '基层团干部', '团员'],
  校团委: ['基层团干部', '团员' ],
  基层团干部:['团员']
};
const { Option } = Select;
const { RangePicker } = DatePicker;
//使用阿里云图标
const IconFont = createFromIconfontCN({
    scriptUrl: [
  "//at.alicdn.com/t/font_1999223_k1aezr3mvn.js"
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
    cardTitle: string,
    cities: any,
    secondCity: any,
    disabled: boolean,
    isser: string,
    accepter: string,
}
export default class Main extends Component<IProps, IState>{
    formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
      this.state = {
            accepter: '',
            isser:'',
            disabled:true,
            cities: provinceData,
            secondCity:[],
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
           axios.post("http://www.test.com/task/selectList.php",didData).then((res: any) => {  
                    if (res.data.code === 200) {
                        const { title, school, startTime, endTime, userSchool,content,isser,accepter} = res.data.data.data[0]
                        this.formRef.current!.setFieldsValue({title});
                        this.formRef.current!.setFieldsValue({school});
                      this.setState({
                            secondCity:cityData[isser],
                            isser,
                            accepter,
                            startTime,
                            endTime,
                            userSchool,
                            disabled:false,
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
        })
    }
  //
  public isserCahange = (value: any) => {
    if (value === undefined) {
      this.setState({
        isser:'',
        secondCity:[],
        accepter:'',
        disabled:false
      })
    } else {
      this.setState({
        isser:value,
        secondCity: cityData[value],
        accepter:cityData[value][0],
        disabled:false
      })
    }
 
  }
  //
  public accepterChange = (value: any) => {
    if (value === undefined) {
      value=''
    }
    this.setState({
      accepter:value,
    })
  }
    //公示时间变化
    public dateChange = (date: any, dateString: any) => {
            this.setState({
                startTime:dateString[0],
                endTime:dateString[1],
                timedata: [moment(dateString[0],"YYYY年MM月DD日"), moment( dateString[1],"YYYY年MM月DD日")]
            })
    }
    //发布
    public onFinish =  (values: any) => {
      if (this.state.userSchool) {
        if (this.state.isser) {
          if (this.state.accepter) {
            if (!this.state.editorState.isEmpty()) {
              if (this.state.startTime) {
                if (this.props.location.data.title === '新增任务') {
                  let noticeData = qs.stringify({
                    ...values,
                    isser: this.state.isser,
                    accepter:this.state.accepter,
                    content: this.state.editorState.toHTML(),
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    userSchool:this.state.userSchool
                })
                  axios.post("http://www.test.com/task/task.php",noticeData).then((res: any) => {
                    if (res.data.code === 200) {
                      message.success('新增任务成功')
                      this.props.history.push('/admin/work/taskManagement')
                    }
                  }).catch((err) => {
                    console.log(err);
                  })
                } else {
                  let editNoticeData = qs.stringify({
                    ...values,
                    isser: this.state.isser,
                    accepter:this.state.accepter,
                    list: this.props.location.data.list,
                    content: this.state.editorState.toHTML(),
                    startTime: this.state.startTime,
                    endTime: this.state.endTime,
                    userSchool:this.state.userSchool
                })
                  axios.post("http://www.test.com/task/update.php",editNoticeData).then((res: any) => {
                    if (res.data.code === 200) {
                      message.success('修改任务成功')
                      this.props.history.push('/admin/work/taskManagement')
                    }
                  }).catch((err) => {
                    console.log(err);
                  })
                 }
              } else {
                message.warning('请选择任务时间段')
              }
            } else {
              message.warning('任务内容不能为空')
            }
          } else {
            message.warning('请选择任务接收人')
          }
        } else {
          message.warning('请选择任务发布人')
         }
      } else {
        message.warning('请选择接受对象')
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
            label={<p>任务标题</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="title"  
            rules={[{  required: true,message: '请输任务的标题' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入任务的标题"/>
      </Form.Item>
      </div>
        <div style={{display:'inline-block',width:'45%'}}>
      <Form.Item
            label={<p >接收对象</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
         <Select value={this.state.userSchool}
            placeholder="请选择任务的接收对象"
                  allowClear   
                  style={{
                      width: "80%",
                         }}
          onChange={this.userChange}>
        {options.map((item:any) =>(
       <Option value={ item.value}>{item.label}</Option>
         ))}
              </Select>
             </div>
           </div>
        <div style={{
                  marginLeft: '50px',
                  marginBottom:'20px'
                }}>
     <div style={{ display: 'inline-block', width: '45%' }}>
     <Form.Item
            label={<p>任务发布人</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
         <Select value={this.state.isser}
            placeholder="请选择任务的发布人"
                  allowClear   
                  style={{
                      width: "80%",
                         }}
          onChange={this.isserCahange}>
        { this.state.cities.map((item:any) =>(
       <Option value={ item}>{item}</Option>
         ))}
              </Select>
         </div>
       <div style={{ display: 'inline-block', width: '45%' }}>
     <Form.Item
            label={<p>任务接收人</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
         <Select value={this.state.accepter}
                      placeholder="请选择任务的接收人"
                      disabled={this.state.disabled}
                  allowClear   
                  style={{
                      width: "80%",
                         }}
          onChange={this.accepterChange}>
        { this.state.secondCity.map((item:any) =>(
       <Option value={item}>{item}</Option>
         ))}
              </Select>
                  </div>
                  </div>
        <div style={{
           marginLeft:'50px'
                }}>
      <div style={{ display: 'inline-block', width: '45%' }}>
        <Form.Item
            label={<p>请输入任务的发布单位</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
      <Form.Item 
            name="school"  
            rules={[{  required: true, message: '请输入任务的发布单位' }]}>
          <Input style={{
                  width:'80%'
               }} prefix={<IconFont type="iconxin" />} placeholder="请输入任务的发布单位"/>
                 </Form.Item>   </div>
             <div style={{ display: 'inline-block', width: '45%' }}>
          <Form.Item
            label={<p>任务时间</p>}
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
                <Form.Item label={<p>您需要在下面输入此次任务的内容</p>}
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