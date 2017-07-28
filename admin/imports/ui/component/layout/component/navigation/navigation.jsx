import React from 'react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';
// import PropTypes from 'prop-types';
import entityMap from '../../../../../startup/client/entity-map.js';
// import Entity from '../../../../../lib/base/entity/entity.js';

export default class Navigation extends BaseComponent
{
    getItems()
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

        // static
        // todo: inject items here in more sophisticated way
        menuItems.push({
            path: '/task-runner',
            title: 'Task Runner',
        });

        return menuItems;
    }

    render()
    {
        return (
            <div className="">
                {
                    this.getItems().map((item) => {
                        return (
                            <div key={`${item.path} - ${item.title}`}>
                                <a href={item.path}>{item.title}</a>
                            </div>
                        );
                    })
                }
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