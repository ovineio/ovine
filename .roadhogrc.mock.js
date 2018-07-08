import apis from './mock/server';

const isMock = process.env.MOCK === 'true';

export default (isMock ? apis : {});
