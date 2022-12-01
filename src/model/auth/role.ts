import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'
import API, { IAPI } from './api'
const Schema = mongoose.Schema
export interface IRole extends Document {
    name: string,
    apis: { route: string, method: string }[],
    admins: Types.ObjectId[],
    addAPI(api: IAPI): void,
    getAPIs(): IAPI[]
}

interface RoleModel extends Model<IRole> {

}

const roleSchema = new mongoose.Schema<IRole>({
    name: {
        type: String,
        unique: true,
        sparse: true
    },
    apis: [{
        route: {
            type: String
        },
        method: {
            type: String
        }
    }],
    admins: [{ type: Schema.Types.ObjectId, ref: 'Admin' }]
}, { timestamps: true })

roleSchema.methods.getAPIs = async function () {
    const role = this
    const apis = []
    for (let i = 0; i < role.apis.length; i++) {
        apis.push((await API.findOne({ route: role.apis[i].route, method: role.apis[i].method })))
    }
    return apis
}

roleSchema.methods.toJSON = function () {
    const modelObject = this.toObject() as any
    delete modelObject.admins
    delete modelObject.apis
    return modelObject
}

roleSchema.methods.addAPI = async function (api: IAPI) {
    const role = this
    const currentAPIs = role.apis
    let exists = false
    for (let i = 0; i < currentAPIs.length; i++) {
        if (currentAPIs[i].route === api.route && currentAPIs[i].method === api.method) {
            exists = true
        }
    }
    if (!exists) {
        role.apis = role.apis.concat({ route: api.route, method: api.method })
        await role.save()
    }
}

roleSchema.methods.removeAPI = async function (api: IAPI) {
    const role = this
    role.apis = role.apis.filter((s: { route: any; method: any }) => {
        return !(s.route === api.route && s.method === api.method)
    })
    await role.save()
}

const Role = mainDB.model<IRole, RoleModel>('Role', roleSchema)
export default Role