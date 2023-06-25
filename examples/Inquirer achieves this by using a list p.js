Inquirer achieves this by using a list prompt that displays a list of choices to the user and allows them to select one using the arrow keys and enter. The list prompt takes an array of choices as an argument and returns the selected choice as the answer. For example:

// Import Inquirer
const inquirer = require('inquirer');

// Define a list prompt
inquirer.prompt([
  {
    type: 'list',
    name: 'color',
    message: 'What is your favorite color?',
    choices: ['Red', 'Green', 'Blue', 'Yellow'],
  },
])
.then((answer) => {
  // Do something with the answer
  console.log(`You chose ${answer.color}`);
});
Copy
This will create a list prompt that asks the user to choose their favorite color from a list of four options. The output will be something like:

? What is your favorite color? (Use arrow keys)
❯ Red 
  Green 
  Blue 
  Yellow 
Copy
To implement this without using Inquirer, you would need to use a lower-level library such as readline or process.stdin to read user input from the command line. You would also need to use some ANSI escape codes to control the cursor movement and color output. For example:

// Import readline
const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Define the list prompt parameters
const question = 'What is your favorite color?';
const choices = ['Red', 'Green', 'Blue', 'Yellow'];
let index = 0;

// Define some ANSI escape codes
const cursorUp = '\u001b[A';
const cursorDown = '\u001b[B';
const cursorHide = '\u001b[?25l';
const cursorShow = '\u001b[?25h';
const eraseLine = '\u001b[2K';

// Write the question and the choices to the output
rl.write(question + '\n');
for (let i = 0; i < choices.length; i++) {
  if (i === index) {
    // Highlight the current choice with a green background
    rl.write('\u001b[42m\u001b[30m' + choices[i] + '\u001b[0m\n');
  } else {
    // Write the other choices normally
    rl.write(choices[i] + '\n');
  }
}

// Move the cursor up to the first choice
rl.write(cursorHide);
for (let i = 0; i < choices.length; i++) {
  rl.write(cursorUp);
}

// Listen for keypress events
rl.input.on('keypress', (char, key) => {
  // If the user pressed enter, return the answer and close the interface
  if (key.name === 'return') {
    rl.write(cursorShow);
    rl.write('\nYou chose ' + choices[index] + '\n');
    rl.close();
    return;
  }

  // If the user pressed up or down, update the index and redraw the choices
  if (key.name === 'up' || key.name === 'down') {
    // Erase the current line
    rl.write(eraseLine);

    // Move the cursor back to the beginning of the line
    rl.write('\r');

    // Write the current choice normally
    rl.write(choices[index] + '\n');

    // Update the index
    if (key.name === 'up') {
      index = (index + choices.length - 1) % choices.length;
    } else {
      index = (index + 1) % choices.length;
    }

    // Move the cursor up to the next choice
    rl.write(cursorUp);

    // Erase the current line
    rl.write(eraseLine);

    // Move the cursor back to the beginning of the line
    rl.write('\r');

    // Write the next choice with a green background
    rl.write('\u001b[42m\u001b[30m' + choices[index] + '\u001b[0m');
  }
});
Copy
This will create a similar list prompt as Inquirer, but with much more code and complexity. The output will be something like:

What is your favorite color?
Red 
Green 
Blue 
Yellow 
Copy
As you can see, using Inquirer is much easier and convenient than implementing your own list prompt without it.