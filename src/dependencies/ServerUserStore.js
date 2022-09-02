class ServerUserStore {
  async get(id) {
    const response = await fetch('https://url', {
      method: 'POST',
      body: JSON.stringify({id})
    })

    return await response.json()
  }
}
