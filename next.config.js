/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    prependData: `@import "styles/common/_variables.scss";` // prependData 옵션 추가
  }
}

module.exports = nextConfig;
