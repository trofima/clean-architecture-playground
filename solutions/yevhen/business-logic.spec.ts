describe('business logic', () => {
  it('should start getting a user by a given ID from the cache not from the store by default', async () => {
    const {businessLogic, userStoreMock, userCacheMock} = setUp();

    expect(userStoreMock.userGettings).toEqual([]);
    expect(userCacheMock.userGettings).toEqual([]);

    businessLogic.getUser('ID');

    expect(userStoreMock.userGettings).toEqual([]);
    expect(userCacheMock.userGettings).toEqual(['ID']);
  });

  it('should start getting a user by another given ID from the cache by default', async () => {
    const {businessLogic, userCacheMock} = setUp();

    businessLogic.getUser('Another ID');

    expect(userCacheMock.userGettings).toEqual(['Another ID']);
  });

  it('should start getting a user by a given ID from the store not from the cache when specified', async () => {
    const {businessLogic, userStoreMock, userCacheMock} = setUp();

    businessLogic.getUser('ID', /* fromCache= */ false);

    expect(userStoreMock.userGettings).toEqual(['ID']);
    expect(userCacheMock.userGettings).toEqual([]);
  });

  it('should start getting a user by another given ID from the store when specified', async () => {
    const {businessLogic, userStoreMock} = setUp();

    businessLogic.getUser('Another ID', /* fromCache= */ false);

    expect(userStoreMock.userGettings).toEqual(['Another ID']);
  });

  it('should resolve with a user that has the ID of the user with a given ID when the user getting from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({id: 'ID'}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({id: 'ID'}));
  });

  it('should resolve with a user that has the ID of the user with another given ID when the user getting from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({id: 'Another ID'}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({id: 'Another ID'}));
  });

  it('should resolve with a user that has the name of the user with a given name when the user getting from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({name: 'Name'}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({name: 'Name'}));
  });

  it('should resolve with a user that has the name of the user with another given name when the user getting from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({name: 'Another name'}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({name: 'Another name'}));
  });

  it('should resolve with a user that is adult when the user getting from the cache succeeds with a user whose age is 18', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 18}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isAdult: true}));
  });

  it('should resolve with a user that is juvenile when the user getting from the cache succeeds with a user whose age is 17', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 17}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isAdult: false}));
  });

  it('should resolve with a user that is adult when the user getting from the cache succeeds with a user whose age is 19', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 19}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isAdult: true}));
  });

  it('should resolve with a user that is juvenile when the user getting from the cache succeeds with a user whose age is 16', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 16}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isAdult: false}));
  });

  it('should resolve with a user that is eligibale to buy alcohol when the user getting from the cache succeeds with a user whose age is 21', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 21}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isEligibaleToBuyAlcohol: true}));
  });

  it('should resolve with a user that is not eligibale to buy alcohol when the user getting from the cache succeeds with a user whose age is 20', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 20}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isEligibaleToBuyAlcohol: false}));
  });

  it('should resolve with a user that is eligibale to buy alcohol when the user getting from the cache succeeds with a user whose age is 22', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 22}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isEligibaleToBuyAlcohol: true}));
  });

  it('should resolve with a user that is not eligibale to buy alcohol when the user getting from the cache succeeds with a user whose age is 19', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userGetting = businessLogic.getUser('ID');
    await userCacheMock.succeedUserGettingAt(0, makeGatewayUser({age: 19}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({isEligibaleToBuyAlcohol: false}));
  });

  it('should resolve with a given user when the user getting from the store succeeds', async () => {
    const {businessLogic, userStoreMock} = setUp();

    const userGetting = businessLogic.getUser('ID', false);
    await userStoreMock.succeedUserGettingAt(0, makeGatewayUser({id: 'ID'}));

    await expect(userGetting).resolves.toEqual(expect.objectContaining({id: 'ID'}));
  });

  it('should start listing users from the cache not from the store by default', async () => {
    const {businessLogic, userStoreMock, userCacheMock} = setUp();

    expect(userStoreMock.userListingCount).toBe(0);
    expect(userCacheMock.userListingCount).toBe(0);

    businessLogic.getUsers();

    expect(userStoreMock.userListingCount).toBe(0);
    expect(userCacheMock.userListingCount).toBe(1);
  });

  it('should start listing users from the store not from the cache when specified', async () => {
    const {businessLogic, userStoreMock, userCacheMock} = setUp();

    businessLogic.getUsers(/* fromCache= */ false);

    expect(userStoreMock.userListingCount).toBe(1);
    expect(userCacheMock.userListingCount).toBe(0);
  });

  it('should resolve with a given user when the user listing from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userListing = businessLogic.getUsers();
    await userCacheMock.succeedUserListingAt(0, new Set([makeGatewayUser({id: 'ID'})]));

    await expect(userListing).resolves.toEqual(new Set([expect.objectContaining({id: 'ID'})]));
  });

  it('should resolve with given users when the user listing from the cache succeeds', async () => {
    const {businessLogic, userCacheMock} = setUp();

    const userListing = businessLogic.getUsers();
    await userCacheMock.succeedUserListingAt(
      0,
      new Set([makeGatewayUser({id: 'ID'}), makeGatewayUser({id: 'Another ID'})]),
    );

    await expect(userListing).resolves.toEqual(
      new Set([expect.objectContaining({id: 'ID'}), expect.objectContaining({id: 'Another ID'})]),
    );
  });

  it('should resolve with a given user when the user listing from the store succeeds', async () => {
    const {businessLogic, userStoreMock} = setUp();

    const userListing = businessLogic.getUsers(/* fromCache= */ false);
    await userStoreMock.succeedUserListingAt(0, new Set([makeGatewayUser({id: 'ID'})]));

    await expect(userListing).resolves.toEqual(new Set([expect.objectContaining({id: 'ID'})]));
  });

  it('should resolve with given users when the user listing from the store succeeds', async () => {
    const {businessLogic, userStoreMock} = setUp();

    const userListing = businessLogic.getUsers(/* fromCache= */ false);
    await userStoreMock.succeedUserListingAt(
      0,
      new Set([makeGatewayUser({id: 'ID'}), makeGatewayUser({id: 'Another ID'})]),
    );

    await expect(userListing).resolves.toEqual(
      new Set([expect.objectContaining({id: 'ID'}), expect.objectContaining({id: 'Another ID'})]),
    );
  });
});

function setUp() {
  const mockUserStore = new MockUserGateway();
  const mockUserCache = new MockUserGateway();
  return {
    businessLogic: new BusinessLogic(mockUserStore, mockUserCache),
    userStoreMock: mockUserStore as UserGatewayMock,
    userCacheMock: mockUserCache as UserGatewayMock,
  };
}

class AsyncFunctionSpy<Params extends any[], Result> {
  constructor(describeMissingCallAt: (index: number) => string = (index) => `No call at ${index}`) {
    this.#describeMissingCallAt = describeMissingCallAt;
  }

  call(...params: Params): Promise<Result> {
    const deferred = new Deferred<Result>();
    this.#calls.push({params, deferred});
    return deferred.promise;
  }

  async resolveAt(index: number, result: Result) {
    const {deferred} = this.#removeAt(index);
    deferred.resolve(result);
    await deferred.promise;
  }

  async rejectAt(index: number, error: Error) {
    const {deferred} = this.#removeAt(index);
    deferred.reject(error);
    try {
      await deferred.promise;
    } catch {}
  }

  get calls() {
    return this.#calls.map(({params}) => params);
  }

  #removeAt(index: number) {
    const [call] = this.#calls.splice(index, 1);
    if (!call) throw new Error(this.#describeMissingCallAt(index));
    return call;
  }

  #describeMissingCallAt;
  #calls: {params: Params; deferred: Deferred<Result>}[] = [];
}

class Deferred<Value> {
  constructor() {
    this.promise = new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
    });
  }

  readonly promise: Promise<Value>;

  get resolve(): (value: Value) => void {
    return this.#resolve;
  }

  get reject(): (error: Error) => void {
    return this.#reject;
  }

  #resolve!: (value: Value) => void;
  #reject!: (error: Error) => void;
}

class BusinessLogic {
  static #convertGatewayUserToUser({id, name, age}: GatewayUser): User {
    return {
      id,
      name,
      isAdult: age >= 18,
      isEligibaleToBuyAlcohol: age >= 21,
    };
  }

  constructor(userStore: UserGateway, userCache: UserGateway) {
    this.#userStore = userStore;
    this.#userCache = userCache;
  }

  async getUser(id: User['id'], fromCache = true): Promise<User> {
    const getewayUser = await (fromCache ? this.#userCache.getUserById(id) : this.#userStore.getUserById(id));
    return BusinessLogic.#convertGatewayUserToUser(getewayUser);
  }

  async getUsers(fromCache = true): Promise<ReadonlySet<User>> {
    const gatewayUsers = Array.from(await (fromCache ? this.#userCache.listUsers() : this.#userStore.listUsers()));
    return new Set(gatewayUsers.map(BusinessLogic.#convertGatewayUserToUser));
  }

  readonly #userStore;
  readonly #userCache;
}

type User = {
  readonly id: string;
  readonly name: string;
  readonly isAdult: boolean;
  readonly isEligibaleToBuyAlcohol: boolean;
};

class MockUserGateway implements UserGateway, UserGatewayMock {
  // UserGateway

  getUserById(id: GatewayUser['id']) {
    return this.#getUserByIdSpy.call(id);
  }

  listUsers() {
    return this.#listUsersSpy.call();
  }

  // UserGatewayMock

  get userGettings() {
    return this.#getUserByIdSpy.calls.map(([id]) => id);
  }
  async succeedUserGettingAt(index: number, user: GatewayUser) {
    await this.#getUserByIdSpy.resolveAt(index, user);
  }

  get userListingCount() {
    return this.#listUsersSpy.calls.length;
  }
  async succeedUserListingAt(index: number, users: ReadonlySet<GatewayUser>) {
    await this.#listUsersSpy.resolveAt(index, users);
  }

  readonly #getUserByIdSpy = new AsyncFunctionSpy<[GatewayUser['id']], GatewayUser>();
  readonly #listUsersSpy = new AsyncFunctionSpy<[], ReadonlySet<GatewayUser>>();
}

interface UserGateway {
  getUserById(id: GatewayUser['id']): Promise<GatewayUser>;
  listUsers(): Promise<ReadonlySet<GatewayUser>>;
}

interface UserGatewayMock {
  readonly userGettings: readonly GatewayUser['id'][];
  succeedUserGettingAt(index: number, user: GatewayUser): Promise<void>;

  readonly userListingCount: number;
  succeedUserListingAt(index: number, users: ReadonlySet<GatewayUser>): Promise<void>;
}

function makeGatewayUser({id = 'ID', name = 'Name', age = 21}: Partial<GatewayUser>): GatewayUser {
  return {id, name, age};
}

type GatewayUser = {
  readonly id: string;
  readonly name: string;
  readonly age: number;
};
