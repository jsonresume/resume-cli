/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
import {InitAction} from '../../src/actions/init';
import {expect} from 'chai';

describe('InitAction', () => {
    var action : InitAction;

    beforeEach(function () {
        action = new InitAction();
    });

    describe('#checkForResume', () => {
        it('should return false if resume does not exist', () => {
            expect(action.doesHaveResume(process.cwd())).to.be.false;   
        });
        it('should return true if resume does exist', () => {
            expect(action.doesHaveResume(process.cwd() + '/test/resources')).to.be.true;   
        });
    });
});