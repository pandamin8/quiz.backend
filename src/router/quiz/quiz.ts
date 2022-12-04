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

        await question.setChoices(req.body.choices, req.body.answer)

        await question.save()

        res.send(question)
    } catch (e) {
        if (e instanceof Error) res.status(400).send({ error: e.message })
    }
})

router.get('/question', async(req, res) => {
    try {
        const skip = req.query.skip ? Number(req.query.skip) : 0
        const limit = req.query.limit ? Number(req.query.limit) : 5

        const questions = await Question.find({}).skip(skip).limit(limit)

        res.send(questions)
    } catch(e) {
        if (e instanceof Error) res.status(400).send({ error: e.message })
    }
})

router.get('/question/:id', async(req, res) => {
    try {
        const question = await Question.findById(req.params.id)
        if (!question) throw new Error('Question not found')
        res.send(question)
    } catch (e) {
        if (e instanceof Error) res.status(404).send({ error: e.message })
    }
})

export default router