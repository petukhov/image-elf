// Thanks to https://github.com/gatsbyjs/gatsby/issues/17661#issuecomment-665800908
exports.onCreateWebpackConfig = ({
    stage,
    rules,
    loaders,
    plugins,
    actions,
}) => {
    // if (stage === "build-html") {
        actions.setWebpackConfig({
            externals: ['canvas']
        })
    // }
};