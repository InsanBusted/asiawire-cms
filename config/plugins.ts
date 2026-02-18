export default ({ env }) => ({
  upload: {
    config: {
      provider: '@strapi-community/strapi-provider-upload-google-cloud-storage',
      providerOptions: {
        bucketName: env('GCS_BUCKET_NAME'),
        basePath: env('GCS_BASE_PATH', ''), // contoh: 'uploads' atau 'media'
        baseUrl: env('GCS_BASE_URL', `https://storage.googleapis.com/${env('GCS_BUCKET_NAME')}`),
        // Service account JSON (lebih aman pakai base64 -> decode jadi object)
        serviceAccount: env.json('GCS_SERVICE_ACCOUNT_JSON'),
        // Public read vs Signed URL:
        publicFiles: env.bool('GCS_PUBLIC_FILES', true),
        // Kalau bucket kamu pakai Uniform bucket-level access, ini HARUS true
        uniform: env.bool('GCS_UNIFORM', true),
        // Signed URL expiry (ms). Default provider biasanya 15 menit.
        expires: env.int('GCS_SIGNED_URL_EXPIRES', 15 * 60 * 1000),
        // Optional: caching untuk object metadata
        cacheMaxAge: env.int('GCS_CACHE_MAX_AGE', 60 * 60 * 24 * 7), // 7 hari (detik)
      },

      // Upload security (wajib untuk hilangkan warning + best practice)
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