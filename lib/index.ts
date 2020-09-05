import { v4 } from 'uuid';

type Nullable<T> = T | null;

export interface JSONResponse {
    request_id: string;
    content: {};
}

class ExtJSON {

    private apiJSON: any = {};
    private responseJSON: Nullable<JSONResponse> = {} as JSONResponse;

    public async handleIncomingJSON(...objects: any[]): Promise<Nullable<JSONResponse>> {
        const flat = this.flatten(await this.getContainedObjects(objects));
        if (!flat) {
            return null;
        }
        return this.runPreprocessor(flat);
    }

    private runPreprocessor(flat: any): Nullable<JSONResponse> {
        const specialToDelete: string[] = [];
        const possibleContainers: string[] = [];

        for (let d in flat) {
            if (d.startsWith('__ext__json__')) delete flat[d]; // TODO: possibly use to configure parsing options
            if (d.startsWith('//') || (d.split('.').length > 1 && d.split('.')[1].startsWith('//'))) delete flat[d];
            if (d.startsWith('>>')) {
                const cleaned = d.substring(2);
                flat[cleaned] = flat[d];
                specialToDelete.push(cleaned);
                possibleContainers.push(`{{${cleaned}}}`);
                delete flat[d];
            }
            possibleContainers.push(`{{${d}}}`);
        }
        
        for (let d in flat) {
            try {
                possibleContainers.forEach((container: string) => {
                    if (flat[d].includes(container)) {
                        const found = possibleContainers.find((e: string) => e === container);
                        if (found) {
                            flat[d] = flat[d].replace(container, flat[found.replace('{{', '').replace('}}', '').trim()]);
                        }
                    }
                });
            } catch (e) {
                // some error occurred
                return null;
            }
        }

        for (let s of specialToDelete) {
            if (flat[s]) delete flat[s];
        }

        const response: JSONResponse = {
            request_id: v4(),
            content: JSON.stringify(this.unflatten(flat), null, '\t'),
        };

        this.responseJSON = response;
        return response;
    }

    private async getContainedObjects(...objects: any[]): Promise<{}> {
        return objects.reduce((res: any, cur: any) => {
            return Object.assign(res, {...this.apiJSON, ...cur});
        }, {});
    }

    private unflatten(data: any): {} {
        let result: any = {}, cur: any, prop: string, idx: number, last: number, temp: string;
        if (Object(data) !== data || Array.isArray(data)) return data;
        for (const p in data) {
            cur = result, prop = "", last = 0;
            do {
                idx = p.indexOf('.', last);
                temp = p.substring(last, idx !== -1 ? idx : undefined);
                cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
                prop = temp;
                last = idx + 1;
            } while (idx >= 0);
            cur[prop] = data[p];
        }
        return result[''];
    }

    private flatten(data: any): {} {
        let result: any = {};
        const recur = (cur: any, prop: any): any => {
            if (Object(cur) !== cur) {
                result[prop] = cur;
            } else if (Array.isArray(cur)) {
                for (var i = 0, j = cur.length; i < j; i++) {
                    recur(cur[i], prop ? `${prop}.${i}` : `${i}`);
                }
                if (j == 0) result[prop] = [];
            } else {
                let empty = true;
                for (let p in cur) {
                    empty = false;
                    recur(cur[p], prop ? `${prop}.${p}` : p);
                }
                if (empty) result[prop] = {};
            }
        }
        recur(data, '');
        return result;
    }

    public set serverJSON(data: any) {
        this.apiJSON = data;
    }

    public get response(): Nullable<JSONResponse> {
        return this.responseJSON;
    }
}

export default ExtJSON;