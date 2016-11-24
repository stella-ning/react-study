import React from 'react';
import TodoList from './todoList';

function id(){
    return Math.random().toString().replace(/\./,'') + Math.random().toString().replace(/\./,'')
}
var Todo = React.createClass({
    //设置组件外部属性
    getInitialState(){
        return{
            data:[
                {text:'ivan',id:id(),type:'active'},
                {text:'stella',id:id(),type:'no-active'},
                {text:'fei',id:id(),type:'active'}
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
				<div className='todo-list'>
                    <TodoList
                        data={this.state.data}
                        onDelete={this.handleDelete}
                        onEdit={this.handleEdit}
                    />
				</div>
			</div>
		)
	},
    handleEdit:function(){

    },
    //删除
    handleDelete:function(obj){
        var data = this.state.data,
            json = [];
            alert(obj)
        for(var i=0;i<data.length;i++){
            if(data[i].text != obj.text){
                json.push(data[i])
            }
        }
        this.setState({
            data:json
        })
    },
    //添加
    handleAdd:function(){
        var data = this.state.data,
            newText = this.state.value;
        data.push({
            text:newText,
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
