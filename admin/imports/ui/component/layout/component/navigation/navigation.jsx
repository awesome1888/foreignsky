import React from 'react';
import { Dropdown, Icon, Input, Menu } from 'semantic-ui-react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
// import PropTypes from 'prop-types';
import entityMap from '../../../../../startup/client/entity-map.js';
// import Entity from '../../../../../lib/base/entity/entity.js';

export default class Navigation extends BaseComponent
{
    // getItems()
    // {
    //     const menuItems = [];
    //
    //     this.getEntityItems(menuItems);
    //
    //     // static
    //     // todo: inject items here in more sophisticated way
    //     menuItems.push({
    //         path: '/task-runner',
    //         title: 'Task Runner',
    //     });
    //
    //     return menuItems;
    // }

    getEntityItems()
    {
        const menuItems = [];
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

        return menuItems;
    }

    render()
    {
        const { activeItem } = this.state || {}

        // todo: generate this from the structure
        return (
            <Menu vertical className="w_100p">
                <Dropdown item text='Entity'>
                    <Dropdown.Menu>
                        {
                            this.getEntityItems().map((item) => {
                                return (
                                    <Dropdown.Item key={item.path} href={item.path}>
                                        {item.title}
                                    </Dropdown.Item>
                                );
                            })
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <Menu.Item name='browse' active={activeItem === 'browse'} href="/task-runner">
                    <div className="icon_build inline-float_right lh_14px" />
                    Task Runner
                </Menu.Item>
            </Menu>
        );
    }
}
