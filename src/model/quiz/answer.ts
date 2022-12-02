import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

const Schema = mongoose.Schema

export interface IAnswer extends Document {
    question: Types.ObjectId,
    choice: Types.ObjectId
}

interface AnswerModel extends Model<IAnswer> {
    
}

const answerSchema = new mongoose.Schema<IAnswer> ({
    question: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    choice: {
        type: Schema.Types.ObjectId,
        ref: 'Choice'
    }
}, { timestamps: true })

const Answer = mainDB.model<IAnswer, AnswerModel>('Answer', answerSchema)
export default Answer