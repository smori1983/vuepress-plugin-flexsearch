const { tokenize } = require('kuromojin');

async function main() {
  const { program } = await import('commander');

  program.command('kuromoji')
    .description('invoke kuromoji')
    .argument('<input>', 'The text to analyze')
    .action(async (input) => {
      const tokens = await tokenize(input);
      console.log(tokens);
    });

  program.parse();
}

main().then();
