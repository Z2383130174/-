/* eslint-disable jsx-a11y/iframe-has-title */
import { Component } from 'react'
import { Button } from 'antd'
import { RollbackOutlined } from '@ant-design/icons';
interface IProps {
    history: any,
    location:any
}

interface IState {
   
}
export default class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }
    public goback = () => {
        if (this.props.location.url.list === 1) {
            this.props.history.push({ pathname: "/admin/NewsConstruction/News", url: {list:"1"}})
        } else if (this.props.location.url.list === 2) {
            this.props.history.push({ pathname: "/admin/NewsConstruction/News", url: {list:"2"}})
        }
    }
    render() {
        return (
            <div>
                <Button type="primary" style={{
                    position: "fixed",
                    top: "108px",
                    left: "200px"
                }} onClick={this.goback} icon={ <RollbackOutlined />}>返回新闻界面</Button>
                {/* <iframe src={ this.props.location.url.url} */}
                <iframe src={ this.props.location.url.url}
                    style={{
                        width:"110%",
                        height: "640px",
                        margin: "-25px -9px 0px -58px",
                        overflowX:"hidden"
                    }}
  ></iframe>
            </div>
        );
    }

}