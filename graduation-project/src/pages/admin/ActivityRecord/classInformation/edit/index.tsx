import { Component } from 'react'
import { Card, Form, Input, Button, DatePicker, ConfigProvider, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import { FormInstance } from 'antd/lib/form';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import qs from 'qs'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import './index.css'
import axios from 'axios';
import React from 'react';

const { TextArea } = Input;
const { RangePicker } = DatePicker;
const IconFont = createFromIconfontCN({
    scriptUrl: [
  "  .alicdn.com/t/font_1999223_yl4n0qasc3.js"
    ],
  });
interface IProps {
    history: any,
    location:any
}

interface IState {
    title:any,
    startTime: any,
    endTime: any,
    timedata: any,
    loading: boolean,
    editorState: any,
    pictureCreateTime: any,
    pictureAddress: any, 
    introValue:string,
}

export default class Main extends Component<IProps, IState>{
  formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
      this.state = {
            pictureAddress: '',
            editorState: BraftEditor.createEditorState(null),
            loading: false,
            title: '',
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
            pictureCreateTime: '',
            introValue:''
        }
    }
  componentDidMount() {
            if (this.props.location.data) { 
                 this.setState({
                    title:this.props.location.data.title
                 })
              if (this.props.location.data.pictureCreateTime) {
                this.setState({
                    pictureCreateTime:this.props.location.data.pictureCreateTime||"",
                }, () =>{
                  this.pictureInit()
                })
              }
              if (this.props.location.data.list) {
                let didData = qs.stringify({
                  list: this.props.location.data.list
                });
                axios.post("http://www.test.com/classInformation/selectList.php", didData).then((res: any) => {
                  if (res.data.code === 200) {
                    console.log(res.data.data.data);
                    const { classTitle, classTec, classNumber, startTime, endTime, content,introValue} = res.data.data.data[0]
                    this.formRef.current!.setFieldsValue({ classTitle });
                    this.formRef.current!.setFieldsValue({ classTec });
                    this.formRef.current!.setFieldsValue({ classNumber });
                    this.setState({
                      startTime,
                      endTime,
                      introValue,
                      editorState: BraftEditor.createEditorState(content),
                      timedata: [moment(startTime, "YYYY年MM月DD日HH时mm分"), moment(endTime, "YYYY年MM月DD日HH时mm分")],
                    })
                  }
                }).catch((err) => {
                  console.log(err);
                })
              }
        }
  }
  //富文本编辑器
public handleEditorChange = (editorState:any) => {
    this.setState({ editorState })
}

//会议时间选择
 public dateChange = (date: any, dateString: any) => {
    console.log(date, dateString);
    console.log(typeof (dateString));
    console.log(dateString[0]);
        this.setState({
            startTime:dateString[0],
            endTime:dateString[1],
            timedata: [moment(dateString[0],"YYYY年MM月DD日HH时mm分"), moment( dateString[1],"YYYY年MM月DD日HH时mm分")]
        })
  }
  //一键清空
  public empty = () => {
    this.formRef.current!.setFieldsValue({ classTitle:'' });
    this.formRef.current!.setFieldsValue({ classTec:'' }); 
    this.formRef.current!.setFieldsValue({ classNumber:'' });
    this.setState({
      startTime:'',
      endTime: '',
      introValue:'',
      editorState: BraftEditor.createEditorState(null),
      timedata: [moment(this.state.startTime, "YYYY年MM月DD日HH时mm分"), moment(this.state.endTime, "YYYY年MM月DD日HH时mm分")],
    })
  }
  public pictureInit = () => {
    let pictureData = qs.stringify({
           pictureCreateTime :this.state.pictureCreateTime, 
    });
    console.log(pictureData);
    axios.post('http://www.test.com/classInformation/selectPicture.php', pictureData).then((res:any)=>{
      if (res.data.data.data.length > 0) {
        this.setState({
          pictureAddress: res.data.data.data[0].picture
        })
      } else {
        this.setState({
          pictureAddress: ''
        })
      }
    })
  }

  //老师个人简介
  public tetxChange = (e:any) => {
    this.setState({
          introValue:e.target.value
    })
  }
  
  public onFinish = (values: any) => {
    if (!this.state.editorState.isEmpty()) {
      if (this.state.introValue.length>0) {
        if (this.props.location.data.title === '新增团课') {
          if (this.state.startTime) {
            let submitData = qs.stringify({
              ...values,
              introValue:this.state.introValue,
              startTime: this.state.startTime,
              endTime: this.state.endTime,
              content: this.state.editorState.toHTML(),
              picture: this.state.pictureCreateTime||"",
            });
            axios.post("http://www.test.com/classInformation/submit.php", submitData).then((res: any) => {
              if (res.data.code === 200) {
                message.success("提交成功")
                this.props.history.push('/admin/ActivityRecord/classInformation')
              }
            }).catch((err: any) => {
              console.log(err);
            })
          } else {
            let submitData = qs.stringify({
              list: this.props.location.data.list,
              ...values,
              introValue:this.state.introValue,
              startTime: this.state.startTime,
              endTime: this.state.endTime,
              content: this.state.editorState.toHTML(),
              picture: this.state.pictureCreateTime||"",
            });
            axios.post("http://www.test.com/classInformation/update.php", submitData).then((res: any) => {
              if (res.data.code === 200) {
                message.success("修改成功")
                this.props.history.push('/admin/ActivityRecord/classInformation')
              }
            }).catch((err: any) => {
              console.log(err);
            })
          }
          } else {
            message.warning('请选择团课时间')
          }
      }else {
        message.warning('请输入此次团课老师的简介')
      }
    } else {
      message.warning('请输入会议内容')
    }
    
  };
  public onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        console.log(this.state.editorState.toHTML());
  }
  public removePicture = () => {
    let didData = qs.stringify({
      pictureCreateTime: this.state.pictureCreateTime||"",
    });
    axios.post("http://www.test.com/classInformation/deletePicture.php", didData).then((res: any) => {
      if (res.data.code === 200) {
        message.success('删除图片成功')
        this.setState({
          pictureCreateTime:''
        }, () => {
          this.pictureInit()
        })
      }
    })
        
   }
  //图片上传方法
  public handleChange = ({ file }: any) => {
    if (file.status === 'uploading') {
            this.setState({
              loading: true,
            })
           }
    if (file.status === "done") {
      console.log(file);
            this.setState({
              loading: false,
              pictureCreateTime: file.response.time
            })
             message.success('头像上传成功');
            this.pictureInit()
           } else if (file.status === "error") {
            this.setState({
              loading:false
            })
              message.error('头像上传失败');
            }
  }
  render() {
        const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div style={{ marginTop: 8 }}>上传团日活动照片</div>
      </div>
    );
        return (
            <div className="editactivites">
                <Card title={this.state.title}>
              <Form 
          ref={this.formRef}
          name="basic"
          initialValues={{ remember: true }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
    >
           <div style={{
                marginLeft:'50px'
        }}>
         <div style={{display:'inline-block',width:'45%'}}>
        <Form.Item
            label={<p>团课标题</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="classTitle"  
            rules={[{  required: true,message: '请输入团课的标题' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入团课的标题"/>
      </Form.Item>
      </div>
        <div style={{display:'inline-block',width:'45%'}}>
      <Form.Item
            label={<p >团课老师</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="classTec"  
            rules={[{  required: true, message: '请输入团课老师的姓名' }]}>
          <Input style={{
             width:'80%'
          }}  prefix={<IconFont type="iconxin" />} placeholder="请您输入团课老师的姓名"/>
                            </Form.Item>
                         </div>
                    </div>
              <div style={{
                     marginLeft:'50px'
                        }}>
                        <div style={{ display: 'inline-block', width: '45%' }}>
        <Form.Item
            label={<p>参加人数</p>}
            style={{
              marginBottom: '-2px',
            }}
      > 
         </Form.Item>
      <Form.Item 
            name="classNumber"  
            rules={[{  required: true, message: '请输入团课的参加人数' }]}>
          <Input style={{
                                width:'80%'
                            }} prefix={<IconFont type="iconxin" />} placeholder="请您输入团课的参加人数"/>
                                </Form.Item>   </div>
                            <div style={{ display: 'inline-block', width: '45%' }}>
          <Form.Item
            label={<p>团课时间</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
       </Form.Item>
                    <ConfigProvider locale={zh_CN}>
                        <RangePicker style={{width:'80%' }}
                            format="YYYY年MM月DD日HH时mm分"
                            onChange={this.dateChange}
                            separator="~"
                            showTime
                            value={this.state.startTime === "" || this.state.endTime === "" ? null : this.state.timedata}
                        />
                    </ConfigProvider>              

      </div>
                        </div>
                        <Form.Item
            label={<span>您可以自行选择是否上传团课老师的图片</span>}
            style={{
              marginBottom: '-2px',
              marginLeft:'50px'
                  }} >
                  <Button type="primary" style={{
                    marginLeft: '10px'
                  }}
                    disabled={this.state.pictureAddress===''}
                    onClick={this.removePicture}>删除已上传图片</Button>
        </Form.Item>
              <Form.Item>
                  <Upload
                    name="file"
                    style={{
                      backgroundColor: 'blue',
                      display:'none'
                    }}
             
                    listType="picture-card"
                    showUploadList={false}
                    // fileList={this.state.fileList}
                    action="http://www.test.com/classInformation/classPicture.php"
                    onChange={this.handleChange}
      >
                    {this.state.pictureAddress ? <img src={this.state.pictureAddress} alt="avatar" style={{ width: 200, height: 200 }} /> : uploadButton}
                  </Upload>
                  <div style={{
                      // display: 'inline-block',
                      float:'right',
                      width: '500px',
                    marginRight: '114px',
                    marginTop:'-29px'
                  }}>
                    <p>请输入此次团课老师的个人简介</p>
                    <TextArea
                      style={{
                        marginTop:'10px'
                      }}
                      value={ this.state.introValue}
                      placeholder="您可以输入老师的个人简介"
                      autoSize={{ minRows: 9, maxRows: 9 }}
                      onChange={this.tetxChange}
                      />
                  </div>
                </Form.Item>                          
                <Form.Item label={<p>您需要在下面输入此次团课的意义</p>}
                  style={{
                    marginBottom: '20px',   
                    marginLeft: '50px'
                  }} >
                </Form.Item>
         <Form.Item>
         <BraftEditor
                    value={this.state.editorState}
                    onChange={this.handleEditorChange}
                    // onSave={this.submitContent}
          />
      </Form.Item>
                <Form.Item>
                  <Button type="primary" onClick={ this.empty} style={{ width: '20%' ,float:'left'}}>
                    清空全部内容
        </Button>
            <Button type="primary" htmlType="submit" style={{ width: '20%' ,float:'right'}}>
                    { this.props.location.data.title}
        </Button>
      </Form.Item>
    </Form>
            </Card> 
           </div>
        );
    }

}