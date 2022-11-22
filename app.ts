import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'

import http from 'http'
import fs from 'fs'

import { listFiles } from './src/utilities'

const app = express()
const server = http.createServer(app)

// importing all router files automatically
const loadRouters = async () => {
    const files = listFiles([], process.cwd() + '/dist/src/router')
    if (!files) return
    for (let file of files) {
        try {
            if (!file.path.endsWith('.map')) {
                const router = require(file.path)
                app.use('/api', router.default)
            }

        } catch (e) {
            console.log('error importing router: ' + file.name)
        }

    }
}

loadRouters()

server.listen(process.env.PORT)
