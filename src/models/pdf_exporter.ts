import {Resume} from './resume';
import {Exporter} from './exporter';

let pdf = require('html-pdf');
let fs = require('fs');
let process = require('process');

export class PDFExporter extends Exporter {
    writePdf(callback : Function){
        var html = this.renderHtml();
        pdf.create(html, {format: 'Letter'}).toFile(this._fileName, callback);
    }
}