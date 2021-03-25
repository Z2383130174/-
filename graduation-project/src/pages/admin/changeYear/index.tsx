import { Upload, Button, } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React from 'react';
import axios from 'axios';

export default class Demo extends React.Component {
  state = {
    fileList: [],
    uploading: false,
  };

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach(file => {
      formData.append('files[0]', file);
    });

    this.setState({
      uploading: true,
    });

    // You can use any AJAX library you like
    axios.post("http://www.test.com/gonggao/selectList.php", formData).then((res: any) => {
      
    })
  }
    

  render() {
    const { uploading, fileList } = this.state;
    const props = {
      beforeUpload: (file:any) => {
        this.setState(state => ({
          fileList:[file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        <Upload {...props}    >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? 'Uploading' : 'Start Upload'}
        </Button>
      </>
    );
  }
}
