let fs = require('fs');
let process = require('process');
let resumeJson = require('resume-schema').resumeJson;
let resumeSchema = require('resume-schema');

export class Resume {
    private _resume : any;
    private _path : string;

    // Resume may be string to path or resume JSON blob.
    constructor(resume : string | any){
        if(typeof resume === "string"){
            this._path = resume;
            this.readFromFile();
        }
        else {
            this._resume = resume;
            this._path = process.cwd();
        }
    }

    readFromFile() {
        if(this.exists()){
            this._resume = JSON.parse(fs.readFileSync(this._path, 'utf8'));
        }
    }

    exists() : boolean {
        return fs.existsSync(this._path);
    }

    // Creates new resume at current path.
    init() {
        fs.writeFileSync(this._path, JSON.stringify(resumeJson, undefined, 2));
    }

    // Tests resume and callsback with boolean of validness.
    test(callback : Function) {

        resumeSchema.validate(this._resume, function(report : any, errs : any) {
            if(errs){
                callback(false, errs);
            }
            callback(true, {});
        });
    }

    resume() : any {
        return this._resume;
    }

    path() : string {
        return this._path;
    }

}