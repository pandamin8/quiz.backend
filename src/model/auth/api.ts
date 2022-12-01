import mongoose, { Document, Model, ObjectId, Types } from 'mongoose'
import mainDB from '../../db/mongoose'
const Schema = mongoose.Schema

export interface IAPI extends Document{
    route: string,
    method: string,
    routerFile: string,
    validInputs: string[],
    requiredInputs: string[],
    foreignKeys: string[]
}

interface APIModel extends Model<IAPI> {
    findOrCreate(data: any): IAPI
}

const apiSchema = new Schema<IAPI>({
    route: {
        type: String
    },
    method: {
        type: String
    },
    routerFile: {
        type: String
    },
    validInputs: [String],
    requiredInputs: [String],
    foreignKeys: [String]
}, { timestamps: true })

apiSchema.statics.findOrCreate = async (data) => {
    let doc = await API.findOne({ route: data.route, method: data.method })
    if (doc) {
        doc.validInputs = data.validInputs
        doc.requiredInputs = data.requiredInputs
        doc.foreignKeys = data.foreignKeys
        await doc.save()
        return doc
    }
    doc = await API.create(data)
    return doc
}

const API = mainDB.model<IAPI, APIModel>('API', apiSchema)
export default API