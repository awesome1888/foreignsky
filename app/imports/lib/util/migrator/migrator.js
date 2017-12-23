import {Migrations} from 'meteor/percolate:migrations';

export default class Migrator
{
    _loaded = false;
    _steps = {};
    _top = -1;

    constructor(steps = {})
    {
        this.addSteps(steps);

        // Migrations.config({
        //     collectionName: 'migration-control',
        // });
    }

    addSteps(steps)
    {
        const versionMet = {};
        let version;
        steps.forEach((step) => {
            version = step.getVersion();
            if (versionMet[version])
            {
                throw new Error(
                    `Unable to migrate: version ${version} met twice. The common reason for this is - migrations were created in separate branches. In order to migrate properly, migrations should go one after another.`
                );
            }
            versionMet[version] = true;

            if (this._top < version)
            {
                this._top = version;
            }

            this._steps[version.toString()] = step;
        });
    }

    loadSteps()
    {
        let version;
        Object.values(this._steps).forEach((step) => {
            version = step.getVersion();

            step.version = version;
            step.name = step.getName();

            Migrations.add(step);
        });

        // percolate:migration crashes if unable to find the latest migration. Well, give it one.
        const v = Migrations.getVersion();
        if (!!v && !this.isExist(v))
        {
            Migrations.add({
                version: v,
                name: 'Fake migration',
                up: () => {},
            });
        }
    }

    isExist(version)
    {
        return version in this._steps;
    }

    getTopVersion()
    {
        return this._top;
    }

    executeOne(version) {
        if (this.isExist(version) && !this.isLocked())
        {
            this.toggleLock(true);

            // do migration
            this._steps[version].up();

            this.toggleLock(false);
        }
        else
        {
            console.dir('Not running, the control is locked');
        }
    }

    execute()
    {
        if (!this._loaded)
        {
            this.loadSteps();
        }

        Migrations.migrateTo('latest');
    }

    toggleLock(way)
    {
        this.getLockCollection().update({
            _id: 'control',
        }, {
            $set: {
                locked: !!way
            }
        });
    }

    isLocked()
    {
        return this.getLockCollection().findOne({
                _id: 'control'
        }).locked === true;
    }

    getLockCollection()
    {
        return Migrations._collection;
    }
}
