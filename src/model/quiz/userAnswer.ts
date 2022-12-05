import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

const Schema = mongoose.Schema

export interface IUserAnswer extends Document {
    UserId: Types.ObjectId,
    ChoiceId: Types.ObjectId
}

interface UserAnswerModel extends Model<IUserAnswer> {
    
}

const userAnswerSchema = new mongoose.Schema<IUserAnswer> ({
    UserId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    ChoiceId: {
        type: Schema.Types.ObjectId,
        ref: 'Choice'
    }
}, { timestamps: true })

const UserAnswer = mainDB.model<IUserAnswer, UserAnswerModel>('UserAnswer', userAnswerSchema)
export default UserAnswer