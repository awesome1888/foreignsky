import React, {Children} from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import RendererGeneric from '../generic/index.jsx';
import Container from '../container/index.jsx';
import Modal from '../../../../../general/modal/index.js';
import entityMap from '../../../../../../../startup/client/entity-map.js';
import Form from '../../../../form/form.jsx';
import Util from '../../../../../../../lib/util.js';

class RendererLinkList extends RendererGeneric
{
    _cache = {
        items: {},
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
        this.toggleFormModal = this.toggleFormModal.bind(this);
    }

    componentDidMount()
    {
        this.startDataReload();
    }

    startDataReload(clearCache = false)
    {
        if (clearCache)
        {
            this._cache.items = {};
        }

        this.setState({
            itemReady: false,
        });
        this.loadData().then(() => {
            this.setState({
                error: null,
                itemReady: true,
            });
        }, (err) => {
            this.setError(err);
        });
    }

    async loadData()
    {
        const ids2Get = _.difference(this.getValue(), this.getCachedIds());

        if (_.isArrayNotEmpty(ids2Get))
        {
            const entity = this.getEntity();
            const data = await entity.find({
                select: [entity.getPrimaryAttributeCode()],
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

    saveToCache(item)
    {
        const entity = this.getEntity();

        this._cache.items[item.getId()] = {
            _id: item.getId(),
            label: item.getData()[entity.getPrimaryAttributeCode()],
        };
    }

    getCachedIds()
    {
        return Object.keys(this._cache.items);
    }

    getCached(id)
    {
        return this._cache.items[id] || null;
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
            select: '*',
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

    toggleFormModal()
    {
        this.setState({
            formModalOpened: !this.state.formModalOpened,
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

    renderDeleteButton()
    {
        // todo
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

    hasFormError()
    {
        return _.isStringNotEmpty(this.state.formError);
    }

    render()
    {
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
                                        {data.label}
                                    </a>
                                    <input
                                        type="hidden"
                                        name={this.makeChildName()}
                                        onChange={this.getOnChange(null, index)}
                                        value={this.getValue()}
                                    />
                                    <button
                                        onClick={Util.passCtx(this.onItemDeleteClick, [data._id])}
                                        type="button"
                                    >
                                        Delete
                                    </button>
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
