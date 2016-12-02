import React from 'react';
import {Link} from 'react-router';
import {STATIC_FILE} from './Api';
import './index.css';

const File = React.createClass({
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
            Links,
            Tag;

        if (this.props.isFolder) {
            path = path.substr(0,1) !== '/' ? "cloud/"+path:"cloud"+path;
            Links = <Link to={path}>
                <div className="file-icon" data-ext={ext} data-type={type}></div>
                <p className="file-name">{this.state.name}</p>
            </Link>
        } else {
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

        return (
            <li className="file" title={this.props.name}>
                {Links}
            </li>
        )
    },
    getInitialState() {
        return {
            isFolder:this.props.isFolder,
            name:this.props.name,
            path:this.props.path,
            ext:this.props.ext,
        }
    }
});

export default File;
