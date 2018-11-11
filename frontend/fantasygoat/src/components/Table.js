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

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }

  cleanStatsForTable = (stats) => {
    const teams = stats["fantasy_content"]["league"][1]["teams"];
    let test = Object.values(teams).slice(0,10).map((val, i, arr) => {  
      let nameObj = val['team'][0][2];
      let stats = val['team'][1]['team_stats']['stats'].reduce((stats, current) => {
        if(current['stat']['stat_id'] !== "9004003" && current['stat']['stat_id'] !== "9007006") {
          let statObj = {}; 
          statObj[current['stat']['stat_id']] = current['stat']['value'];
          stats.push(statObj);
        }
        return stats;
      }, []);
      let obj = Object.assign({},nameObj,...stats);
      obj['key'] = nameObj['name'];
      return obj;
    }) 

    return test;
  }

  render() {
    // Don't render the table until we receive the stats data via Axios
    if (this.props.stats.length === 0){
      return null;
    }

    const stats = this.cleanStatsForTable(this.props.stats);
    console.log('Here is the cleaned data ready for use!', stats);
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
        <Table rowSelection={rowSelection} columns={statsColumns} dataSource={stats} />
      </div>
    );
  }
}

export default StatsTable;