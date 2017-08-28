import React from 'react';
import { Menu } from 'semantic-ui-react'
import BaseComponent from '../../../../../lib/base/component/component.jsx';
// import PropTypes from 'prop-types';
import entityMap from '../../../../../startup/client/entity-map.js';
// import Entity from '../../../../../lib/base/entity/entity.js';

export default class Navigation extends BaseComponent
{
    getItems()
    {
        const menuItems = [];

        this.makeEntityItems(menuItems);

        // static
        // todo: inject items here in more sophisticated way
        menuItems.push({
            path: '/task-runner',
            title: 'Task Runner',
        });

        return menuItems;
    }

    makeEntityItems(menuItems)
    {
        entityMap.forEach((item) => {
            const entity = item.entity;
            const listRoute = _.getValue(item, 'route.list');
            if (_.isObjectNotEmpty(listRoute) && entity)
            {
                menuItems.push({
                    path: listRoute.path,
                    title: entity.getTitle(),
                });
            }
        });
    }

    render()
    {
        const { activeItem } = this.state || {}

        return (
            <div className="">

                <Menu vertical>
                    <Menu.Item>
                        <Menu.Header>Products</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item name='enterprise' active={activeItem === 'enterprise'} onClick={this.handleItemClick} />
                            <Menu.Item name='consumer' active={activeItem === 'consumer'} onClick={this.handleItemClick} />
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        <Menu.Header>CMS Solutions</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item name='rails' active={activeItem === 'rails'} onClick={this.handleItemClick} />
                            <Menu.Item name='python' active={activeItem === 'python'} onClick={this.handleItemClick} />
                            <Menu.Item name='php' active={activeItem === 'php'} onClick={this.handleItemClick} />
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        <Menu.Header>Hosting</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item name='shared' active={activeItem === 'shared'} onClick={this.handleItemClick} />
                            <Menu.Item name='dedicated' active={activeItem === 'dedicated'} onClick={this.handleItemClick} />
                        </Menu.Menu>
                    </Menu.Item>

                    <Menu.Item>
                        <Menu.Header>Support</Menu.Header>

                        <Menu.Menu>
                            <Menu.Item name='email' active={activeItem === 'email'} onClick={this.handleItemClick}>
                                E-mail Support
                            </Menu.Item>

                            <Menu.Item name='faq' active={activeItem === 'faq'} onClick={this.handleItemClick}>
                                FAQs
                            </Menu.Item>
                        </Menu.Menu>
                    </Menu.Item>
                </Menu>


                {/*{*/}
                    {/*this.getItems().map((item) => {*/}
                        {/*return (*/}
                            {/*<div key={`${item.path} - ${item.title}`}>*/}
                                {/*<a href={item.path}>{item.title}</a>*/}
                            {/*</div>*/}
                        {/*);*/}
                    {/*})*/}
                {/*}*/}
            </div>
        );
    }
}

//<br />
//<br />
//<br />
//<a href="/entity/article">Article</a>
//    <a href="/entity/article.tag">Article tag</a>
//<a href="/entity/embed">Embed</a>
//    <a href="/entity/file">File</a>
//    <br />
//    <a href="/task-runner">Task runner</a>