/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

import React from 'react';
// import expect from '../../../../lib/util/test-env/index.client.js';

import Article from '../entity.client.js';

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

    it('has correct code', () => {
        const code = Article.getUniqueCode();
        console.dir(code);
        // expect(1).to.exist;
    });
});
