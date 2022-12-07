import express from 'express'

import Admin from '../../model/auth/admin'

const router = express.Router()

router.post('/admin/login', async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.username, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({ admin, token })
    } catch (e) {
        if (e instanceof Error) res.status(400).send({ error: e.message })
    }
})

export default router