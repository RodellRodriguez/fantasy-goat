import React from 'react';
import { Menu, Dropdown, Icon } from 'antd';

const WeekSelector = props => {

	const onClick = ({key}) => {
		let week = key;
		props.handleWeekChange(week);
	};

	//Loops from 1 -> props.currentWeek
	const menuItems = Array.from(new Array(props.currentWeek),(val,index)=>index+1).map(
		week => <Menu.Item key={week}>Week #{week}</Menu.Item>
	)

	const menu = (
		<Menu onClick={onClick}>
			{menuItems}
		</Menu>
	);

	return (
		<div>Selected Week is {props.selectedWeek}
		<br></br>
			<Dropdown overlay={menu}>
			    <a className="ant-dropdown-link" href="#">
			      Select a Week <Icon type="down" />
			    </a>
		  	</Dropdown>	
		</div>
	);
}

export default WeekSelector;
