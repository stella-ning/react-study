import React from 'react';
import TodoList from './todo-list';

function id(){
    return Math.random().toString().replace(/\./,'') + Math.random().toString().replace(/\./,'')
}
var Todo = React.createClass({
    //设置组件外部属性
    getInitialState(){
        return{
			data:[
				{text:'ning',id:id(),active:'active'},
				{text:'yue',id:id(),active:'active'},
				{text:'xin',id:id(),active:'active'},
			],
            value:'writing what you want'
        }
    },
    //渲染
	render(){
		return(
			<div>
				<h2>TodoMVC</h2>
				<div className='add-input'>
					<input value={this.state.value} onChange={this.handleChange}/>
					<button onClick={this.handleAdd}>提交</button>
				</div>
				<div className='todoList'>
					<TodoList
						data={this.state.data}
						onDelete={this.handleClick}
						onEdit={this.handleEdit}
					/>
				</div>
			</div>
		)
	},
	//编辑
	handleEdit:function(obj){
		var data = this.state.data;
		data.map(function(o){
			if(o.id == obj.id){
				o.text = obj.text
			}
			return o;
		})
		this.setState({
			data:data
		})
	},
	//删除
	handleClick:function(obj){
		var data = this.state.data,
			json = [];
		for(var i=0;i<data.length;i++){
			if(data[i].text != obj.text){
				json.push(data[i]);
			}
		}
		this.setState({
			data:json
		})


	},
	//添加
	handleAdd:function(){
		var data = this.state.data,
			value = this.state.value;
		data.push({
			text:value,
			id:id()
		})
		this.setState({
			data:data,
			value:''
		})
	},
    //改变添加input框的值
    handleChange:function(e){
        this.setState({
            value:e.target.value
        })
    }
})
export default Todo;
