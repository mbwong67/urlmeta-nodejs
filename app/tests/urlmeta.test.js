const getUrlMetadata = require('../urlmeta');

test('google.com', async () => {
  const result = await getUrlMetadata('https://google.com')
  expect(result).toEqual(samples['google'])
});

test('YouTube link', async () => {
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
  }
}

