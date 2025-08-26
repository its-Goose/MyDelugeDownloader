# MyDelugeDownloader

MyDelugeDownloader is a Firefox extension that integrates with Deluge to improve download management.

## Features
- Quick access to Deluge downloads
- Customizable hotkeys
- Lightweight and easy to install

## Installation
1. Download the `.xpi` file from the [Releases](https://github.com/its-Goose/MyDelugeDownloader/releases) page.
2. Open Firefox and go to `about:debugging`.
3. Click **This Firefox → Load Temporary Add-on**.
4. Select the `.xpi` file to load the extension.

## How to use
Configure in `about:addons` for the deluge web URL. (Port is normally `:8112`)
Make sure to sign in to deluge on your browser and keep that tab open while sending the magnet links.
Right click on a magnet link and press `e` or click on the `Download with Deluge` button.


## Development
- The `.xpi` file is a packaged version of the add-on.
- To modify, unzip the `.xpi` and edit the source files.
- Repack using Firefox Developer Tools or the `web-ext` CLI.

## License
MIT License