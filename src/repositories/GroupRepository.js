import Repository from './Repository';

const resource = 'group';

export default {
    get(params) {
        return Repository.get(`${resource}.list`, params);
    },
    post(params) {
        return Repository.get(`${resource}.post`, params);
    },
}
