import Shell, {log} from '../../../../imports/lib/util/shell/shell.js';

Shell.register('sample-routine', 'Sample routine', () => {
    log('Hello, this is Sample Routine speaking!');
});
