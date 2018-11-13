import React from 'react';
import { Table, Button } from 'antd';

const statsColumns = [{
  title: 'Team Name',
  dataIndex: 'name',
}, {
  title: 'FG%',
  dataIndex: '5',
}, {
  title: 'FT%',
  dataIndex: '8',
}, {
  title: '3PTM',
  dataIndex: '10',
}, {
  title: 'PTS',
  dataIndex: '12',
}, {
  title: 'REB',
  dataIndex: '15',
}, {
  title: 'AST',
  dataIndex: '16',
}, {
  title: 'ST',
  dataIndex: '17',
}, {
  title: 'BLK',
  dataIndex: '18',
}, {
  title: 'TO',
  dataIndex: '19',
}, {
  title: 'Score',
  dataIndex: 'score',
}];

class StatsTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
      loading: false,
    };
  }

  start = () => {
    this.setState({ loading: true });
    // ajax request after empty completing
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
    console.log('selectedRows are:', selectedRows);
    console.log(this.calculateScore(selectedRowKeys, selectedRows));
  }

  calculateScore = (selectedRowKeys, selectedRows) => {
    if (selectedRows.length < 2) {
      return 'Not enough teams selected'
    }
    let count = 0;
    let firstTeam = {name : selectedRows[0].name, count: count}
    let secondTeam = {name : selectedRows[1].name, count: count}
    for(let key in selectedRows[0]){
      if(key === 'name' || key === 'key') {continue;}
      
      let firstTeamStat = selectedRows[0][key];
      let secondTeamStat = selectedRows[1][key];
      
      if (this.isTurnoverCategory(key)){
        if (firstTeamStat < secondTeamStat) {
          firstTeam.count++;
        }
        if (secondTeamStat < firstTeamStat) {
          secondTeam.count++;
        }
      }
      else {
        if (firstTeamStat > secondTeamStat) {
          firstTeam.count++;
        }
        if (secondTeamStat > firstTeamStat) {
          secondTeam.count++;
        }
      } 
    } 
    return [firstTeam, secondTeam];
  }

  isTurnoverCategory = key => key === '19'

  greaterThan = n => m => m > n

  lessThan = n => m => m < n

  render() {
    // Don't render this component until we receive the stats props via Axios
    if (this.props.stats.length === 0){
      return null;
    }
    
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    
    return (
      <div>
        THIS IS THE STATS TABLE!
        <div style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            onClick={this.start}
            disabled={!hasSelected}
            loading={loading}
          >
            Reload
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
          </span>
        </div>
        <Table rowSelection={rowSelection} columns={statsColumns} dataSource={this.props.stats} />
      </div>
    );
  }
}

export default StatsTable;