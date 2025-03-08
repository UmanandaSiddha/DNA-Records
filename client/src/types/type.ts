export const UserRoleEnum = {
    USER: "USER",
    ADMIN: "ADMIN",
    BUYER: "BUYER"
} as const;

export interface IUser {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    hiveUser: string;
    publicKey?: string;
    role: typeof UserRoleEnum[keyof typeof UserRoleEnum];
    isVerified: boolean;
    oneTimePassword?: string;
    oneTimeExpire?: Date;
    dnaFile?: string;
    createdAt: Date;
    updatedAt: Date;
}