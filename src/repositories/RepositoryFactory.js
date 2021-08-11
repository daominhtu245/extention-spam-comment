import UserRepository from './UserRepository';
import GroupRepository from './GroupRepository'

const repositories = {
    user: UserRepository,
    group: GroupRepository,
};

export default {
    get: name => repositories[name]
};
