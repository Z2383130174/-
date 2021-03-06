import React from 'react'
// 引入编辑器组件
import BraftEditor from 'braft-editor'
import {  Card,}from 'antd'
// 引入编辑器样式
import 'braft-editor/dist/index.css'

export default class EditorDemo extends React.Component {

    state = {
        // 创建一个空的editorState作为初始值
        editorState: BraftEditor.createEditorState(null)
    }




    render () {

        const { editorState } = this.state
        return (
            <div className="my-component">
                <Card>
                <BraftEditor
                    value={editorState}
                /></Card>
            </div>
        )

    }

}