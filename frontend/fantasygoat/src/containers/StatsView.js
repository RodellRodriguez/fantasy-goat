import React from 'react';
import axios from 'axios';

import Derp from '../components/Derp';

class Stats extends React.Component {

	state = {
		stats: []
	}

	componentDidMount(){
		axios.get('http://127.0.0.1:8000/weeklystats/')
			.then(res => {
				this.setState({
					stats: res.data
				});
				console.log(res.data);
			})
	}

	render(){
		return (
			<Derp />
		)
	}

}

export default Stats;