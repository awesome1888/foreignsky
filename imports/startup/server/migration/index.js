import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Steps from './steps/steps.js';

Meteor.startup(() => {
    Steps.forEach((item) => {
        Migrations.add(item);
    });
    Migrations.migrateTo('latest');
    // to re-run the migration, type here:
    // Migrations.migrateTo('X,rerun');
    // where X is a version of the migration
});
