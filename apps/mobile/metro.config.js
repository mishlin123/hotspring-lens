const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const repoRoot = path.resolve(__dirname, '../..')

const config = getDefaultConfig(projectRoot)

// Allow Metro to resolve files from the monorepo root (for the shared data JSON)
config.watchFolders = [repoRoot]

module.exports = config
