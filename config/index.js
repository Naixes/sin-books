const path = require('path')

let config = {
    viewDir: path.join(__dirname, '../', 'views'),
    staticDir: path.join(__dirname, '../', 'assets')
}

// NODE_ENV = development production
if(process.env.NODE_ENV == 'development') {
    const devConfig = {
        port: 3000,
        cache: false
    }

    config = {
        ...config,
        ...devConfig
    }
}

if(process.env.NODE_ENV == 'production') {
    const proConfig = {
        port: 80,
        cache: 'memory'
    }

    config = {
        ...config,
        ...proConfig
    }
}

module.exports = config