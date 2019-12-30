var serverEnviroment = {
    local: {
        mode: 'local',
        port: 3000
    },
    preProd: {
        mode: 'pre-production',
        port: 4000
    },
    prod: {
        mode: 'production',
        port: 5000
    }
}
module.exports = function (mode) {
    return process.env.PORT || serverEnviroment[mode || process.argv[2] || 'local'] || serverEnviroment.local;
}