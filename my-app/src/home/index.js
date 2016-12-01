import React from 'react';
import {Router, Route, hashHistory, Link, IndexRoute} from 'react-router';
import {Menu, Row, Col, Switch,Icon} from 'antd';
import Todo from '../todoMVC';
import Card from '../card';
import Cloud from '../cloud';
import Students from '../students';
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
import 'antd/dist/antd.css';


const SideBar = React.createClass({
	getInitialState() {
		return {
			current: '1',
			openKeys: [],
		};
	},
	handleClick(e) {
		//console.log('Clicked: ', e);
		this.setState({ current: e.key });
	},
  	render() {
	    return (
			<Menu
				mode="inline"
				selectedKeys={[this.state.current]}
				onClick={this.handleClick}
				defaultOpenKeys={['sub1']}
			>
				<SubMenu key="sub1" title={<span><Icon type="appstore" /><span>案例列表</span></span>}>
					<MenuItem key="/todo"><Link to="/todo">todoMvc</Link></MenuItem>
					<MenuItem key="/card"><Link to="/card">react选项卡</Link></MenuItem>
					<MenuItem key="/students"><Link to="/students">学生信息管理系统</Link></MenuItem>
					<MenuItem key="/cloud"><Link to="/cloud">我的云盘</Link></MenuItem>
				</SubMenu>
			</Menu>
	    );
  	},
});

//展示组件
var App = React.createClass({
	//设置组件属性
	getInitialState: function () {
          return {
              current:''
          }
    },
	//渲染html
	render:function(){
		return(
			<Row>
                <Col span={4}>
                    <SideBar current={this.state.current}/>
                </Col>
                <Col span={20}>
                    {this.props.children}
                </Col>
            </Row>
		)
	},
	//组件加载之前
    componentWillMount: function () {
        this.setState({
            current:hashHistory.getCurrentLocation().pathname
        });
	}
})

//路由组件
var R = React.createClass({
	/*---路由嵌套  App组件下包括todo,card,cloud等组件---*/
	render:function(){
		return(
			<Router history={hashHistory}>
                <Route path="/" component={App}>
					<IndexRoute component={Card}/>
					<Route path='todo' component={Todo}/>
					<Route path='card' component={Card}/>
					<Route path='students' component={Students}/>
                    <Route path="cloud" component = {Cloud}>
                        <Route path="*" component={Cloud}/>
                    </Route>
                </Route>
            </Router>
		)
	}
})
export default R;
