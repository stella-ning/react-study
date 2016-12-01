import React from 'react';
import {message, Breadcrumb,Row,Col,Icon} from 'antd';
import {getFile} from './Api';
import { Link} from 'react-router';
import FileList from './FileList';

let BreadItem = Breadcrumb.Item;
let Cloud = React.createClass({
    render(){
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

        return (
            <div className="cloud-title">
                <h1 className="app-title"><Icon type="cloud" />stella云盘</h1>
                <Row className="cloud-breads">
                    <Col span={23} push={1}>
                        <Breadcrumb>
                            {breads}
                        </Breadcrumb>
                    </Col>
                </Row>
                <FileList data={that.state.data} onChange={that.onChange}/>
            </div>
        )
    },
    getInitialState(){
        return {
            data:[],
            path:'/',
            routes:[]
        }
    },
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
    getFile(path){
        var that = this;
		var datas = this.state.data;
        getFile(path, function (res) {
            message.success("数据加载成功");
            that.setState({
                data:res.body.file,
            });
        },
        function (err) {
            message.error('Oh，No！数据加载失败了');
        });
    },
    onChange(path){
        this.getFile(path);
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

});

export  default Cloud;
