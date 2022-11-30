import { postUser, loginUser } from './users'

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: 'APIs Documentation for quiz.backend',
        termsOfService: '',
        contact: {
            name: 'Amin Khodabande',
            email: 'whfk233@gmail.com',            
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },

    servers: [
        {
            url: 'localhost:400/api/v1',
            description: 'local server'
        }
    ],
    
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                format: 'JWT'
            }
        }
    },

    tags: [
        {
            name: 'User'
        }
    ],
    paths: {
        '/user': { 'post': postUser },
        '/user/login': { 'post': loginUser }
    }
}