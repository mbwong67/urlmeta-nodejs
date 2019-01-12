const nock = require('nock')
const getUrlMetadata = require('../urlmeta');

test('wikipedia.org returns expected data', async () => {
  // Mock the network request.
  const scope = nock('https://wikipedia.org')
   .get('/')
   .replyWithFile(200, __dirname + '/samples/wikipedia.html')

  // Get the metadata.
  const result = await getUrlMetadata('https://wikipedia.org')
  expect(result).toEqual(samples['wikipedia'])
});

test('nytimes.com returns expected data', async () => {
  const url = '/2018/10/01/opinion/justice-kavanaugh-recuse-himself.html'

  // Mock the network request.
  const scope = nock('https://www.nytimes.com')
   .get(url)
   .replyWithFile(200, __dirname + '/samples/nytimes.html')

  // Get the metadata.
  const result = await getUrlMetadata('https://www.nytimes.com' + url)
  expect(result).toEqual(samples['nytimes'])
});

test('Non-existing nytimes url results in an error', async () => {
  const url = '/2018/10/01/opinionauauauno/'

  // Mock the network request.
  const scope = nock('https://www.nytimes.com')
   .get(url)
   .replyWithFile(404, __dirname + '/samples/nytimes_404.html')

  expect.assertions(1);
  try {
    // Get the metadata, verify that we get an error.
    const result = await getUrlMetadata('https://www.nytimes.com' + url)
  } catch (e) {
    expect(e).toEqual(new Error(
      'Can not fetch page: Not Found'
    ))
  }
});

test('Malformed nytimes url results in an error', async () => {
  expect.assertions(1);
  try {
    // Get the metadata, verify that we get an error.
    const result = await getUrlMetadata('httpsQQ://www.nytimes.com/2018/10/01/opinionauauauno/')
  } catch (e) {
    expect(e).toEqual(new TypeError(
      'Only HTTP(S) protocols are supported'
    ))
  }
});

test('YouTube link returns expected data', async () => {
  // Mock the network request.
  const scope = nock('https://www.youtube.com')
   // We request the metadata from the /oembed endpoint
   .get('/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D0J66ybQM0lo&format=json')
   .replyWithFile(200, __dirname + '/samples/youtube.json')

  // Get the metadata.
  const result = await getUrlMetadata('https://www.youtube.com/watch?v=0J66ybQM0lo')
  expect(result).toEqual(samples['youtube'])
});

test('Malformed youtube url results in an error', async () => {
  // Mock the network request.
  const scope = nock('https://www.youtube.com')
   .get('/oembed?url=httpsqq%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3viZhIumUNo&format=json')
   .reply(404, 'Not found')

  expect.assertions(1);
  try {
    // Get the metadata, verify that we get an error.
    const result = await getUrlMetadata('httpsQQ://www.youtube.com/watch?v=3viZhIumUNo')
  } catch (e) {
    expect(e).toEqual(new Error(
      'Can not fetch youtube data: Not Found'
    ))
  }
});

test('Non-existing youtube url results in an error', async () => {
  // Mock the network request.
  const scope = nock('https://www.youtube.com')
   .get('/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3viZhIumUNo_noexist1321&format=json')
   .reply(404, 'Not found')

  expect.assertions(1);
  try {
    const result = await getUrlMetadata('https://www.youtube.com/watch?v=3viZhIumUNo_noexist1321')
  } catch (e) {
    expect(e).toEqual(new Error(
      'Can not fetch youtube data: Not Found'
    ))
  }
});


const samples = {
  "wikipedia": {
    "hasOgTags":false,
    "url":"https://wikipedia.org/",
    "title":"Wikipedia",
    "description":"Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation.",
    "image":null,
    "type":null,
    "locale":null,
    "video":null,
    "siteName":"wikipedia.org",
    "altImages": [
      "https://wikipedia.org/portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png"
    ]
  },
  "youtube": {
    "hasOgTags":false,
    "url":"https://www.youtube.com/watch?v=0J66ybQM0lo",
    "title":"Federer Training",
    "description":null,
    "image":"https://i.ytimg.com/vi/0J66ybQM0lo/hqdefault.jpg",
    "type":"video",
    "locale":null,
    "video":null,
    "siteName":"www.youtube.com",
    "altImages":[]
  },
  "nytimes": {
    "hasOgTags":true,
    "url":"https://www.nytimes.com/2018/10/01/opinion/justice-kavanaugh-recuse-himself.html",
    "title":"Opinion | All the Ways a Justice Kavanaugh Would Have to Recuse Himself",
    "description":"Given his blatant partisanship and personal animosity toward liberals, how could he be an effective member of the Supreme Court?",
    "image":"https://static01.nyt.com/images/2018/10/01/opinion/01Tribe/01Tribe-facebookJumbo.jpg",
    "type":"article",
    "locale":null,
    "video":null,
    "siteName":"www.nytimes.com",
    "altImages":[]
  }
}
