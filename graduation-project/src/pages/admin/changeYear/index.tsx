import { Component } from 'react'
import { Upload, Modal } from 'antd';
import axios from 'axios'
import { PlusOutlined } from '@ant-design/icons';
interface IProps {
    history:any
}

interface IState {
  previewVisible: boolean,
  previewImage: string,
  previewTitle: string,
  fileList: any
}
export default  class Main extends Component<IProps, IState>{
  constructor(props: IProps) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      previewTitle: '',
      fileList: []
    }
  }
  componentDidMount() {
    axios.post("http://www.test.com/selectPicture.php").then((res: any) => {
   console.log(res.data.data);
   

    })
  }
   public handleCancel = () => this.setState({ previewVisible: false });
   beforeUpload=(data:any)=>{
    return false;
   }
   public handlePreview = async (file:any) => {

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };
  
    public handleChange = ({ fileList }:any) => this.setState({ fileList });
  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
        return (
            <div>
            <Upload
          action="http://www.test.com/editPicture.php"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 4 ? null : uploadButton}
            </Upload>
            <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
            </div>
        );
    }

}









 

