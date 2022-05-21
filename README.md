# Auth
Node Express MongoDB api for managing locations.

## Installation

Use the package manager [npm](https://github.com/mattcole75/locations) to install Locations once you have cloned the repository.

```bash
npm install
```
## description
This API is part of a suit of microservices with a purpose to handle application locations only. The system requires access to the Auth microservice to approve transactions based on authentication and authorised roles.

## Configuration
 - Create a .env file in the root directory
    - Add the following configuration:
        - DB_URI={your mongodb uri} e.g. mongodb://localhost:27017/
        - PORT={the port number you will serve the express app on} e.g. 1337
        - LOG_PATH={the path to your log file} e.g. ./logs/auth.log
- Create your logs Directory as above
- Take a look at the config file in the configuration directory as this information is used in the URL's.
- The location text search functionality will only work once the text inecies are in place on the name and description fields on MongoDB Schema.

## Data requirements
```
    - name: String(1 - 64)
    - description: String(1 - 256)
    - address.line1: String(1 - 64)
    - address.line2: String(1 - 64)
    - address.city: String(1 - 64)
    - address.postcode: String(1 - 16)
    - latitude: String(1 - 32)
    - longitude: String(1 - 32)
    - what3words: String(1 - 256)
```
## Usage

### POST Create location:
This API will accept a level 1 or root location. You can add sub locations to this location.
You can use what ever address format you require as mongo will store the contents as a document.
```
POST http://localhost:1337/auth/api/0.1/location

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Requires JSON Body:
    {
        name: 'the name of the location,
        description: 'brief description of the location',
        address: {
            line1: 'address line 1 of the location',
            line2: 'address line 2 of the location',
            city: 'the locations city or town',
            postcode: 'the postcode of the location'
        },
        latitude: 'the latitude coordinate of the location',
        longitude: 'the longitude coordination of the location',
        what3words: 'the what three words reference for the location'
    }

Returns:
    - 201 Created, returns the uid and transaction status
    - 500 Internal error message
```

### POST Create sub-location:
This API will accept a level 2, 3, 4 ... location and associate it to its parent location'.
```
POST http://localhost:1337/auth/api/0.1/location

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid'
    }

Requires JSON Body:
    {
        parentRef: 'the uid of the parent location',
        name: 'the name of the location,
        description: 'brief description of the location',
        what3words: 'the what three words reference for the location'
    }

Returns:
    - 201 Created, returns the uid and transaction status
    - 500 Internal error message
```

### GET location:
This API will return the matching location provided it is in use.
```
GET http://localhost:1337/auth/api/0.1/location

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid',
        id: 'the id of the location'
    }

Returns:
    - 200 ok, returns the stored location matching the id
    - 404 not found
    - 500 Internal error message
```

### GET locations:
This API will return the matching locations provided it is in use for all levels.
```
GET http://localhost:1337/auth/api/0.1/locations

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid',
        id: 'the id of the parent location || ommitt to return all level 1'
    }

Returns:
    - 200 ok, returns the stored location matching the id
    - 400 [error details]
    - 500 Internal error message
```

### PATCH location:
This API will patch a given location attribut(s) given the location uid.
```
GET http://localhost:1337/auth/api/0.1/locations

Requires JSON Header:
    {
        idToken: 'the given IdToken',
        localId: 'the given localid',
        id: 'the id of the location'
    }

Requires JSON Body:
    {
        [attribute]: 'the value to update it to'
    }

Returns:
    - 200 ok, returns the stored location matching the id
    - 400 invalid request
    - 500 Internal error message
```

## License
[GNU GENERAL PUBLIC LICENSE V3](https://www.gnu.org/licenses/gpl-3.0.en.html)