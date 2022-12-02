import * as dotenv from 'dotenv'
dotenv.config({ path: process.cwd() + '/.env' })

import express from 'express'
import swaggerUi from 'swagger-ui-express'

import http from 'http'
import fs from 'fs'

import { listFiles } from './src/utilities'
import { swaggerDocument } from './documentation/swagger'

const app = express()
const server = http.createServer(app)
app.use(express.json())

// importing all router files automatically
const loadRouters = async () => {
    const files = listFiles([], process.cwd() + '/dist/src/router')
    if (!files) return
    for (let file of files) {
        try {
            if (!file.path.endsWith('.map')) {
                const router = require(file.path)
                app.use('/api/v1', router.default)
            }

        } catch (e) {
            console.log('error importing router: ' + file.name)
        }

    }
}

loadRouters()

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const port = process.env.PORT

import scan from './src/scanApis'

scan()

server.listen(port, () => {
    console.log('Server is running on port ' + port)
})
