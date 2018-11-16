import React from 'react';
import axios from 'axios';

import { Button } from 'antd';

import StatsTable from '../components/Table';
import WeekSelector from '../components/WeekSelector';

class Stats extends React.Component {

	constructor(props){
		super(props);
		this.backendDomain = 'http://127.0.0.1:8000/';
		this.state = {
			stats: [],
			selectedWeek: 0,
			currentWeek: 0,
			selectedWeekIndex: 0,
			selectedRowKeys: [],
			selectedRows: []
		};
	}

	componentDidMount(){
		axios.get(this.backendDomain + 'weeklystats/current/')
			.then(res => {
				this.setAllStatsDataState(res, true);
			})
	}

	setAllStatsDataState = (statsPayload, currentWeek = false) => {
		let selectedWeek = statsPayload.data["fantasy_content"]["league"][1]["teams"][0]["team"][1]['team_stats']["week"];
		if (typeof selectedWeek === 'string') {
			selectedWeek = parseInt(selectedWeek);
		}
		console.log('selectedWeek is',selectedWeek)
		console.log('selectedWeek type is', typeof selectedWeek);

		let stats = [...Array(selectedWeek)];
		console.log('stats before cleaning', stats)
		stats[selectedWeek-1] = this.cleanStatsForTable(statsPayload.data);
		console.log('stats after cleaning', stats);
	
		this.setState({
			stats: stats,
			selectedWeek: selectedWeek,
			selectedWeekIndex: selectedWeek-1,
			selectedRowKeys: [],
			selectedRows: []
		}, function () {
			if (currentWeek) {
				this.setState({
					currentWeek: selectedWeek
				})
			}
		});			
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
		if (this.state.selectedRows.length === 2 && selectedRows.length !== 2) {
			this.clearTeamScores();
		}
		this.setState({ selectedRowKeys, selectedRows });
		console.log('selectedRows are:', selectedRows);
		this.calculateScore(selectedRows);
	}

	calculateScore = (selectedRows) => {
	    if (selectedRows.length < 2) {
	      return;
	    }
	    let score = 0;
	    let firstTeam = {name : selectedRows[0].name, score: score}
	    let secondTeam = {name : selectedRows[1].name, score: score}
	    for(let key in selectedRows[0]){
	      if(this.isNotStatCategory(key)) {continue;}
	      
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

	isNotStatCategory = key => {
		return key === 'name' || key === 'key' || key === 'index' || key === 'score';
	}
	
	isTurnoverCategory = key => key === '19'

	setTeamScores = (selectedRows, matchup) => {
		let currentStats = this.copyStats();
		let desiredWeekStats = currentStats[this.state.selectedWeekIndex];
		for (let teamIndex = 0; teamIndex < 2; teamIndex++){
			let desiredTeamToChangeScore = desiredWeekStats[selectedRows[teamIndex]['index']];
			desiredTeamToChangeScore['score'] = matchup[teamIndex]['score']
		}
		this.setState({
			stats: currentStats
		})
	}

	clearTeamScores = () => {
		let currentStats = this.copyStats();
		let desiredWeekStats = currentStats[this.state.selectedWeekIndex];
		this.state.selectedRows.forEach(team => {
			desiredWeekStats[team['index']]['score'] = '';
		})

		this.setState({
			stats: currentStats
		})
	}	
	
	copyStats = () => {
		return JSON.parse(JSON.stringify(this.state.stats));
	}

	handleWeekChange = (week) => {
		console.log('before if statement', this.state.stats)
		this.setState({
			stats: [],
			selectedWeek: 0
		}, () => {
			if (typeof this.state.stats[week-1] === 'undefined') {
				axios.get(this.backendDomain + `weeklystats/week/${week}`)
					.then(res => {
						this.setAllStatsDataState(res);
					})
			}
			else {
				this.setState({
					selectedWeek: week,
					selectedWeekIndex: parseInt(week)-1
				});
			}
		});
	}

	render(){
		// Don't render any of the children components until we receive the stats props via Axios
	    if (this.state.selectedWeek === 0){
	      return (
	      		<Button type="primary" loading>
		        	Loading Stats
		        </Button>
	      	)
	    }
		const rowSelection = {
	    	selectedRowKeys: this.state.selectedRowKeys,
	    	onChange: this.handleSelectChange,
	    };
	   
		return (
			<div>
				<WeekSelector 
					currentWeek= {this.state.currentWeek}
					selectedWeek= {this.state.selectedWeek}
					handleWeekChange={this.handleWeekChange}
				/>
				<StatsTable 
					stats={this.state.stats[this.state.selectedWeekIndex]} 
					rowSelection={rowSelection}
				/>	
			</div>
		)
	}
}

export default Stats;