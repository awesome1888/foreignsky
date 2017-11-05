/* eslint-disable class-methods-use-this */

import React from 'react';
import { Progress } from 'semantic-ui-react';

import BaseLoadProgress from '../../../general/etc/global-load-progress/index.jsx';

import './style.less';

export default class GlobalLoadProgress extends BaseLoadProgress {
    render()
    {
        return (
            <Progress
                percent={this.getPercent()}
                size='tiny'
                className="load-indicator"
                active={!this.isComplete()}
            />
        );
    }
}
