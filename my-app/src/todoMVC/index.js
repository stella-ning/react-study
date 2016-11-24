import React from 'react';
var Todo = React.createClass({
	render(){
		return(
			<div>
				<h2>TodoMVC</h2>
				<div className='add-input'>
					<input placeholder='writing what you want'/>
					<button type='button'>提交</button>
				</div>
				<div className='todo-list'>
					
				</div>
			</div>
		)
	}
})
export default Todo;
