import React from 'react'
import {
	Icon,
	Input
} from 'antd';
import './index.css';
import {Link} from 'react-router';
//
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

var File = React.createClass({
	render(){
		const {name,ext,isFolder,path} = this.props;
		var type = getIcon(ext,isFolder);

		return(
			<li>
				<span>
					<Icon type={type} />
				</span>

				<p>{name}</p>
			</li>
		)
	}
})

var FileList = React.createClass({
	render(){
		var datas = this.props.data;
		console.log(datas);
		var list = datas.map(function (item) {
            return <File key={item.name} name={item.name} ext={item.ext} isFolder={item.isFolder} path={item.path}/>
        });
		return(
			<ul>
				{list}
			</ul>
		)
	}
});

export default FileList;
