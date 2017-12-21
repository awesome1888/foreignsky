import React from 'react';
import BaseComponent from '../component/component.jsx';
import PropTypes from 'prop-types';
import {DocHead} from 'meteor/kadira:dochead';

import Option from '../../../api/option/entity/entity.client.js';
import OptionC from '../../../api/option/config/collection.js';

export default class BasePage extends BaseComponent
{
    static propTypes = {
        title: PropTypes.string,
    };

    static defaultProps = {
        title: '',
    };

    componentWillMount()
    {
        super.componentWillMount();

        this.on('set-title', this.onSetTitle.bind(this));

        this.setDocumentTitle(this.makeTitle(this.getPageTitle()));
        this.setDescription(this.getPageDescription());
        this.setKeywords(this.getPageKeywords());
    }

    getApplicationTitle()
    {
        const res = OptionC.find({public: true});
        console.dir(res.fetch());

        // todo: get page postfix from options
        return 'New application';
    }

    /**
     * The page title can be also updated at the runtime by calling this.fire('set-title', 'New title'); on any
     * component derived from BaseComponent
     * @returns {string}
     */
    getPageTitle()
    {
        return 'New page';
    }

    getPageDescription()
    {
        // todo: get default page description from options
        return 'My brand new application';
    }

    getPageKeywords()
    {
        // todo: get default page keywords from options
        return ['application', 'new'];
    }

    onSetTitle(e, title)
    {
        this.setDocumentTitle(this.makeTitle(title));
    }

    setDocumentTitle(title = '')
    {
        if (title.length > 0)
        {
            title = `${title} – ${this.getApplicationTitle()}`;
        }

        DocHead.setTitle(title);
    }

    setDescription(text = '')
    {
        DocHead.addMeta({
            name: "description",
            content: _.isStringNotEmpty(text) ? text : this.getPageTitle(),
        });
    }

    // todo: move to the page logic
    setKeywords(keywords = [])
    {
        let kw = [];
        if (_.isArrayNotEmpty(keywords))
        {
            kw = keywords;
        }

        DocHead.addMeta({
            name: "keywords",
            content: kw.join(', '),
        });
    }

    makeTitle(title = '')
    {
        if (_.isStringNotEmpty(title))
        {
            return title.replace(/#DASH#/g, '–');
        }

        return '';
    }
}
