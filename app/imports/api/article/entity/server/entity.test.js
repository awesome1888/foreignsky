/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

// import expect from '../../../../lib/util/test-env/index.server.js';

import Article from '../entity.server.js';

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
    });
});
