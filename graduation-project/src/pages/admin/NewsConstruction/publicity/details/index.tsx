import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import zoomdata from './zongze'
import firstdata from './firstdata'
import seconddata from './seconddata'
import thirddata from './thirddata'
import fourdata from './fourdata'
import fivedata from './fivedata'
import sixdata from './sixdata'
import sevendata from './sevendata'
import eightdata from './eightdata'
import ninedata from './ninedata'
import tendata from './tendata'
interface IProps {
    location:any
}

interface IState {

}
class News extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {

        }
      }
    render() {
        let data=zoomdata
        if (this.props.location.query.num) {
            if (this.props.location.query.num === 0) {
                    data= zoomdata
            }else if (this.props.location.query.num === 1) {
                    data= firstdata
            } else if (this.props.location.query.num === 2) {
                    data= seconddata
            } else if (this.props.location.query.num === 3) {
                    data= thirddata
            } else if (this.props.location.query.num === 4) {
                    data= fourdata
            } else if (this.props.location.query.num === 5) {
                    data= fivedata
            } else if (this.props.location.query.num === 6) {
                    data=sixdata
            } else if (this.props.location.query.num === 7) {
                    data= sevendata
            } else if (this.props.location.query.num === 8) {
                    data= eightdata
            }else if (this.props.location.query.num === 9) {
                    data= ninedata
            } else if (this.props.location.query.num === 10) {
                    data= tendata
            }
        }
     return (
     <iframe 
    title="resg"
    srcDoc={data}
    style={{ width: '106%', border: '0px', height: '105%' ,marginLeft:'-30px'}}
    scrolling="auto"
  ></iframe>
        );
    }
}
export default withRouter(News as any)