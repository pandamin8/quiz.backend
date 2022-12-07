import Admin from "./model/auth/admin"
import API from "./model/auth/api"
import Role from "./model/auth/role"
import fs from 'fs'
import { Schema, Types } from "mongoose"

const dir = process.cwd() + '/src/router/'
const scan = async () => {
    let godAdmin = await Admin.findOne({ username: 'admin' })
    let godRole = await Role.findOne({ name: 'GOD' })
    if (!godAdmin) {
        godAdmin = new Admin({ username: 'admin', password: 'dspmadmin' })
        await godAdmin.generateAuthToken()
    }
    if (!godRole) {
        godRole = await Role.create({ name: 'GOD' })
    }
    if (!godAdmin.roles.includes(godRole._id)) {
        await godAdmin.addRole(godRole)
    }
    await scanDir(dir)
    const apis = await API.find()
    for (let i = 0; i < apis.length; i++) {
        if (!ids.includes(apis[i]._id.toString())) {
            await API.findByIdAndRemove(apis[i].id)
        }
    }
    console.log('scan completed')
}

const ids: string[] = []

const scanDir = async (dir: string) => {
    const files = listFiles([], dir)
    if (!files) return
    for (let i = 0; i < files.length; i++) {
        const routerFile = files[i].path
        try {
            const str = fs.readFileSync(routerFile).toString()
            const part = str.split('router.')
            for (let i = 1; i < part.length; i++) {
                const method = part[i].split('(')[0]
                const route = part[i].split("'")[1].split("'")[0]
                const validInputs: Array<string> = []
                const requiredInputs: Array<string> = []
                const foreignKeys: Array<string> = []
                if (part[i - 1].includes('// valid inputs: ')) {
                    const v = part[i - 1].split('// valid inputs: ')[1].split('\n')[0].replace('\n', '').replace('\r', '')
                    v.split(',').forEach((input) => validInputs.push(input))
                }
                if (part[i - 1].includes('// required inputs: ')) {
                    const r = part[i - 1].split('// required inputs: ')[1].split('\n')[0].replace('\n', '').replace('\r', '')
                    r.split(',').forEach((input) => requiredInputs.push(input))
                }
                if (part[i - 1].includes('// foreign keys: ')) {
                    const f = part[i - 1].split('// foreign keys: ')[1].split('\n')[0].replace('\n', '').replace('\r', '')
                    f.split(',').forEach((input) => foreignKeys.push(input))
                }
                const api = await API.findOrCreate({
                    route, method, routerFile, validInputs, requiredInputs, foreignKeys
                })
                ids.push(api._id.toString())
            }
        } catch (e) {
            await scanDir(dir + routerFile + "/")
        }
    }
}

const listFiles = (result: { name: string; path: string }[], dir: string) => {
    try {
        if (!result) result = []
        const files = fs.readdirSync(dir)
        for (let i = 0; i < files.length; i++) {
            if (fs.lstatSync(dir + '/' + files[i]).isDirectory()) {
                const recursive = listFiles(result, dir + '/' + files[i])
                if (recursive) result = recursive
            } else {
                result.push({ name: files[i], path: dir + '/' + files[i] })
            }
        }
        return result
    } catch (e) {
        if (e instanceof Error)
            console.log(e.stack)
    }
}

export default scan