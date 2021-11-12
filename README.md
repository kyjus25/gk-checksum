# gk-checksum
A simple Node application to generate the checksum of GitKraken tar.gz files

## How to run

- Install the package dependencies by running `npm install`
- Start the application by running `npm start`

## How it works

- 👀 Looks for versions on the [Gitkraken Release Notes](https://support.gitkraken.com/release-notes/current) and parses them to JSON
- 👨‍💻 Downloads each version to a `tmp` directory
- ✅ Runs crypto to generate a sha256 checksum of the file
- 🗑️ Cleans up the `tmp` directory when it's finished
