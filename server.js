// const express = require('express');
// const cors = require("cors");
// const app = express();
// const multer = require('multer');
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// const Meyda = require('meyda');

// const speechClient = new SpeechClient({
//   keyFilename: `${__dirname}/config.json`
// });

// app.use(express.json());
// app.use(cors());

// app.post('/api/audio-to-text', upload.single(), async (req, res) => {
//   try {
//     const audioData = req.body.audioData;
//     const audioBuffer = Buffer.from(audioData, 'base64');
//     const text = await convertAudioToText(audioBuffer);
//     res.json({ text });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred during audio-to-text conversion.' });
//   }
// });

// app.get("/", function (req, res) {
//   res.sendFile(__dirname + "/ps.html");
// });

// async function convertAudioToText(audioBuffer) {
//   const audio = {
//     content: audioBuffer.toString('base64'),
//   };

//   const config = {
//     languageCode: 'en-US',
//   };

//   const request = {
//     audio: audio,
//     config: config,
//   };

//   const [response] = await speechClient.recognize(request);

//   const transcription = response.results
//     .map((result) => result.alternatives[0].transcript)
//     .join(' ');

//   return transcription;
// }

// function extractFeatures(audioBuffer) {
//   const features = Meyda.extract(['spectralCentroid', 'rms'], audioBuffer);
//   return features;
// }

// app.post('/api/audio-features', upload.single(), async (req, res) => {
//   try {
//     const audioData = req.body.audioData;
//     const audioBuffer = Buffer.from(audioData, 'base64');
//     const features = extractFeatures(audioBuffer);
//     res.json({ features });
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ error: 'An error occurred during feature extraction.' });
//   }
// });

// const server = app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

const express = require('express');
const cors = require('cors');
const app = express();
const { SpeechClient } = require('@google-cloud/speech');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const Meyda = require('meyda');

const speechClient = new SpeechClient({
  keyFilename: `${__dirname}/config.json`
});

app.use(express.json());
app.use(cors());

app.post('/api/audio-to-text', upload.single(), async (req, res) => {
  try {
    const audioData = req.body.audioData;
    const audioBuffer = Buffer.from(audioData, 'base64');
    const text = await convertAudioToText(audioBuffer);
    res.json({ text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during audio-to-text conversion.' });
  }
});

async function convertAudioToText(audioBuffer) {
  const audio = {
    content: audioBuffer.toString('base64'),
  };

  const config = {
    languageCode: 'en-US',
  };

  const request = {
    audio: audio,
    config: config,
  };

  const [response] = await speechClient.recognize(request);

  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join(' ');

  return transcription;
}

function extractFeatures(audioBuffer) {
  const features = Meyda.extract(['mfcc', 'chroma'], audioBuffer);
  return features;
}

app.post('/api/audio-features', upload.single(), async (req, res) => {
  try {
    const audioData = req.body.audioData;
    const audioBuffer = Buffer.from(audioData, 'base64');
    const features = extractFeatures(audioBuffer);
    res.json({ features });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred during feature extraction.' });
  }
});   

const server = app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

