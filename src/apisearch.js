/**
 * Apisearch entry point
 */
import Query, {
    QUERY_DEFAULT_PAGE,
    QUERY_DEFAULT_SIZE,
    QUERY_INFINITE_SIZE
} from "./Query";
import HttpRepository from "./Repository";
import ItemUUID from "./ItemUUID";

const cache = {};

const client = function(repository, endpoint, secret) {
    this.repository = repository;
    this.endpoint = endpoint;
    this.secret = secret;
};

const search = function(query, callback) {
    let repository = new HttpRepository(
        this.endpoint,
        this.secret
    );

    return repository
        .query(query)
        .then(
            response => callback(response)
        )
    ;
};

const query =  {
    create(
        q,
        page = QUERY_DEFAULT_PAGE,
        size = QUERY_DEFAULT_SIZE
    ) {
        return new Query({
            q,
            from: (page - 1) * size,
            page,
            size
        });
    },
    createMatchAll() {
        return new Query({
            q: '',
            page: QUERY_DEFAULT_PAGE,
            size: QUERY_INFINITE_SIZE
        });
    },
    createLocated(
        coordinate,
        queryText,
        page = QUERY_DEFAULT_PAGE,
        size = QUERY_DEFAULT_SIZE
    ) {
        return new Query({
            coordinate,
            page,
            size,
            q: queryText
        });
    }
};

const createUUID = function(id, type) {
    return new ItemUUID(
        id,
        type
    );
};

module.exports = {
    client,
    search,
    query,
    createUUID,
    cache
};