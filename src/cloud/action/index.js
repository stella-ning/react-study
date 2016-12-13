import React from 'react';
import {Icon,Modal,Input} from 'antd';
var Action = React.createClass({
	render:function(){
		const {newValue,onChange,onCancel,visible,type,onRename,onNewFolder} = this.props
		var title = this.getTitle()
        var onOK = this.getOk()
		return(
			<div>
				<Modal
					title={title}
					visible={visible}
					onOk={(e)=>onOK(newValue)}
					onCancel={onCancel}
				>
					<Input value={newValue} onChange={onChange}/>
				</Modal>
			</div>
		)
	},
	getOk(){
        const {oldValue,newValue,onChange,onCancel,visible,type,onRename,onNewFolder} = this.props
        if(type == 'rename'){
            return onRename
        }
        if(type == 'newFolder'){
            return onNewFolder
        }
        return '未知操作'
    },
	getTitle:function(){
		const {oldValue,newValue,onChange,onCancel,visible,type} = this.props
        if(type == 'rename'){
            return '给'+oldValue +'重命名'
        }
        if(type == 'newFolder'){
            return '新建文件夹'
        }
        return '未知操作'
    }
})

export default Action;
