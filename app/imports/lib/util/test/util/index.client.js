import UtilBase from './index.both.js';

export default class Util extends UtilBase
{
    // todo: move to method utils
    static execute(name, args)
    {
        return new Promise((fulfil, reject) => {
            Meteor.apply(name, args, (error, res) => {
                if (error) {
                    reject(error);
                } else {
                    fulfil(res);
                }
            });
        });
    }

    static hasElementWithText(wrapper, text, tag = 'div')
    {
        wrapper = this.ensureMounted(wrapper);

        expect(wrapper).to.exist;

        const elements = wrapper.find(tag);
        expect(elements).to.exist;

        let element = null;
        elements.forEach((item) => {
            if (item.text() === text)
            {
                element = item;
            }
        });

        expect(element).to.not.equal(null);

        return element;
    }

    static ensureMounted(wrapper)
    {
        // todo
        return wrapper;
    }
}
