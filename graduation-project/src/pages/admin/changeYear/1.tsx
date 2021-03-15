

import React from "react";
import { Upload, Button, message}from "antd";
import axios from "axios";
 
 
class index extends React.Component {
  state = {url:''};
 
  // 新打开界面
  componentDidMount() {
    axios.post("http://www.test.com/selectPicture.php").then((res: any) => {
      this.setState({
        url:res.data.data.data[1].picture
      }, () => {
        console.log(this.state.url);
        
      })
    })
  }
 
  onChange = ({ file }:any) => {
    if (file.status === "done") {
      message.success(`${file.name} file uploaded successfully`);
      console.log(file);
 
      // this.props.onOk({ code, msg, data });
    } else if (file.status === "error") {
      message.error(`${file.name} file upload failed.`);
    }
  };
 
  // 渲染
  render() {
    const props = {
      name: "file",
      action: "http://www.test.com/editPicture.php",
      showUploadList: false,

      onChange: this.onChange
    };
 
    return (
 
      <div>
             <Upload {...props}>
        <Button
          style={{ marginLeft: 20 }}
          onClick={() => {
            console.log("hhhh");
          }}
        >
          从文件导入
        </Button>
      </Upload>
           <img src={this.state.url} alt=""/>
 </div>
      // <UploadFile url='/api/login/upload' onOk={this.onOk.bind(this)} />
    );
  }
}
 
export default index;