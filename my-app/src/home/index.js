import React from 'react';
import {Router, Route, hashHistory, Link, IndexRoute} from 'react-router';
import SideBar from '../sizeBar';
import Todo from '../todoMVC';
import Card from '../card';
import {Row,Col,message, Breadcrumb} from 'antd';
import 'antd/dist/antd.css';

var App = React.createClass({
	render(){
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
	getInitialState: function () {
          return {
              current:''
          }
    },
    componentWillMount: function () {
        this.setState({
            current:hashHistory.getCurrentLocation().pathname
        });
	}
})

var R = React.createClass({
	render(){
		return(
			<Router history={hashHistory}>
				<Route path='/' component={App}>
					<IndexRoute component={Todo}/>
					<Route path='todo' component={Todo}/>
					<Route path='card' component={Card}/>
				</Route>
			</Router>
		)
	}
})
export default R;
