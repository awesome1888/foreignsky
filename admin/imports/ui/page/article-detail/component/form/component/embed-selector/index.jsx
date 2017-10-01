import React from 'react';
import connectField from 'uniforms/connectField';
// import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import {ControllerClass as RendererLinkList} from '../../../../../../component/general/form/component/renderer/link-list/index.jsx';
import FileEntity from '../../../../../../../api/file/entity/entity.client.js';
import CachedRegistry from '../../../../../../../lib/base/cached-registry/index.jsx';
// import Container from '../../../../../../component/general/form/component/renderer/container/index.jsx';

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
            _.pluck(item.item, 'imageId').forEach((fId) => {
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

    renderList()
    {
        console.dir(this.getFileRegistry());

        return null;
    }
}

export default connectField(EmbedSelector, {});
