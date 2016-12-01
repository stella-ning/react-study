import request from 'superagent';

let host = 'http://101.200.129.112:9527/'
const GET_FILE = host + 'file/get/';
export const STATIC_FILE = host+"static";

export function getFile(path, callback, errCallback) {
    request.get(GET_FILE)
        .query({
            path:path
        })
        .end(function (err, res) {
            if (err) {
                errCallback && errCallback(err);
                return;
            }
            callback(res);

        });
}