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
    try {
        const question = this        
            
        for (let i = 0; i < titles.length; i++) {
            const title = titles[i]
            const choice = await Choice.create({ title })
            question.choices = question.choices.concat(choice._id)

            if (title === answer)
                await Answer.create({ QuestionId: question._id, ChoiceId: choice._id })                        
        }

        await question.save()
    } catch (e) {
        console.log(e)
    }
}

const Question = mainDB.model<IQuestion, QuestionModel>('Question', questionSchema)
export default Question