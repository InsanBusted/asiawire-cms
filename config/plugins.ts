export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCS_BUCKET_NAME'),
        basePath: env('GCS_BASE_PATH', ''), 
        baseUrl: env('GCS_BASE_URL'),
        serviceAccount: env.json('GCS_SERVICE_ACCOUNT_JSON'),
        publicFiles: true,
        uniform: env.bool('GCS_UNIFORM', true),
        expires: env.int('GCS_SIGNED_URL_EXPIRES', 15 * 60 * 1000),
        cacheMaxAge: env.int('GCS_CACHE_MAX_AGE', 60 * 60 * 24 * 7), 
      },

      security: {
        allowedTypes: [
          'image/*',
          'video/*',
          'audio/*',
          'application/pdf',
          'application/zip',
          'application/vnd.openxmlformats-officedocument.*',
          'application/msword',
          'text/plain',
        ],
        deniedTypes: [
          'application/x-sh',
          'application/x-dosexec',
        ],
      },

      // Optional tapi bagus untuk production
      sizeLimit: 250 * 1024 * 1024, // 250MB
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});