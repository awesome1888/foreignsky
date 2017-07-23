import React from 'react';
import BaseComponent from '../../../../../lib/base/component/component.jsx';

export default class extends BaseComponent
{
    get shittyPhrases()
    {
        return [
            'This is my panel, I am The Admin, I do what I want!',
            'Uncorns sucks! I mean it!',
            'Do some good today. Or die. Whatever.',
            'This is only hard-coded text, and soon there will be more!',
            'Do not underestimate unpredictable idiots around.',
            'Man, have some sleep already!',
            'Тут будет менюшечка, ну а пока - захардкоженные ссылочки',
        ];
    }

    render() {
        return (
            <blockquote className="margin-bottom">
                {_.sample(this.shittyPhrases)}
            </blockquote>
        );
    }
}
