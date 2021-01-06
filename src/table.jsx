import React, { Component } from 'react';
import { httpRequest } from './util/request';

export default class table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataList: []
        };
    }

    getData = async () => {
        console.log('开始获取数据');
        const res = await httpRequest('GET', '/api/documents/');
        console.log(res);
        // console.log('结果', res2.data);
    };

    componentDidMount() {
        this.getData();
    }
    onClick() {
        this.getData();
    }

    render() {
        return (
            <div>
                <button onClick={this.onClick.bind(this)}>刷新数据</button>
            </div>
        );
    }
}
