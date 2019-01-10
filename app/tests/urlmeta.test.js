const getUrlMetadata = require('../urlmeta');

test('google.com', async () => {
  const result = await getUrlMetadata('https://google.com')
  expect(result).toEqual(samples['google'])
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
}

