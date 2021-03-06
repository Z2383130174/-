/* eslint-disable jsx-a11y/iframe-has-title */
import { Component } from 'react'
interface IProps {
    history: any,
    location:any
}

interface IState {
   
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
    }
    render() {
        return (
            <div>
                {/* <iframe src={ this.props.location.url.url} */}
                <iframe src={ this.props.location.url.url}
                    style={{
                        width:"110%",
                        height: "640px",
                        margin: "-25px -9px 0px -58px",
                    }}
  ></iframe>
            </div>
        );
    }

}