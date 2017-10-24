import React from 'react';

import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';
import PropTypes from 'prop-types';

import { Button } from 'semantic-ui-react';

export default class FilePicker extends BaseComponent
{
    static propTypes = {
    };

    static defaultProps = {
    };

    _fileButton = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            newFiles: [],
        });
    }

    onFileButtonChange()
    {
        const files = this.getFileButton().files;
        const data = [];
        for (let k = 0; k < files.length; k++)
        {
            data.push({
                name: files[k].name,
                isImage: files[k].type.toString().startsWith('image/'),
                size: files[k].size,
            });
        }

        this.setState({
            newFiles: data,
        });
    }

    getFileButton()
    {
        return this._fileButton;
    }

    hasExistingFiles()
    {
        return false;
    }

    hasNewFiles()
    {
        return this.state.newFiles.length > 0;
    }

    hasAnyFiles()
    {
        return this.hasNewFiles() || this.hasExistingFiles();
    }

    renderNewFiles()
    {
        return (
            <div className="file-picker__items group_x">
                {
                    this.state.newFiles.map((item) => {
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

    render()
    {
        return (
            <div className="file-picker">
                {
                    this.hasAnyFiles()
                    &&
                    <div className="margin-b_x2">
                        <div className="file-picker__existing">
                            <div className="file-picker__items">

                            </div>
                        </div>
                        {
                            this.hasNewFiles()
                            &&
                            <div className="file-picker__new margin-b_x">
                                <div className="file-picker__header margin-b_x">
                                    Files to be added:
                                </div>
                                {this.renderNewFiles()}
                            </div>
                        }
                    </div>
                }

                <Button
                    as="div"
                    color="blue"
                    className="file-picker__add-files-button"
                    size="mini"
                >
                    Add files
                    <input
                        className="file-picker__add-files-button-real"
                        type="file"
                        multiple
                        onChange={this.onFileButtonChange.bind(this)}
                        ref={(ref) => { this._fileButton = ref; }}
                    />
                </Button>
            </div>
        );
    }
}
