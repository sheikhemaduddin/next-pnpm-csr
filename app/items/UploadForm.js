'use client';

import { useState } from 'react';

export default function UploadForm() {
  const [status, setStatus] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('uploading');

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/upload', { method: 'POST', body: formData });
    const result = await response.json();

    setStatus(response.ok ? `Uploaded: ${result.path}` : `Error: ${result.error}`);
    if (response.ok) event.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="upload-form">
      <label htmlFor="file">Upload a file</label>
      <input id="file" name="file" type="file" required />
      <button type="submit" disabled={status === 'uploading'}>Upload</button>
      {status && <p>{status}</p>}
    </form>
  );
}
