const fs = require("fs");
const bucket = require("./firebase");
const BUCKET_URL = `https://storage.googleapis.com/lfs-cards.appspot.com/`;

const upload = async files => {
  try {
    const media = {
      names: [],
      src: []
    };
    const responses = files.map(async image =>
      bucket.upload(image.path, { public: true })
    );
    await Promise.all(responses).then(response => {
      response.forEach(res => {
        media.names.push(res[0].metadata.name);
        media.src.push(BUCKET_URL + res[0].metadata.name);
      });
      files.forEach(image =>
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        fs.unlink(image.path, err => {
          if (err) console.log("Error occured while deleting!");
        })
      );
    });
    return media;
  } catch (err) {
    return { error: err };
  }
};

const remove = async image => {
  try {
    return await bucket.file(image).delete();
  } catch (e) {
    return e;
  }
};

module.exports = { upload, remove };
