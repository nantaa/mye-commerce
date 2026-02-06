import Xendit from 'xendit-node';

const xendit = new Xendit({
    secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_...',
});

export const { Invoice } = xendit;
export default xendit;
