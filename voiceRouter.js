var express = require("express");
var router = express.Router();
var fs = require('fs');
const WaveFile = require('wavefile').WaveFile;
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

async function quickstart() {

  const gcsUri = 'gs://cloud-samples-data/speech/brooklyn_bridge.raw';
  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
}

async function fileVoice2text(filename, srlan) {
    const encoding = 'LINEAR16';
    const sampleRateHertz = 8000;
    const languageCode = srlan;
  
    const config = {
      encoding: encoding,
      sampleRateHertz: sampleRateHertz,
      languageCode: languageCode,
    };

    console.log(filename)
    let wav = new WaveFile(fs.readFileSync(filename));
    wav.toSampleRate(sampleRateHertz);
    const audio = {
      // content: fs.readFileSync("public/out.wav").toString('base64'),
      content: wav.toBase64(),
    };
    
    const request = {
      config: config,
      audio: audio,
    };
    
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    return transcription;
}

async function translateText(text, tg) {
    let translations = await translate.translate(text, tg);
    return translations;
}

// test speech2text
router.get("/", function(req, res, next) {
    var transcript = quickstart();
    transcript.then(function(result) {
      res.send(result);
   })
});

router.post("/fileVoice", function(req, res, next) {
  var filename = req.body.filename;
  var srlan = req.body.srlan;
  var tglan = req.body.tglan;
  // var transcript = fileVoice2text('public/'+filename);
  var transcript = fileVoice2text('public/'+filename, srlan);

  transcript.then(function(result) {
    var transtext= translateText(result, tglan);
    transtext.then(function(trans) {
        res.send({'origintext': result, 'transtext': trans[0]});
    })
 })
});

module.exports = router;