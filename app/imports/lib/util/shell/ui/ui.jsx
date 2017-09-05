import {Meteor} from 'meteor/meteor';
import React from 'react';

import BaseComponent from '../../../base/component/component.jsx';
import { Button } from 'semantic-ui-react';

import './style.less';

export default class UI extends BaseComponent
{
    static defaultProps = {
        className: '',
    };

    constructor(params)
    {
        super(params);
        this.state = {
            loading: false,
            ready: false,
            executed: false,
            time: 0,
            data: '',
            jobs: [],
        };
    }

    componentWillMount()
    {
        this.loadJobs();
    }

    loadJobs()
    {
        Meteor.call('shell.registration.list', (err, res) => {
            let jobs = {};
            if (!err && _.isObjectNotEmpty(res.jobs)) {
                jobs = res.jobs;
            }

            const items = [];
            _.forEach(jobs, (item, code) => {
                items.push({
                    key: code,
                    value: item.name,
                });
            });

            this.setState({
                jobs: items,
                ready: true,
            });
        });
    }

    getJobs()
    {
        return this.state.jobs;
    }

    run(code) {
        if (this.state.loading) {
            return;
        }

        this.setState({loading: true});
        this.execute('shell.execute', [code]).then((res) => {
            console.dir(res);
            this.setState({
                loading: false,
                executed: true,
                time: res.duration || 0,
                data: res.data,
                durations: res.durations || {},
                times: res.times || {},
            });
        });
    }

    onSumbit()
    {
        const code = this._select.value;
        if (code)
        {
            this.run(code);
        }
    }

    renderButtons() {

        return (
            <div className="shell-ui__panel">
                <select
                    className="shell-ui__selectbox"
                    ref={ ref => {this._select = ref; } }
                >
                    {
                        this.getJobs().map((job) => {
                            return (
                                <option
                                    value={job.key}
                                    key={job.key}
                                >
                                    {job.value}
                                </option>
                            );
                        })
                    }
                </select>
                <Button
                    color="green"
                    onClick={this.onSumbit.bind(this)}
                >
                    Execute
                </Button>
            </div>
        );
    }

    renderStatistics()
    {
        return (
            <div className="shell-ui__statistics">
                <div className="">
                    <span className="shell-ui__statistics-header">Execution time:</span>
                    <div className="">
                        {this.state.time} seconds
                    </div>
                </div>
                {
                    _.isObjectNotEmpty(this.state.durations)
                    &&
                    <div className="">
                        Durations:
                    </div>
                }
                {
                    _.isObjectNotEmpty(this.state.times)
                    &&
                    <div className="">
                        Times:
                    </div>
                }
            </div>
        );
    }

    render() {
        if (!this.state.ready) {
            return (<div>Loading...</div>);
        }

        if (!_.isObjectNotEmpty(this.state.jobs)) {
            return (<div>No jobs registered. Please register a job on the server side.</div>);
        }

        return (
            <div className={this.props.className}>
                <div className="group_x">
                    {this.renderButtons()}

                    <div className="shell-ui__output">
                        {
                            this.state.loading
                            &&
                            <div>
                                Executing...
                            </div>
                        }
                        {
                            !this.state.loading
                            &&
                            this.state.data
                        }
                    </div>

                    {
                        this.state.executed
                        &&
                        this.renderStatistics()
                    }
                </div>
            </div>
        );
    }
}
