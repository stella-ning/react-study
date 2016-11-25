import React from 'react'

import {Table,Button,Modal,Form,Input,Radio,Row,Col,message} from 'antd'
const FormItem = Form.Item
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
import 'antd/dist/antd.css'
import request from 'superagent'

var header = [
    {title:'id',dataIndex:'id'},
    {title:'name',dataIndex:'name'},
    {title:'age',dataIndex:'age'},
    {title:'sex',dataIndex:'sex'},
    {
        title:'single',
        dataIndex:'single',

        render:(single, obj)=>(
            <div>
                {obj.name} 这只 {single ? '单身狗':'恩爱狗'}
                是个{obj.sex} 他今年{obj.age}岁了
            </div>
        )
    },
]


var api = 'http://101.200.129.112:9527/react1/student/'

//console.log(request)

// var Title = React.createClass({
//     render:function () {
//         return (
//             <div><Button>删除</Button></div>
//         )
//     }
// })


var Students = React.createClass({
    getInitialState:function () {
        return {
            loading : false,
            items :[],
            showAdd:false,

            name:'',
            age:'',
            sex:'boy',
            single:true,

            selectedRowKeys: [],
        }
    },

    onSelectChange(selectedRowKeys) {
        console.log(selectedRowKeys)
        this.setState({ selectedRowKeys:selectedRowKeys });
    },

    render:function () {
        var loading = this.state.loading
        var selectedRowKeys = this.state.selectedRowKeys
        var rowSelection = {
            selectedRowKeys:selectedRowKeys,
            onChange: this.onSelectChange,
        };
        var disabled = selectedRowKeys.length !==1
        return (
            <div className="dongnao">
                <h3>动脑学院学生信息系统</h3>
                <div className="content">
                    <Button icon="plus" type='primary' onClick={(e)=>this.setState({showAdd:true})}>增加</Button>&nbsp;
                    <Button icon='edit' disabled={disabled} type='ghost'>编辑</Button>&nbsp;
                    <Button icon='delete' disabled={disabled} onClick={this.handleDelete}>删除</Button>
                    <br/><br/>
                    <Table
                        loading={this.state.loading}
                        columns={header}
                        rowSelection={rowSelection}
                        dataSource={this.state.items}/>
                </div>

                <Modal
                    visible={this.state.showAdd}
                    onCancel={(e)=>this.setState({showAdd:false})}
                    title='增加学生信息'
                    onOk={this.handleSave}

					
                >
                    <Form>
                        <FormItem
                            label='名字'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span:18 }}

                        >
                            <Input value={this.state.name} onChange={(e)=>this.handleChange(e,'name')}/>
                        </FormItem>

                        <FormItem
                            label='年龄'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span:18 }}

                        >
                            <Input value={this.state.age} onChange={(e)=>this.handleChange(e,'age')}/>
                        </FormItem>


                        <FormItem
                            label='性别'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span:18 }}
                        >
                            <RadioGroup value={this.state.sex} onChange={(e)=>this.handleChange(e,'sex')}>
                                <Radio key="boy" value={'boy'}>小鲜肉</Radio>
                                <Radio key="girl" value={'girl'}>小萝莉</Radio>
                            </RadioGroup>

                        </FormItem>
                        <FormItem
                            label='单身狗'
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span:18 }}
                        >
                            <RadioGroup value={this.state.single} onChange={(e)=>this.handleChange(e,'single')}>
                                <RadioButton key="boy" value={true}>单身狗</RadioButton>
                                <RadioButton key="girl" value={false}>恩爱狗</RadioButton>
                            </RadioGroup>

                        </FormItem>

                    </Form>
                </Modal>
            </div>
        )
    },
    handleDelete(){
        var that = this
        Modal.confirm({
            title:'删除学生信息',
            content:'你确定要删除这条学生记录吗？该操作很危险，请小心使用',
            onOk:function () {
                message.success('成功删除了一条数据')
                var id = that.state.selectedRowKeys[0]
                console.log(id)
                var deleteRequest = api + id
                console.log(deleteRequest)
                request
                    .delete(deleteRequest)
                    .end(function (err, res) {
                        console.log(res.body)
                    })
            }
        })
    },
    handleSave(){
        var that = this
        var data = {
            name : this.state.name,
            age : this.state.age,
            sex : this.state.sex,
            single : this.state.single
        }
        request
            .post(api)
            .send(data)
            .end(function (err, res) {
                var item = res.body
                item.key = item.id
                var items = that.state.items
                items.unshift(res.body)
                that.setState({
                    items:items,
                    showAdd:false
                })
                message.success('成功添加数据'+item.name)
            })
    },
    handleChange(e,type){
        var value = e.target.value,
            obj = {}
            obj[type] = value
        this.setState(obj)
    },
    componentDidMount(){
        var that = this

        this.setState({
            loading:true
        })
        request
            .get(api)
            .end(function (err,res) {
                if(err){return console.log(err)}

                res.body = res.body.map(function (obj) {
                    obj.key = obj.id
                    return obj
                })
                console.log(res.body)
                that.setState({
                    items:res.body,
                    loading:false
                })
            })
    }

})


export default Students
