import apis from './mock/server';

const isMock = process.env.API_ENV === 'local';

export default (isMock ? apis : {});
