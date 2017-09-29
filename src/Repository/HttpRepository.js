import MemoryCache from "../Cache/MemoryCache";
const axios = require('axios/lib/axios');

/**
 * Repository class
 */
export default class HttpRepository {
    /**
     * Constructor
     * @param endpoint
     * @param secret
     * @param cache
     */
    constructor(endpoint, secret, cache) {
        this.endpoint = endpoint;
        this.secret = secret;
        this.cache = cache ? new MemoryCache() : null;
    }

    /**
     * Make query against the server
     * @param query
     * @returns {Promise}
     */
    query(query) {
        query = encodeURI(
            JSON.stringify(query)
        );
        let composedQuery = `${this.endpoint}?key=${this.secret}&query=${query}`;

        // check if query exists in cache store
        // return promise with the cached value if key exists
        // if not exists, fetch the data
        if (this.cache !== null) {
            let cachedResponse = this.cache.get(composedQuery);
            if (cachedResponse) {
                return new Promise(
                    resolve => resolve(cachedResponse)
                );
            }
        }

        return this.fetchData(composedQuery);
    }

    /**
     * Fetch data using Axios method
     * @param composedQuery
     * @returns {Promise}
     */
    fetchData(composedQuery) {
        let self = this;

        return new Promise((resolve, reject) => {
            axios.get(composedQuery)
                .then(response => {
                    // check if cache is enabled
                    // set the composedQuery as a cache key
                    // and the valid response as a cache value
                    if (self.cache !== null) {
                        self.cache.set(
                            composedQuery,
                            response.data
                        );
                    }

                    return resolve(response.data);
                })
                .catch(
                    error => reject(error)
                );
        });
    }
}