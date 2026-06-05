import { handleUpload } from '@vercel/blob/client';

// Server-side route: signs client uploads to Vercel Blob.
// The /api/* path is protected by Vercel Password Protection (dashboard config),
// so any caller reaching this function is already authenticated.
export default async function handler(request) {
  const body = await request.json();

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp'],
        addRandomSuffix: true,
        maximumSizeInBytes: 5 * 1024 * 1024, // 5 MB cap per upload
      }),
      onUploadCompleted: async ({ blob }) => {
        // Log only metadata — never log the blob body or client data.
        console.log('upload completed', { url: blob.url, size: blob.size });
      },
    });

    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 400 }
    );
  }
}
