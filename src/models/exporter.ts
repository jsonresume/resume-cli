import {Resume} from './resume';
let fs = require('fs');
let process = require('process');

export class Exporter {
    protected _resume : Resume;
    protected _theme : any;
    protected _fileName : string;

    constructor(resume : Resume, theme : string | any, fileName : string){
        this._resume = resume;
        this._fileName = fileName;

        if(typeof theme == "string"){
            this.importTheme(theme);
        }

        else {
            this._theme = theme;
        }
    }

    importTheme(theme : string){
        if(!theme.match('jsonresume-theme-.*')){
            theme = 'jsonresume-theme-' + theme;
        }
        this._theme = require(theme);
    }

    renderHtml() : string{
        return this._theme.render(this._resume.resume());
    }

    writeHtml() {
        let html : string = this.renderHtml();
        fs.writeFileSync(process.cwd() + '/' + this._fileName, html);
    }

    hasTheme() : boolean {
        return (this._theme != null);
    }

}