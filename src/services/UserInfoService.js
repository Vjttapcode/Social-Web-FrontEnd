export async function fetchUserInfo(id, token) {
  const resp = await fetch(`/api/user-info/get-user-info/${id}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!resp.ok) {
    throw new Error(`Fetch UserInfo thất bại: ${resp.status}`)
  }
  const { data } = await resp.json()
  return data
}

export async function fetchAvatarBlob(imageId, token) {
  const resp = await fetch(`/api/image/get-image/${imageId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!resp.ok) throw new Error('Không lấy được avatar')
  return resp.blob()
}
