// const fs = require('fs');
const { resolve, dirname, parse } = require('path');
const commonjs = require('@rollup/plugin-commonjs');
const inject = require('@rollup/plugin-inject');

const ROLLUP = require('rollup');

module.exports = function rollupPluginPartialInject({
  prefix = '_.',
  plugin = '',
  path = '',
} = {}) {
  const input = require.resolve(
    resolve(
      ...[plugin ? dirname(require.resolve(plugin)) : '', path].filter((v) => v)
    )
  );

  function set_inject() {
    const result = {};
    return Promise.resolve(ROLLUP.rollup({ plugins: [commonjs()], input }))
      .then((bundle) => {
        return bundle.generate({
          format: 'cjs', // es
          name: input,
          exports: 'named',
        });
      })
      .then((outputs) => {
        const output = outputs.output[0];
        output.exports.forEach((n) => (result[`${prefix}${n}`] = [input, n]));

        Object.keys(output.modules).forEach((n) => {
          const key = `${prefix}${parse(n).name}`;
          if (!(key in result)) result[key] = `${n}`;
        });

        // console.log(result);

        return inject(result);
      });
  }

  let is_init = false;
  const result = {
    name: 'partial-inject',

    async options(opts) {
      if (!is_init) {
        is_init = true;
        const k = opts.plugins.indexOf(result) || 0;
        opts.plugins.splice(k, 0, await set_inject());
      }

      return opts;
    },
  };

  return result;
};
