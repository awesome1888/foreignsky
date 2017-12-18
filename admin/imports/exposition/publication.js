import UserPublication from './user/publication.js';
import OptionPublication from './option/publication.js';

import {provider} from './security-provider.js';

UserPublication.declare(provider);
OptionPublication.declare(provider);
