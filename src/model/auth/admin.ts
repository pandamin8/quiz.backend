import bcrypt from 'bcrypt'
import mongoose, { Document, Model, Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import mainDB from '../../db/mongoose'
import Role, { IRole } from './role'
const Schema = mongoose.Schema

export interface IAdmin extends Document{
    password: string,
    username: string,
    loginCount: number,
    lastLogin: number,
    lastIP: string,
    tokens: string[],
    roles: Types.ObjectId[],
    generateAuthToken(): void,
    addRole(role: IRole): void,
    getRoles(): IRole[]
}
interface AdminModel extends Model<IAdmin> {
    findByCredentials(username: string, password: string): IAdmin
}

const adminSchema = new Schema<IAdmin>({
    username: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    password: {
        type: String
    },
    loginCount: {
        type: Number,
        default: 1
    },
    lastLogin: {
        type: Number
    },
    lastIP: {
        type: String
    },
    tokens: {
        type: [String],
        default: []
    },
    roles: [{ type: Schema.Types.ObjectId, ref: 'Role' }],
}, { timestamps: true })

adminSchema.pre('save', async function (next) {
    const admin = this
    if (admin.isModified('password')) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next()
})

adminSchema.statics.findByCredentials = async (username, password) => {
    try {
        const admin = await Admin.findOne({ username })
        if (!admin) {
            throw new Error("Wrong Username or Password")
        } else {
            const isPasswordCorrect = await bcrypt.compare(password.toString(), admin.password)
            if (!isPasswordCorrect) {
                throw new Error("Wrong Username or Password")
            } else {
                return admin
            }
        }
    } catch (e) {
        throw new Error("Wrong Username or Password")
    }
}

adminSchema.methods.toJSON = function () {
    const modelObject = this.toObject() as any
    delete modelObject.lastIP
    delete modelObject.lastLogin
    delete modelObject.loginCount
    delete modelObject.password
    delete modelObject.tokens
    return modelObject
}

adminSchema.methods.generateAuthToken = async function () {
    try {
        if(!process.env.JWT_SECRET) throw new Error('no jwt secret found')
        const admin = this
        const token = jwt.sign({ id: admin.id.toString() }, process.env.JWT_SECRET)
        admin.tokens = admin.tokens.concat(token)
        await admin.save()
        return token
    } catch (e) {
        console.log(e)
    }
}

adminSchema.methods.getRoles = async function () {
    const admin = this
    const roleIds = admin.roles
    const roles = []
    for (let i = 0; i < roleIds.length; i++) {
        const role = await Role.findById(roleIds[i])
        //const roleJSON = role.toJSON()
        roles.push(role)
    }
    return roles
}

adminSchema.methods.addRole = async function (role: IRole) {
    const admin = this
    if (!admin.roles.includes(role.id)) {
        role.admins = role.admins.concat(admin.id)
        admin.roles = admin.roles.concat(role.id)
        await role.save()
        await admin.save()
    } else {
        console.log('already assigned')
    }
}

adminSchema.methods.removeRole = async function (role: IRole) {
    const admin = this
    role.admins = role.admins.filter((s: Types.ObjectId) => !s.equals(admin.id))
    admin.roles = admin.roles.filter((s: Types.ObjectId) => !s.equals(role.id))
    await role.save()
    await admin.save()
}

const Admin = mainDB.model<IAdmin, AdminModel>('Admin', adminSchema)

export default Admin