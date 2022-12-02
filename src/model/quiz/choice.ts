import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

export interface IChoice extends Document {
    title: string
}

interface ChoiceModel extends Model<IChoice> {
    
}

const choiceSchema = new mongoose.Schema<IChoice> ({
    title: String
}, { timestamps: true })

const Choice = mainDB.model<IChoice, ChoiceModel>('Choice', choiceSchema)
export default Choice