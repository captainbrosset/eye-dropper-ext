const fs = require('fs');
const archiver = require('archiver');
const {version} = require('./src/manifest.json');

const SRC_DIR = './src';
const DIST_DIR = './dist';

const output = fs.createWriteStream(`${DIST_DIR}/eye-dropper-${version}.zip`);
const archive = archiver('zip');

output.on('close', () => {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
});

archive.on('error', err => {
    throw err;
});

archive.pipe(output);
archive.directory(SRC_DIR, false);
archive.finalize();
