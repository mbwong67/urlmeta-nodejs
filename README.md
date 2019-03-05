[![Build Status](https://travis-ci.org/serebrov/urlmeta-nodejs.svg?branch=master)](https://travis-ci.org/serebrov/urlmeta-nodejs)

[Express](https://expressjs.com/) app that fetches and returns URL metadata, based on [mozilla/page-metadata-parser](https://github.com/mozilla/page-metadata-parser).

The app implements the url parser service: for a given URL, it loads a webpage, parses and returns json with metadata (title, description, etc).

Similar service implemented in [python](https://github.com/serebrov/urlmeta-python).
Similar service implemented in [rust](https://github.com/serebrov/urlmeta-rust).

Run the setup: `make up`.

Usage example:

```
$ curl http://localhost:3000/url-parser\?target\=https://nodejs.org/en/

{
    "hasOgTags": true,
    "url": "https://nodejs.org/en/",
    "title": "Node.js",
    "description": "Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.",
    "image": "https://nodejs.org/static/images/logo-hexagon-card.png",
    "type": null,
    "locale": null,
    "video": null,
    "siteName": "nodejs.org",
    "altImages": []
}
```

```
$ curl http://localhost:3000/url-parser\?target\=https://www.youtube.com/watch\?v\=fJ9rUzIMcZQ

{
    "hasOgTags": false,
    "url": "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",
    "title": "Queen - Bohemian Rhapsody (Official Video)",
    "description": null,
    "image": "https://i.ytimg.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
    "type": "video",
    "locale": null,
    "video": null,
    "siteName": "www.youtube.com",
    "altImages": []
}
```
