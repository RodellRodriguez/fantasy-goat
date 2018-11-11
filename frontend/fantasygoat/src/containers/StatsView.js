import React from 'react';
import axios from 'axios';

import StatsTable from '../components/Table';
import TestTable from '../components/TestTable';

class Stats extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			stats: []
		};
	}

	componentDidMount(){
		axios.get('http://127.0.0.1:8000/weeklystats/')
			.then(res => {
				this.setState({
					stats: res.data
				});
			})
	}

	render(){
		return (
			<div>
				<StatsTable stats={this.state.stats}/>	
				<br /> <br />
				<TestTable />
			</div>
		)
	}
}

export default Stats;