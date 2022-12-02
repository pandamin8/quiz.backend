declare namespace Express {
    export interface Request {
        admin?: import('./src/model/auth/admin').IAdmin,
        user?: import('./src/model/auth/user').IUser,
        token?: string,
        userType?: string
    }
}

