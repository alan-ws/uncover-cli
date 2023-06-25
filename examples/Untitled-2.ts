// Create a new Command instance
const program = new Command();

// Define the basic information for the CLI
program
  .name('my-cli')
  .version('1.0.0')
  .description('A simple CLI example')
  .usage('[options] <command> [...]');

// Define the CLI options
program
  .option('-v, --verbose', 'enable verbose mode')
  .option('-d, --debug', 'enable debug mode');

// Define the main command
program
  .command('hello <name>')
  .description('say hello to someone')
  // Define the action handler for the main command
  .action((name, options) => {
    // Access the parsed options as an object
    const opts = program.opts();
    // Do something with the name and options
    console.log(`Hello ${name}`);
    if (opts.verbose) {
      console.log('Verbose mode is on');
    }
    if (opts.debug) {
      console.log('Debug mode is on');
    }
  });

// Define a subcommand of hello
program
  .command('hello world')
  .description('say hello to the world')
  // Define the action handler for the subcommand
  .action((options) => {
    // Access the parsed options as an object
    const opts = program.opts();
    // Do something with the options
    console.log('Hello world');
    if (opts.verbose) {
      console.log('Verbose mode is on');
    }
    if (opts.debug) {
      console.log('Debug mode is on');
    }
  });

// Parse the arguments into options and command-arguments
program.parse();
