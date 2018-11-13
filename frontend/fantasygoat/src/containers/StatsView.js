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
					stats: this.cleanStatsForTable(res.data)
				});
			})
	}

	cleanStatsForTable = (stats) => {
	    const teams = stats["fantasy_content"]["league"][1]["teams"];
	    let tableData = Object.values(teams).slice(0,10).map((val, i, arr) => {  
	      let nameObj = val['team'][0][2];
	      let stats = val['team'][1]['team_stats']['stats'].reduce((stats, current) => {
	      	const freeThrowTotalId = "9004003";
	      	const fieldGoalTotalId = "9007006";

	        if(current['stat']['stat_id'] !== freeThrowTotalId && current['stat']['stat_id'] !== fieldGoalTotalId) {
	          let statObj = {};
	          let stat =  current['stat']['value'];
	          let statKey = current['stat']['stat_id'];
	     
	          statObj[statKey] = this.convertStatFromStringToNumber(stat, statKey);
	          stats.push(statObj);
	        }
	        return stats;
	      }, []);

	      let statsObj = Object.assign({},nameObj,...stats);
	      statsObj['key'] = nameObj['name'];
	      return statsObj;
	    }) 

	    return tableData;
	  }

	convertStatFromStringToNumber = (stat, statKey) => {
	    const freeThrowPercentageId = '5';
	    const fieldGoalPercentageId = '8';
	    let convertedStat = '';
	    if (statKey === freeThrowPercentageId || statKey === fieldGoalPercentageId) {
	        convertedStat = parseFloat(stat);
	    }
	    else {
	        convertedStat = parseInt(stat);
	    }
	    return convertedStat;
	  }	 

	render(){
		return (
			<div>
				<StatsTable stats={this.state.stats}/>	
				<br /> <br />
			</div>
		)
	}
}

export default Stats;