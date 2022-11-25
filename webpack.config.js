const CompressionPlugin = require(`compression-webpack-plugin`);
module.exports = {
    plugins:[
        new CompressionPlugin({
            test: /\.(js|css)$/,
            filename(info) {
                const opFile = info.path.split('.');
                const opFileType = opFile.pop();
                const opFileName = opFile.join('.');
                return `${opFileName}.${opFileType}.gz`;
            }
        })
    ],
}
