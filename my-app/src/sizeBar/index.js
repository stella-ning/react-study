import React from 'react';
import {Router, Route, hashHistory, Link, IndexRoute} from 'react-router';
import {Menu, Row, Col, Switch} from 'antd';
import 'antd/dist/antd.css';
const MenuItem = Menu.Item;
const SubMenu = Menu.SubMenu;
var SizeBar = React.createClass({
	getInitialState(){
        return {
            theme:'Light',
            current:this.props.current
        }
    },
	render(){
		return(
			<div>
                <Switch onChange={this.changeTheme} checkedChildren="Dark" unCheckedChildren="Light" />
                <Menu onClick={this.handleClick}
                      theme={this.state.theme}
                      selectedKeys={[this.state.current]}
                      defaultOpenKeys={['sub1']}
                      mode="inline">
                    <SubMenu key="sub1" title={<span><span>导航栏</span></span>}>
                        <MenuItem key="/todo"><Link to="/todo">todoMvc</Link></MenuItem>
                        <MenuItem key="/card"><Link to="/card">react选项卡</Link></MenuItem>
                    </SubMenu>
                </Menu>
            </div>
		)
	},
	changeTheme: function (value) {
        this.setState({
            theme: value ? 'dark' : 'light',
        });
    },
    handleClick: function (e) {
        this.setState({current:e.key})
    },
})

export default SizeBar;
