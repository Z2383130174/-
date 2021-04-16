import { Component } from 'react'
import qs from 'qs'
import axios from 'axios'
interface IProps {
    history:any,
    location:any
}

interface IState {
    title: string,
    user:string,
    content: string,
    type: any,
    Time: any,
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            title: '',
            user: '',
            type: '',
            Time:'',
            content: '',
        }
    }
    componentDidMount() { 
        if (this.props.location.data) {
            let didData = qs.stringify({
                list: this.props.location.data.list
            });
            axios.post("http://www.test.com/logging/selectList.php", didData).then((res: any) => {
                if (res.data.code === 200) {
                    this.setState({
                        title: res.data.data.data[0].loggingTitle,
                        type:res.data.data.data[0].loggingType,
                        Time:res.data.data.data[0].Time,
                        content: res.data.data.data[0].content,
                        user:res.data.data.data[0].loggingUser,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    render() {
        return (
            <div style={{fontSize:'20px',fontFamily:'fangsong'}}>
                <h3 style={{textAlign:'center'}}>{ this.state.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: this.state.content }} style={{lineHeight:'40px',textIndent: "2em"}} />
                <div style={{
                    float:'right'                                                                                   
                }}>
                <div>发布时间：{this.state.Time}-{this.state.Time}</div>
                    <div>日志作者：{this.state.user}</div>
              </div>
            </div>
        );
    }

}
