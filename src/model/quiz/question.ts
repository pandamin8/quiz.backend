import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

const Schema = mongoose.Schema

export interface IQuestion extends Document {
    title: string,
    description: string,
    choices: Types.ObjectId[]
}

interface QuestionModel extends Model<IQuestion> {

}

const questionSchema = new mongoose.Schema<IQuestion> ({
    title: String,
    description: String,
    choices: {
        type: [Schema.Types.ObjectId],
        ref: 'Choice'
    }
}, { timestamps: true })

const Question = mainDB.model<IQuestion, QuestionModel>('Question', questionSchema)
export default Question