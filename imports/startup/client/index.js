// localization
import { TAPi18n } from 'meteor/tap:i18n';
TAPi18n.setLanguage('ru');
moment.locale('ru');

// moment localization
import moment from 'moment';
import 'moment/locale/ru';

// routing
import './routes/index.js';

// pre-render
import PreRender from '/imports/lib/prerender.js';
PreRender.lock();