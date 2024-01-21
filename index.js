const express = require('express');
const app = express();
const { exec } = require('child_process');

// 设置脚本文件名的变量
const scriptFileName = 'koyeb.sh';

// 设置脚本文件的 URL
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
  const port = 3000;

  app.get('/', function (req, res) {
     const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>My Web Page</title>
        </head>
        <body>
            <h1>Hello, wellcomehere!</h1>
            <p>This is a sample web page...</p>
        </body>
        </html>
    `;
    res.send(htmlContent);
  });

  // 页面监听先启动
  const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });

  // 等待脚本运行结束
  await downloadScript(scriptURL);
  await runScript();

  // 脚本运行结束后再开启页面监听
  server.close(() => {
    console.log('Server closed');
  });
}

generateConfig().catch(console.error);
