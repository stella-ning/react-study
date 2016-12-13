import React from 'react';
import './index.css';
import {Link,hashHistory} from 'react-router';
import {STATIC_FILE} from '../api.js'


var File = React.createClass({
	//const {name,ext,isFolder,path,action,onPick,active} = this.props;
	render(){
		var ext = this.props.ext,
            exts = '.pdf,.txt,.psd,.html,.js,.exe,.xls,.doc,.apk',
            video = '.mp4,.wmv,.rmvb',
            audio = '.falc,.mp3,.wamv',
            rar = '.rar,.zip,.7z',
            img = '.jpg,.png,.gif',
            type = this.props.isFolder?'folder':'';

        ext = exts.indexOf(ext) !== -1 ? ext :
            video.indexOf(ext) !== -1 ? '.video':
            audio.indexOf(ext) !== -1 ? '.audio':
            img.indexOf(ext)  !== -1 ? ext:
            rar.indexOf(ext) !== -1 ? 'rar': 'default';

        ext = ext == '' ?'default' :ext;

        var path = this.props.path,
			onPick = this.props.onPick,
			path = this.props.path,
			action = this.props.action,
			name = this.props.name,
            Links,
            Tag;

		if(this.props.isFolder){
			//截取传过来的path的第一位是否是'/'
			path = path.substr(0,1) !=='/'? "cloud/"+path:"cloud"+path;
			Links =	<Link to={path}>
		                <div className="file-icon" data-ext={ext} data-type={type}></div>
		                <p className="file-name">{this.props.name}</p>
		            </Link>
		}else{
			if ('.jpg,.png,.gif'.indexOf(ext) !== -1 && ext !== '') {

                Tag =  <img src={STATIC_FILE+path} width="84" height="84"/>;
            } else {
                Tag = <div className="file-icon" data-ext={ext}></div>
            }
            Links = <a href={STATIC_FILE+path} target="_blank" className="files">
	                        {Tag}
	                    <p className="file-name">{this.props.name}</p>
	                </a>
		}


		const act = name == this.props.active;

		return(
			<li
				className= {act?"file acitve":"file"}
				title={this.props.name}
				onMouseDown={this.mousedown}
				onDoubleClick={this.handleDbClick}
			>
                {Links}
            </li>
		)
	},
	mousedown(e){
        const {name,onPick} = this.props
        onPick(name)

    },

    handleDbClick(){
        const {name,path,ext,isFolder,onPick} = this.props
        onPick(name)
        console.log(name)

        if(isFolder){
            hashHistory.push(path)
        }else {
            window.open(STATIC_FILE+path)
        }
    }
});

var FileList = React.createClass({
	render(){
		const datas = this.props.data;
		const {onPick}= this.props;
		console.log(datas);
		var list = datas.map(function (item) {
            return(
				<File
				   key={item.name}
				   name={item.name}
				   ext={item.ext}
				   isFolder={item.isFolder}
				   path={item.path}
				   onPick = {onPick}
			   />
			)
        });
		return(
			<ul>
				{list}
			</ul>
		)
	}
});

export default FileList;
