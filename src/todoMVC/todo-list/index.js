import React from 'react';
import './index.css';
var TodoItem = React.createClass({
	getInitialState(){
		return{
			value:this.props.text
		}
	},
	render(){
		return(
			<li className='todoItem'>
				{this.props.text}
				<button onClick={(e)=>this.props.delete(this.props.o)}>删除</button>
				<p>
					<input value={this.state.value} onChange={this.handleChange}/>
					<button onClick={this.handleEdit}>确定</button>
					<button onClick={this.handleCancel}>取消</button>
				</p>
			</li>
		)

	},
	handleChange:function(e){
		this.setState({
			value:e.target.value
		})
	},
	handleEdit:function(){
		var obj = {
			id:this.props.id,
			text:this.state.value
		}
		this.props.edit(obj)
	},
	handleCancel:function(){
		this.setState({
			value:this.props.text
		})
	}
})
var TodoList = React.createClass({
	render(){
		//var data = this.props.data;
		var that = this;
		var nodes = this.props.data.map(function(o){
			return(
				<TodoItem
					o={o} key={o.id} text={o.text} id={o.id}
					delete={that.props.onDelete}
					edit={that.props.onEdit}
				/>
			)
		})
		return(
			<ul className='todoList'>
				{nodes}
			</ul>
		)
	}
})

export default TodoList;
