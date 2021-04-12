import { Component } from 'react'
import qs from 'qs'
import  axios from 'axios'
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
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
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
                // list: this.props.location.data.list
                list:'5'
            });
            axios.post("http://www.test.com/gonggao/selectList.php", didData).then((res: any) => {
                if (res.data.code === 200) {
                    this.setState({
                        title: res.data.data.data[0].title,
                        startTime:res.data.data.data[0].startTime,
                        endTime:res.data.data.data[0].endTime,
                        content: res.data.data.data[0].content,
                        school:res.data.data.data[0].school,
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
                <div>公示时间：{this.state.startTime}-{this.state.endTime}</div>
                <div>公示单位：{ this.state.school}</div>
              </div>
            </div>
        );
    }

}
