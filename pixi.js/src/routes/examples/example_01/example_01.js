import React from 'react';
import { Link } from 'dva/router';
import * as PIXI from 'pixi.js'
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

export default class HomePage extends React.Component {
    state = {
        operates: [],
        confirmDirty: false
    };

    componentDidMount() {
        this.setState({
            ...this.props.data
        });

        let app = new PIXI.Application({width: 256, height: 256});
        let element= document.getElementById("example01");
        element.appendChild(app.view);
    }
    render() {
        const appcfg=window.AppConfigs;
        return (
            <PageHeaderLayout>
                <div id="example01">
                
                </div>
            </PageHeaderLayout>
        );
    }
}