/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
import {Resume} from '../../src/models/resume';
import {Exporter} from '../../src/models/exporter';
import {expect} from 'chai';
let resumeJson = require('resume-schema').resumeJson;

let fs = require('fs');
var mock = require('mock-fs');

describe('Exporter', () => {
    describe('#importTheme', () => {
        it('should create new exporter with valid theme if given theme', () => {
            let theme : any = require('jsonresume-theme-flat');
            let resume : Resume = new Resume(resumeJson);

            let exporter : Exporter = new Exporter(resume, theme, 'test.test');
            expect(exporter.hasTheme()).to.eq(true);
        });

        it('should grab theme if given string name without jsonresume', () => {
            let resume : Resume = new Resume(resumeJson);

            let exporter : Exporter = new Exporter(resume, 'flat', 'test.test')
            expect(exporter.hasTheme()).to.eq(true);
        });

        it('should grab theme if given string with jsonresume', () => {
            let resume : Resume = new Resume(resumeJson);

            let exporter : Exporter = new Exporter(resume, 'jsonresume-theme-flat', 'test.test');
            expect(exporter.hasTheme()).to.eq(true);
        });
    });

    describe('#renderHtml', () => {
        it ('should return a valid html string for a theme', () => {
            let theme :any = require('jsonresume-theme-flat');
            let resume : Resume = new Resume(resumeJson);

            let exporter : Exporter = new Exporter(resume, theme, 'test.test');
            expect(exporter.renderHtml().toString()).to.contain('<html>');
        });
    });
});
