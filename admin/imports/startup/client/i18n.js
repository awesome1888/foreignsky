/**
 * Localization - client
 */

import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

import { TAPi18n } from 'meteor/tap:i18n';

TAPi18n.setLanguage('ru');
