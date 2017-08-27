import React from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import Container from '../container/index.jsx';
import Modal from '../../../../../general/modal/index.js';
import entityMap from '../../../../../../../startup/client/entity-map.js';
import Form from '../../../../form/form.jsx';
import Util from '../../../../../../../lib/util.js';

import {RendererClass} from '../link/index.jsx';

class RendererLinkList extends RendererClass
{
    async loadData()
    {
        const ids2Get = _.difference(this.getValue(), this.getCachedIds());

        if (_.isArrayNotEmpty(ids2Get))
        {
            const entity = this.getEntity();
            const data = await entity.find({
                select: [entity.getCutawayAttributeCode()],
                filter: {
                    _id: {$in: this.getValue()}
                },
            });
            data.forEach((item) => {
                this.saveToCache(item);
            });
        }

        return true;
    }

    getCachedIds()
    {
        return Object.keys(this._cache.items);
    }

    getChildName()
    {
        return '$';
    }

    makeChildName(child = null, index = false)
    {
        let childName = this.getChildName();
        if (child && _.isStringNotEmpty(child.props.name))
        {
            childName = child.props.name;
        }

        return joinName(
            this.getName(),
            index !== false ? childName.replace('$', index) : childName
        );
    }

    isLimitReached()
    {
        const a = this.getAttribute();

        return this.isDisabled() || a.getMaxCount() <= this.getValue().length;
    }

    onItemDeleteClick(id)
    {
        const onChange = this.getOnChange();

        onChange(_.difference(this.getValue(), [id]));
    }

    onItemAddClick()
    {
        const isLimitReached = this.isLimitReached();

        if (!isLimitReached)
        {
            this.setState({
                model: {},
                modelReady: true,
                itemId: null,
            }, () => {
                this.toggleFormModal();
            });
        }
    }

    onFormSubmit(data)
    {
        const id = this.state.itemId;

        this.getEntity().save(
            id,
            data
        ).then((res) => {

            if (!id)
            {
                // new item added, need to add this to values
                const onChange = this.getOnChange();
                const val = this.getValue();

                onChange(val.concat([res]));
            }

            this.startDataReload(true);
            this.toggleFormModal();
        }, (error) => {
            this.setState({
                formError: error,
            });
        });
    }

    renderAddButton()
    {
        return (
            <button
                type="button"
                onClick={this.onItemAddClick}
            >
                + Add
            </button>
        );
    }

    renderDeleteButton(id)
    {
        return (
            <button
                onClick={Util.passCtx(this.onItemDeleteClick, [id])}
                type="button"
            >
                Delete
            </button>
        );
    }

    render()
    {
        if (this.hasError())
        {
            return (
                <div className="form__error">
                    {this.getErrorText()}
                </div>
            );
        }

        if (!this.isReady())
        {
            return null;
        }

        const entity = this.getEntity();

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <div>
                    {
                        this.getValue().map((id, index) => {
                            const data = this.getCached(id);
                            if (!data)
                            {
                                return null;
                            }

                            return (
                                <div
                                    key={index}
                                >
                                    <a
                                        href={entityMap.makeDetailPath(entity, data._id)}
                                        target="_blank"
                                        className=""
                                        onClick={Util.passCtx(this.onItemClick, [data._id])}
                                    >
                                        {data.label ? data.label.toString() : data._id}
                                    </a>
                                    <input
                                        type="hidden"
                                        name={this.makeChildName()}
                                        onChange={this.getOnChange(null, index)}
                                        value={this.getValue()}
                                    />
                                    {this.renderDeleteButton(data._id)}
                                </div>
                            );
                        })
                    }
                    <div>
                        {this.renderAddButton()}
                    </div>
                    <Modal
                        onClose={this.toggleFormModal}
                        opened={this.state.formModalOpened}
                    >
                        {
                            !this.isFormReady()
                            &&
                            <div>Loading...</div>
                        }
                        {
                            this.isFormReady()
                            &&
                            <div>
                                {
                                    this.hasFormError()
                                    &&
                                    <div className="form__error-message form__error-message_top">
                                        {this.state.formError}
                                    </div>
                                }
                                <Form
                                    map={this.getMapTransformed()}
                                    model={this.transformModel()}
                                    submitButtonLabel="Save"
                                    onSubmit={this.onFormSubmit}
                                />
                            </div>
                        }
                    </Modal>
                </div>
            </Container>
        );
    }
}

export default connectField(RendererLinkList, {includeInChain: false});
