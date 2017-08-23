import Shell, {log} from '../../../../imports/lib/util/shell/shell.js';

////
import Entity from '../../../api/test-linked-entity/entity/entity.server.js';

Shell.register('map-filter', 'Map filter', () => {
    const map = Entity.getMap().filter((a) => {
        // show only auto-selectable attributes
        return a.isAutoSelectable();
    });

    log(map);
});
