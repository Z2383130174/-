/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-has-content */

import React, { Component } from 'react';
import { Carousel, Tabs,Popconfirm ,Modal,Row,Col,Input, message} from 'antd';
import { createFromIconfontCN } from '@ant-design/icons';
import qs from 'qs'
import axios from 'axios'
import newsOne from './3.jpg'
import newsTwo from './4.jpg'
import newsThree from './5.jpg'
import newsFour from './6.jpg'
import './index.css'
const { TabPane } = Tabs;
interface IProps {
    history:any
}

interface IState {
    newsData: any,
    isModalVisible: boolean,
    arr: any
    homenewsData: any,
    homeisModalVisible: boolean,
    homearr:any
}
const IconFont = createFromIconfontCN({
    scriptUrl: [
"//at.alicdn.com/t/font_1999223_dy1bdrs7sb9.js"
    ],
  });
export default class New extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            isModalVisible: false,
            arr: {
                title: '',
                date: '',
                keyword: '',
                pictureAddress: '',
                newsAddress:''
            },
            newsData: [],
            homeisModalVisible: false,
            homearr: {
                title: '',
                date: '',
                keyword: '',
                pictureAddress: '',
                newsAddress:''
            },
            homenewsData: [],
        }
    }
    componentDidMount() {
        this.getNews();
        this.homegetNews()
    }
    public getNews = () => { 
        axios.post("http://www.test.com/news/Abroad/select.php").then((res: any) => {
            if (res.data.code === 200) {
                this.setState({
                    newsData: res.data.data.data
                }, () => {
                    console.log(this.state.newsData);
                    
                })
            }
        }).catch((err)=> {
            console.log(err);
        })
    }
    public homegetNews = () => { 
        axios.post("http://www.test.com/news/home/select.php").then((res: any) => {
            if (res.data.code === 200) {
                this.setState({
                    homenewsData: res.data.data.data   
                })
            }
        }).catch((err)=> {
            console.log(err);
        })
    }
    public addNews = () => {
        this.setState({
            isModalVisible:true
        })
    }
    public homeaddNews = () => {
        this.setState({
            homeisModalVisible:true
        })
    }
    public handleCancel = () => {
        this.setState({
            isModalVisible: false,
            arr:[]
        })
    }
    public homehandleCancel = () => {
        this.setState({
            homeisModalVisible: false,
            homearr:[]
        })
    }
    public handleOk = () => {
        console.log(this.state.arr);
        if (this.state.arr.title&&this.state.arr.title.length>0) {
            if (this.state.arr.date&&this.state.arr.date.length>0) {
                if (this.state.arr.keyword&&this.state.arr.keyword.length>0) {
                    if (this.state.arr.pictureAddress&&this.state.arr.pictureAddress.length>0) {
                        if (this.state.arr.newsAddress&&this.state.arr.newsAddress.length>0) {
                            let addData = qs.stringify({
                                     ...this.state.arr
                              });  
                            axios.post("http://www.test.com/news/Abroad/Abroad.php", addData).then((res: any) => {
                                if (res.data.code === 200) {
                                    this.setState({
                                        isModalVisible: false,
                                        arr:[]
                                    }, () => {
                                        this.getNews()
                                    })
                                    message.success('添加成功')
                                }
                            }).catch((err)=> {
                                console.log(err);
                            })
                        } else {
                            message.warning('新闻网址不能为空')
                        }
                    } else {
                        message.warning('图片网址不能为空')
                    }
                } else {
                    message.warning('新闻关键字不能为空')
                }
            } else {
                message.warning('新闻日期不能为空')
            }
        } else {
            message.warning('新闻标题不能为空')
        }
    }
    public homehandleOk = () => {
        console.log(this.state.homearr);
        if (this.state.homearr.title&&this.state.homearr.title.length>0) {
            if (this.state.homearr.date&&this.state.homearr.date.length>0) {
                if (this.state.homearr.keyword&&this.state.homearr.keyword.length>0) {
                    if (this.state.homearr.pictureAddress&&this.state.homearr.pictureAddress.length>0) {
                        if (this.state.homearr.newsAddress&&this.state.homearr.newsAddress.length>0) {
                            let addData = qs.stringify({
                                     ...this.state.homearr
                              });  
                            axios.post("http://www.test.com/news/home/home.php", addData).then((res: any) => {
                                if (res.data.code === 200) {
                                    this.setState({
                                        homeisModalVisible: false,
                                        homearr:[]
                                    }, () => {
                                        this.homegetNews()
                                    })
                                    message.success('添加成功')
                                }
                            }).catch((err)=> {
                                console.log(err);
                            })
                        } else {
                            message.warning('新闻网址不能为空')
                        }
                    } else {
                        message.warning('图片网址不能为空')
                    }
                } else {
                    message.warning('新闻关键字不能为空')
                }
            } else {
                message.warning('新闻日期不能为空')
            }
        } else {
            message.warning('新闻标题不能为空')
        }
    }
    public titleChange = (e:any) => {
        this.setState({
            arr: {
                 ...this.state.arr,
                 title:e.target.value
            }
        })
    }
    public hometitleChange = (e:any) => {
        this.setState({
            homearr: {
                 ...this.state.homearr,
                 title:e.target.value
            }
        })
    }
    public dateChange = (e:any) => {
        this.setState({
            arr: {
                ...this.state.arr,
                date:e.target.value
            }
        })
    }
    public homedateChange = (e: any) => {
        this.setState({
            homearr: {
                ...this.state.homearr,
                date:e.target.value
            }
        })
    }
    public keywordChange = (e:any) => {
        this.setState({
            arr: {
                ...this.state.arr,
                keyword:e.target.value
            }
        })
    }
    public homekeywordChange = (e:any) => {
        this.setState({
            homearr: {
                ...this.state.homearr,
                keyword:e.target.value
            }
        })
    }
    public pictrueAddressChange =(e:any) => {
        this.setState({
            arr: {
                ...this.state.arr,
                pictureAddress:e.target.value
            }
        })
    }
    public homepictrueAddressChange =(e:any) => {
        this.setState({
            homearr: {
                ...this.state.homearr,
                pictureAddress:e.target.value
            }
        })
    }
    public newsAddressChange = (e:any) => {
        this.setState({
            arr: {
                ...this.state.arr,
                newsAddress:e.target.value
            }
        })
    }
    public homenewsAddressChange = (e:any) => {
        this.setState({
            homearr: {
                ...this.state.homearr,
                newsAddress:e.target.value
            }
        })
    }
    public delete = (index:number) => {
        let deleteData = qs.stringify({
                 list:this.state.newsData[index].list
        });
        axios.post("http://www.test.com/news/Abroad/delete.php", deleteData).then((res: any) => {
            if (res.data.code === 200) {
                message.success('删除新闻成功')
                this.getNews()
            }
        })
    }
    public homedelete = (index:number) => {
        let deleteData = qs.stringify({
                 list:this.state.homenewsData[index].list
        });
        axios.post("http://www.test.com/news/home/delete.php", deleteData).then((res: any) => {
            if (res.data.code === 200) {
                message.success('删除新闻成功')
                this.homegetNews()
            }
        })
    }
    public start = (index:any) => {
        let AddNewsData = qs.stringify({
                 ...this.state.newsData[index]
        });
        axios.post("http://www.test.com/news/news.php", AddNewsData).then((res: any) => {
            if (res.data.code === 200) {
                message.success('添加要闻库成功')
            }
        })
    }
    public homestart = (index:any) => {
        let AddNehomesData = qs.stringify({
                 ...this.state.homenewsData[index]
        });
        console.log(AddNehomesData);
        
        axios.post("http://www.test.com/news/news.php", AddNehomesData).then((res: any) => {
            if (res.data.code === 200) {
                message.success('添加要闻库成功')
            }
        })
    }
    public newsHttp = (index:number) => {
        let arr=this.state.newsData[index]
        this.props.history.push({ pathname: '/admin/NewsConstruction/News/NewsDetails', url: {url:arr.newsAddress}})
    }
    public homenewsHttp = (index:number) => {
        let arr=this.state.homenewsData[index]
        this.props.history.push({ pathname: '/admin/NewsConstruction/News/NewsDetails', url: {url:arr.newsAddress}})
    }
    public keywordClick = (ite:any) => {
        let url = "https://search.cctv.com/search.php?qtext=" + ite
        this.props.history.push({ pathname: '/admin/NewsConstruction/News/NewsDetails', url: {url:url}})
    }
    public homekeywordClick = (ite:any) => {
        let url = "https://search.cctv.com/search.php?qtext=" + ite
        this.props.history.push({ pathname: '/admin/NewsConstruction/News/NewsDetails', url: {url:url}})
    }
    render() {
        const addStyle = {
            style: {  width: "80%",
            marginLeft:'34px',
          }
          }
         return (
                <div className="news">
                     <div className="card-container">
                <Tabs type="card">
                            <TabPane tab="国外新闻" key="1">
                                <Carousel autoplay effect="fade" >
                                 <div>
                                     <img src={ newsOne} alt=""
                                         style={{
                                             width:'120%',
                                             height: '300px',
                                         }}/>
                                    </div>
                                    <div>
                                     <img src={ newsTwo} alt=""
                                         style={{
                                             height: '300px',
                                         }}/>
                                    </div>  <div>
                                     <img src={newsThree} alt=""
                                         style={{
                                             height: '300px',
                                         }}/>
                                    </div>  <div>
                                     <img src={ newsFour} alt=""
                                         style={{
                                             height: '300px',
                                         }}/>
                                    </div>
                                </Carousel> 
                             {this.state.newsData.map((item:any,index:number) => (
                                        (index+1) %4===0 ? <ul>
                                        <li className="lastLi">
                                         <div className="image" key={ index}>
                                                <a href="javascript:;">
                                                    <img src={ item.pictureAddress} alt="" onClick={()=>{this.newsHttp(index)} }/>
                                            </a>
                                            <div className="text">
                                                 <a  href="javascript:;" onClick={()=>{this.newsHttp(index)} }>{ item.title}</a>
                                            </div>
                                             <div className="bottom">
                                                 <span className="keyword">
                                                 {
                                                     item.keyword.split(",").map((ite:any)=>(
                                                        <a  href="javascript:;"  onClick={() => { this.keywordClick(ite)}}>{ ite}</a>
                                                    ))}
                                                    </span>
                                                <span className="date" >{ item.date}</span>
                                                        <div className="share">
                                                            <a className="weixin" ></a>  
                                                            <a className="qq" ></a></div>
                                                            <Popconfirm title="确认删除此新闻"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.delete(index)
                                                                    }}>
                                                        <IconFont type="iconcangpeitubiao_shanchu" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "28px",
                                                            top: "44px",
                                                        }} />
                                                            </Popconfirm>
                                                            <Popconfirm title="添加此新闻至要闻库"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.start(index)
                                                                    }}>
                                                    <IconFont type="iconxingzhuanggongnengtubiao-" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "0px",
                                                            top: "44px",
                                                        }}/>
                                                        </Popconfirm>
                                                    </div>
                                        </div>
                                            </li>
                                        </ul>:<ul>
                                        <li>
                                        <div className="image" key={ index}>
                                                <a href="javascript:;">
                                                    <img src={ item.pictureAddress} alt="" onClick={()=>{this.newsHttp(index)} }/>
                                            </a>
                                            <div className="text">
                                                 <a href="javascript:;" onClick={()=>{this.newsHttp(index)} }>{ item.title}</a>
                                            </div>
                                                 <div className="bottom">
                                                     <span className="keyword">
                                                    {    item.keyword.split(",").map((ite:any)=>(
                                                         <a  href="javascript:;"  onClick={() => { this.keywordClick(ite)}}>{ ite}</a>
                                                    ))}
                                                         </span>
                                                <span className="date" >{ item.date}</span>
                                                        <div className="share">
                                                            <a  className="weixin" data-fx="wx-btn1" title="微信" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.11"></a>  
                                                            <a  className="qq" data-fx="qq-btn" title="QQ" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.14"></a></div>
                                                            <Popconfirm title="确认删除此新闻"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.delete(index)
                                                                    }}>
                                                        <IconFont type="iconcangpeitubiao_shanchu" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "28px",
                                                            top: "44px",
                                                        }} />
                                                            </Popconfirm>
                                                            <Popconfirm title="添加此新闻至要闻库"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.start(index)
                                                                    }}>
                                                    <IconFont type="iconxingzhuanggongnengtubiao-" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "0px",
                                                            top: "44px",
                                                        }}/>
                                                        </Popconfirm>
                                                    </div>
                                        </div>
                                            </li>
                                        </ul> ))}

                         {  this.state.newsData.length < 8 ?((this.state.newsData.length===3||this.state.newsData.length===7)?<ul>
                               <li className="lastLi">
                                     <IconFont type="icontianjiajiahaowubiankuang" style={{
                                         fontSize: '100px',
                                         position: 'absolute',
                                         right: "90px",
                                         top: "105px",
                                     }} onClick={ this.addNews}/>
                                      </li>
                             </ul>:<ul>
                               <li>
                                     <IconFont type="icontianjiajiahaowubiankuang" style={{
                                         fontSize: '100px',
                                         position: 'absolute',
                                         right: "90px",
                                         top: "105px",
                                     }} onClick={ this.addNews}/>
                                      </li>
                             </ul>) : null}
                             <Modal title="添加新闻" visible={this.state.isModalVisible} onOk={this.handleOk} onCancel={this.handleCancel}>
                             <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻标题：</label>
                  <Input
                    value={this.state.arr.title}
                    onChange={this.titleChange}
                    {...addStyle}
                ></Input></Col>
                         </Row>
                        <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻日期,以-分割</label>
                  <Input
                    value={this.state.arr.date}
                     onChange={this.dateChange}
                    {...addStyle}
                ></Input></Col>
                                 </Row>
                                 <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻关键字，多个关键字以逗号分割：</label>
                  <Input
                    value={this.state.arr.keyword}
                    onChange={this.keywordChange}
                    {...addStyle}
                ></Input></Col>
              </Row>
                    <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻照片网址：</label>
                  <Input
                    value={this.state.arr.pictureAddress}
                    onChange={this.pictrueAddressChange}
                    {...addStyle}
                ></Input></Col>
                       </Row>
                      <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻网址：</label>
                  <Input
                    value={this.state.arr.newsAddress}
                    onChange={this.newsAddressChange}
                    {...addStyle}
                ></Input></Col>
                      </Row>
      </Modal>
                  </TabPane>
                  <TabPane tab="国内新闻" key="2">
  
                              
                  <Carousel autoplay effect="fade" >
                                 <div>
                                     <img src={ newsOne} alt=""
                                         style={{
                                             width:'120%',
                                             height: '300px',
                                         }}/>
                                    </div>
                                    <div>
                                     <img src={ newsTwo} alt=""
                                         style={{
                                             height: '300px',
                                         }}/> 
                                    </div>  <div>
                                     <img src={newsThree} alt=""
                                         style={{
                                             height: '300px',
                                         }}/>
                                    </div>  <div>
                                     <img src={ newsFour} alt=""
                                         style={{
                                             height: '300px',
                                         }}/>
                                    </div>  
                                </Carousel> 
                             {this.state.homenewsData.map((item:any,index:number) => (
                                        (index+1) %4===0 ? <ul>
                                        <li className="lastLi">
                                        <div className="image" key={ index}>
                                                <a href="javascript:;">
                                                    <img src={ item.pictureAddress} alt="" onClick={()=>{this.homenewsHttp(index)} }/>
                                            </a>
                                            <div className="text">
                                                 <a  href="javascript:;" onClick={()=>{this.homenewsHttp(index)} }>{ item.title}</a>
                                            </div>
                                             <div className="bottom">
                                                 <span className="keyword">
                                                 {
                                                     item.keyword.split(",").map((ite:any)=>(
                                                        <a  href="javascript:;"  onClick={() => { this.keywordClick(ite)}}>{ ite}</a>
                                                    ))}
                                                    </span>
                                                <span className="date" >{ item.date}</span>
                                                        <div className="share">
                                                            <a className="weixin" data-fx="wx-btn1" title="微信" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.11"></a>  
                                                            <a className="qq" data-fx="qq-btn" title="QQ" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.14"></a></div>
                                                            <Popconfirm title="确认删除此新闻"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.homedelete(index)
                                                                    }}>
                                                        <IconFont type="iconcangpeitubiao_shanchu" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "28px",
                                                            top: "44px",
                                                        }} />
                                                            </Popconfirm>
                                                            <Popconfirm title="添加此新闻至要闻库"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.homestart(index)
                                                                    }}>
                                                    <IconFont type="iconxingzhuanggongnengtubiao-" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "0px",
                                                            top: "44px",
                                                        }}/>
                                                        </Popconfirm>
                                                    </div>
                                        </div>
                                            </li>
                                        </ul>:<ul>
                                        <li>
                                        <div className="image" key={ index}>
                                                <a href="javascript:;">
                                                    <img src={ item.pictureAddress} alt="" onClick={()=>{this.homenewsHttp(index)} }/>
                                            </a>
                                            <div className="text">
                                                 <a  href="javascript:;" onClick={()=>{this.homenewsHttp(index)} }>{ item.title}</a>
                                            </div>
                                                 <div className="bottom">
                                                     <span className="keyword">
                                                    {    item.keyword.split(",").map((ite:any)=>(
                                                        <a  href="javascript:;"  onClick={() => { this.homekeywordClick(ite)}}>{ ite}</a>
                                                    ))}
                                                         </span>
                                                <span className="date" >{ item.date}</span>
                                                        <div className="share">
                                                            <a  className="weixin" data-fx="wx-btn1" title="微信" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.11"></a>  
                                                            <a  className="qq" data-fx="qq-btn" title="QQ" data-spm-anchor-id="C94212.PBi4fu284lJm.EqrnPf7WDfbU.14"></a></div>
                                                            <Popconfirm title="确认删除此新闻"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.homedelete(index)
                                                                    }}>
                                                        <IconFont type="iconcangpeitubiao_shanchu" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "28px",
                                                            top: "44px",
                                                        }} />
                                                            </Popconfirm>
                                                            <Popconfirm title="添加此新闻至要闻库"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    onCancel={() => {
                                                                    console.log("用户取消删除")
                                                                    }}
                                                                    onConfirm={() => {      
                                                                        this.homestart(index)
                                                                    }}>
                                                    <IconFont type="iconxingzhuanggongnengtubiao-" style={{
                                                            fontSize: '20px',
                                                            position: 'absolute',
                                                            right: "0px",
                                                            top: "44px",
                                                        }}/>
                                                        </Popconfirm>
                                                    </div>
                                        </div>
                                            </li>
                                        </ul> ))}

                         {  this.state.homenewsData.length < 8 ?((this.state.homenewsData.length===3||this.state.newsData.length===7)?<ul>
                               <li className="lastLi">
                                     <IconFont type="icontianjiajiahaowubiankuang" style={{
                                         fontSize: '100px',
                                         position: 'absolute',
                                         right: "90px",
                                         top: "105px",
                                     }} onClick={ this.homeaddNews}/>
                                      </li>
                             </ul>:<ul>
                               <li>
                                     <IconFont type="icontianjiajiahaowubiankuang" style={{
                                         fontSize: '100px',
                                         position: 'absolute',
                                         right: "90px",
                                         top: "105px",
                                     }} onClick={ this.homeaddNews}/>
                                      </li>
                             </ul>) : null}
                             <Modal title="添加新闻" visible={this.state.homeisModalVisible} onOk={this.homehandleOk} onCancel={this.homehandleCancel}>
                             <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻标题：</label>
                  <Input
                    value={this.state.homearr.title}
                    onChange={this.hometitleChange}
                    {...addStyle}
                ></Input></Col>
                         </Row>
                        <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻日期,以-分割</label>
                  <Input
                    value={this.state.homearr.date}
                     onChange={this.homedateChange}
                    {...addStyle}
                ></Input></Col>
                                 </Row>
                                 <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻关键字，多个关键字以逗号分割：</label>
                  <Input
                    value={this.state.homearr.keyword}
                    onChange={this.homekeywordChange}
                    {...addStyle}
                ></Input></Col>
              </Row>
                    <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻照片网址：</label>
                  <Input
                    value={this.state.homearr.pictureAddress}
                    onChange={this.homepictrueAddressChange}
                    {...addStyle}
                ></Input></Col>
                       </Row>
                      <Row>
                <Col span={18} offset={3}><label className="FormLabelStyle">请输入新闻网址：</label>
                  <Input
                    value={this.state.homearr.newsAddress}
                    onChange={this.homenewsAddressChange}
                    {...addStyle}
                ></Input></Col>
                      </Row>
      </Modal>
                  </TabPane>
                </Tabs>
              </div>
               </div>
        );
    }
}
