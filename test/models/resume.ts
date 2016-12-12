/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
import {Resume} from '../../src/models/resume';
import {expect} from 'chai';
let resumeJson = require('resume-schema').resumeJson;

let fs = require('fs');
var mock = require('mock-fs');

describe('Resume', () => {
    describe('#constructor', () => {
        it('should have resume if given resume', () => {
            let resumeJson = {"test" : "test2"}
            let resume = new Resume(resumeJson);
            expect(resume.resume()).to.equal(resumeJson);
            expect(resume.path()).to.equal(process.cwd());
        });
        it('should have resume located at path if given path', () => {
            let path : string = __dirname + "/../resources/resume.json";
            let contents : any = JSON.parse(fs.readFileSync(path, 'utf8'));
            let resume : Resume = new Resume(path);

            expect(resume.resume()).to.eql(contents);
            expect(resume.path()).to.equal(path);
        });
    });

    describe('#init', () => {
        it('should write resume at given path', () => {
            mock({
                '/resume-path': {}
            });

            let path : string = '/resume-path/resume.json'
            let resume : Resume = new Resume(path);
            resume.init();
            
            let resumeReceived = JSON.parse(fs.readFileSync(path, 'utf8'));
            expect(resumeReceived).to.eql(resumeJson);

            mock.restore();
        });
    });

    describe('#test', () => {
        it('should return true for good resumes', (done) => {
            let path : string = __dirname + "/../resources/resume.json";
            let contents : any = JSON.parse(fs.readFileSync(path, 'utf8'));
            let resume = new Resume(path);

            resume.test((result: boolean, errs : any) => {
                expect(result).to.equal(true);
                done();
            });

        });
    });

    describe('#readFromFile', () => {
        it('should return true if resume exists', () => {
            let path : string = __dirname + "/../resources/resume.json";
            let resume : Resume = new Resume(path);

            expect(resume.exists()).to.equal(true);
        });

        it('should return false if resume does not exist', () => {
            let path : string = __dirname + "/../resources/resume2.json";
            let resume : Resume = new Resume(path);

            expect(resume.exists()).to.equal(false);
        });
    });
    
});