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
			path:'/'
		}
	},
	render(){
		return(
			<div>
				<h1>stella云</h1>
				<FileList
					data={this.state.data}
				/>
			</div>

		)
	},
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
	componentWillMount(){
        var path = this.props.params.splat;
        path = !path?'/':"/"+path;
        this.getFile(path);
    },
    componentWillReceiveProps(nextProps){
        let spalt = nextProps.params.splat;
        this.getFile(spalt?'/'+spalt:'/');
    }
})


export default Cloud
