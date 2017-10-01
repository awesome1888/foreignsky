import React from 'react';
import connectField from 'uniforms/connectField';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import { Button, List, Modal } from 'semantic-ui-react';

import './style.less';

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';
import entityMap from '../../../../../../../startup/client/entity-map.js';
import Form from '../../../../form/form.jsx';
import Util from '../../../../../../../lib/util.js';
import ModalConfirm from '../../../../modal-confirm/index.jsx';

class RendererLink extends RendererGeneric
{
    _cache = {
        items: {},
        error: null,
        entity: null,
        map: null,
        model: null,
        itemId: null,
    };

    constructor(props)
    {
        super(props);
        this.extendState({
            formModalOpened: false,
            itemReady: false,
            modelReady: false,
            error: null,
        });
        this.onItemAddClick = this.onItemAddClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onItemDeleteClick = this.onItemDeleteClick.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onFormSubmitClick = this.onFormSubmitClick.bind(this);
        this.toggleFormModal = this.toggleFormModal.bind(this);
    }

    componentDidMount()
    {
        this.startDataReload();
    }

    async startDataReload(clearCache = false)
    {
        if (clearCache)
        {
            this.invalidateCaches();
        }

        this.setState({
            itemReady: false,
        });
        this.loadData().then(() => {
            this.setItemsReady();
        }, (err) => {
            this.setError(err);
        });
    }

    invalidateCaches()
    {
        this._cache.items = {};
    }

    setItemsReady()
    {
        this.setState({
            error: null,
            itemReady: true,
        });
    }

    getItemSelectFields()
    {
        return [this.getEntity().getCutawayAttributeCode()];
    }

    async loadData()
    {
        const id = this.getValue();
        const itemSaved = this.getCached(id);
        if (itemSaved)
        {
            return itemSaved;
        }

        const entity = this.getEntity();
        const fields = this.getItemSelectFields();
        const item = await entity.findById(id, {
            select: fields,
        });

        if (item)
        {
            this.saveToCache(item);
            return true;
        }

        return false;
    }

    getCached(id)
    {
        if (!id)
        {
            return null;
        }

        return this._cache.items[id] || null;
    }

    saveToCache(item)
    {
        const entity = this.getEntity();

        const data = item.exportData();
        data.label = item.getData()[entity.getCutawayAttributeCode()];

        this._cache.items[item.getId()] = data;
    }

    getEntity()
    {
        if (!this._cache.entity)
        {
            const entity = this.props.attribute.getParameter('entity');
            if (!entity) // todo: instanceof here
            {
                throw new ReferenceError('Illegal "entity" parameter for the attribute');
            }

            this._cache.entity = entity;
        }

        return this._cache.entity;
    }

    getMap()
    {
        return this.getEntity().getMap().filter((a) => {
            // show only auto-selectable attributes
            return a.isAutoSelectable();
        });
    }

    setError(error)
    {
        this.setState({
            error,
        });
    }

    hasError()
    {
        return !!this.state.error;
    }

    getErrorText()
    {
        console.error(this.state.error);
        return this.state.error.toString();
    }

    isReady()
    {
        return this.state.itemReady;
    }

    getOnChange()
    {
        if (_.isFunction(this.props.onChange))
        {
            return this.props.onChange;
        }

        return e => e;
    }

    onItemClick(id, e)
    {
        this.setState({
            modelReady: false,
            formError: null,
            itemId: id,
        });
        this.toggleFormModal();

        this.getEntity().findById(id, {
            select: '#',
        }).then((
            item
        ) => {
            this.setState({
                modelReady: true,
                model: item.getData(),
            });
        }, (err) => {
            this.setState({
                formError: error,
            });
        });

        e.preventDefault();
    }

    onItemDeleteClick(id)
    {
        this._deleteConfirm.ask(
            'Do you want to detach the selected item? You will be able to re-attach this item in any time later.',
            'An important question'
        ).then((answer) => {
            if (answer)
            {
                this.getOnChange()('');
            }
        });
    }

    onItemAddClick()
    {
        this.setState({
            model: {},
            modelReady: true,
            itemId: null,
        }, () => {
            this.toggleFormModal();
        });
    }

    onFormSubmitClick()
    {
        this._form.submit();
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
                const onChange = this.getOnChange();
                // new item added, update value
                onChange(res);
            }

            this.startDataReload(true);
            this.toggleFormModal();
        }, (error) => {
            this.setState({
                formError: error,
            });
        });
    }

    toggleFormModal()
    {
        this.setState({
            formModalOpened: !this.state.formModalOpened,
        });
    }

    transformMap(map)
    {
        return map;
    }

    transformModel()
    {
        return this.state.model;
    }

    transformModelBack(model)
    {
        return model;
    }

    getMapTransformed()
    {
        if (!this._cache.map)
        {
            this._cache.map = this.transformMap(this.getMap());
            // todo: pre-sort here by order!!!
        }

        return this._cache.map;
    }

    isFormReady()
    {
        return this.state.formModalOpened && this.state.modelReady;
    }

    isModeEdit()
    {
        return _.isObject(this.state.model) && _.isStringNotEmpty(this.state.model._id);
    }

    hasFormError()
    {
        return _.isStringNotEmpty(this.state.formError);
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

    renderDeleteButton()
    {
        return (
            <Button
                onClick={this.onItemDeleteClick}
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
        const value = this.getValue();
        const data = this.getCached(value);
        
        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <List divided verticalAlign='middle' className="margin-t no-margin-b">
                    {
                        (value && data)
                        &&
                        <List.Item>
                            <List.Content floated='right'>
                                {this.renderDeleteButton()}
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
                                    {data._id}
                                </div>
                                <input
                                    type="hidden"
                                    name={this.getName()}
                                    onChange={this.getOnChange()}
                                    value={this.getValue()}
                                />
                            </List.Content>
                        </List.Item>
                    }
                </List>

                {
                    !(value && data)
                    &&
                    <div className="margin-t">
                        {this.renderAddButton()}
                    </div>
                }

                <Modal
                    open={this.state.formModalOpened}
                    onClose={this.toggleFormModal}
                    dimmer="blurring"
                    closeIcon
                >
                    <Modal.Header>{this.isModeEdit() ? 'Item edit' : 'New item'}</Modal.Header>
                    <Modal.Content scrolling>
                        <Modal.Description>
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
                                        onSubmit={this.onFormSubmit}
                                        showFooter={false}
                                        ref={(ref) => { this._form = ref; }}
                                    />
                                </div>
                            }
                        </Modal.Description>
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

                <ModalConfirm ref={ref => { this._deleteConfirm = ref; }} />
            </Container>
        );
    }
};

export default connectField(RendererLink, {});
export const ControllerClass = RendererLink;
