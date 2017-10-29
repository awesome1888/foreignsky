import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';
import File from '../../../../../api/file/entity/entity.client.js';
import ModalConfirm from '../../modal-confirm/index.jsx';

import './style.less';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

export default class FilePicker extends BaseComponent
{
    static propTypes = {
        onChange: PropTypes.func,
        value: PropTypes.array,
        files: PropTypes.array,
    };

    static defaultProps = {
        onChange: null,
        value: [],
        files: [],
    };

    _invisible = null;
    _selector = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            uploadingFiles: [],
            locked: false,
        });
    }

    componentWillReceiveProps(props)
    {
        // console.dir('New props!');
        // console.dir(props);
    }

    onFileAddClick()
    {
        this._invisible.innerHTML = '';
        const selector = this.makeSelector();
        selector.appendTo(this._invisible);

        selector.click();
    }

    onFileButtonChange()
    {
        // as soon as files picked, we start uploading them
        const button = this.getSelector().get(0);

        const files = button.files;
        const data = _.clone(this.state.uploadingFiles);
        for (let k = 0; k < files.length; k++)
        {
            data.push({
                name: files[k].name,
                isImage: files[k].type.toString().startsWith('image/'),
                size: files[k].size,
                percent: 0,
                loaderType: _.random(0, 99) > 50 ? 'v' : 'h',
            });
        }

        this.setState({
            uploadingFiles: data,
        });

        this.lockButton();
        this.upload(button).then((ids) => {
            this.onChange(ids);
            this.unlockButton();
        });
    }

    getFiles()
    {
        return this.props.files;
    }

    getValue()
    {
        return this.props.value;
    }

    onChange(newIds)
    {
        const currentId = this.getValue();
        const ids = _.union(currentId, newIds);

        // mere with existing ids
        if (_.isFunction(this.props.onChange))
        {
            this.props.onChange(ids);
        }
    }

    onItemDeleteClick(id, e)
    {
        this._deleteConfirm.ask(
            'Do you want to detach the selected file? You will be able to re-attach this item in any time later.',
            'An important question'
        ).then((answer) => {
            if (answer)
            {
                if (_.isFunction(this.props.onChange))
                {
                    this.props.onChange(_.difference(this.getValue(), [id]));
                }
            }
        });

        e.preventDefault();
    }

    makeSelector()
    {
        this._selector = $('<input type="file" name="files" multiple>');
        this._selector.on('change', this.onFileButtonChange.bind(this));
        return this.getSelector();
    }

    getSelector()
    {
        return this._selector;
    }

    lockButton()
    {
        this.setState({
            locked: true,
        });
    }

    unlockButton()
    {
        this.setState({
            locked: false,
        });
    }

    setPercent(i, percent)
    {
        const data = _.clone(this.state.uploadingFiles);
        data[i].percent = percent;

        this.setState({
            uploadingFiles: data,
        });
    }

    async upload(button)
    {
        const ids = [];
        return Promise.all(_.map(button.files, (file, i) => {
            return this.uploadFile(file, this.setPercent.bind(this, i)).then((_id) => {
                ids.push(_id);
            });
        })).then(() => {
            return ids;
        });
    }

    async uploadFile(file, progressCallback)
    {
        const data = new FormData();
        data.append('file', file);

        return await File.save(null, data, {
            progressCallback
        });
    }

    hasExistingFiles()
    {
        return this.getValue().length > 0;
    }

    hasNewFiles()
    {
        return this.state.uploadingFiles.length > 0;
    }

    hasAnyFiles()
    {
        return this.hasNewFiles() || this.hasExistingFiles();
    }

    renderAddNewButton()
    {
        const hasAny = this.hasAnyFiles();

        return (
            <div className={`${!hasAny ? 'margin-t_x' : ''}`}>
                <Button
                    as="div"
                    color="blue"
                    className={`file-picker__add-files-button`}
                    size="mini"
                    onClick={this.onFileAddClick.bind(this)}
                    disabled={this.state.locked}
                >
                    {
                        hasAny
                        &&
                        <span>Add more files</span>
                    }
                    {
                        !hasAny
                        &&
                        <span>Add files</span>
                    }
                </Button>
                <div
                    ref={(ref) => { this._invisible = ref; }}
                    className="no-display"
                />
            </div>
        );
    }

    renderFiles()
    {
        const files = [];

        this.getFiles().forEach((item) => {
            files.push(
                <a
                    href={item.getAbsoluteUrl()}
                    className="file-picker__item-existing"
                    rel="noreferrer noopener"
                    target="_blank"
                    style={{
                        backgroundImage: `url(${item.getAbsoluteUrl()})`,
                    }}
                    key={`e_${item.getId()}`}
                >
                    <div
                        className="file-picker__item-existing-delete"
                        onClick={this.onItemDeleteClick.bind(this, item.getId())}
                    />
                </a>
            );
        });

        this.state.uploadingFiles.forEach((file, i) => {
            const style = file.loaderType === 'h' ? {width: `${file.percent}%`} : {height: `${file.percent}%`};
            files.push(
                <a
                    className="file-picker__item-new"
                    key={`n_${i}`}
                >
                    <div className="file-picker__item-new-inner">
                        <div className="file-picker__item-new-progress">
                            <span className="file-picker__item-new-progress-bar-text">{`${file.percent}%`}</span>
                            <div
                                className={`file-picker__item-new-progress-bar_${file.loaderType}`}
                                style={style}
                            >
                                <span className="file-picker__item-new-progress-bar-text file-picker__item-new-progress-bar-text_inner">{`${file.percent}%`}</span>
                            </div>
                        </div>
                    </div>
                </a>
            );
        });

        return (
            <div className="margin-b_x">
                <div className="file-picker__items group_x">
                    {files}
                </div>
            </div>
        );
    }

    render()
    {
        const hasAnyFile = this.hasAnyFiles();

        return (
            <div className="file-picker">
                {
                    hasAnyFile
                    &&
                    this.renderFiles()
                }
                {this.renderAddNewButton()}
                <ModalConfirm ref={ref => { this._deleteConfirm = ref; }} />
            </div>
        );
    }
}
