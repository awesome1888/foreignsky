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

    constructor(props)
    {
        super(props);
        this.extendState({
            uploadingFiles: [],
        });
    }

    onFileAddClick()
    {
        $(this.getFileButton()).click();
    }

    onFileButtonChange()
    {
        // as soon as files picked, we start uploading them
        const button = this.getFileButton();

        const files = button.files;
        const data = _.clone(this.state.uploadingFiles);
        for (let k = 0; k < files.length; k++)
        {
            data.push({
                name: files[k].name,
                isImage: files[k].type.toString().startsWith('image/'),
                size: files[k].size,
                percent: 0,
            });
        }

        this.setState({
            uploadingFiles: data,
        });

        this.startUpload(button);
    }

    startUpload(button)
    {
        
    }

    getFileButton()
    {
        return this._fileButton;
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
    
    renderNewFiles()
    {
        return (
            <div className="file-picker__items group_x">
                {
                    this.state.uploadingFiles.map((item) => {
                        return (
                            <div
                                className="file-picker__item"
                                key={item.name}
                            >
                                <div className="file-picker__item-name">
                                    <input type="text" value={item.name} />
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    // renderInputs()
    // {
    //     return (
    //         <div className="">
    //
    //         </div>
    //     );
    // }

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
                <input
                    className="file-picker__add-files-button-real"
                    type="file"
                    multiple
                    onChange={this.onFileButtonChange.bind(this)}
                    ref={(ref) => { this._fileButton = ref; }}
                />
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
                    <div className="margin-b_x">
                        {
                            this.hasExistingFiles()
                            &&
                            <div className="file-picker__existing">
                                <div className="file-picker__items group_x">
                                    <a
                                        href="/img/mauer/2kx2k/DSC_0668.jpg"
                                        className="file-picker__item-existing"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        style={{
                                            backgroundImage: 'url(/img/mauer/2kx2k/DSC_0668.jpg)',
                                        }}
                                    >
                                        <div className="file-picker__item-existing-delete" />
                                    </a>
                                    <a
                                        className="file-picker__item-existing"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                    >
                                        <div className="file-picker__item-existing-delete" />
                                    </a>
                                    <a
                                        href="/img/mauer/2kx2k/DSC_0668.jpg"
                                        className="file-picker__item-existing"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        style={{
                                            backgroundImage: 'url(/img/mauer/2kx2k/DSC_0668.jpg)',
                                        }}
                                    >
                                        <div className="file-picker__item-existing-delete" />
                                    </a>
                                    <a
                                        className="file-picker__item-new"
                                    >
                                        <div className="file-picker__item-new-inner">
                                            <div className="file-picker__item-new-progress">
                                                <div
                                                    className="file-picker__item-new-progress-bar_h"
                                                    style={{width: '30%'}}
                                                />
                                            </div>
                                        </div>
                                    </a>
                                    <a
                                        className="file-picker__item-new"
                                    >
                                        <div className="file-picker__item-new-inner">
                                            <div className="file-picker__item-new-progress">
                                                <div
                                                    className="file-picker__item-new-progress-bar_v"
                                                    style={{height: '30%'}}
                                                />
                                            </div>
                                        </div>
                                    </a>
                                    <a
                                        href="/img/mauer/2kx2k/DSC_0668.jpg"
                                        className="file-picker__item-existing"
                                        rel="noreferrer noopener"
                                        target="_blank"
                                        style={{
                                            backgroundImage: 'url(/img/mauer/2kx2k/DSC_0668.jpg)',
                                        }}
                                    >
                                        <div className="file-picker__item-existing-delete" />
                                    </a>
                                </div>
                            </div>
                        }
                    </div>
                }
                {this.renderAddNewButton()}
            </div>
        );
    }
}
