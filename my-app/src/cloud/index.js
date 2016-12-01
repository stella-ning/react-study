import React from 'react'
import _ from 'underscore'
import {Table,Button,Modal,Form,Input,Radio,Row,Col,message,Icon} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import 'antd/dist/antd.css'

import request from 'superagent'
import FileList from './file-list'
import Menu from './menu'
import Action from './action'
import {getFileList,rename,newFolder,remove,paste,cut,upload} from './api'
import './index.css'

import {
    Router,
    Route,
    hashHistory
} from 'react-router';

// var R = React.createClass({
//     render(){
//         return (
//             <Router history={hashHistory}>
//                 <Route path='*' component={Cloud}/>
//             </Router>
//         )
//     }
// })



var Cloud = React.createClass({
    getInitialState:function () {
        return {
            file:[],
            copyItem:{},
            path:[],
            loading:false,
            menu:{
                x:0,
                y:0,
                display:false
            },
            active:'',
            actionType:null,
            newValue:'',
			cutItem:'',
            showAction:false,
			showUpload:false,
			fileList:[]
        }
    },
    render(){
        return(
            <div className="app"
                 onContextMenu={(e)=>e.preventDefault()}
                 onMouseDown={this.mouseDown}
            >
                <h3 className="app-title"><Icon type="cloud" />stella云盘</h3>

                <FileList
                    file={this.state.file}
                    path={this.state.path}
                    active={this.state.active}
                    onPick={this.pickItem}
                    onCopy={this.copyItem}
                    loading={this.state.loading}
                    onRename={this.rename}
                />
                <Menu
                    display={this.state.menu.display}
                    x={this.state.menu.x}
                    y={this.state.menu.y}
					canNewFolder={true}
					canRename={!!this.state.active}
					canDelete={!!this.state.active}
                    canCopy={this.state.active}
					canPaste={_.keys(this.state.copyItem).length || _.keys(this.state.cutItem).length}
                    canCut={this.state.active}
					canUpload={true}
                    onAction={(type)=>this.handleAction(type)}
                />
                <Action
                    visible={this.state.showAction}
                    type={this.state.actionType}
                    oldValue={this.state.active}
                    onChange={(e)=>this.setState({newValue:e.target.value})}
                    newValue={this.state.newValue}
                    onCancel={(e)=>this.hideAction()}
                    onRename={this.handleRename}
                    onNewFolder={this.handleNewFolder}
                />
				<Modal
                    visible={this.state.showUpload}
                    onCancel={(e)=>this.setState({showUpload:false})}
                    title={'上传文件'}
                    onOk={this.uploadFile}
                >
                    <form  method="post" action="http://101.200.129.112:9527/file/upload/"   enctype="multipart/form-data">
                        <input name="cloud" type="file" multiple />
                        <Input type='hidden' name="path" value={this.state.path.join('/')+'/'}/>
                        <input type="submit" value="提交" />

                    </form>
                </Modal>
            </div>
        )
    },
    // copyItem(){
	//
    // },
    uploadFile(){
		var f = this.refs.upload.files
        var path = this.state.path.join('/') + '/'
        upload({
            path:path,
            files:f
        },function (res) {
            console.log(res)
        })
	},
    deleteFile(){
        var path = this.state.path.join('/') +'/' +  this.state.active
        var query = {
            path:path
        }
        var that = this
        Modal.confirm({
            title:'是否想删除这个文件',
            content:'该操作很危险，请小心',
            onOk:function () {
                remove(query,function (res) {
                    var file = that.state.file
                    var json = []
                    for(var i=0;i<file.length;i++){
                        if(file[i].name != that.state.active){
                            json.push(file[i])
                        }
                    }

                    that.setState({
                        file:json
                    })
                    that.hideAction()
                    message.success('成功删除文件(夹)'+that.state.active)
                })
            },
            onCancel:function () {
                alert('cancel')
            }
        })


    },

    handleRename(name){
        var path = this.state.path.join('/') +'/' +  this.state.active
        var query = {
            name:name,
            path:path
        }
        var that = this
        rename(query,function (res) {
            console.log(res)
            var file =that.state.file
            var json = []
            file.map(function (obj) {
                if(obj.name == that.state.active){
                    json.push(res)
                }else {
                    json.push(obj)
                }
            })
            that.setState({
                file:json
            })
            that.hideAction()
            message.success('成功重命名文件'+that.state.active+'--->'+name)
            that.pickItem(name)
        })
    },
    handleNewFolder(name){
        console.log('handleNewFolder',name)
		console.log(4);
        var that =this
        var path = this.state.path.join('/')
        newFolder({
            name:name,
            path:path
        },function (res) {
            var file = that.state.file
            file.push(res)
            that.setState({file:file})
            that.hideAction()
            message.success('成功新建夹'+name)
        })
    },

    handleAction(type){
        var that = this
        this.hideMenu()
        this.setState({
            actionType:type
        })

        if(type =='delete' && !this.state.active){
            Modal.error({
                title:'操作错误',
                content:'删除时请选中某个文件'
            })
            return
        }

        if(type =='rename' && !this.state.active){
            Modal.error({
                title:'操作错误',
                content:'重命名时请选中某个文件'
            })
            return
        }

        if(type =='copy' && !this.state.active){
            Modal.error({
                title:'操作错误',
                content:'复制文件时请选中某个文件'
            })
            return
        }
		if(type == 'upload'){
            this.setState({showUpload:true})
        }


        if(type == 'newFolder'){
            var times=0
            var file = this.state.file
            file.map(function (obj) {
                if(/^新建文件夹/.test(obj.name)){
                    times++
                }
            })
            times = !times ? '' : times

            this.setState({

                newValue:'新建文件夹'+times
            })
            this.showAction()
        }

        if(type == 'rename'){
            this.setState({
                newValue:this.state.active
            })
            this.showAction()
        }

        if(type == 'delete'){
            this.deleteFile()
        }

        if(type == 'copy'){
            var file = this.state.file;
            var that = this;
            var item = {};
            file.map(function (obj) {
                if(obj.name == that.state.active){
                    item = obj
                }
            });
            that.setState({
                copyItem:item
            });
            message.success('已经复制文件'+that.state.active+'到剪切板');
        }
		if(type == 'cut'){
            var file = this.state.file;
            var that = this;
            var item = {};
            file.map(function (obj) {
                if(obj.name == that.state.active){
                    item = obj
                }
            });
            that.setState({
                cutItem:item
            });
            message.success('已经复制文件'+that.state.active+'到剪切板');
        }

        if(type == 'paste'){
			var isCopy = !!_.keys(this.state.copyItem).length,
				isCut = !!_.keys(this.state.cutItem).length;
			if(isCopy){
				var file = this.state.file;
	            var item = this.state.copyItem;
	            var has = false;
	            for(var i=0;i<file.length;i++){
	                if(file[i].name == item.name){
	                    has = true
	                }
	            }

				var query={
                    old_path:that.state.copyItem.path,
                    new_path:that.state.path.join('/')+'/'+that.state.copyItem.name
                }
                if(has){
                    query.new_path = that.state.path.join('/')+'/'+that.state.copyItem.name+'-1'
                }
                paste(query,function (res) {
                    file.push(res)
                    that.setState({
                        file:file
                    })
                    message.success('成功复制文件'+that.state.active)
                },function () {
                    console.log('paste failed')
                })
			}

			if(isCut){
				var has = false
                var file = this.state.file
                for(var i=0;i<file.length;i++){
                    if(file[i].name == item.name){
                        has = true
                    }
                }
                var query={
                    old_path:that.state.cutItem.path,
                    new_path:that.state.path.join('/')+'/'+that.state.cutItem.name
                }
                if(has){
                    query.new_path = that.state.path.join('/')+'/'+that.state.cutItem.name+'-1'
                }

                cut(query,function (res) {
                    var item = that.state.copyItem
                    file.push(res)
                    that.setState({
                        file:file
                    })
                    message.success('成功复制文件'+that.state.active)
                },function () {
                    console.log('paste failed')
                })
			}

        }

    },
    showAction(){
        this.setState({showAction:true})
    },
    hideAction(){
        this.setState({showAction:false})
    },
    pickItem(name){
        this.setState({active:name,newValue:name})
    },
    unPickItem(name){
        this.setState({active:'',newValue:''})
    },
    showMenu(e){
        this.setState({
            menu:{
                x:e.clientX,
                y:e.clientY,
                display:true
            }
        })
    },
    hideMenu(){
        this.setState({
            menu:{
                display:false,
            },
        })
    },
    mouseDown(e){
        if(e.button == 2){
            this.showMenu(e)
        }else {
            this.hideMenu(e)
            this.unPickItem()
        }
    },


    getFile(path){

        var that = this
        that.setState({
            loading:true
        })

        getFileList(path,function (res) {
            //console.log(res)
            that.setState({
                file:res.file,
                path:res.path.split('/'),
                loading:false
            })
        },function (err) {
            //console.log('err',err)
        })
    },
    componentDidMount(){
        const {params} = this.props
        const {splat} = params
        this.getFile(splat)
        console.log('componentDidMount',splat)
    },
    componentWillReceiveProps(nextProps){
        const {params} = nextProps
        const {splat} = params
        this.getFile(splat)
        console.log('componentWillReceiveProps',splat)
    }
})





export default Cloud
