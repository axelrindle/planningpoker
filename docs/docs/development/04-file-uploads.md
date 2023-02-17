# File Uploads

Files can be uploaded using the [tus protocol](https://tus.io). It supports resumable uploads
which may come in handy especially for uploading high-quality images or in situations with
limited bandwidth.

While tus itself provides a standalone HTTP server implementation, it is exposed via the `/upload`
endpoint.

Uploaded files are scoped and usually stored within the `uploads` directory in application data.
