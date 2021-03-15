import { Component } from 'react'
import { Card, Form,Input,Button,DatePicker,ConfigProvider, message }from 'antd'
// import { Table,message,Space, Modal,Input,Select,Row,Col,Button,Pagination,ConfigProvider} from 'antd';
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


const { RangePicker } = DatePicker;
const IconFont = createFromIconfontCN({
    scriptUrl: [
  "  //at.alicdn.com/t/font_1999223_yl4n0qasc3.js"
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
  editorState:any,
}


export default class Main extends Component<IProps, IState>{
  formRef = React.createRef<FormInstance>();
    constructor(props: IProps) {
        super(props)
      this.state = {
        editorState: BraftEditor.createEditorState(null),
            loading: false,
            imageUrl:'',
            title: '',
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
        }
    }
 componentDidMount() {
            if (this.props.location.data) { 
                 this.setState({
                    title:this.props.location.data.title
                 })
                 let didData = qs.stringify({
                  list: this.props.location.data.list
                });
                 axios.post("http://www.test.com/activity/selectList.php",didData).then((res: any) => {
                   if (res.data.code === 200) { 
                     console.log(res.data.data.data);
                     const {activityTitle,activityType,activityNumber,startTime,endTime,content }=res.data.data.data[0]
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
                      }).catch((err) =>{
                        console.log(err); 
                     })
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

  public onFinish = (values: any) => {
    if (!this.state.editorState.isEmpty()) {
      if (this.props.location.data.title === '新增团日活动') {
        let submitData = qs.stringify({
          ...values,
          startTime: this.state.startTime,
          endTime: this.state.endTime,
          content: this.state.editorState.toHTML()
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
          content: this.state.editorState.toHTML()
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
      message.warning('请输入会议内容')
    }
    
  };
  public onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
        console.log(this.state.editorState.toHTML());
      };

    render() {
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
            label={<p>标题</p>}
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
                        {/* <Form.Item
            label={<p>上传会议图片</p>}
            style={{
              marginBottom: '-2px',
            }} >
        </Form.Item>
              <Form.Item>
              <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        // beforeUpload={this.beforeUpload}
        onChange={this.handleChange}
          >
        {this.state.imageUrl ? <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      </Form.Item> */}
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