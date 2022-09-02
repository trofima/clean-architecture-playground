class LocalCache {
  async get(id) {
    const users = localStorage.getItem('users');

    return id ? users : users.find(({id: userId}) => id === userId);
  }
}
