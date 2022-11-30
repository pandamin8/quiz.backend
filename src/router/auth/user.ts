import express from 'express'

import User from '../../model/auth/user'

const router = express.Router()

router.post('/user', async (req, res) => {
    try {
        const user = new User({
            email: req.body.email,
            password: req.body.password
        })

        const token = user.generateAuthToken()
        await user.save()

        res.send({ user, token })

    } catch(e) {
        if (e instanceof Error) res.status(400).send({ error: e.message })
    }    
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.username, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        if (e instanceof Error) res.status(401).send({ error: e.message })
    }
})

export default router