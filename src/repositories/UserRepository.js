import Repository from './Repository';

const resource = 'user';

export default {
    get() {
        return Repository.get(`${resource}.profile`);
    },
    getAccount(){
        return Repository.get(`${resource}.account`);
    }
}
