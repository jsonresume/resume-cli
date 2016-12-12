import * as chalk from 'chalk';
import {Resume} from '../models/resume';
import {Exporter} from '../models/exporter';
import {PDFExporter} from '../models/pdf_exporter'

let fs = require('fs');
let resumeJson = require('resume-schema').resumeJson;
let process = require('process');

export class ExportAction {
    exportResume(resume : Resume, theme : string, fileName : string){
        let extension : string = this.getExtension(fileName);

        if(extension == "html"){
            let exporter = new Exporter(resume, theme, fileName);
            exporter.writeHtml();
            console.log(chalk.green("Resume created successfully at " + fileName));
        }
        else if(extension == "pdf"){
            let exporter = new PDFExporter(resume, theme, fileName);
            exporter.writePdf(() => {
                console.log(chalk.green("Resume created successfully at " + fileName));
            });
        }
        else {
            console.log(chalk.red("Invalid file type " + extension));
        }
    }

    getExtension(fileName : string) : string {
        var dotPos = fileName.lastIndexOf('.');
        if (dotPos === -1) {
            return null;
        }
        return fileName.substring(dotPos + 1).toLowerCase();
    }
}

