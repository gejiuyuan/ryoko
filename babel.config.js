module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                target: {
                    node: 'current',
                }
            }
        ],
        '@babel/preset-typescript',
    ]
}