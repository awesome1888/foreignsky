import moment from 'moment';

export default class CSVExporter {

    _parameters = {};

    constructor(parameters) {
        this._parameters = _.isObject(parameters) ? parameters : {};
    }

    export(data) {
        if (!Meteor.isClient) {
            return;
        }

        if (_.isFunction(this._parameters.dataMapper)) {
            data = this._parameters.dataMapper(data);
        }

        const blob = new Blob([this.prepare(data)], { type: 'data:text/csv;charset=UTF-8,%ef%bb%bf'}); // eslint-disable-line
        const url = URL.createObjectURL(blob); // eslint-disable-line

        const link = document.createElement('a');
        link.setAttribute('href', url);
        const time = moment().format('DD-MM-YYYY__HH-mm-SS');
        link.setAttribute('download', `export-${time}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    prepareLine(theValue) {
        const t = typeof (theValue);
        let output;
        if (t === 'undefined' || t === null) {
            output = '""';
        } else if (t === 'string') {
            output = `"${theValue}"`;
        } else {
            output = `"${String(theValue)}"`;
        }
        return output;
    }

    prepare(array) {
        let headers = [];
        _.each(array, (it) => {
            headers = _.union(headers, _.keys(it));
        });
        let content = '';

        const headerStrings = this._parameters.header || {};
        if (_.isObjectNotEmpty(headerStrings)) {
            content = `${headers.map((col) => {
                return col in headerStrings ? headerStrings[col] : col;
            }).join(',')}\n`;
        } else {
            content = `${headers.join(',')}\n`;
        }

        _.each(array, (obj) => {
            const lineContent = [];
            _.each(headers, (header) => {
                lineContent.push(this.prepareLine(obj[header]));
            });
            content = `${content}${lineContent.join(',')}\n`;
        });
        return content;
    }
}
