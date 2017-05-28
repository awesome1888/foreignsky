module.exports = {
    servers: {
        one: {
            host: '188.120.254.6',
            username: 'root',
            // pem:
            // password:
            // or leave blank for authenticate from ssh-agent
        }
    },

    meteor: {
        name: 'NachBerlin',
        path: '../..', //change this to your project path
        servers: {
            one: {}
        },
        buildOptions: {
            serverOnly: true,
            cleanAfterBuild: true, // default
        },
        env: {
            PATH: '~/.node/current/bin:$PATH',
            ROOT_URL: 'https://nachberlin.ru/',
            MONGO_URL: 'mongodb://localhost:27017/nachberlin',
            //MONGO_URL: 'mongodb://development:qVKQcPy9XTTFkzmpzz6VCugJQJxFlG4n@aws-eu-central-1-portal.1.dblayer.com:15580,aws-eu-central-1-portal.0.dblayer.com:15580/meteor?ssl=true',
            //MONGO_OPLOG_URL: 'mongodb://oploguser:LdnUNgxJwMSOq3J-1eL8I3hQnTtPVTEpLE0QMkK7H4M@aws-eu-central-1-portal.1.dblayer.com:15581/local?authSource=admin&ssl=true',
            PORT: 11000,
            //NODE_ENV: 'development'
        },

        dockerImage: 'abernix/meteord:base',
        deployCheckWaitTime: 60
    }
};
