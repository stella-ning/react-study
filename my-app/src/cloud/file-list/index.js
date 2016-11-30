import React from 'react';
import {
	Icon,
	Input
} from 'antd';
import './index.css';
import {hashHistory} from 'react-router';
const host = 'http://101.200.129.112:9527/static/';
import Loading from '../loading';

function getIcon(ext,isFolder) {
    if(isFolder){
        return 'folder-open'
    }
    switch (ext){
        case '.html':
            return 'code'
        case '.css':
            return 'code'
        case '.js':
            return 'code'
        case '.jpg':
            return 'picture'
        case '.png':
            return 'picture'
        case '.gif':
            return 'picture'
		case '.txt':
			return 'file-text'
    }
    return 'file'
}

var FileItem = React.createClass({
	render:function(){
		const {name,ext,isFolder,path,action,onPick,active} = this.props;
		const type = getIcon(ext,isFolder);
		const act = name == active;
		return(
			<li className={act?"file-item active":"file-item"}>
				<span
					className = "file-item-icon"
					onDoubleClick = {this.handleDBClick}
					onMouseDown={this.mousedown}
				>
					<Icon type={type} />
				</span>
				<p>
					<span className="file-item-name">{name}</span>
				</p>
			</li>
		)
	},
	mousedown:function(e){
		const {name,onChange,path,ext,isFolder,action,onRename,active,onPick} = this.props
        onPick(name)
	},
	handleDBClick:function(){
		const {name,onChange,path,ext,isFolder,onPick} = this.props;
		onPick(name)
        //console.log(name)
		if(isFolder){
            hashHistory.push(path);
        }else {
            window.open(host+path)
        }
	}
})
var FileList = React.createClass({
	render:function(){
		const {
            file,
			path,
			action,
			active,
			onPick,
			loading,
            Load
        }= this.props
		var nodes = file.map(function(obj){
			//console.log(obj);
			return(
				<FileItem
					name={obj.name}
					path={obj.path}
					key={path+'-'+obj.name}
					action={action}
					isFolder={obj.isFolder}
					ext={obj.ext}
					active={active}
					onPick={onPick}
				/>
			)
		});
		if(loading){
            nodes = Load
        }
		return(
			<div className="file-content">
				<ul className="file-list" style={{display:loading?'none':'block'}}>
					{nodes}
				</ul>
				<div style={{display:loading?'block':'none'}}>
					<Loading/>
				</div>
			</div>
		)
	}
})
export default FileList;
