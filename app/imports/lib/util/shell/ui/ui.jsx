import {Meteor} from 'meteor/meteor';
import React from 'react';

import { Form } from 'semantic-ui-react';

import './style.less';

export default class UI extends React.Component {

    static defaultProps = {
        className: '',
    };

    constructor(params) {
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

    componentWillMount() {
        Meteor.call('shell.registration.list', (err, res) => {
            let jobs = {};
            if (!err && _.isObjectNotEmpty(res.jobs)) {
                jobs = res.jobs;
            }

            const items = [];
            _.forEach(jobs, (item, code) => {
                items.push({
                    key: code,
                    value: code,
                    text: item.name,
                });
            });
            
            this.setState({
                jobs: items,
                ready: true,
            });
        });
    }

    execute() {
        const jobId = this.shellName.value;

        if (this.state.loading) {
            return;
        }

        this.setState({loading: true});
        Meteor.call('shell.execute', jobId, (err, res) => {
            if (!err) {
                this.setState({
                    loading: false,
                    executed: true,
                    time: res.duration || 0,
                    data: res.data,
                    durations: res.durations || {},
                    times: res.times || {},
                });
            }
        });
    }

    onSumbit()
    {
        console.dir(this._select);
        
        const code = this._select.value;
        console.dir(code);
    }

    renderButtons() {
        return (
            <Form
                onSubmit={this.onSumbit.bind(this)}
            >
                <Form.Group widths='equal'>
                    <Form.Select
                        options={this.state.jobs}
                        placeholder='Choose the task'
                        ref={ ref => {this._select = ref; } }
                    />
                    <Form.Button>Execute</Form.Button>
                </Form.Group>
            </Form>
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
                        <div className="data-block">
                            <div
                                className="data-block__content data-block__content_adaptive padding-top-bottom_half text_size_small text_color_gray"
                            >
                                Execution time: {this.state.time} seconds
                            </div>
                        </div>
                    }

                    {
                        _.isObjectNotEmpty(this.state.durations)
                        &&
                        <div className="data-block">
                            <div className="data-block__title text_size_minor">
                                Durations
                            </div>
                            <div className="data-block__content data-block__content_adaptive">
                                <div className="group_vertical">
                                    {
                                        _.map(this.state.durations, item => (
                                            <div key={`duration-${item.label}-${item.total}`}>
                                                {item.label} &mdash; {item.total} seconds
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }

                    {
                        _.isObjectNotEmpty(this.state.times)
                        &&
                        <div className="data-block">
                            <div className="data-block__title text_size_minor">
                                Call times
                            </div>
                            <div className="data-block__content data-block__content_adaptive">
                                <div className="group_vertical">
                                    {
                                        _.map(this.state.times, item => (
                                            <div key={`times-${item.label}-${item.count}`}>
                                                {item.label} &mdash; {item.count} times called
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
