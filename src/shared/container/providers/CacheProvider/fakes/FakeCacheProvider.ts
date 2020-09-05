import ICacheProvider from '../models/ICacheProvider';

interface ICacheDate {
    [key: string]: string;
}

export default class FakeCacheProvider implements ICacheProvider {
    cache: ICacheDate = {};

    public async save(key: string, value: any): Promise<void> {
        this.cache[key] = JSON.stringify(value);
    }

    public async recover<T>(key: string): Promise<T | null> {
        const data = this.cache[key];
        if (!data) {
            return null;
        }
        return JSON.parse(data) as T;
    }

    public async invalidate(key: string): Promise<void> {
        delete this.cache[key];
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        Object.keys(this.cache).forEach(key => {
            if (key.startsWith(`${prefix}:`)) {
                delete this.cache[key];
            }
        });
    }
}
