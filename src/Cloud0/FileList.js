import React from 'react';
import File from './File';

const FileList = React.createClass({
    render(){
        var list = this.props.data.map(function (item) {
            return <File key={item.name} name={item.name} ext={item.ext} isFolder={item.isFolder} path={item.path}/>
        });
        return (
            <ul>
                {list}
            </ul>
        )
    }
});

export default FileList;
