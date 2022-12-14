import mongoose, { Document, Model, Types } from 'mongoose'
import mainDB from '../../db/mongoose'

import Choice from './choice'
import Answer from './answer'

const Schema = mongoose.Schema

export interface IQuestion extends Document {
    title: string,
    description: string,
    choices: Types.ObjectId[],
    setChoices(titles: string[], answer: String): void
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

questionSchema.methods.setChoices = async function(titles: [String], answer: String) {
    return new Promise(async (resolve, reject) => {     
        try {
            const question = this        

            if (hasDuplicates(titles))
                throw new Error('Cannot have duplicate choices')
            if (!titles.includes(answer))
                throw new Error('Answer must be among choices')

            for (let i = 0; i < titles.length; i++) {
                const title = titles[i]
                const choice = await Choice.create({ title, QuestionId: question._id })
                question.choices = question.choices.concat(choice._id)
            
                if (title === answer)
                    await Answer.create({ QuestionId: question._id, ChoiceId: choice._id })                
            }
        
            await question.save()
        } catch (e) {
            reject(e)
        }

    })
}

// questionSchema.methods.answer = async function (AnswerId: Type.ObjectId) {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const question = this
//             const userAnswer = new UserAnswer()
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

function hasDuplicates(array: [String]) {
    return (new Set(array)).size !== array.length;
}

const Question = mainDB.model<IQuestion, QuestionModel>('Question', questionSchema)
export default Question