import { Component } from 'react'
import qs from 'qs'
import axios from 'axios'
import { message,Button} from 'antd'
interface IProps {
    history:any,
    location:any
}

interface IState {
    title: string,
    school:string,
    content: string,
    startTime: any,
    endTime: any,
    userSchool:any
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            userSchool:'',
            title: '',
            school: '',
            startTime: '',
            endTime:'',
            content: '',
        }
    }
    componentDidMount() { 
        if (this.props.location.data) {
            let didData = qs.stringify({
                list: this.props.location.data.list
            });
            axios.post("http://www.test.com/information/selectList.php", didData).then((res: any) => {
                if (res.data.code === 200) {
                    this.setState({
                        title: res.data.data.data[0].title,
                        startTime:res.data.data.data[0].startTime,
                        endTime:res.data.data.data[0].endTime,
                        content: res.data.data.data[0].content,
                        school: res.data.data.data[0].school,
                        userSchool:res.data.data.data[0].userSchool,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    public audit = () => {
        let addData = qs.stringify({
            list: this.props.location.data.list,
           ...this.state
        });
        axios.post("http://www.test.com/newsDatabase/addInformation.php", addData).then((res: any) => {
            if (res.data.code === 200) {
                message.success('添加要闻库成功')
                this.props.history.push('/admin/NewsConstruction/information')
            } else {
                message.error('添加要闻库失败，因为要闻库已有要闻')
            }
       })
    }
    render() {
        return (
            <div style={{fontSize:'20px',fontFamily:'fangsong'}}>
                <h3 style={{textAlign:'center'}}>{ this.state.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: this.state.content }} style={{lineHeight:'40px',textIndent: "2em"}} />
                <div style={{
                    float:'right'
                }}>
                    <div>公示时间：{this.state.startTime}-{this.state.endTime}</div>
                    <div>公示单位：{this.state.school}</div>
                    <div>  <Button type='primary' onClick={ this.audit} style={{
                    float:'right'
                }}>审核通过</Button></div>
              </div>
            </div>
        );
    }

}


