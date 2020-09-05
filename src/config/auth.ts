const auth = {
    secret: process.env.APP_SECRET || 'default',
    expireIn: '1d',
};

export default auth;
