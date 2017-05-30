import { TAPi18n } from 'meteor/tap:i18n';
import moment from 'moment';
import 'moment/locale/ru';

import './routes/index.js';
import PreRender from '/imports/lib/prerender.js';

TAPi18n.setLanguage('ru');
moment.locale('ru');
PreRender.lock();