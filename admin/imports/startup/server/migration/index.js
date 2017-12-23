import Migrator from '../../../lib/util/migrator/migrator.js';
import steps from './steps.js';

if (!Meteor.isTest)
{
    Meteor.startup(() => {
        (new Migrator(steps)).execute();
    });
}
