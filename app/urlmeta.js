const domino = require('domino')
const fetch = require('node-fetch')
/*
 * Metadata parser, https://github.com/mozilla/page-metadata-parser
 *
 * The purpose of this library is to be able to find a consistent 
 * set of metadata for any given web page. 
 * Each individual kind of metadata has many rules which define 
 * how it may be located.
 *
 * Metadata example:
 * {
 *   "description": "A Javascript library for parsing metadata on a web page. - mozilla/page-metadata-parser",
 *   "icon":"https://github.githubassets.com/favicon.ico",
 *   "image":"https://avatars0.githubusercontent.com/u/131524?s=400&v=4",
 *   "title":"mozilla/page-metadata-parser",
 *   "language":"en",
 *   "type":"object",
 *   "url":"https://github.com/mozilla/page-metadata-parser",
 *   "provider":"GitHub"
 * }
 */
const {getMetadata, metadataRuleSets} = require('page-metadata-parser')
const urlParser = require('url')

const MAX_ALT_IMAGES = 30

// We extend standard metadata with og:video tag.
var metadataRules = metadataRuleSets
metadataRules["video"] = {
  rules: [
    ['meta[property="og:video:secure_url"]', element => element.getAttribute('content')],
    ['meta[property="og:video:url"]', element => element.getAttribute('content')],
    ['meta[property="og:video"]', element => element.getAttribute('content')],
  ]
}

async function getUrlMetadata(targetUrl) {
  const url = urlParser.parse(targetUrl)
  const host = url.hostname

  if (host.indexOf("youtube.com") !== -1 || host.indexOf("youtu.be") !== -1) {
    return getYoutubeMetadata(url)
  } else {
    return getPageMetadata(url)
  }
}

async function getYoutubeMetadata(targetUrl) {
  // To verify that targetUrl is well-formed.
  const parsedUrl = urlParser.parse(targetUrl)

  // Build the url to the /oembed endpoint.
  var youtubeUrl = urlParser.parse("https://www.youtube.com/oembed")
  youtubeUrl.query = {
    "url": targetUrl.format(),
    "format": "json"
  }
  const metadataUrl = youtubeUrl.format()

  const response = await fetch(metadataUrl)
  if (!response.ok) {
    throw new Error("Can not fetch youtube data: " + response.statusText)
  }
  const metadata = await response.json()

  return metadataResult({
    "url":          targetUrl.format(),
    "title":        metadata.title,
    "image":        metadata.thumbnail_url,
    "type":         metadata.type,
    "siteName":     targetUrl.hostname,
  })
}

async function getPageMetadata(url) {
  // Fetch the URL and get page text.
  const response = await fetch(url.format())
  if (!response.ok) {
    throw new Error("Can not fetch page: " + response.statusText)
  }
  const html = await response.text()

  // Parse page text with domino.
  const doc = domino.createWindow(html).document

  // Extract metadata.
  const metadata = getMetadata(doc, url.format(), metadataRules)
  const temp = doc.querySelector('meta[property="og:title"]')
  const hasOgTags = doc.querySelectorAll('meta[property="og:title"]').length !== 0

  var data = {
    "hasOgTags":    hasOgTags,
    "url":          metadata.url,
    "title":        metadata.title,
    "description":  metadata.description,
    "image":        metadata.image,
    "type":         metadata.type,
    "locale":       metadata.language,
    "video":        metadata.video,
    "siteName":     url.hostname,
    "altImages":    hasOgTags ? [] : getDocumentImages(doc, url),
  }
  // TODO: looks like "undefined" values are excluded from output
  // along with the keys, why?
  return metadataResult(data)
}

function imageThatShouldBeExcluded(imageSource) {
   return imageSource.startsWith("https://www.facebook.com/tr?")
}

function getDocumentImages(doc, docUrl) {
  const images = doc.querySelectorAll("img")
  const count = Math.min(images.length, MAX_ALT_IMAGES)

  var result = []
  for (var i = 0; i < count; i++) {
    imageSource = images[i].src
    if(!imageSource || imageThatShouldBeExcluded(imageSource)) {
      continue
    }
    var imageUrl = null
    try {
      imageUrl = urlParser.parse(imageSource)
    } catch (e) {
      // Skip bad image link
      continue
    }
    if (!imageUrl.host) {
      result.push(docUrl.resolve(imageUrl))
    } else {
      result.push(imageUrl.format())
    }
  }
  return result
}

function metadataResult(metadata) {
  // express.js skips fields with 'undefined' values,
  // if we have data = {'test': undefined} and we do res.json(data),
  // the actual response will be {} (empty object).
  // And domino returns undefined for absent elements, so we
  // do the undefined -> null replacement here to preserve these keys
  // in the request output.
  for (var key in metadata) {
    if (metadata[key] === undefined) {
      metadata[key] = null;
    }
  }
  return Object.assign ({
    "hasOgTags":    false,
    "url":          "",
    "title":        "",
    "description":  "",
    "image":        "",
    "type":         "",
    "locale":       "",
    "video":        "",
    "siteName":     "",
    "altImages":    [],
  }, metadata)
}

module.exports = getUrlMetadata
