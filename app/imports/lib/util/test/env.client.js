import { expect, chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import chaiEnzyme from 'chai-enzyme';
import chaiArrays from 'chai-arrays';
import sinonLib from 'sinon';

import { mount as enzymeMount } from 'enzyme';

chai.use(chaiEnzyme()); // add some extra chai functionalities
chai.use(chaiAsPromised); // add promises
chai.use(chaiArrays);

export default expect;
export const mount = enzymeMount;
export const sinon = sinonLib;
