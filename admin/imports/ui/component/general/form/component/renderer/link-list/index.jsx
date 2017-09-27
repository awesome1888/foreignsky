import React from 'react';
import connectField from 'uniforms/connectField';
import joinName from 'uniforms/joinName';
import filterDOMProps from 'uniforms/filterDOMProps';

// https://github.com/vazco/uniforms/blob/master/INTRODUCTION.md#autofield-algorithm
// https://github.com/vazco/uniforms/blob/master/API.md#connectfield
// https://github.com/vazco/uniforms/blob/master/packages/uniforms-unstyled/src/TextField.js

import Container from '../container/index.jsx';
import entityMap from '../../../../../../../startup/client/entity-map.js';
import Form from '../../../../form/form.jsx';
import Util from '../../../../../../../lib/util.js';
import ModalConfirm from '../../../../modal-confirm/index.jsx';
import PageNavigation from '../../../../page-navigation/page-navigation.jsx';

import { Button, List, Modal } from 'semantic-ui-react';

import './style.less';

import {ControllerClass as Link} from '../link/index.jsx';

class RendererLinkList extends Link
{
    constructor(props)
    {
        super(props);
        this.extendState({
            page: 1,
            count: 0,
        });
    }

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
            this.setState({
                count: this.getValueActual().length,
            });
        }

        return true;
    }

    getValueActual()
    {
        return this.getValue().map((id) => {
            return this.getCached(id);
        }).filter(x => !!x);
    }

    getPage()
    {
        return this.state.page || 1;
    }

    getCount()
    {
        return this.state.count || 0;
    }

    getPageSize()
    {
        return 5;
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

    getRange()
    {
        const start = this.getPageSize() * (this.getPage() - 1);
        const end = start + this.getPageSize();

        return [
            start, end,
        ];
    }

    onItemDeleteClick(id)
    {
        this._deleteConfirm.ask(
            'Do you want to detach the selected item? You will be able to re-attach this item in any time later.',
            'An important question'
        ).then((answer) => {
            if (answer)
            {
                this.getOnChange()(_.difference(this.getValue(), [id]));
            }
        });
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

    onPageChange(page)
    {
        this.setState({
            page,
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

    renderPageNav()
    {
        if (this.getCount() <= this.getPageSize())
        {
            return null;
        }

        return (
            <PageNavigation
                page={this.getPage()}
                pageSize={this.getPageSize()}
                count={this.getCount()}
                onPageSelect={this.onPageChange.bind(this)}
                isSmall
            />
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

    renderVisibleItems()
    {
        const entity = this.getEntity();

        const range = this.getRange();
        return this.getValueActual().map((data, index) => {
            if (index < range[0] || index > range[1])
            {
                return null;
            }

            return (
                <List.Item key={data._id}>
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
                            {data._id}
                        </div>
                        <input
                            type="hidden"
                            name={this.makeChildName()}
                            onChange={this.getOnChange(null, index)}
                            value={data._id}
                        />
                    </List.Content>
                </List.Item>
            );
        });
    }

    renderInvisibleItems()
    {
        const range = this.getRange();
        return this.getValueActual().map((data, index) => {
            if (index < range[0] || index > range[1])
            {
                return (
                    <input
                        key={data._id}
                        type="hidden"
                        name={this.makeChildName()}
                        onChange={this.getOnChange(null, index)}
                        value={data._id}
                    />
                );
            }

            return null;
        });
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

        return (
            <Container
                errorProps={this.props}
                {...filterDOMProps(this.props)}
            >
                <List divided verticalAlign='middle' className="margin-t no-margin-b">
                    {this.renderVisibleItems()}
                </List>

                {this.renderInvisibleItems()}

                <div className="margin-t">
                    {this.renderAddButton()}
                    {this.renderPageNav()}
                </div>

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
                                        submitButtonLabel="Save"
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
}

export default connectField(RendererLinkList, {includeInChain: false});
export const ControllerClass = RendererLinkList;
