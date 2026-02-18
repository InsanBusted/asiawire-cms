import { Storage } from "@google-cloud/storage";
import path from "path";

export default {
  init(providerOptions) {
    const storage = new Storage({
      keyFilename: path.resolve(
        process.cwd(),
        "config/gcs-service-account.json"
      ),
    });

    const bucket = storage.bucket(providerOptions.bucketName);

    return {
      async upload(file) {
        const fileName = `${Date.now()}-${file.name}`;

        const blob = bucket.file(
          providerOptions.basePath
            ? `${providerOptions.basePath}/${fileName}`
            : fileName
        );

        await blob.save(file.buffer, {
          contentType: file.mime,
        });

        await blob.makePublic();

        file.url = `https://storage.googleapis.com/${providerOptions.bucketName}/${providerOptions.basePath ? providerOptions.basePath + "/" : ""}${fileName}`;
      },

      async delete(file) {
        const filePath = file.url.split(".com/")[1];
        await bucket.file(filePath).delete().catch(() => {});
      },
    };
  },
};
