const axios = require('axios');
const html2json = require('html2json').html2json;
const download = require('download');
const figlet = require('figlet');
const fs = require('fs');
const crypto = require('crypto');

async function calc() {
    // Generate some nerdy ASCII art
    console.clear();
    figlet('GitKraken Checksums', function(err, data) { if (err) { return; } console.log(data) });
    // Make the initial request to find the current releases number
    const req = await axios({ method: 'get', url: 'https://support.gitkraken.com/release-notes/current'}).then(i => i.data);
    // Parse the page inside the <article/> to get the applicable version
    const html = html2json( req.match(/article([\s\S]*?)(.*)<\/article>/g).toString() );
    // Look for <h2/> in the page. These are the version releases
    const releases = html.child.filter(i => i.tag === 'h2').map(i => i.attr.id.replace('version-', ''));
    for (let i = 0; i < releases.length; i++) {
        // Split the version (found as "100") to "1.0.0".
        const verSplit = releases[i].split('');
        // NOTE: We're assuming only 1 digit major and minor releases for a while.
        const ver = `${verSplit[0]}.${verSplit[1]}.${verSplit.slice(2).join('')}`;
        console.log(`👀 found version ${ver} on the website`);
        console.log(`👨‍💻 downloading ${ver} from CDN`);
        // Download the appropriate version of GK
        const dl = await download(`https://release.axocdn.com/linux/GitKraken-v${ver}.tar.gz`, 'tmp', {filename: `${ver}.tar.gz`});
        // Checksum the file as sha256
        const sum = crypto.createHash('sha256').update(fs.readFileSync(`tmp/${ver}.tar.gz`), 'utf8').digest('hex');
        console.log(`✅ checksum for ${ver}: ${sum}`);
        // Enter an empty line to make it most readable for the user
        console.log('');
    }
    // Clean up the download
    console.log(`🗑️ Cleaning up downloads`);
    fs.rmdirSync('tmp', { recursive: true });
}

calc();
