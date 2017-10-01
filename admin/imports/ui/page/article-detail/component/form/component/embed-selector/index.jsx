import React from 'react';
import connectField from 'uniforms/connectField';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLinkList} from '../../../../../../component/general/form/component/renderer/link-list/index.jsx';
import FileEntity from '../../../../../../../api/file/entity/entity.client.js';
import CachedRegistry from '../../../../../../../lib/base/cached-registry/index.jsx';
import Util from '../../../../../../../lib/util.js';

import './style.less';

class EmbedSelector extends RendererLinkList
{
    _files = null;

    constructor(props)
    {
        super(props);
        this.extendState({
            imagesReady: false,
        });
    }

    onCopyToClipBoardClick(id)
    {
        Util.copyToClipBoard(`[EMBED ID=${id}]`);
    }

    invalidateCaches()
    {
        this.getFileRegistry().invalidate();
        super.invalidateCaches();
    }

    isReady()
    {
        return this.state.imagesReady && super.isReady();
    }

    setItemsReady()
    {
        // load images for the first page
        this.loadImagesForPage(this.state.page).then(() => {
            super.setItemsReady();
        });
    }

    onPageChange(page)
    {
        // load new pack of images here, if page changed...
        this.loadImagesForPage(page).then(() => {
            this.setState({
                page,
            });
        });
    }

    async loadImagesForPage(page)
    {
        this.setState({
            imagesReady: false,
        });
        
        const ids = this.getItemPageRange(page).reduce((result, item) => {
            const data = item.getData();
            _.pluck(data.item, 'imageId').forEach((fId) => {
                result.push(fId);
            });

            return result;
        }, []);
        
        await this.getFileRegistry().pull(ids, ['_id', 'path']);

        this.setState({
            imagesReady: true,
        });
    }

    getFileRegistry()
    {
        if (!this._files)
        {
            this._files = new CachedRegistry(FileEntity);
        }

        return this._files;
    }

    getItemSelectFields()
    {
        return ['item.imageId'];
    }

    getFileUrl(id)
    {
        const file = this.getFileRegistry().get(id);
        if (file) {
            return file.getPathTo();
        }

        return '';
    }

    renderItem(item)
    {
        return (
            <div
                className="embed__grid-item-container"
                key={item.getId()}
            >
                <div className="embed__grid-item">
                    {this.renderItemMosaic(item)}
                    <div
                        className="embed__grid-item-edit"
                        title="Edit"
                        onClick={Util.passCtx(this.onItemClick, [item.getId()])}
                    />
                    <div
                        className="embed__grid-item-delete"
                        title="Delete"
                        onClick={Util.passCtx(this.onItemDeleteClick, [item.getId()])}
                    />
                    <div
                        className="embed__grid-item-copy-code"
                        title="Copy code to clipboard"
                        onClick={Util.passCtx(this.onCopyToClipBoardClick, [item.getId()])}
                    />
                </div>
            </div>
        );
    }

    renderItemMosaic(item)
    {
        const images = item.getImageIds();

        const count = item.getCount();
        if (count === 1)
        {
            return (
                <div
                    className="embed__grid-item-image"
                    style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                />
            );
        }
        else if (count === 2)
        {
            const rand = _.random(0, 9);

            if (rand < 5)
            {
                return (
                    <div className="embed__grid-item-mosaic_v">
                        <div>
                            <div
                                className="embed__grid-item-image"
                                style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                            />
                        </div>
                        <div>
                            <div
                                className="embed__grid-item-image"
                                style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                            />
                        </div>
                    </div>
                );
            }
            else
            {
                return (
                    <div className="embed__grid-item-mosaic_h">
                        <div>
                            <div
                                className="embed__grid-item-image"
                                style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                            />
                        </div>
                        <div>
                            <div
                                className="embed__grid-item-image"
                                style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                            />
                        </div>
                    </div>
                );
            }
        }
        else if(count === 3)
        {
            const rand = _.random(0, 9);
            const rand2 = _.random(0, 9);

            if (rand < 5)
            {
                if (rand2 < 5)
                {
                    return (
                        <div className="embed__grid-item-mosaic_v">
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                                />
                            </div>
                            <div>

                                <div className="embed__grid-item-mosaic_v">
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[2])})`}}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                }
                else
                {
                    return (
                        <div className="embed__grid-item-mosaic_v">
                            <div>

                                <div className="embed__grid-item-mosaic_v">
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[2])})`}}
                                />
                            </div>
                        </div>
                    );
                }
            }
            else
            {
                if (rand2 < 5)
                {
                    return (
                        <div className="embed__grid-item-mosaic_h">
                            <div>

                                <div className="embed__grid-item-mosaic_v">
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                                        />
                                    </div>
                                </div>

                            </div>
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[2])})`}}
                                />
                            </div>
                        </div>
                    );
                }
                else
                {
                    return (
                        <div className="embed__grid-item-mosaic_h">
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                                />
                            </div>
                            <div>

                                <div className="embed__grid-item-mosaic_v">
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                                        />
                                    </div>
                                    <div>
                                        <div
                                            className="embed__grid-item-image"
                                            style={{backgroundImage: `url(${this.getFileUrl(images[2])})`}}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                    );
                }
            }
        }
        else
        {
            return (
                <div className="embed__grid-item-mosaic_h">
                    <div>

                        <div className="embed__grid-item-mosaic_v">
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[0])})`}}
                                />
                            </div>
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[1])})`}}
                                />
                            </div>
                        </div>

                    </div>
                    <div>

                        <div className="embed__grid-item-mosaic_v">
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[2])})`}}
                                />
                            </div>
                            <div>
                                <div
                                    className="embed__grid-item-image"
                                    style={{backgroundImage: `url(${this.getFileUrl(images[3])})`}}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            );
        }
    }

    renderList()
    {
        return (
            <div className="embed__grid margin-b_x2">
                <div className="embed__grid-inner">
                    {
                        this.getItemPageRange().map((item) => {
                            return (
                                this.renderItem(item)
                            );
                        })
                    }
                </div>
            </div>
        );
    }
}

export default connectField(EmbedSelector, {});
