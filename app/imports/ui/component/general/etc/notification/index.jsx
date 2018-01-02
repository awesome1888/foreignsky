import BaseComponent from '../../../../../lib/base/component/component.jsx';

import './style.less';

export default class Notification extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            notifications: [],
        };

        this.on('notify', this.onNotify.bind(this));
    }

    onNotify(message)
    {
        console.dir(message);
    }

    render()
    {
        return (
            <div
                className={classnames(
                    'load-overlay fade',
                )}
            >
            </div>
        );
    }
}
