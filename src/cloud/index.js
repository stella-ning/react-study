import React from 'react'
import _ from 'underscore'
import {Table,Button,Modal,Form,Input,Radio,Row,Col,message,Icon,Breadcrumb} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const BreadItem = Breadcrumb.Item;
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
    hashHistory,
	Link
} from 'react-router';


var Cloud = React.createClass({
	getInitialState(){
		return{
			data:[],
			path:'/',
			routes:[],
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
	//渲染到页面
	render(){
		//面包导航
		var that = this,
            routes = location.hash.split("/");

        routes = routes.slice(1,routes.length);
        routes = routes.map(function (item, index) {
            var link = {};
            link.url = routes.slice(0,index+1).join("/");
            link.name = item;
            return link;
        });
        var breads = [];

        if (routes.length > 1) {
            breads = routes.map(function (item, index) {
                if (index < routes.length) {
                    return <BreadItem key={index}><Link to={item.url}>{item.name}</Link></BreadItem>
                } else {
                    return <BreadItem>{item.name}</BreadItem>
                }
            });
        } else {
            breads = <BreadItem>{routes[0].name}</BreadItem>;
        }

		return(
			<div className="app"
                 onContextMenu={(e)=>e.preventDefault()}
                 onMouseDown={this.mouseDown}
				 onClick={this.handleClick}
				 onDoubleClick={this.handleDoubleClick}
			>
				<h3 className="app-title"><Icon type="cloud" />stella云盘</h3>
				<p>
					<Breadcrumb>
						{breads}
					</Breadcrumb>
				</p>
				<FileList
					data={this.state.data}
					path={this.state.path}
					active={this.state.active}
					onPick={this.pickItem}
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

			</div>

		)
	},
	//删除文件
	deleteFile(){
        var path = this.state.path +'/' +  this.state.active
        var query = {
            path:path
        }
        var that = this
        Modal.confirm({
            title:'是否想删除这个文件',
            content:'该操作很危险，请小心',
            onOk:function () {
                remove(query,function (res) {
                    var data = that.state.data
                    var json = []
                    for(var i=0;i<data.length;i++){
                        if(data[i].name != that.state.active){
                            json.push(data[i])
                        }
                    }

                    that.setState({
                        data:json
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
	//重命名
	handleRename(name){
		var path = this.state.path +'/' +  this.state.active;

        var query = {
            name:name,
            path:path
        };
        var that = this;
        rename(query,function (res) {
            console.log(res)
            var data =that.state.data;
            var json = [];
            data.map(function (obj) {
                if(obj.name == that.state.active){
                    json.push(res)
                }else {
                    json.push(obj)
                }
            });
            that.setState({
                data:json
            })
            that.hideAction()
            message.success('成功重命名文件'+that.state.active+'--->'+name)
            that.pickItem(name)
			//alert(name);
        })
	},
	//新建文件夹
	handleNewFolder(name){
		//console.log('handleNewFolder',name);
        var that =this;
        var path = this.state.path;
        newFolder({
            name:name,
            path:path
        },function (res) {
            var data = that.state.data
            data.push(res)
            that.setState({data:data})
            that.hideAction()
            message.success('成功新建夹'+name)
        })

	},
	//菜单的点击事件
	handleAction(type){
		var that = this
		this.hideMenu()
		this.setState({
			actionType:type
		})

		//新建文件夹
		if(type == 'newFolder'){
			var times=0
			var data = this.state.data
			data.map(function (obj) {
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
		//文件夹重命名
		if(type == 'rename'){
			this.setState({
				newValue:this.state.active
			})
			this.showAction()
		}
		//删除文件
		if(type == 'delete'){
			this.deleteFile()
		}
		//复制文件
		if(type == 'copy'){
			var data = this.state.data
			var that = this
			var item = {}
			data.map(function (obj) {
				if(obj.name == that.state.active){
					item = obj
				}
			})
			that.setState({
				copyItem:item
			})
			message.success('已经复制文件'+that.state.active+'到剪切板')
		}
		//剪切文件
		if(type == 'cut'){
			var data = this.state.data
			var that = this
			var item = {}
			data.map(function (obj) {
				if(obj.name == that.state.active){
					item = obj
				}
			})
			that.setState({
				cutItem:item
			})
			message.success('已经复制文件'+that.state.active+'到剪切板')
		}

		//粘贴文件
		if(type == 'paste'){
			var isCopy = !!_.keys(this.state.copyItem).length,
				 isCut = !!_.keys(this.state.cutItem).length

			if(isCopy){

				var item = this.state.copyItem
				var has = false
				var data = this.state.data
				for(var i=0;i<data.length;i++){
					if(data[i].name == item.name){
						has = true
					}
				}

				var query={
					old_path:that.state.copyItem.path,
					new_path:that.state.path+'/'+that.state.copyItem.name
				}
				if(has){
					query.new_path = that.state.path+'/'+that.state.copyItem.name+'-1'
				}
				paste(query,function (res) {
					data.push(res)
					that.setState({
						data:data
					})
					message.success('成功复制文件'+that.state.active)
				},function () {
					console.log('paste failed')
				})
			}
			if(isCut){
				var has = false
				var data = this.state.data
				for(var i=0;i<data.length;i++){
					if(data[i].name == item.name){
						has = true
					}
				}
				var query={
					old_path:that.state.cutItem.path,
					new_path:that.state.path+'/'+that.state.cutItem.name
				}
				if(has){
					query.new_path = that.state.path+'/'+that.state.cutItem.name+'-1'
				}

				cut(query,function (res) {
					var item = that.state.copyItem
					data.push(res)
					that.setState({
						data:data
					})
					message.success('成功复制文件'+that.state.active)
				},function () {
					console.log('paste failed')
				})
			}
		}
	},
	//弹出增生改模板
	showAction(){
        this.setState({showAction:true})
    },
	//隐藏增生改模板
    hideAction(){
        this.setState({showAction:false})
    },
	//获取当前的文件名字
    pickItem(name){
        this.setState({active:name,newValue:name})
    },
    unPickItem(name){
        this.setState({active:'',newValue:''})
    },
	//点击事件
	handleClick(){
		console.log('click')
	},
	//双击事件
	handleDoubleClick(){
		console.log('dbclick')
	},
	//隐藏菜单
	hideMenu(e){
		this.setState({
			menu:{
				display:false
			}
		})
	},
	//显示菜单
	showMenu(e){
		this.setState({
            menu:{
                x:e.clientX-210,
                y:e.clientY,
                display:true
            }
		})
	},
	//鼠标右击事件
	mouseDown(e){
        if(e.button == 2){
            this.showMenu(e)
        }else {
            this.hideMenu(e)
            this.unPickItem()
        }
    },
	//面包导航
	getBreadNav(){
        var routes = location.hash.split("/")
        routes = routes.slice(1,routes.length);
        routes = routes.map(function (item, index) {
            var temp = {};
            temp.url = routes.slice(0,index+1).join("/");
            temp.name = item;
            return temp;
        });

        this.setState({
            routes:routes
        });
    },
	//获取文件数据
	getFile(path){
		var that = this;
		getFileList(path,function(res){
			//成功
			message.success('数据加载成功!');
			that.setState({
				data:res.file,
			})
		},function(res){
			//失败
			message.error('oh,加载数据失败!')
		})
	},
	//组件将要加载时
	componentWillMount(){
        var path = this.props.params.splat;
        path = !path?'/':"/"+path;
        this.getFile(path);
    },
	//组件接收到新的 props 的时候调用
    componentWillReceiveProps(nextProps){
        let spalt = nextProps.params.splat;
        this.getFile(spalt?'/'+spalt:'/');
    }
})


export default Cloud
