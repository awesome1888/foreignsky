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
        Option.set('application.title', 'Admin', {
            appId: 'admin',
            public: true,
        });
        Option.set('application.front-app.url', 'https://foreignsky.ru', {
            appId: 'admin',
            public: true,
        });

        Option.set('application.title', 'Чужое небо', {
            appId: 'app',
            public: true,
        });
        Option.set('application.description', 'Блог одной русской семьи, переехавшей в Германию', {
            appId: 'app',
            public: true,
        });
        Option.set('application.keywords', [
            'германия',
            'европа',
            'блог',
            'русские',
            'путешествия',
            'переезд',
        ], {
            appId: 'app',
            public: true,
        });

        Option.set('vendor.google.map.key', 'AIzaSyDV90oJprjrtNbo3ASxmvFObr05jiC-0WI', {
            public: true,
        });
    }
})();
