import { expect, chai } from 'meteor/practicalmeteor:chai';
import chaiAsPromised from 'chai-as-promised';
import chaiArrays from 'chai-arrays';
import sinonLib from 'sinon';

chai.use(chaiAsPromised); // add promises
chai.use(chaiArrays);

export default expect;
export const sinon = sinonLib;
