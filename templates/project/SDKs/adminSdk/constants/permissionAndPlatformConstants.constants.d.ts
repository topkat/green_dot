export declare const allRoles: readonly ["appUser", "icoInvestor", "bangkAdmin"];
export type AllRoles = typeof allRoles[number];
export declare const sdkNameForRole: {
    appUser: "mobileApp";
    bangkAdmin: "admin";
    icoInvestor: "icoDashboard";
};
export type Platforms = (typeof sdkNameForRole)[AllRoles];
export type sdkNameForRole = typeof sdkNameForRole;
export type PermissionPerPlatform = {
    [K in keyof sdkNameForRole as `${sdkNameForRole[K]}`]: K;
};
export declare const permissionPerPlatform: PermissionPerPlatform;
