/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import React from 'react';
import expect from '../../../../lib/util/test-env/index.server.js';

// import Article from '../entity.server.js';

describe('Article entity', () => {
    before(() => {
        // utilUserDeprecated.cleanDBUsers();
        // utilUser.createAdmin({authorize: true});
    });

    // afterEach(() => {
    // });

    after(() => {
        // return utilUser.logout();
    });

    it('has smth', () => {
        // global.window = { location : { host : 'example.com' } };
        // const page = mount(<Header />);
        expect(1).to.exist;
    });
});
