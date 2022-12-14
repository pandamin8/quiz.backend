import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema

export interface IUser extends Document {
    username: string,
    password: string,
    tokens: string[],
    generateAuthToken(): void
}

interface UserModel extends Model<IUser> {
    findByCredentials(username: string, password: string): IUser
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    tokens: {
        type: [String],
        default: []
    }
}, { timestamps: true })

userSchema.methods.generateAuthToken = async function () {
    try {
        if (!process.env.JWT_SECRET) throw new Error('no jwt secret found')
        const user = this
        const token = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET)
        user.tokens = user.tokens.concat(token)
        await user.save()
        return token
    } catch (e) {
        console.log(e)
    }
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password') && user.password)
        user.password = await bcrypt.hash(user.password, 8)
    next()
})

userSchema.statics.findByCredentials = async (email: String, password: String) => {
    const user = await User.findOne({ email })

    if (!user) throw new Error('Unable to login')

    const isMatched = await bcrypt.compare(password.toString(), user.password)

    if (!isMatched) throw new Error('Unable to login')

    return user
}

userSchema.methods.toJSON = function() {
    const userObject = this.toObject() as any
    delete userObject.password
    delete userObject.tokens
    return userObject
}

const User = mainDB.model<IUser, UserModel>('User', userSchema)
export default User