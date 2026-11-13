const ImageKit = require("imagekit");
const env = require("../config/env");

// Initialize ImageKit instance
const imagekit = new ImageKit({
    publicKey: env.IMAGEKIT_PUBLIC_KEY,
    privateKey: env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: env.IMAGEKIT_URL_ENDPOINT,
});

// Upload file to ImageKit
async function uploadFile(file, fileName) {
    const result = await imagekit.upload({
        file: file,
        fileName: fileName,
    });

    return result;
}

module.exports = {
    uploadFile,
};