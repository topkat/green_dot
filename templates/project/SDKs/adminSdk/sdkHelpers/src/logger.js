"use strict";
/* eslint-disable no-console */
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = void 0;
const topkat_utils_1 = require("topkat-utils");
exports.log = {
    /** You can log any value here, it will be SAFELY stringified objects; arrays... */
    error(...msgs) {
        logg('error', ...msgs);
    },
    /** You can log any value here, it will be SAFELY stringified objects; arrays... */
    info(...msgs) {
        logg('log', ...msgs);
    },
    /** You can log any value here, it will be SAFELY stringified objects; arrays... */
    warning(...msgs) {
        logg('warn', ...msgs);
    }
};
function logg(level, ...msgs) {
    return console[level](...msgs.map(m => {
        if (typeof m === 'string')
            return m;
        else {
            try {
                let msg = '';
                if (m?.errorDescription) {
                    m.hasBeenLogged = true;
                    msg = m.logs.join('\n');
                }
                else {
                    if (m?.message)
                        msg += m.message + '\n';
                    if (m?.stack)
                        msg += m.stack + '\n';
                    msg += (0, topkat_utils_1.removeCircularJSONstringify)(m, 2);
                }
                return msg;
            }
            catch (err) {
                console.error('errorWhileStringifyingErrorMessage');
                console.error(err);
                console.error('Original err msg:');
                console.error(m);
                return m.toString();
            }
        }
    }));
}
//# sourceMappingURL=logger.js.map