import path from 'path';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

//rollup默认采用es module引用方式，该插件可支持编译使用commonjs的库
import commonjs from '@rollup/plugin-commonjs';

//rollup默认无法去处理import _ from 'lodash'这类的模块引入，因此需要此插件解析，从而打包进文件
import nodeResolve from '@rollup/plugin-node-resolve';

// import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel';

import json from '@rollup/plugin-json';

import pkg from './package.json';

const libName = pkg.name;
const libVersion = pkg.version;
const libDir = path.resolve(__dirname, 'src');
const resolve = p => path.resolve(libDir, p);

const configs = {

    'esm': {
        file: `dist/${libName}.esm.js`,
        format: 'esm',// cjs iife umd amd es system
        name: libName,
        inlineDynamicImports: true,
    },

    'cjs': {
        file: `dist/${libName}.cjs.js`,
        format: 'cjs',
        name: libName,
        exports: 'default',
    },

    'umd': {
        file: `dist/${libName}.min.js`,
        format: 'umd',
        name: libName,
        plugins: [
            terser(),
        ],
        extend: true
    },


}
 

const createBundleconf = (type) => ({

    input: resolve('index.ts'),

    output: configs[type],

    plugins: [
        nodeResolve({
            extensions: ['.ts', '.js']
        }),// 查找和打包node_modules中的第三方模块 
        commonjs(), //将 CommonJS 转换成 ES2015 模块供 Rollup 处理 
        json(),
        typescript()
    ],

    external: [

    ]

})

export default Object.keys(configs).map(createBundleconf);