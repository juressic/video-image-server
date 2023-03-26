require('dotenv').config();

//Express
const express = require('express');
const app = express();
const PORT = 5557; //process.env.PORT || 8080;

const path = require('path');
const fs = require('fs');

const multer = require('multer');

const uuid = require('uuid').v1;

//const mail_sender = require('./mail_sender');
const send_mail = require('./mail_sender');

app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: false }));

app.use('/', require('./routes/visitors'));

app.use('/stream', require('./routes/stream'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
  //res.send('Welcome to the automatic web creator app!');
});

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/data');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '--' + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

app.post('/single', upload.single('image'), (req, res) => {
  console.log(req.file);
  res.send('Single File upload success');
});

//Create New Stream Route
const newStreamRoute = (videoName) => {
  const streamRoute = `routes.get('/${videoName}', (req, res) => {
  const path = './public/data/${videoName}';
  const stat = fs.statSync(path);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });
    const head = {
      'Content-Range': \`bytes \${start}-\${end}/\${fileSize}\`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
}
);`;
  return streamRoute;
};

//const serverAddress = 'http://172.24.20.160';
//const serverAddress = 'http://localhost';
const serverAddress = '20.199.179.107'; //'18.212.42.92'; //http://20.199.179.107/
//const serverAddress = 'localhost';

const setTemplate = (helloMsg, img1, video, about) => {
  const template = `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${helloMsg}</title>
    <link rel="stylesheet" href="web-style.css" />
  </head>
  <body>
    <div class="main-container">
      <div class="top-section">
        <div class="header-container">
          <img
            src="http://${serverAddress}:${PORT}/data/${img1}"
            width="300"
            height="*"
            alt=""
          />
          <div class="header-info">
            <h1>Hello,</h1>
            <h3>You can call me ${helloMsg}!</h3>
            <h4>Look closely how wonderful I am!</h4>
          </div>
        </div>
      </div>
      <div class="mid-section">
        <div class="mid-container">
          <video muted autoplay width="300px" controls loop id="myVideo">
            <source
              src="http://${serverAddress}:${PORT}/stream/${video}"
              type="video/mp4"
            />
          </video>
          <h3>This is what I do 😄</h3>
        </div>
      </div>
      <div class="bot-section">
        <div class="bot-container">
          <h3>About Me</h3>
          <p>
            ${about}
          </p>
        </div>
      </div>
    </div>
  </body>
</html>`;

  const template2 = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Museum</title>
  </head>
  <body>
    <h1>${helloMsg}</h1>
    <video muted autoplay height="400" controls>
      <source src="http://${serverAddress}:${PORT}/stream/${video}" type="video/mp4" />
    </video>
    <img src="http://${serverAddress}:${PORT}/data/${img1}" width="300" height="*" alt="" />
  </body>
</html>
`;

  return template;
};

app.post('/multiple', upload.array('images', 10), async (req, res) => {
  var visitorName = req.body.visitor + '_' + Date.now();
  visitorName = visitorName.replace(/\s+/g, '');
  //Make profile dirs
  fs.mkdirSync(`./visitor/${visitorName}`);

  //Create new stream route
  fs.appendFile(
    './routes/stream.js',
    newStreamRoute(req.files[1].filename),
    (err) => {
      if (err) throw err;
      console.log('stream route created');
    }
  );

  //Create Website
  fs.appendFile(
    `./visitor/${visitorName}/${visitorName}.html`,
    setTemplate(
      `${req.body.visitor}`,
      `${req.files[0].filename}`,
      `${req.files[1].filename}`,
      `${req.body.about}`
    ),
    function (err) {
      if (err) throw err;
      console.log('Saved!');
    }
  );

  const route = `router.get('/${visitorName}', (req, res) => {
      res.sendFile(
        path.join(
          __dirname,
          '..',
          'visitor',
          '${visitorName}',
          '${visitorName}.html'
          )
          );
        });`;

  //Create route
  fs.appendFile('./routes/visitors.js', route, (err) => {
    if (err) throw err;
    console.log('route created');
  });

  const visitorLink = `${serverAddress}:${PORT}/${visitorName}`;
  //Send MAIL
  await send_mail(req.body.visitor, visitorLink, req.body.email);
  //res.json({ link: `${serverAddress}:${PORT}/${visitorName}` });
  res.sendFile(path.join(__dirname, '/my-Link.html'));
  //res.redirect('http://' + visitorLink);
  console.clear;
});

//Send mail to visitor
app.listen(PORT, () => console.log(`listening on port ${PORT}`));
//console.clear();
