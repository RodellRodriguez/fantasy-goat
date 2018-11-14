import React from 'react';
import axios from 'axios';

import StatsTable from '../components/Table';

class Stats extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			stats: [],
			selectedRowKeys: [],
			selectedRows: []
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
	      statsObj['index'] = i;
	      statsObj['score'] = ''
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

	handleSelectChange = (selectedRowKeys, selectedRows) => {
		console.log('prev selectedRows', this.state.selectedRows)
		if (this.state.selectedRows.length === 2 && selectedRows.length < 2) {
			this.clearScores();
		}

		this.setState({ selectedRowKeys, selectedRows });
		console.log('selectedRows are:', selectedRows);
		this.calculateScore(selectedRows);
	}

	clearScores = () => {
		let currentStats = this.copyStats(this.state.stats);
		this.state.selectedRows.forEach(team => {
			console.log('this the team yo', team)
			currentStats[team['index']]['score'] = '';
		})

		this.setState({
			stats: currentStats
		})
	}

	calculateScore = (selectedRows) => {
	    if (selectedRows.length < 2) {
	      return;
	    }
	    let score = 0;
	    let firstTeam = {name : selectedRows[0].name, score: score}
	    let secondTeam = {name : selectedRows[1].name, score: score}
	    for(let key in selectedRows[0]){
	      if(key === 'name' || key === 'key' || key === 'index' || key === 'score') {continue;}
	      
	      let firstTeamStat = selectedRows[0][key];
	      let secondTeamStat = selectedRows[1][key];
	      
	      if (this.isTurnoverCategory(key)){
	        if (firstTeamStat < secondTeamStat) {
	          firstTeam.score++;
	        }
	        if (secondTeamStat < firstTeamStat) {
	          secondTeam.score++;
	        }
	      }
	      else {
	        if (firstTeamStat > secondTeamStat) {
	          firstTeam.score++;
	        }
	        if (secondTeamStat > firstTeamStat) {
	          secondTeam.score++;
	        }
	      } 
	    } 
	    this.setTeamScores(selectedRows, [firstTeam, secondTeam])
	  }
	
	isTurnoverCategory = key => key === '19'

	setTeamScores = (selectedRows, matchup) => {
		let currentStats = this.copyStats(this.state.stats);
		for (let teamIndex = 0; teamIndex < 2; teamIndex++){
			let desiredTeamToChangeScore = currentStats[selectedRows[teamIndex]['index']];
			desiredTeamToChangeScore['score'] = matchup[teamIndex]['score']
		}
		this.setState({
			stats: currentStats
		})
	}
	
	copyStats = stats => JSON.parse(JSON.stringify(stats));

	render(){
		const rowSelection = {
	    	selectedRowKeys: this.state.selectedRowKeys,
	    	onChange: this.handleSelectChange,
	    };
		return (
			<div>
				<StatsTable 
					stats={this.state.stats} 
					onSelectRowChange= {this.handleSelectChange}
					rowSelection={rowSelection}
				/>	
			</div>
		)
	}
}

export default Stats;