import { Component } from 'react'
import { Input, DatePicker, Button , ConfigProvider, message,Select} from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import moment from 'moment';
import axios from 'axios';
import qs from 'qs';
import './note.css'

import TQ from './tuanqi.jpg'
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface IProps {

}

interface IState {
    title: any,
    value: any,
    school: any,
    startTime: any,
    endTime: any,
    timedata: any,
    userSchool:any
}

export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            title: '',
            value: '',
            school: '',
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
            userSchool:'',
        }
      
    }
    componentDidMount() { 
        axios.post("http://www.test.com/gonggao/noteselect.php").then((res: any) => {  
            if (res.data.code === 200) { 
                const { title, value, school,startTime,endTime,userSchool}=res.data.data.data[0]
                this.setState({
                    title,
                    value,
                    school,
                    startTime,
                    endTime,
                    userSchool,
                   timedata: [moment(startTime,"YYYY年MM月DD日"), moment( endTime,"YYYY年MM月DD日")] 
                }, () => {
                        console.log(this.state.timedata);
                        
                })
            }
        }).catch((err) =>{
            console.log(err); 
        })
    }

    // 内容变化
    public onChange = (e: any) => {
        const { value} = e.target
        this.setState({
            value
        });
    };
    // 标题变化
    public titleChange = (e: any) => {
        const { value} = e.target
        this.setState({
            title:value
        });
    };
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
    //接受单位
    public userChange = (value:any) => { 
        this.setState({
            userSchool:value
        })
    }
    //发布单位
    public schoolChange = (e:any) => { 
        const { value} = e.target
        this.setState({
            school:value
        });
    }
    //发布
    public release = () => {
        if (this.state.title) { 
            if (this.state.userSchool) { 
                if (this.state.value) { 
                    if (this.state.school) { 
                        if (this.state.startTime && this.state.endTime) { 
                            const { title, value, school, startTime, endTime,userSchool } = this.state;
             let noticeData = qs.stringify({
             title,value,school,startTime,endTime,userSchool,
             reading:"已读",
            })    
                            axios.post("http://www.test.com/gonggao/notices.php", noticeData).then((res: any) => {  
                                if (res.data.code === 200) { 
                                    message.success('新增公告成功')
                                }
                            }).catch((err) =>{
                                console.log(err); 
                            })
                        } else {
                            message.warning('请输入公告时间')
                        }
                    } else {
                        message.warning('请输入发布单位')
                    }
                } else {
                    message.warning('请输入公告内容')
                }
            }else {
                message.warning('请选择发布对象')
            }
        } else {
            message.warning('请输入公告标题')
        }
    }
    //清空
    public empty = () => {
        this.setState({
            title: '',
            value: '',
            school: '',
            startTime: '',
            endTime: '',
            timedata: [moment(null, "YYYY年MM月DD日"), moment(null, "YYYY年MM月DD日")],
            userSchool:'',
        })
    }
    
    render() {
        const options = [
            { label: '初中团支部', value: '初中团支部' },
            { label: '高中团支部', value: '高中团支部' },
            {label:'大学团支部',value:'大学团支部'}
          ]
        return (
            <div className="note">
                <div className="notice">
                    <div style={{
                        textAlign: 'left',
                        marginTop: '10px',
                        marginBottom: '10px',
                        padding:"0px 40px"
                    }}>
                    公告标题: <Input value={this.state.title} onChange={ this.titleChange} style={{
                            width: 'auto',
                            height: "27.6px",
                            marginRight:'150px'
                        }}></Input>
                    选择发布对象:<Select value={this.state.userSchool}
                            allowClear   
                              style={{
                                width: "20%",
                                 }}
          onChange={this.userChange}>
        { options.map((item:any) =>(
       <Option value={ item.value}>{item.label}</Option>
         ))}
              </Select>
                   </div>
                    <TextArea
                        value={this.state.value}
                        placeholder="请输入公示内容"
                        onChange={this.onChange}
                        allowClear
                        showCount
                        maxLength={2000}
                    />
                    <span className="num">公告字数：</span>
                    <div style={{
                               position: 'absolute',
                               right: 0,
                               bottom:105
                    }}>发布单位：<Input value={this.state.school} onChange={this.schoolChange} style={{
                        width: '200px',
                        height: "27.6px",
                    }}></Input>
                    </div>
                    <span style={{
                        position: 'absolute',
                        right: 285,
                        bottom: 56,
                    }}> 公示时间：</span>
                    <ConfigProvider locale={zh_CN}>
                        <RangePicker style={{ position: 'absolute', right: 0, bottom: 55, }}
                            format="YYYY年MM月DD日"
                            onChange={this.dateChange}
                            separator="~"
                            value={this.state.startTime === "" || this.state.endTime === "" ? null : this.state.timedata}
                        />
                    </ConfigProvider>
                    <img src={TQ} alt="" style={{
                        width: '200px',
                        height: '200px',
                        borderRadius:'50%',
                        position: "absolute",
                        left: -230,
                        top: 200,
                        // transform: rotateY(180deg)
                    }} />
                     <img src={TQ} alt="" style={{
                        width: '200px',
                        height: '200px',
                        borderRadius:'50%',
                        position: "absolute",
                        right: -230,
                        top: 200,
                        // transform: "rotateY(180deg)"
                    }} />
                     <Button type="primary" style={{
                        position: 'absolute',
                        left: 5,
                        bottom: 5,
                    }} onClick={ this.empty}>清空内容</Button>
                    <Button type="primary" style={{
                        position: 'absolute',
                        right: 5,
                        bottom: 5,
                    }} onClick={ this.release}>发布公告</Button>
                   
                </div>
            </div>
        );
    }

}