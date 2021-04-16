import { Component } from 'react'
import { Card, Form, Input, Button, DatePicker, ConfigProvider, message, Upload } from 'antd'
import { LoadingOutlined, PlusOutlined,createFromIconfontCN } from '@ant-design/icons';
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


const { RangePicker } = DatePicker;
const IconFont = createFromIconfontCN({
    scriptUrl: [
  " //at.alicdn.com/t/font_1999223_k1aezr3mvn.js"
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
    imageUrl: any,
    editorState: any,
    pictureCreateTime: any,
    pictureAddress1: any
    pictureAddress2: any
    pictureAddress3:any
}


export default class Main extends Component<IProps, IState>{
  formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
      this.state = {
            pictureAddress1: '',
            pictureAddress2: '',
            pictureAddress3:'',
            editorState: BraftEditor.createEditorState(null),
            loading: false,
            imageUrl:'',
            title: '',
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
            pictureCreateTime: {
                      pictureCreateTime1: '',
                      pictureCreateTime2: '',
                      pictureCreateTime3:'',
            }   
  
        }
    }
 componentDidMount() {
            if (this.props.location.data) { 
                 this.setState({
                    title:this.props.location.data.title
                 })
              if (this.props.location.data.p1Time||this.props.location.data.p2Time||this.props.location.data.p3Time) {
                this.setState({
                  pictureCreateTime: {
                    pictureCreateTime1:this.props.location.data.p1Time||"",
                    pictureCreateTime2:this.props.location.data.p2Time||"",
                    pictureCreateTime3:this.props.location.data.p3Time||""
                  }
                }, () =>{
                  this.pictureInit1()
                    this.pictureInit2()
                    this.pictureInit3()
                })
              }

              if (this.props.location.data.list) {
                let didData = qs.stringify({
                  list: this.props.location.data.list
                });
                axios.post("http://www.test.com/activity/selectList.php", didData).then((res: any) => {
                  if (res.data.code === 200) {
                    console.log(res.data.data.data);
                    const { activityTitle, activityType, activityNumber, startTime, endTime, content } = res.data.data.data[0]
                    this.formRef.current!.setFieldsValue({ activityTitle });
                    this.formRef.current!.setFieldsValue({ activityType });
                    this.formRef.current!.setFieldsValue({ activityNumber });
                    this.setState({
                      startTime,
                      endTime,
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
    this.formRef.current!.setFieldsValue({ activityTitle:'' });
    this.formRef.current!.setFieldsValue({ activityType:'' });
    this.formRef.current!.setFieldsValue({ activityNumber:'' });
    this.setState({
      startTime:'',
      endTime:'',
      editorState: BraftEditor.createEditorState(null),
      timedata: [moment(this.state.startTime, "YYYY年MM月DD日HH时mm分"), moment(this.state.endTime, "YYYY年MM月DD日HH时mm分")],
    })
  }
  public pictureInit1 = () => {
    let pictureData = qs.stringify({
           pictureCreateTime :this.state.pictureCreateTime.pictureCreateTime1, 
    });
    console.log(pictureData);
    axios.post('http://www.test.com/activity/selectPicture.php', pictureData).then((res:any)=>{
      if (res.data.data.data.length > 0) {
        this.setState({
          pictureAddress1: res.data.data.data[0].picture
        })
      } else {
        this.setState({
          pictureAddress1: ''
        })
      }
    })
  }
  public pictureInit2 = () => {
    let pictureData = qs.stringify({
           pictureCreateTime :this.state.pictureCreateTime.pictureCreateTime2, 
    });
    console.log(pictureData);
    axios.post('http://www.test.com/activity/selectPicture.php', pictureData).then((res:any)=>{
      if (res.data.data.data.length>0) {
        this.setState({
          pictureAddress2:res.data.data.data[0].picture
        })
      }else {
        this.setState({
          pictureAddress2: ''
        })
      }
    })
  }
  public pictureInit3 = () => {
    let pictureData = qs.stringify({
           pictureCreateTime :this.state.pictureCreateTime.pictureCreateTime3, 
    });
    console.log(pictureData);
    axios.post('http://www.test.com/activity/selectPicture.php', pictureData).then((res:any)=>{
      if (res.data.data.data.length>0) {
        this.setState({
          pictureAddress3:res.data.data.data[0].picture
        })
      }else {
        this.setState({
          pictureAddress3: ''
        })
      }
    })
  }

  public onFinish = (values: any) => {
    if (!this.state.editorState.isEmpty()) {
      if (this.state.startTime) {
        if (this.props.location.data.title === '新增团日活动') {
          let submitData = qs.stringify({
            ...values,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            content: this.state.editorState.toHTML(),
            picture1: this.state.pictureCreateTime.pictureCreateTime1||"",
            picture2: this.state.pictureCreateTime.pictureCreateTime2||"",
            picture3: this.state.pictureCreateTime.pictureCreateTime3||"",
            
          });
          axios.post("http://www.test.com/activity/submit.php", submitData).then((res: any) => {
            if (res.data.code === 200) {
              message.success("提交成功")
              this.props.history.push('/admin/ActivityRecord/LeagueActivities')
            }
          }).catch((err: any) => {
            console.log(err);
          })
        } else {
          let submitData = qs.stringify({
            list: this.props.location.data.list,
            ...values,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            content: this.state.editorState.toHTML(),
            picture1: this.state.pictureCreateTime.pictureCreateTime1||"",
            picture2: this.state.pictureCreateTime.pictureCreateTime2||"",
            picture3: this.state.pictureCreateTime.pictureCreateTime3||"",
          });
          axios.post("http://www.test.com/activity/update.php", submitData).then((res: any) => {
            if (res.data.code === 200) {
              message.success("修改成功")
              this.props.history.push('/admin/ActivityRecord/LeagueActivities')
            }
          }).catch((err: any) => {
            console.log(err);
          })
        }
      } else {
        message.warning('请选择团日活动的时间')
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
      pictureCreateTime1: this.state.pictureCreateTime.pictureCreateTime1||"",
      pictureCreateTime2: this.state.pictureCreateTime.pictureCreateTime2||"",
      pictureCreateTime3: this.state.pictureCreateTime.pictureCreateTime3||"",
    });
    axios.post("http://www.test.com/activity/deletePicture.php", didData).then((res: any) => {
      if (res.data.code === 200) {
        message.success('删除图片成功')
        this.setState({
          pictureCreateTime: {
            pictureCreateTime1: '',
            pictureCreateTime2: '',
            pictureCreateTime3: ''
          }
        }, () => {
          this.pictureInit1()
          this.pictureInit2()
          this.pictureInit3()
        })
      }
    })
        
   }
  //图片上传方法
  public handleChange1 = ({ file }: any) => {
    if (file.status === 'uploading') {
            this.setState({
              loading: true,
            })
           }
    if (file.status === "done") {
      console.log(file);
            this.setState({
              loading: false,
              pictureCreateTime: {
                pictureCreateTime1: file.response.time
              }
            })
             message.success('头像上传成功');
            this.pictureInit1()
           } else if (file.status === "error") {
            this.setState({
              loading:false
            })
              message.error('头像上传失败');
            }
  }
  public handleChange2 = ({ file }: any) => {
    if (file.status === 'uploading') {
            this.setState({
              loading: true,
            })
           }
    if (file.status === "done") {
            this.setState({
              loading: false,
              pictureCreateTime: {
                pictureCreateTime2: file.response.time
              }
            }, () => {
                console.log(this.state.pictureCreateTime.pictureCreateTime2);
            })
             message.success('头像上传成功');
            this.pictureInit2()
           } else if (file.status === "error") {
            this.setState({
              loading:false
            })
              message.error('头像上传失败');
            }
  }
  public handleChange3 = ({ file }: any) => {
    if (file.status === 'uploading') {
            this.setState({
              loading: true,
            })
           }
    if (file.status === "done") {
            this.setState({
              loading: false,
              pictureCreateTime: {
                pictureCreateTime3: file.response.time
              }
            }, () => {
              console.log(this.state.pictureCreateTime.pictureCreateTime3);
            })
             message.success('头像上传成功');
            this.pictureInit3()
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
            label={<p>团日活动标题</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="activityTitle"  
            rules={[{  required: true,message: '请输入团日活动的标题' }]}>
          <Input style={{
             width:'80%'
          }} prefix={<IconFont type="iconxin" />} placeholder="请您输入团日活动的标题"/>
      </Form.Item>
      </div>
        <div style={{display:'inline-block',width:'45%'}}>
      <Form.Item
            label={<p >会议类型</p>}
            style={{
              marginBottom: '-2px',
            }}
      >
      </Form.Item>
      <Form.Item 
            name="activityType"  
            rules={[{  required: true, message: '请输入团日活动的会议类型' }]}>
          <Input style={{
             width:'80%'
          }}  prefix={<IconFont type="iconxin" />} placeholder="请您输入团日活动的会议类型"/>
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
            name="activityNumber"  
            rules={[{  required: true, message: '请输入团日活动的参加人数' }]}>
          <Input style={{
                                width:'80%'
                            }} prefix={<IconFont type="iconxin" />} placeholder="请您输入团日活动的参加人数"/>
                                </Form.Item>   </div>
                            <div style={{ display: 'inline-block', width: '45%' }}>
          <Form.Item
            label={<p>会议时间</p>}
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
            label={<p>您可以自行选择是否上传会议图片</p>}
            style={{
              marginBottom: '-2px',
              marginLeft:'50px'
                  }} >
                  <Button type="primary" style={{
                    marginLeft: '145px'
                  }}
                    disabled={this.state.pictureAddress1===''}
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
                    action="http://www.test.com/activity/activityPicture.php"
                    onChange={this.handleChange1}
      >
                    {this.state.pictureAddress1 ? <img src={this.state.pictureAddress1} alt="avatar" style={{ width: 200, height: 200 }} /> : uploadButton}
                  </Upload>
                  <Upload
                    name="file"
                    className={ this.state.pictureAddress1===''?"upload2":""}
                    listType="picture-card"
                    showUploadList={false}
                    // fileList={this.state.fileList}
                    action="http://www.test.com/activity/activityPicture.php"
                    onChange={this.handleChange2}
      >
                    {this.state.pictureAddress2 ? <img src={this.state.pictureAddress2} alt="avatar" style={{ width: 200, height: 200 }} /> : uploadButton}
                  </Upload>
                  <Upload
                    name="file"
                    className={ this.state.pictureAddress2===''?"upload3":""}
                    listType="picture-card"
                    showUploadList={false}
                    // fileList={this.state.fileList}
                    action="http://www.test.com/activity/activityPicture.php"
                    onChange={this.handleChange3}
      >
                    {this.state.pictureAddress3 ? <img src={this.state.pictureAddress3} alt="avatar" style={{ width: 200, height: 200 }} /> : uploadButton}
                 </Upload>
                </Form.Item>
                <Form.Item label={<p>您需要在下面输入此次团日活动的内容以及意义</p>}
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