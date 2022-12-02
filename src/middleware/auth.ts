import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Admin, { IAdmin } from '../model/auth/admin'
import API from '../model/auth/api'
import { IRole } from '../model/auth/role'
import User from '../model/auth/user'

export const auth = (mode: 1 | 2 | 3, strict = true) => {
    return async (req: Request, res: Response, next: Function) => {
        try {
            let token = req.header('Authorization')
            if (!token) token = req.cookies.token
            if (!token && strict) {
                res.status(401).send({ error: "Authentication Failed" })
                return
            }
            if (!token) token = ''
            token = token.replace('Bearer ', '')
            if (mode == 1) {
                const admin = await adminAuthenticateToken(token)
                if (!admin) {
                    res.status(401).send({ error: "Authentication Failed" })
                    return
                }
                const authorized = await isAuthorized(admin, req.route.path, req.method.toLowerCase())
                if (!authorized) {
                    res.status(403).send({ error: "Forbidden" })
                    return
                }
                req.admin = admin
                req.token = token
                req.userType = 'admin'
                next()
            }
            if (mode == 2) {
                const user = await userAuthenticateToken(token)
                if (!user && strict) {
                    res.status(401).send({ error: "Authentication Failed" })
                    return
                }
                if (user) {
                    req.user = user
                    req.token = token
                    req.userType = 'user'
                }
                next()
            }
        } catch (e) {

        }
    }
}

export const userAuthenticateToken = async (token: string) => {
    try {
        if (!process.env.JWT_SECRET) return null
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }
        const user = await User.findOne({
            tokens: token,
            _id: decoded.id
        })
        return user
    } catch (e) {
        return null
    }
}

export const adminAuthenticateToken = async (token: string) => {
    try {
        if (!process.env.JWT_SECRET) return null
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string }
        const admin = await Admin.findOne({
            tokens: token,
            _id: decoded.id
        })
        return admin
    } catch (e) {
        return null
    }
}

export const isAuthorized = async (admin: IAdmin, route: string, method: string) => {
    const api = await API.findOne({
        route,
        method
    })
    if (!api) {
        return false
    }
    let authorized = false

    const adminRoles = await admin.getRoles()
    adminRoles.forEach(async (role: IRole) => {
        if (role.name === "GOD") {
            authorized = true
        }

        const apis = await role.getAPIs()
        apis.forEach((a) => {
            if (a.route === api.route && a.method === api.method) {
                authorized = true
            }
        })
    })
    return authorized
}