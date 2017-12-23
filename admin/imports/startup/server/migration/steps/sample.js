import Migration from '../../../../lib/base/migration/index.js';

export default new (class extends Migration {
    getVersion() {
        return 1;
    }

    getName() {
        return 'This is the migration name';
    }

    executeActions() {
        // JobSuggestion.updateMany({
        //     productionVersion: {$exists: false},
        // }, {
        //     productionVersion: 1,
        // });
        //
        // // update candidates
        // this.transformItems(User, {
        //     $filters: {
        //         roles: {$in: ['CANDIDATE']}
        //     },
        //     candidateProfile: {
        //         summary: {
        //             higherEducation: 1,
        //             workExperience: 1,
        //         },
        //     },
        // }, [
        //     (item, data) => {
        //     }
        // ], false, true);
    }
})();
