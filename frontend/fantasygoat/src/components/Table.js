import React from 'react';
import { Table } from 'antd';

const sortNums = (a, b) => a.name.length - b.name.length;

const statsColumns = [{
  title: 'Team Name',
  dataIndex: 'name',
  sorter: (a, b) => a.name.length - b.name.length,
}, {
  title: 'FG%',
  dataIndex: '5',
  sorter: sortNums,
}, {
  title: 'FT%',
  dataIndex: '8',
  sorter: sortNums,
}, {
  title: '3PTM',
  dataIndex: '10',
  sorter: sortNums,
}, {
  title: 'PTS',
  dataIndex: '12',
  sorter: sortNums,
}, {
  title: 'REB',
  dataIndex: '15',
  sorter: sortNums,
}, {
  title: 'AST',
  dataIndex: '16',
  sorter: sortNums,
}, {
  title: 'ST',
  dataIndex: '17',
  sorter: sortNums,
}, {
  title: 'BLK',
  dataIndex: '18',
  sorter: sortNums,
}, {
  title: 'TO',
  dataIndex: '19',
  sorter: sortNums,
}, {
  title: 'Score',
  dataIndex: 'score',
}];

class StatsTable extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      selectedRowKeys: [], // Check here to configure the default column
    };
  }

  test = (record, index) => {
    //console.log('record:', record, 'index', index);
  }

  render() {
    
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
        </div>
        <Table 
            rowSelection={this.props.rowSelection} 
            columns={statsColumns} 
            dataSource={this.props.stats}
            rowClassName = {this.test}
        />
      </div>
    );
  }
}

export default StatsTable;