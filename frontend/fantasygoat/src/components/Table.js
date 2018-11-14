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

  greaterThan = n => m => m > n

  lessThan = n => m => m < n

  render() {
    // Don't render this component until we receive the stats props via Axios
    console.log(this.props)
    if (this.props.stats.length === 0){
      return null;
    }
    
    const { loading, selectedRowKeys } = this.state;
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
        <Table rowSelection={this.props.rowSelection} columns={statsColumns} dataSource={this.props.stats} />
      </div>
    );
  }
}

export default StatsTable;