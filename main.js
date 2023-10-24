const { spawn } = require('child_process');
const os = require('os');
const fs = require('fs');

let timesPerDay = 35;
const today = Math.floor(Math.random() * 3) + 1;

if(today === 1) {
    timesPerDay = Math.floor(Math.random() * 5) + 31;
} else if(today === 2) {
    timesPerDay = Math.floor(Math.random() * 9) + 20;
} else if(today === 3) {
    timesPerDay = Math.floor(Math.random() * 9) + 10;

}

updateGit(timesPerDay)

async function updateGit(amount) {
    if(amount <= 0) return;

    console.log('Updating git ' + amount + ' times...');
    let shellCommand;
    if (os.platform() === 'win32') {
        shellCommand = 'cmd';
    } else {
        shellCommand = 'sh';
    }

    const shell = spawn(shellCommand);

    shell.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    shell.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    shell.on('exit', (code) => {
        console.log(`Child process exited with code ${code}`);
    });

    let push;
    try {
        const filePath = "data/data.json";

        const fileContents = fs.readFileSync(filePath, 'utf8');
        const incrementedNumber = (parseInt(fileContents, 10) || 0) + 1;
        const newContents = String(incrementedNumber);
        push = incrementedNumber;

        fs.writeFileSync(filePath, newContents);

        console.log('Number incremented successfully.');
    } catch (error) {
        console.error('Error:', error);
    }

    shell.stdin.write('git add .\n');
    shell.stdin.write(`git commit -m "update ${push}"\n`);
    shell.stdin.write('git push\n');

    shell.stdin.end();

    console.log('Git updated successfully.');
    await sleep(10000);
    updateGit(amount - 1);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}