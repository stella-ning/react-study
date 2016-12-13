import React from 'react';
import CardItem from './cardItem.js';
const TitleBar = CardItem.TitleBar;
const Title = CardItem.Title;
const ContentBar = CardItem.ContentBar;
const Content = CardItem.Content;

var CardBox = React.createClass({
	getInitialState(){
		return{
			current:1
		}
	},
	render(){
		return(
			<div>
				<CardItem current={this.state.current}>
					<TitleBar>
						<Title index={1} onClick={(e)=>this.setState({current:1})}>title1</Title>
						<Title index={2} onClick={(e)=>this.setState({current:2})}>title2</Title>
						<Title index={3} onClick={(e)=>this.setState({current:3})}>title3</Title>
					</TitleBar>
					<ContentBar>
						<Content index={1}>conternt1</Content>
						<Content index={2}>conternt2</Content>
						<Content index={3}>conternt3</Content>
					</ContentBar>
				</CardItem>
			</div>
		)
	}
})

export default CardBox;
