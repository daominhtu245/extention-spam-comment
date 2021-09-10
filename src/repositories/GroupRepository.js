import Repository from './Repository';

const resource = 'group';

export default {
    get(params) {
        return Repository.get(`${resource}.list`, params);

    },
    getPost(params) {
        return Repository.get(`${resource}.getPost`, params);
    },
    comment(params){
        return Repository.get(`${resource}.comment`, params);

    }
    ,
    post(params) {
        return Repository.get(`${resource}.post`, params);
    },
}
