import React from 'react';
import { Table, Button } from 'antd';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
}, {
  title: 'Age',
  dataIndex: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
}];

const data = [];
for (let i = 0; i < 46; i++) {
  data.push({
    key: i,
    name: `Edward King ${i}`,
    age: 32,
    address: `London, Park Lane no. ${i}`,
  });
}


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
    console.log('hello world');
  }

  render() {
    // Don't render the table until we receive the stats data via Axios
    if (this.props.stats.length === 0){
      return null;
    }
    console.log('I got the stats props!', this.props.stats);

    const stats = this.cleanStatsForTable(this.props.stats);
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
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default StatsTable;