// src/services/imageService.js
const API_ROOT = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

/**
 * Upload avatar image via fetch, trả về imageId
 * @param {File} file
 * @param {string} token
 */
export async function postImage(file, token) {
  const formData = new FormData()
  formData.append('file', file)

  const resp = await fetch(`${API_ROOT}/api/image/post-image`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
  const data = await resp.json()
  if (!resp.ok) {
    throw new Error(data.error || 'Avatar upload failed')
  }
  return data.imageId
}
