const stream2 = require('stream').Writable;
const Console2 = require('console').Console;

class SpyStream extends stream2 {
    constructor(options) {
        super(options);
        this.setDefaultEncoding('utf8');
        this.flushBuffer();
    }

    flushBuffer() {
        const data = this._buffer;
        this._buffer = '';

        return data;
    }

    appendBuffer(data) {
        this._buffer += data;
    }

    _write(chunk, encoding, callback) {
        this.appendBuffer(chunk.toString());
        callback();
    }
}

export default class SpyConsole extends Console2 {
    constructor() {
        const innerStream = new SpyStream();
        super(innerStream);
        this._stream = innerStream;
    }

    getData() {
        return this._stream.flushBuffer();
    }

    dir(arg) {
        if (_.isString(arg)) {
            this.log(arg);
        } else {
            super.dir(arg);
        }
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new this();
        }

        return this.instance;
    }
}
