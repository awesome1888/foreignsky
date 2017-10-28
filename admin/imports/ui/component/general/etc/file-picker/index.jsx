import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';
import File from '../../../../../api/file/entity/entity.client.js';

import './style.less';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

export default class FilePicker extends BaseComponent
{
    static propTypes = {
    };

    static defaultProps = {
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

    onFileAddClick()
    {
        this._invisible.innerHTML = '';
        const selector = this.makeSelector();
        console.dir(selector);
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
        this.upload(button).then(() => {
            console.dir('Uploaded!');
            this.unlockButton();
        });
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
        console.dir(i+' '+percent);
        
        const data = _.clone(this.state.uploadingFiles);
        data[i].percent = percent;

        this.setState({
            uploadingFiles: data,
        });
    }

    async upload(button)
    {
        return Promise.all(_.map(button.files, (file, i) => {
            return this.uploadFile(file, this.setPercent.bind(this, i));
        }));
    }

    async uploadFile(file, cb)
    {
        const formData = new FormData();
        formData.append('file', file);

        return this.submit(formData, cb);
    }

    async submit(data, prcCallback)
    {
        return new Promise((resolve) => {
            $.ajax({
                url: '/upload',
                type: 'post',
                contentType: false,
                processData: false,
                data,
                dataType: 'json',
                xhr: () => {
                    const xhr = $.ajaxSettings.xhr();
                    xhr.upload.addEventListener('progress', (evt) => {
                        if (evt.lengthComputable)
                        {
                            prcCallback(Math.ceil(evt.loaded / evt.total * 100));
                        }
                    }, false);
                    return xhr;
                },
                success: function(json){
                    resolve({error: null, result: json});
                },
                error: function(x, text){
                    resolve({error: text, result: null});
                },
            });
        });
    }

    hasExistingFiles()
    {
        return true;
    }

    hasNewFiles()
    {
        return this.state.uploadingFiles.length > 0;
    }

    hasAnyFiles()
    {
        return this.hasNewFiles() || this.hasExistingFiles();
    }

    isButtonSelected()
    {
        
    }

    renderAddNewButton()
    {
        return (
            <div className="">
                <Button
                    as="div"
                    color="blue"
                    className="file-picker__add-files-button"
                    size="mini"
                    onClick={this.onFileAddClick.bind(this)}
                    disabled={this.state.locked}
                >
                    {
                        this.hasAnyFiles()
                        &&
                        <span>Add more files</span>
                    }
                    {
                        !this.hasAnyFiles()
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

        files.push(
            <a
                href="/img/mauer/2kx2k/DSC_0668.jpg"
                className="file-picker__item-existing"
                rel="noreferrer noopener"
                target="_blank"
                style={{
                    backgroundImage: 'url(/img/mauer/2kx2k/DSC_0668.jpg)',
                }}
                key="e_1"
            >
                <div className="file-picker__item-existing-delete" />
            </a>
        );

        files.push(
            <a
                href="/img/mauer/2kx2k/DSC_0668.jpg"
                className="file-picker__item-existing"
                rel="noreferrer noopener"
                target="_blank"
                style={{
                    backgroundImage: 'url(/img/mauer/2kx2k/DSC_0668.jpg)',
                }}
                key="e_2"
            >
                <div className="file-picker__item-existing-delete" />
            </a>
        );

        files.push(
            <a
                className="file-picker__item-existing"
                rel="noreferrer noopener"
                target="_blank"
                key="e_3"
            >
                <div className="file-picker__item-existing-delete" />
            </a>
        );

        this.state.uploadingFiles.forEach((file, i) => {
            files.push(
                <a
                    className="file-picker__item-new"
                    key={`n_${i}`}
                >
                    <div className="file-picker__item-new-inner">
                        <div className="file-picker__item-new-progress">
                            <div
                                className={`file-picker__item-new-progress-bar_${file.loaderType}`}
                                style={{height: `${file.percent}%`}}
                            />
                        </div>
                    </div>
                </a>
            );
        });

        files.push(
            <a
                className="file-picker__item-new"
                key={`n_222`}
            >
                <div className="file-picker__item-new-inner">
                    <div className="file-picker__item-new-progress">
                        <span className="file-picker__item-new-progress-bar-text">50%</span>
                        <div
                            className={`file-picker__item-new-progress-bar_h`}
                            style={{width: `50%`}}
                        >
                            <span className="file-picker__item-new-progress-bar-text file-picker__item-new-progress-bar-text_inner">50%</span>
                        </div>
                    </div>
                </div>
            </a>
        );

        files.push(
            <a
                className="file-picker__item-new"
                key={`n_222333`}
            >
                <div className="file-picker__item-new-inner">
                    <div className="file-picker__item-new-progress">
                        <span className="file-picker__item-new-progress-bar-text">50%</span>
                        <div
                            className={`file-picker__item-new-progress-bar_v`}
                            style={{height: `50%`}}
                        >
                            <span className="file-picker__item-new-progress-bar-text file-picker__item-new-progress-bar-text_inner">50%</span>
                        </div>
                    </div>
                </div>
            </a>
        );

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
        return (
            <div className="file-picker">
                {
                    this.hasAnyFiles()
                    &&
                    this.renderFiles()
                }
                {this.renderAddNewButton()}
            </div>
        );
    }
}
