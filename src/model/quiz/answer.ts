import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

const Schema = mongoose.Schema

export interface IAnswer extends Document {
    QuestionId: Types.ObjectId,
    ChoiceId: Types.ObjectId
}

interface AnswerModel extends Model<IAnswer> {
    
}

const answerSchema = new mongoose.Schema<IAnswer> ({
    QuestionId: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    ChoiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Choice'
    }
}, { timestamps: true })

const Answer = mainDB.model<IAnswer, AnswerModel>('Answer', answerSchema)
export default Answer