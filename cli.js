const { tokenize } = require('kuromojin');

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

yargs(hideBin(process.argv))
  .command('kuromoji <input>', 'invoke kuromoji', (yargs) => {
    return yargs
      .positional('input', {
        describe: 'The text to analyze',
        type: 'string',
      });
  }, async (argv) => {
    const tokens = await tokenize(argv.input);

    console.log(tokens);
  })
  .parse();
