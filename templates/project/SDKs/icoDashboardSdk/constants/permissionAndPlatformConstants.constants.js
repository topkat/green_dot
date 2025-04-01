"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permissionPerPlatform = exports.sdkNameForRole = exports.allRoles = void 0;
const topkat_utils_1 = require("topkat-utils");
exports.allRoles = [
    // /!\ Roles are just linked to an interface
    'appUser', // mobile app
    'icoInvestor', // ico dashboard
    'bangkAdmin' // internal dashboard
];
exports.sdkNameForRole = {
    appUser: 'mobileApp',
    bangkAdmin: 'admin',
    icoInvestor: 'icoDashboard',
};
exports.permissionPerPlatform = ((0, topkat_utils_1.objEntries)(exports.sdkNameForRole).reduce((o, [k, v]) => ({ ...o, [v]: k }), {}));
//# sourceMappingURL=permissionAndPlatformConstants.constants.js.map