/* eslint-disable array-callback-return */
import { Component } from 'react'
import { Transfer, Select,Button,ConfigProvider, message} from 'antd'
import qs from 'qs'
import axios from 'axios'
import zhCN from 'antd/lib/locale/zh_CN';
const { Option } = Select;
const schoolClass = {
  初中团支部: ['初一', '初二', '初三'],
  高中团支部: ['高一', '高二', '高三'],
  大学团支部: ['大一', '大二', '大三','大四'],
}
interface IProps {

}

interface IState {
  targetKeys: any,
  selectedKeys: any,
  optionSchool: any[],
  schoolClass: any[],
  userSchool: string,
  userClass: string,
  disabled: boolean,
  yearData:any[]
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
          targetKeys: [],
          yearData:[],
          selectedKeys: [],
          optionSchool: [
            '初中团支部','高中团支部','大学团支部'
          ],
          schoolClass: [],
          userSchool: '',
          userClass: '',
          disabled:true
        }
    }
  componentDidMount() {
    // this.refer()
  }
  public onChange = (nextTargetKeys: any, direction: any, moveKeys: any) => {
      console.log('targetKeys:', nextTargetKeys);
      console.log('direction:', direction);
      console.log('moveKeys:', moveKeys);
      this.setState({
        targetKeys:nextTargetKeys
      })
    };
  
  public onSelectChange = (sourceSelectedKeys: any, targetSelectedKeys: any) => {
      console.log('sourceSelectedKeys:', sourceSelectedKeys);
      console.log('targetSelectedKeys:', targetSelectedKeys);
      this.setState({
        selectedKeys:[...sourceSelectedKeys, ...targetSelectedKeys]
      })
    };
  public schoolChange = (value:any) => {
    if (value ===undefined) {
      this.setState({
        userSchool: '',
        userClass: '',
        schoolClass: [],
        disabled:true
         })
    } else {
      this.setState({
        userSchool: value,
        userClass: schoolClass[value][0],
        schoolClass: schoolClass[value],
        disabled:false
      })
    }
  }
  public classChange = (value: any) => {
    this.setState({
      userClass: value
    })
  }
  //查询数据
  public refer = () => {
    if (this.state.userSchool) {
      if (this.state.userClass) {
        let referData = qs.stringify({
          userSchool: this.state.userSchool,
          userClass: this.state.userClass
        });
        axios.post("http://www.test.com/changeYear/selectAny.php", referData).then((res: any) => {
          if (res.data.code === 200) {
            this.setState({
              yearData: res.data.data.data
            })
          }
        })
      } else {
        message.error('请选择年级')
      }
    }else {
      message.error('请选择团支部')
    }
  }
  public changeYear = () => {
    let updateData = qs.stringify({
      userSchool: this.state.userSchool,
      userClass: this.state.userClass,
      list:[...this.state.targetKeys]
    });
    console.log(updateData);
    
    axios.post("http://www.test.com/changeYear/changeYear.php", updateData).then((res: any) => {
      if (res.data.code === 200) {
        this.setState({
          yearData: res.data.data.data
        })    
      }
    })
  }
    render() {
      return (
        <div>
          <div style={{fontFamily: "cursive", backgroundColor: "rgb(240, 226, 158)", color: "rgb(199, 148, 36)", height: "45px", fontSize: "20px", marginTop: "-24px",textAlign: "center",lineHeight: "45px", marginBottom: "30px"}}>请选择团支部以及年级进行对该年级的年度转接</div>
          <label htmlFor="">团支部：</label>  <Select
             value={this.state.userSchool}
             allowClear   
             style={{
               width: "15%",
             }}
             onChange={this.schoolChange}>
           { this.state.optionSchool.map((item:any,index:any) =>(
          <Option value={ item} key={index }>{item}</Option>
            ))}
            </Select>
            <label htmlFor="" style={{
              marginLeft:'50px'
            }}>年级：</label> <Select
             value={this.state.userClass}
             disabled={this.state.disabled}
             allowClear   
             style={{
             width: "15%"
             }}
             onChange={this.classChange}>
           { this.state.schoolClass.map((item:any,index:any) =>(
          <Option value={ item} key={index }>{item}</Option>
            ))}
          </Select>
            <Button type='primary' style={{ marginLeft: '50px' }} onClick={this.refer}>查询</Button>
          <ConfigProvider locale={zhCN}>
            <Transfer
              rowKey={record => record.list} 
              listStyle={{
                width: 2500,
                height: 485,
              }}
              style={{
                marginTop: '30px'
              }}
              dataSource={this.state.yearData}
              titles={['备选转接人员', '已选转接人员']}
              targetKeys={this.state.targetKeys}
              selectedKeys={this.state.selectedKeys}
              onChange={this.onChange}
              onSelectChange={this.onSelectChange}
              render={(item:any) => (
              <div >
               <span style={{position:'absolute'}}>{item.rootname}</span>
               <span style={{marginLeft:'150px'}}>{item.userSchool}</span>
               <span style={{marginLeft:'150px'}}>{item.userClass}</span>
               </div> )}
            />
          </ConfigProvider>
          <Button type='primary' style={{float:'right',marginTop:'10px'}} onClick={this.changeYear}>开始转接</Button>
          </div>
          );
    }

}