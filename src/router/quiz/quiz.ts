import express from 'express'

import User from '../../model/auth/user'
import Question from '../../model/quiz/question'
import Choice from '../../model/quiz/choice'
import Answer from '../../model/quiz/answer'

import { auth } from '../../middleware/auth'

const router = express.Router()

router.post('/question', auth(1), async(req, res) => {
    try {
        const question = new Question({
            title: req.body.title,
            description: req.body.description            
        })

        if (hasDuplicates(req.body.choices))
            res.status(400).send({ error: 'cannot have duplicate choices' })
            
        await question.setChoices(req.body.choices, req.body.answer)

        await question.save()

        res.send(question)
    } catch (e) {
        if (e instanceof Error) res.status(400).send({ error: e.message })
    }
})

function hasDuplicates(array: [String]) {
    return (new Set(array)).size !== array.length;
}

export default router