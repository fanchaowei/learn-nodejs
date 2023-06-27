import { build } from 'esbuild'

const buildOptions = {
  entryPoints: ['./browser/index.js'],
  outfile: './dist/index.js',
  bundle: true, // 是否打包，如果为 false，那么就不会打包，而是生成一个入口文件
  // minify: true, // 是否压缩代码，如果为 false，那么就不会压缩代码
}

build(buildOptions)
