import { Component, } from 'react'
import { message, Card, Button, Divider, Spin, Comment, Input, Tooltip, Modal, } from 'antd'
import { LikeTwoTone,DownCircleTwoTone,UpCircleTwoTone,DeleteTwoTone,SnippetsTwoTone} from '@ant-design/icons';
import BraftEditor from 'braft-editor'
import moment from 'moment';
import axios from 'axios'
import cookie from 'react-cookies'
import qs from 'qs';
const { TextArea } = Input;
function createMarkup(html:any) {
    return { __html: html };
  }
interface IProps {
    history: any,
    location:any
}

interface IState {
    editorState: any,   //留言内容
    messages: any,   //留言列表
    isShowEditor: boolean,
    replyPid: string,//回复第几条的父级id
    replyContent: string,  //回复内容
    replyUser: any, //回复的对象
    expandIds: any,  //展开的id列表
    placeholder: string,  //回复的placeholder
    loading: boolean,
    pagination: any,
    root:any,
}
export default  class Main extends Component<IProps, IState>{
    constructor(props: IProps) {
        super(props)
        this.state = {
            root:[],
            editorState: BraftEditor.createEditorState(null),   //留言内容
            messages: [],   //留言列表
            isShowEditor: false,
            replyPid: '',//回复第几条的父级id
            replyContent: '',  //回复内容
            replyUser: null, //回复的对象
            expandIds: [],  //展开的id列表
            placeholder: '',  //回复的placeholder
            loading: false,
            pagination: {
              total: 100,
              current: 1,  //前台分页是从1开始的，后台分页是从0开始的，所以要注意一下
              pageSize: 10,
              showQuickJumper: true,
              showSizeChanger: true
            }
        }
    }
       //点赞功能
    onLike = (item: any) => {
        let addLikeData = qs.stringify({
            id: item.id,
            likeNum:parseInt(item.likeNum)+1
       });  
        let url=''
        item.pid ? url = "http://www.test.com/forum/childrenLikeNum.php":url="http://www.test.com/forum/LikeNum.php"
        axios.post(url, addLikeData).then((res: any) => {
            if (res.data.code=== 200) {
                message.success('点赞评论成功')
                this.init()
            }
         })

            // notification.warning({
            //     message: '提示',
            //     description: '暂不支持点赞功能',
            //     duration: 3,
            //     // icon: <Icon type="smile" />,
            // })
        }
      // 展开回复的textarea
    public showReply = (item: any, pid: any) => {
        this.setState({
            replyPid: pid,
            replyContent: '',
            replyUser: item.userName,
            placeholder:this.state.root.rootname+"回复"+item.userName      
        })
    }
  renderActions = (item:any, pid:any) => {
    let actions = [
        <span>
            <Tooltip title="回复时间">
                {moment( parseInt(item.createTime)).format('YYYY-MM-DD HH:mm:ss')}
            </Tooltip>
        </span>,
        <span>
            <Tooltip title="赞">
                <span onClick={()=>this.onLike(item)}>
                    <LikeTwoTone />&nbsp;赞<span>{ item.likeNum}</span>
                </span>
            </Tooltip>
        </span>,
        <span >
            <Tooltip title="回复">
                <span onClick={() => this.showReply(item, pid)}>
                    <span /><SnippetsTwoTone />&nbsp;回复
               </span>
            </Tooltip>
        </span>
    ]
    //只有管理员或者本人才可删除
    if (this.state.root.rootname===item.userId ||this.state.root.jurisdiction==='管理员')
    if (this.state.root) {
        actions.splice(2, 0, (
            <span >
                <Tooltip title="删除">
                    <span onClick={() => this.onDelete(item)}>
                    <DeleteTwoTone />&nbsp;删除
                    </span>
                </Tooltip>
            </span>
        ))
    }
    return actions
    }
       // 删除回复
       public onDelete = async (item:any) => {      console.log(item);
            Modal.confirm({
                title: '提示',
                content: `确认删除该留言${item.children && item.children.length ? '及其底下的回复' : ''}吗？`,
                onOk: async () => {
                    let deleteData = qs.stringify({
                        id:item.id
                   });  
                    let url=''
                    item.children ? url = "http://www.test.com/forum/delete.php":url="http://www.test.com/forum/childrendelete.php"
                    axios.post(url, deleteData).then((res: any) => {
                        if (res.data.code=== 200) {
                            message.success('删除评论成功')
                            this.init()
                        }
                     })
                },
            });
        }
    componentDidMount() {
        this.setState({
            root: cookie.load('root')
        }, () => {
            let loginData = qs.stringify({
                username: this.state.root.id,
                password:this.state.root.password
              });  
               axios.post("http://www.test.com/adminuser/login.php", loginData).then((res: any) => {
                 this.setState({
                   root: {
                     ...this.state.root,
                     picture:res.data.data.data.picture
                   }
                 })
             this.init()
               })
        })

    }
    public init = () => {
        axios.post("http://www.test.com/forum/select.php").then((res: any) => {   
            if (res.data.code === 200) {
                const arr = res.data.data.data.map((item: any) => {
                 item.children = []
                   return item 
                })     
                axios.post("http://www.test.com/forum/childrenSelect.php").then((res: any) => {
                    if (res.data.code === 200) {
                        const arr1 = arr.map((ite: any) => {
                            // eslint-disable-next-line array-callback-return
                            res.data.data.data.map((i: any) => {    
                                if (ite.id === i.pid) {
                                    if (ite.children.length < 0) {
                                        ite.children.concat(i)                                 
                                    } else {
                                        ite.children.push(i)
                                    }
                                }  
                            })
                            return ite
                        })                 
                        this.setState({
                            messages:arr1
                        })
                     }
                })

            } }).catch((err) =>{
            console.log(err); 
          })
    }
    //发言讨论
    public sendMessage = () => {
        const editorState = this.state.editorState
        if (editorState.isEmpty()) {
            message.warning('请先输入内容')
            return
        }
        const htmlContent = this.state.editorState.toHTML()
           let addData = qs.stringify({
               content: htmlContent,
               createTime: Date.now(),
               likeNum: 0,
               userName: this.state.root.rootname,
               children: [],
               picture:this.state.root.picture
          });  
              axios.post("http://www.test.com/forum/submit.php",addData).then((res: any) => {
                  if (res.data.code === 200) {
                      message.success("发表评论成功")
                      this.setState({
                          isShowEditor:!this.state.isShowEditor
                      })
                     this.init()
                  }
               })
    }

    //取消发言
    public closeMessage = () => {
        this.setState({
            isShowEditor:!this.state.isShowEditor
        })
    }
    //发言内容
    public handleMessageChange = (editorState:any) => {
        this.setState({
            editorState
        })
    }
    public  closeReply = () => {
        this.setState({
            replyPid: '',
            replyContent: '',
            replyUser: '',
            placeholder: ''
        })
       }

    public openBraftEditor = () => {
        this.setState({
            isShowEditor:!this.state.isShowEditor
        })
    }
    //提交评论
    public confirmReply = (item: any) => {
        const replyContent = this.state.replyContent
        if (!replyContent) {
            message.warning('请输入回复内容')
            return
        }
        let childrenaddData = qs.stringify({
            content: replyContent,
            pid: this.state.replyPid,
            createTime: Date.now(),
            likeNum: 0,
            userName: this.state.root.rootname,
            targetUserName: this.state.replyUser,
            picture:this.state.root.picture
        })
        axios.post("http://www.test.com/forum/childrenSubmit.php",childrenaddData).then((res: any) => {
            if (res.data.code === 200) {
                this.closeReply()
                message.success("回复评论成功")
               this.init()
            }
         })
    }
     // 折叠回复
    public foldReply = (item:any) => {
        const list = this.state.expandIds.slice()
        const index = list.findIndex((i:any) => i === item.id)
        list.splice(index, 1)
        this.setState({
            expandIds: list
        })
    }
    // 展开回复
    public expandReply = (item:any) => {
        this.setState({
            expandIds: [...this.state.expandIds, item.id]
        })
    }
    // 回复输入框的onChange
          public handleReplyChange = (e:any) => {
            this.setState({
                replyContent: e.target.value
            })
          }
    render() {
        const { isShowEditor, messages, editorState, replyPid, replyContent, expandIds, placeholder, loading, pagination } = this.state
        const hooks = {
            'toggle-link': ({ href, target}:any) => {
                const pattern = /^((ht|f)tps?):\/\/([\w-]+(\.[\w-]+)*\/?)+(\?([\w\-.,@?^=%&:/~+#]*)+)?$/
                if (pattern.test(href)) {
                    return { href, target }
                }
                message.warning('请输入正确的网址')
                return false
            }
        }
        const controls = ['undo', 'redo', 'clear', 'separator', 'bold', 'text-color', 'blockquote', 'code', 'emoji', 'separator', 'link', 'separator', 'media']
        return (
            <div>
                 <Card bordered={false} bodyStyle={{ paddingTop: 0 }}>
                {
                        isShowEditor ?
                        <div style={{ marginTop: 10 }}>        <BraftEditor
                                            hooks={hooks}
                                            controls={controls}
                                            contentStyle={{ height: 210, boxShadow: 'inset 0 1px 3px rgba(0,0,0,.1)' }}
                                            value={editorState}
                                            // media={{ uploadFn: this.myUploadFn }}
                                            onChange={this.handleMessageChange}
                            />
                                      <Button type='primary' onClick={this.sendMessage}>发表</Button>&emsp;
                                <Button onClick={this.closeMessage}>取消</Button>
                    </div>:<Button onClick={this.openBraftEditor}>我要讨论</Button>}
                
                    <Divider />
                    <Spin spinning={loading} style={{ position: 'fixed', top: '50%', left: '50%' }} />
                    <div>
                    {
                            Array.isArray(messages) && messages.map((item: any, index: any) => (
                                <Comment
                                    key={item.id}
                                    author={<span style={{ fontSize: 16 }}>{item.userName}</span>}
                                    avatar={<img className='avatar-img' src={ item.picture?item.picture:"http://47.99.130.140:8888/public/images/default.png"} alt='avatar' />}
                                    content={<div className='info-box braft-output-content' dangerouslySetInnerHTML={createMarkup(item.content)} />}
                                    actions={this.renderActions(item, item.id)}
                                    datetime={`第${pagination.total - (pagination.current - 1) * pagination.pageSize - index}楼`}
                                >
                                    {item.children?item.children.slice(0, expandIds.includes(item.id) ? item.children.length : 1).map((i:any) => (
                                        <Comment
                                            key={i.id}
                                            author={<span style={{ fontSize: 15 }}>{i.userName} 回复 {i.targetUserName}</span>}
                                            avatar={<img className='avatar-img-small' src={ i.picture?i.picture:"http://47.99.130.140:8888/public/images/default.png"} alt='avatar' />}
                                            content={<div className='info-box' dangerouslySetInnerHTML={createMarkup(i.content)} />}
                                            actions={this.renderActions(i, item.id)}
                                        />
                                    )) : null}
                                    <div className='toggle-reply-box' style={{ display: item.children?(item.children.length >1 ? 'block' : 'none'):'none' }}>
                                        {
                                            expandIds.includes(item.id) ? (
                                                <span onClick={() => this.foldReply(item)}>收起全部{item.children?item.children.length:0}条回复 <UpCircleTwoTone /></span>
                                            ) : (
                                                    <span onClick={() => this.expandReply(item)}>展开全部{item.children?item.children.length:0}条回复 <DownCircleTwoTone /></span>
                                                )
                                        }
                                    </div>
                                    {replyPid === item.id && (
                                        <div style={{ width: '70%', textAlign: 'right' }}>
                                            <TextArea rows={4} style={{ marginBottom: 10 }} value={replyContent} onChange={this.handleReplyChange} placeholder={placeholder} />
                                            <Button size='small' onClick={this.closeReply}>取消</Button>&emsp;
                                        <Button size='small' type='primary' onClick={() => this.confirmReply(item)}>回复</Button>
                                        </div>
                                    )}
                                </Comment>
                            ))
                        }
                    </div>
                    </Card>
            </div>
        );
    }

}