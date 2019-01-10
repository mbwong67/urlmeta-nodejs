const getUrlMetadata = require('../urlmeta');

test('google.com returns expected data', async () => {
  const result = await getUrlMetadata('https://google.com')
  expect(result).toEqual(samples['google'])
});

test('nytimes.com returns expected data', async () => {
  const result = await getUrlMetadata('https://www.nytimes.com/2018/10/01/opinion/justice-kavanaugh-recuse-himself.html')
  expect(result).toEqual(samples['nytimes'])
});

test('Non-existing nytimes url results in an error', async () => {
  expect.assertions(1);
  try {
    const result = await getUrlMetadata('https://www.nytimes.com/2018/10/01/opinionauauauno/')
  } catch (e) {
    expect(e).toEqual(new Error(
      'Can not fetch page: Not Found'
    ))
  }
});

test('Malformed nytimes url results in an error', async () => {
  expect.assertions(1);
  try {
    const result = await getUrlMetadata('httpsQQ://www.nytimes.com/2018/10/01/opinionauauauno/')
  } catch (e) {
    expect(e).toEqual(new TypeError(
      'Only HTTP(S) protocols are supported'
    ))
  }
});

test('YouTube link returns expected data', async () => {
  const result = await getUrlMetadata('https://www.youtube.com/watch?v=0J66ybQM0lo')
  expect(result).toEqual(samples['youtube'])
});

test('Malformed youtube url results in an error', async () => {
  expect.assertions(1);
  try {
    const result = await getUrlMetadata('httpsQQ://www.youtube.com/watch?v=3viZhIumUNo')
  } catch (e) {
    expect(e).toEqual(new Error(
      'Can not fetch youtube data: Not Found'
    ))
  }
});

test('Non-existing youtube url results in an error', async () => {
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
  'google': {
    "hasOgTags":false,
    "url":"https://google.com/",
    "title":"Google",
    "description":null,
    "image":null,
    "type":null,
    "locale":"uk",
    "video":null,
    "siteName":"google.com",
    "altImages":[
        "https://google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png",
        "https://google.com/textinputassistant/tia.png"
    ]
  },
  'youtube': {
    "hasOgTags":false,
    "url":"https://www.youtube.com/watch?v=0J66ybQM0lo",
    "title":"Federer Training",
    "description":"",
    "image":"https://i.ytimg.com/vi/0J66ybQM0lo/hqdefault.jpg",
    "type":"video",
    "locale":"",
    "video":"",
    "siteName":"www.youtube.com",
    "altImages":[]
  },
  'nytimes': {
    "hasOgTags":true,
    "url":"https://www.nytimes.com/2018/10/01/opinion/justice-kavanaugh-recuse-himself.html",
    "title":"Opinion | All the Ways a Justice Kavanaugh Would Have to Recuse Himself",
    "description":"Given his blatant partisanship and personal animosity toward liberals, how could he be an effective member of the Supreme Court?",
    "image":"https://static01.nyt.com/images/2018/10/01/opinion/01Tribe/01Tribe-facebookJumbo.jpg",
    "type":"article",
    "locale":"en",
    "video":null,
    "siteName":"www.nytimes.com",
    "altImages":[]
  }
}
