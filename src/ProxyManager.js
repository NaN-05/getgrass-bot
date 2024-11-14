require('colors');
const axios = require('axios');
const fs = require('fs');

const PROXY_SOURCES = {
  'Ngaret': 'https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text',
  'Ndaot': 'https://github.com/monosans/proxy-list/raw/main/proxies/all.txt',
};

async function fetchProxies(url) {
  try {
    const response = await axios.get(url);
    console.log(`\nFetched proxies from ${url}`.green);
    return response.data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to fetch proxies from ${url}: ${error.message}`.red);
    return [];
  }
}

async function readLines(filename) {
  try {
    const data = await fs.promises.readFile(filename, 'utf-8');
    console.log(`Loaded data from ${filename}`.green);
    return data.split('\n').filter(Boolean);
  } catch (error) {
    console.error(`Failed to read ${filename}: ${error.message}`.red);
    return [];
  }
}

async function selectProxySource(inquirer) {
  const choices = [...Object.keys(PROXY_SOURCES), 'CUSTOM', 'NO PROXY'];
  const { source } = await inquirer.prompt([
    {
      type: 'list',
      name: 'source',
      message: 'Select proxy source:'.cyan,
      choices,
    },
  ]);

  if (source === 'CUSTOM') {
    const { filename } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filename',
        message: 'Enter the path to your proxy.txt file:'.cyan,
        default: 'proxy.txt',
      },
    ]);
    return { type: 'file', source: filename };
  } else if (source === 'NO PROXY') {
    return { type: 'none' };
  }

  return { type: 'url', source: PROXY_SOURCES[source] };
}

module.exports = { fetchProxies, readLines, selectProxySource };
