import Migration from '../../../../lib/base/migration/index.js';
import Option from '../../../../api/option/entity/entity.server.js';

export default new (class extends Migration {
    getVersion()
    {
        return 1;
    }

    getName()
    {
        return 'Some default options for both applications';
    }

    up()
    {

    }
})();
