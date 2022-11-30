export const postUser = {
    tags: ['User'],
    description: "Registers a user with the specified username and password",

    required: ['username', 'password'],

    requestBody: {
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Unique username'                        
                        },
                        password: {
                            type: 'string',
                            description: 'Assigned password'
                        }
                    }
                }
            }
        }
    }
    ,
    responses: {
        '200': {          
            description: 'User registration successful',
            'content': {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                                description: 'Specified username'
                            },
                            token: {
                                type: 'string',
                                description: 'Authorization token'
                            }
                        }
                    }
                }
            }
        }
    }
}

export const loginUser = {
    tags: ['User'],
    description: "Logs in a user with valid credentials",

    required: ['username', 'password'],

    requestBody: {
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        username: {
                            type: 'string',
                            description: 'Unique username'                        
                        },
                        password: {
                            type: 'string',
                            description: 'Required password'
                        }
                    }
                }
            }
        }
    }
    ,
    responses: {
        '200': {          
            description: 'User registration successful',
            'content': {
                'application/json': {
                    schema: {
                        type: 'object',
                        properties: {
                            username: {
                                type: 'string',
                                description: 'Specified username'
                            },
                            token: {
                                type: 'string',
                                description: 'Authorization token'
                            }
                        }
                    }
                }
            }
        }
    }
} 