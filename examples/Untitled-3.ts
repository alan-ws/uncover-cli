// Create a new Command instance
const program = new Command();

// Define the basic information for the CLI
program
  .name('my-cli')
  .version('1.0.0')
  .description('A simple CLI example')
  .usage('[options] <command> [...]');

// Define the run command
const runCommand = new Command('run');
runCommand.description('run something');

// Define the local subcommand of run
const localCommand = new Command('local');
localCommand.description('run something locally');
localCommand.action(() => {
  // Do something locally
  console.log('Running locally');
});

// Add the local subcommand to the run command
runCommand.addCommand(localCommand);

// Add the run command to the program
program.addCommand(runCommand);

// Parse the arguments into options and command-arguments
program.parse();


$ my-cli run local
Running locally

$ my-cli help run
Usage: my-cli run [options] [command]

run something

Options:
  -h, --help      display help for command

Commands:
  local           run something locally
  help [command]  display help for command
