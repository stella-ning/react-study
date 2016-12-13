import React from 'react';
import './index.css';
var Card = React.createClass({
    render:function(){
        return(
            <div className='card'>
                {this.props.children}
            </div>
        )
    },
    getChildContext:function(){
        return{
            current:this.props.current
        }
    },
    childContextTypes:{
        current:React.PropTypes.number
    }
});
var TitleBar = React.createClass({
    render:function(){
        return(
            <div className='title-bar'>{this.props.children}</div>
        )
    }
});
var Title = React.createClass({
    contextTypes:{
        current:React.PropTypes.number
    },
    render:function(){
        var active = ''
        if(this.props.index == this.context.current){
            active = 'active'
        }
        return(
            <div className={'title' +' '+ active} onClick={this.props.onClick}>{this.props.children}</div>
        )
    }

})
var ContentBar = React.createClass({
    render:function(){
        return(
            <div className='content-bar'>{this.props.children}</div>
        )
    }
})
var Content = React.createClass({
    contextTypes:{
        current:React.PropTypes.number
    },
    render:function(){
        var display = ''
        if(this.props.index == this.context.current){
            display = 'block'
        }else {
            display = 'none'
        }
        return(
            <div className='content' style={{display:display}}>{this.props.children}</div>
        )
    }
});
Card.TitleBar = TitleBar;
Card.Title = Title;
Card.ContentBar = ContentBar;
Card.Content = Content;
export default Card;
