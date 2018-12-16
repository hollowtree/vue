const path = require('path')
const buble = require('rollup-plugin-buble')

const builds = {
    'web-full-dev': {
        entry: path.join(__dirname, '../src/index.js'),
        dest: path.join(__dirname, '../dist/vue.js'),
        format: 'umd',
        env: 'development',
    },
}


function genConfig(name) {
    const opts = builds[name]
    const config = {
        input: opts.entry,
        external: opts.external,
        plugins: [
            buble(),
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: opts.moduleName || 'Vue'
        },
        onwarn: (msg, warn) => {
            if (!/Circular/.test(msg)) {
                warn(msg)
            }
        }
    }

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    })

    return config
}


if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET)
} else {
    exports.getBuild = genConfig
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}