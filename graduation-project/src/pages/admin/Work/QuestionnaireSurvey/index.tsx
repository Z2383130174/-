import { Component } from 'react'
import { Radio, Checkbox, Input,Rate,Button, message} from 'antd';
import './check.css'
import qs from 'qs';
import axios from 'axios';

interface IProps {
    history:any
}

interface IState {
    answer: any
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            answer: {
                suggest: '',
                phone:'',
                one: '',
                two: '',
                three: '',
                four: '',
                five: '',
                six: '',
                seven:'',
            }
        }
    }
    public nameChange = (e: any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 one: e.target.value
            }
        })
    }

   public phoneChange = (e: any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 phone: e.target.value
            }
        })
    }
    public sexonChange = (e: any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 two: e.target.value
            }
        })
    }
    public memberonChange = (e:any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 three: e.target.value
            }
        })
    }
    public ClassonChange = (e: any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 four: e.target.value
            }
        })
    }
    public importonChange = (checkedValue:any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 five: checkedValue
            }
        })
    }
    public easyonChange= (e:any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 six: e.target.value
            }
        })
    }
    public suggestChange= (e:any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 suggest: e.target.value
            }
        })
    }

    public handleChange = (value:any) => {
        this.setState({
            answer:{
                ...this.state.answer,
                 seven: value
            }
        });
    }
    public empty = () => {
        this.setState({
            answer: {
                suggest: '',
                phone:'',
                one: '',
                two: '',
                three: '',
                four: '',
                five: '',
                six: '',
                seven:'',
            }
        })
    }
    public submit = () => {
        const str=this.state.answer.five.join(",")
        let referData = qs.stringify({
            ...this.state.answer,
            five:str
          });  
          axios.post("http://www.test.com/question.php", referData).then((res: any) => {   
              if (res.data.code === 200) {
                  message.success('提交问卷成功')
                  this.empty()
            } }).catch((err) =>{
            console.log(err); 
        })
    }

    render() {
        const desc = ['非常差', '比较差', '一般', '比较好', '非常好'];
        return (
            <div className="checked">
                <div className="main">
                    <h3>“智慧团建”调研问卷</h3>
                    <div className="question">
                        <div className="title"> 1.您的名字：</div>
                        <Input style={{
                            width: '60%',
                            marginTop:'10px'
                        }} onChange={ this.nameChange} value={this.state.answer.one}></Input>
                    </div>
                    <div className="question">
                        <div className="title"> 2.您的手机号：</div>
                        <Input style={{
                            width: '60%',
                            marginTop:'10px'
                        }} onChange={ this.phoneChange} value={this.state.answer.phone}></Input>
                    </div>
                    <div className="question">
                        <div className="title"> 3.您的性别：</div>
                        <div className="content"><Radio.Group onChange={this.sexonChange} value={this.state.answer.two}>
                            <Radio value={"男"}>男</Radio>
                            <Radio value={"女"}>女</Radio>
                       </Radio.Group></div>
                    </div>
                    <div className="question">
                        <div className="title"> 4.请问您是否为共青团员：</div>
                        <div className="content"><Radio.Group onChange={this.memberonChange} value={this.state.answer.three}>
                            <Radio value={"是"}>是</Radio>
                            <Radio value={"否"}>否</Radio>
                       </Radio.Group></div> 
                    </div>
                    <div className="question">
                        <div className="title"> 5.您参与智慧团建线上课程的频率是？（智慧团建课程：以互联网为载体，传播共青团先进思想课程）：</div>
                        <div className="content">
                            <Radio.Group onChange={this.ClassonChange} value={this.state.answer.four}>
                            <Radio value={"没参与过"}>没参与过</Radio>
                            <Radio value={"一学期1-3次"}>一学期1-3次</Radio>
                            <Radio value={"一学期4-7次"}>一学期4-7次</Radio>
                            <Radio value={"一学期7次以上"}>一学期7次以上</Radio>
                            </Radio.Group>
                        </div>
                    </div>
                     <div className="question">
                        <div className="title"> 6.您认为学习团课有什么重要性？：</div>
                        <div className="content">
                        <Checkbox.Group style={{ width: '100%' }} onChange={this.importonChange} value={this.state.answer.five}>
                            <Checkbox value={"学校要求，重要性一般"} style={{marginLeft:'8px'}}>学校要求，重要性一般</Checkbox>
                            <Checkbox  value={"提高政治思想觉悟"}>提高政治思想觉悟</Checkbox>
                            <Checkbox  value={"了解共青团时政热点"}>了解共青团时政热点</Checkbox>
                            <Checkbox  value={"提高入党机会"}>提高入党机会</Checkbox>
                            <Checkbox  value={"其他"}>其他</Checkbox> 
                       </Checkbox.Group>
                       </div>
                    </div>
                    <div className="question">
                        <div className="title"> 7.您觉得智慧团建的系统好用吗：</div>
                        <div className="content">
                        <Radio.Group onChange={this.easyonChange} value={this.state.answer.six}>
                            <Radio value={"好用"}>好用</Radio>
                            <Radio value={"一般"}>一般</Radio>
                            <Radio value={"不好用"}>不好用</Radio>
                            <Radio value={"垃圾"}>非常垃圾
                            {this.state.answer.six === "垃圾" ? <Input style={{ width: 380, marginLeft: 10 }} placeholder="请您提出宝贵的意见，并留下您的学号，方便后续联系你" onChange={this.suggestChange} value={this.state.answer.suggest}/> : null}</Radio>
                            </Radio.Group>
                       </div>
                    </div>
                    <div className="question">
                        <div className="title"> 8.您可以给此系统平分的话，您会打几分？</div>
                        <div className="content">
                            <Rate style={{
                                fontSize: "30px",
                                paddingTop: "20px",
                            }} tooltips={desc} onChange={this.handleChange} value={this.state.answer.seven} />
        {this.state.answer.seven ? <span className="ant-rate-text">{desc[this.state.answer.seven - 1]}</span> : ''}
                       </div>
                    </div>
                    <div style={{display:"flex",justifyContent: "flex-end",}}>
                        <Button type="primary" style={{
                            marginRight:"30px"
                        }} onClick={ this.empty}>清空</Button>
                    <Button type="primary"  onClick={ this.submit}>提交</Button>
                    </div>
                </div>
            </div>

        )
    }
}
  