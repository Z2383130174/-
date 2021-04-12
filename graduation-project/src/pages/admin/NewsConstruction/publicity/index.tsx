import React, { Component } from 'react'
import './index.css'
interface IProps {
    history:any
}

interface IState {
   
}
export default class Login extends Component<IProps, IState>{
constructor(props: IProps) {
        super(props)
        this.state = {
    
        }
    }
    public click = (num:number) => { 
        this.props.history.push({ pathname: '/admin/NewsConstruction/details', query: {num:num}})
    }
     render() {
        return (
            <div className='root'>
                <div className='main'> 
                    <h3>公示</h3>
    <ul>
<li><span>2021-04-02 15:46:00</span><a target="_blank" onClick={() => { this.click(0)} }>总　则</a></li>
<li><span>2021-04-02 15:47:00</span><a  target="_blank" onClick={() => { this.click(1)}}>第一章　团员</a></li>
<li><span>2021-04-02 15:48:00</span><a  target="_blank" onClick={() => { this.click(2)}}>第二章　团的组织制度</a></li>
<li><span>2021-04-02 15:48:00</span><a  target="_blank" onClick={() => { this.click(3)}}>第三章　团的中央组织</a></li>
<li><span>2021-04-02 15:50:00</span><a  target="_blank" onClick={() => { this.click(4)}}>第四章　团的地方组织、解放军和武警部队中团的组织</a></li>
<li><span>2021-04-02 15:51:00</span><a  target="_blank" onClick={() => { this.click(5)}}>第五章　团的基层组织</a></li>
<li><span>2021-04-02 15:52:00</span><a  target="_blank" onClick={() => { this.click(6)}}>第六章　团的干部</a></li>
<li><span>2021-04-02 15:53:00</span><a  target="_blank" onClick={() => { this.click(7)}}>第七章　团的纪律</a></li>
<li><span>2021-04-02 17:30:00</span><a  target="_blank" onClick={() => { this.click(8)} }>第八章　团旗、团徽、团歌</a></li>
<li><span>2021-04-02 15:57:00</span><a  target="_blank" onClick={() => { this.click(9)}}>第九章　团的经费</a></li>
<li><span>2021-04-02 15:57:00</span><a  target="_blank" onClick={() => { this.click(10)}}>第十章　团同少年先锋队的关系</a></li>
</ul>
                </div>
            </div>

        )
    }
}
