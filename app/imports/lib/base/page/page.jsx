import React from 'react';
import BaseComponent from '../component/component.jsx';
import PropTypes from 'prop-types';

export default class BasePage extends BaseComponent
{
    static propTypes = {
        title: PropTypes.string,
    };

    static defaultProps = {
        title: '',
    };
}
