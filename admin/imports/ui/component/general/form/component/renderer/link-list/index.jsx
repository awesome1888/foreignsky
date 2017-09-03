import React from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import Container from '../container/index.jsx';
// import Modal from '../../../../../general/modal/index.js';
import entityMap from '../../../../../../../startup/client/entity-map.js';
import Form from '../../../../form/form.jsx';
import Util from '../../../../../../../lib/util.js';

import { Button, List, Modal } from 'semantic-ui-react';

import './style.less';

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
            <Button
                onClick={this.onItemAddClick}
                size="mini"
                color="green"
                type="button"
            >
                New item
            </Button>
        );
    }

    renderDeleteButton(id)
    {
        return (
            <Button
                onClick={Util.passCtx(this.onItemDeleteClick, [id])}
                size="mini"
                type="button"
                className="no-margin"
            >
                Delete
            </Button>
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
                <List divided verticalAlign='middle' className="margin-t no-margin-b">
                    {
                        this.getValue().map((id, index) => {
                            const data = this.getCached(id);
                            if (!data)
                            {
                                return null;
                            }

                            return (
                                <List.Item key={id}>
                                    <List.Content floated='right'>
                                        {this.renderDeleteButton(data._id)}
                                    </List.Content>
                                    <List.Content>
                                        <a
                                            href={entityMap.makeDetailPath(entity, data._id)}
                                            target="_blank"
                                            className=""
                                            onClick={Util.passCtx(this.onItemClick, [data._id])}
                                        >
                                            {data.label ? data.label.toString() : data._id}
                                        </a>
                                        <div className="link-list__id">
                                            {id}
                                        </div>
                                        <input
                                            type="hidden"
                                            name={this.makeChildName()}
                                            onChange={this.getOnChange(null, index)}
                                            value={this.getValue()}
                                        />
                                    </List.Content>
                                </List.Item>
                            );
                        })
                    }
                </List>

                <div className="margin-t">
                    {this.renderAddButton()}
                </div>

                <Modal
                    open={this.state.formModalOpened}
                    onClose={this.toggleFormModal}
                    dimmer="blurring"
                    closeIcon
                >
                    <Modal.Header>{this.isModeEdit() ? 'Item edit' : 'New item'}</Modal.Header>
                    <Modal.Content scrolling>
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
                                    showFooter={false}
                                    ref={(ref) => { this._form = ref; }}
                                />
                            </div>
                        }
                    </Modal.Content>
                    <Modal.Actions>
                        <Button
                            color="green"
                            onClick={this.onFormSubmitClick}
                        >
                            Save
                        </Button>
                    </Modal.Actions>
                </Modal>
            </Container>
        );
    }
}

export default connectField(RendererLinkList, {includeInChain: false});
