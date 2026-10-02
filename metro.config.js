// eslint-disable-next-line @typescript-eslint/no-var-requires
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// drizzle-kit'in Expo sürücüsü, üretilen migration'ları .sql dosyası olarak
// bundle edebilmek için Metro'nun bunu bir kaynak (source) uzantısı olarak
// tanımasını gerektirir (bkz. babel.config.js'teki inline-import eklentisi).
config.resolver.sourceExts.push('sql');

// expo-sqlite'ın web (wa-sqlite/WASM) implementasyonu için gerekli — .wasm
// dosyası bir asset olarak tanınmalı (bkz. Expo'nun expo-sqlite web rehberi).
config.resolver.assetExts.push('wasm');

module.exports = config;
