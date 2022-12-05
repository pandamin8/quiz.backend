import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

const Schema = mongoose.Schema

export interface IChoice extends Document {
    title: string,
    QuestionId: Types.ObjectId
}

interface ChoiceModel extends Model<IChoice> {
    
}

const choiceSchema = new mongoose.Schema<IChoice> ({
    title: String,
    QuestionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }
}, { timestamps: true })

const Choice = mainDB.model<IChoice, ChoiceModel>('Choice', choiceSchema)
export default Choice