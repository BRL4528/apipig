/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import WebSocket from 'ws';
import 'express-async-errors';
import { errors } from 'celebrate';
import { Server } from 'socket.io';
import { spawn, execSync, exec } from 'child_process';
// import { SerialPort } from 'serialport';
// import { ReadlineParser } from '@serialport/parser-readline';
import ngrok from '@ngrok/ngrok';
import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';
// import rateLimiter from './middlewares/rateLimiter';
// import upload from '@config/upload';
import mqtt from 'mqtt';
import '@shared/infra/typeorm';
import '@shared/container';
import { UUIDV4 } from 'sequelize';
import axios, { AxiosResponse } from 'axios';

// interface PropsHandleEsp {
//   espSocket: WebSocket;
//   res: Response<any>;
// }

const app = express();
let balanceOnline = false;
let cppProcess: any;
let idCounting: any;
let port: any
let pythonProcess: any = null;

let cppClient: WebSocket | null = null; // Cliente WebSocket para C++
// Não inserir URL de acesso prioritario
// console.log('API CHEGOU NO CORS');
// app.use(cors());
const mqttClient = mqtt.connect('mqtt://10.42.0.1:1883')

//SERIAL PORT
// try {
//   port = new SerialPort({
//     path: '/dev/ttyUSB0',
//     baudRate: 9600,
//   });

// } catch (err) {
//   console.log('Eror', err)
// }

app.use(bodyParser.json({ limit: '50mb' }));

app.use(
  cors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

const serverHttp = http.createServer(app);
const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});
const espWsUrl = 'ws://10.42.0.164:81';
const wss = new WebSocket.Server({ server: serverHttp });




io.on('connection', socket => {
  console.log(`Usuário conectado no socket ${socket.id}`);
});

const options = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html'],
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders(res: any, path: string, stat: any) {
    res.set('x-timestamp', Date.now());
  },
};

app.use(
  '/processes/file',
  express.static(`${uploadConfig.tmpFolder}/processes/file`, options),
);
app.use(express.json());

// app.use('/image', express.static(`${upload.tmpFolder}/car/image`));
// app.use('/document', express.static(`${upload.tmpFolder}/car/document`));
// app.use(rateLimiter);
app.use(routes);
app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

let ngrokUrl: any;

app.get('/ngrok-url', (req, res) => {

  res.json({ url: ngrokUrl });
});
console.log('EEEE', ngrokUrl)
async function startNgrok() {
  if (ngrokUrl === undefined) {
    const url = await ngrok.connect({
      addr: 9000, // Porta do seu servidor
      authtoken: '2mAzcZADRLcFPKkgDKIgjEI4Bin_5PRK3EUj6jpzn7u4CNtgd'
    });
    ngrokUrl = JSON.stringify(url.url())
    console.log(`ngrok tunnel opened at: ${ngrokUrl}`);
    return url.url();
  }
}
startNgrok();



// Rota para iniciar o stream
app.get('/start-stream', (req, res) => {
  if (pythonProcess) {
    return res.status(400).json({ message: 'Stream already running' });
  }

  pythonProcess = spawn('/usr/bin/python3', ['/home/jet/projects/apipig-jetson/exe/streaming.py']);

  pythonProcess.stdout.on('data', (data: any) => {
    console.log(`stdout: ${data}`);
  });

  pythonProcess.stderr.on('data', (data: any) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on('close', (code: any) => {
    console.log(`child process exited with code ${code}`);
    pythonProcess = null;
  });

  return res.status(200).json({ message: 'Stream started' });
});

// Rota para parar o stream
app.get('/stop-stream', (req, res) => {
  if (!pythonProcess) {
    return res.status(400).json({ message: 'No stream running' });
  }

  // Enviar o sinal para o script Python parar o stream
  pythonProcess.kill('SIGINT');

  pythonProcess = null;
  return res.status(200).json({ message: 'Stream stopped' });
});

app.get('/shutdown', async (req, res) => {
  execSync("echo 'jet' | sudo -S shutdown -h now")
});

// const videosDir = '/home/jet/projects/opencv_test/video';

app.get('/record-video/', (req, res) => {
  try {
    // const { videoComand } = req.params;
    // console.log('comando do video', videoComand)

    // if (videoComand !== 'gravar video') {
    const stringFormated = `/home/jet/pigtec/opecv-camera/build/WebcamCapture`
    cppProcess = spawn("/home/jet/pigtec/opecv-camera/build/WebcamCapture", [stringFormated])


    cppProcess.stdout.on('data', (data: any) => {
      console.log(`Saída do programa C++: ${data}`);
      // Aqui você pode enviar a saída para o cliente WebSocket, se necessário
    });

    //   cppProcess.stderr.on('data', (data: any) => {
    //     console.error(`Erro do programa C++: ${data}`);
    //     wss.clients.forEach(function each(client) {
    //       if (client.readyState === WebSocket.OPEN) {
    //         client.send('program_error');
    //       }
    //     });
    //     // Aqui você pode lidar com os erros do programa C++
    //   });

    //   res.json({ video: "http://192.168.101.56:8080/bgr" });
    //   return
    // }

    // cppProcess = spawn("/home/jet/projects/opencv_test/main", [videoComand])

    // cppProcess.stdout.on('data', (data: any) => {
    //   console.log(`Saída do programa C++: ${data}`);
    //   // Aqui você pode enviar a saída para o cliente WebSocket, se necessário
    // });

    // cppProcess.stderr.on('data', (data: any) => {
    //   console.error(`Erro do programa C++: ${data}`);
    //   wss.clients.forEach(function each(client) {
    //     if (client.readyState === WebSocket.OPEN) {
    //       client.send('program_error');
    //     }
    //   });
    //   // Aqui você pode lidar com os erros do programa C++
    // });

    // cppProcess.stdout.on('data', (data: any) => {
    //   console.log(`Saída do programa C++: ${data}`);
    //   // Aqui você pode enviar a saída para o cliente WebSocket, se necessário
    // });


    res.json({ video: "gravação iniciada" });


  } catch (error) {
    console.log('error', error)
  }

});

app.get('/stop-recording', (req, res) => {
  terminateCppProgram();

  res.json({ video: "gravação finalizada!" });
});


// app.get('/list-videos', (req, res) => {

//   fs.readdir(videosDir, (err, files) => {
//     if (err) {
//       console.error(`Erro ao ler diretório de vídeos: ${err}`);
//       return res.status(500).json({ error: 'Erro ao ler diretório de vídeos' });
//     }

//     const videos = files.filter(file => path.extname(file).toLowerCase() === '.mp4');

//     const videoPaths = videos.map(video => path.join(videosDir, video));

//     res.json({ videos: videoPaths });
//   });
// });

let sendBalanceData = false;

mqttClient.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  // Inscrevendo no tópico de dados da balança
  mqttClient.subscribe('peso/leituras', (err) => {
    if (err) {
      console.error('Erro ao se inscrever no tópico MQTT:', err);
    } else {
      console.log('Inscrito no tópico esp/balance');
    }
  });
});


app.get('/spawn', async (req, res) => {
  const {
    cfg,
    names,
    weights,
    saveVideo,
    roteViewVideo,
    mountVideo,
    idScores,
    qtdCurrent,
    balance,
  } = req.query;

  try {
    idCounting = idScores;

    // Iniciar o programa C++ como um processo separado
    if(balance === 'online' && !balanceOnline) {
      res.status(504).json({ message: 'Balança offline.' });
      return
    } else {
      cppProcess = spawn('/home/jet/pigtec/pigtec-cpp/main', [
        idCounting,
        cfg,
        names,
        weights,
        saveVideo,
        roteViewVideo,
        mountVideo,
        qtdCurrent
      ]);
      
    }
    cppProcess.stdout.on('data', (data: any) => {
      console.log(`Saída do programa C++: ${data}`);
      // const message = data.toString();
      // // Aqui você pode enviar a saída para o cliente WebSocket, se necessário

      // wss.clients.forEach((client) => {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(JSON.stringify({ type: 'stdout', message }));
      //   }
      // });

    });

    cppProcess.stderr.on('data', (data: any) => {
      console.error(`Erro do programa C++: ${data}`);
      // wss.clients.forEach(function each(client) {
      //   if (client.readyState === WebSocket.OPEN) {
      //     client.send(`program_error: '${data}'`);
      //   }
      // });
      // Aqui você pode lidar com os erros do programa C++
    });

    cppProcess.on('close', (code: any) => {
      console.log(`Programa C++ encerrado com código de saída ${code}`);

      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send('program_finalized');
        }
      });

      // Desabilitar envio de dados da balança quando o processo C++ for encerrado
      sendBalanceData = false;
    });

    sendBalanceData = balance === 'online';


    res.status(200).json({ message: 'Programa C++ iniciado' });
  } catch (e) {
    console.log(e)
    res
      .status(500)
      .json({ message: `Problemas ao executar programa. ERROR: ${e}` });
  }
});

mqttClient.on('message', (topic, message) => {
  // console.log('top', topic)
  // if (topic === 'peso/leituras' && sendBalanceData) {
  const weightData = Buffer.from(message).toString();

  // console.log(`Peso recebido via MQTT: ${weightData}`);

  // Enviar dados aos clientes WebSocket conectados
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(`scaleData ${weightData}`);
    }
  });
  // }
});


// async function handleConectEsp8266({espSocket, res}: PropsHandleEsp) {
//   try {
//     espSocket.on('open', () => {
//       console.log('Conectado ao WebSocket do ESP');
//     });

//     espSocket.on('message', (data: any) => {

//       // Converte os dados de Buffer para string
//       const msgString = Buffer.from(data).toString();

//       // Aqui você pode tratar os dados, por exemplo, removendo os caracteres indesejados
//       // Como o ESP pode estar enviando valores como '-10.3\r\n', você pode querer limpar ou ajustar isso.
//       // Exemplo: remova os caracteres '\r\n' e separe as leituras em um array
//       const readings = msgString.split("\r\n").filter((value) => value.trim() !== "");

//       // Se você quiser enviar a última leitura:
//       const latestReading = readings[readings.length - 1];
//       console.log('Última leitura:', latestReading);


//       // Enviar os dados para todos os clientes conectados
//       wss.clients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//           // Escolha o que enviar: latestReading ou averageReading
//           client.send(`scaleData ${msgString}`);
//         }
//       });

//       espSocket.on('close', () => {
//         console.log('Cliente desconectado');
//       });
//     });

//     espSocket.on('error', (err: any) => {
//       console.error('Erro na conexão com o ESP:', err);
//     });
//   } catch (err) {
//     console.log('Error', err)
//   }
// }
// //STREAM 2

app.get('/video', (req, res) => {
  const { videoPath } = req.query; // Path to your video file
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
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
    fs.createReadStream(videoPath).pipe(res);
  }
});

// Start the server
// app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

//APP
app.get('/videos', (req, res) => {
  const videos = fs.readdirSync('videos');

  const videosMap = videos.map(video => {
    return `${__dirname}${'/'}videos${'/'}${video}`;
    // return `C:/Users/bruno.carvalho/MidasCorp/WebServices-server${'/'}videos${'/'}${video}`
  });

  res.json(videosMap);
});


app.get('/activitie-balance', async (req: Request, res: Response): Promise<void> => {
  try {
    const isBalanceOnline = await checkBalanceStatus();

    if (isBalanceOnline) {
      console.log('Balança online');
      sendBalanceData = true; // Habilita o envio de dados
      res.status(200).json({ message: 'Balança online.' });
    } else {
      console.log('Balança offline');
      sendBalanceData = false; // Desabilita o envio de dados
      res.status(504).json({ message: 'Balança offline.' });
    }
  } catch (error: unknown) {
    console.error('Erro ao verificar status da balança:', error);
    res.status(500).json({ message: 'Erro ao verificar status da balança.' });
  }
});
// Função para enviar o ping e esperar resposta
async function checkBalanceStatus(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // Publicar mensagem MQTT para solicitar o status
    mqttClient.publish('balance/status', 'ping', (err) => {
      if (err) {
        console.log('Erro ao publicar mensagem MQTT:', err);
        return reject(false);
      }

      console.log('Mensagem "ping" enviada para o tópico balance/status.');
    });

    // Espera a resposta até o timeout
    console.log('ponto do time')
    const timeout = 3000; // Tempo limite em milissegundos
    const timer = setTimeout(() => {
      if (!balanceOnline) {
        console.log('Timeout: Balança offline');
        resolve(false);
      }
    }, timeout);

    // Verifica se a balança responde
    mqttClient.on('message', (topic, message) => {
      if (topic === 'balance/status/response') {
        const payload = message.toString();
        console.log(`Resposta da balança: ${payload}`);

        if (payload === 'pong') {
          balanceOnline = true;
          clearTimeout(timer); // Limpa o timeout assim que a resposta for recebida
          console.log('Balança online');
          resolve(true); // Retorna true para indicar que a balança está online
        }
      }
    });
  });
}

mqttClient.on('connect', () => {
  console.log('Conectado ao broker MQTT');
  mqttClient.subscribe('balance/status/response', (err) => {
    if (err) {
      console.log('Erro ao se inscrever no tópico: ', err);
    }
  });
});

app.get('/activitie-database', async (req: Request, res: Response): Promise<void> => {
  try {
    const nickname: string = 'upl1';

    // Timeout promise para rejeitar após 5 segundos
    const timeoutPromise: Promise<never> = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Tempo limite excedido')), 5000)
    );

    // Requisição com axios
    const axiosRequest: Promise<AxiosResponse> = axios.post(
      'https://node.pigtek.com.br/sessions-farms',
      { nickname },
      { headers: { 'Content-Type': 'application/json' } }
    );

    // Promise.race para competir entre timeout e requisição
    const response = await Promise.race([axiosRequest, timeoutPromise]);

    // Verifica se a resposta é bem-sucedida
    res.status(200).json({ success: 'sucesso' });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Tratamento específico para erros do Axios
      console.error('Erro na requisição Axios:', error.message);
      res.status(500).json({ error: `Erro Axios: ${error.message}` });
    } else if (error instanceof Error) {
      // Tratamento genérico para erros
      console.error('Erro geral:', error.message);
      res.status(500).json({ error: `Erro: ${error.message}` });
    } else {
      console.error('Erro desconhecido:', error);
      res.status(500).json({ error: 'Erro desconhecido' });
    }
  }
});


app.get('/activitie', async (req, res) => {

  res.json({ susses: 'sucesso' });
});

// app.get('/scale/:balance', (req, res) => {
//   const { balance } = req.params;

//   if (balance === 'online') {
//     const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

//     port.open((err: any) => {
//       console.log('ERROR', err)
//       // if (err) {
//       //   console.error('Erro ao abrir a porta serial:', err.message);
//       //   res.status(500).json({ error: 'Erro ao abrir a porta serial' });
//       //   return;
//       // }

//       parser.on('data', handleSendData);

//       function handleSendData(scale: string) {
//         res.status(200).json({
//           scale: scale,
//         });
//         parser.pause();
//         port.close((err: { message: any; }) => {
//           if (err) {
//             console.error('Erro ao fechar a porta serial:', err.message);
//           } else {
//             console.log('Porta serial fechada com sucesso.');
//           }
//         });
//       }
//     });

//     port.on('error', (err: { message: any; }) => {
//       console.error('Erro na porta serial:', err.message);
//       res.status(500).json({ error: 'Erro na porta serial' });
//     });
//   } else {
//     return res.status(200).json({
//       scale: 0,
//     });
//   }

//   // res.status(200).json({
//   // scale: 10,
//   // });
// });

// WebSocket
wss.on('connection', (ws, req) => {
  console.log('Cliente conectado!');

  ws.on('message', (message: any) => {
    const msgString = Buffer.from(message).toString();
    console.log('Mensagem recebida do cliente:', msgString);

    // Broadcast da mensagem para todos os clientes conectados
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msgString); // Envia a mensagem para todos os clientes conectados
      }
    });
  });

  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

// Rota de autenticação básica
app.post('/authentication', (req, res) => {
  console.log('Rota POST de autenticação chamada');
  const { username, password } = req.body;

  // Lógica de autenticação básica
  if (username === 'usuario' && password === 'senha') {
    res.status(200).json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

app.post('/terminateProgram', (req, res) => {
  console.log('Encerrando o programa C++');
  terminateCppProgram(); // Função que encerra o programa C++
  res.status(200).json({ message: 'Programa C++ encerrado' });
});

const terminateCppProgram = () => {
  // var proc = require('child_process').spawn('mongod');
  cppProcess.kill('SIGINT');

  wss.clients.forEach(function each(client) {
    client.send('program_finalized');
  });
};

app.delete('/videos/:videoName', (req, res) => {
  const videoName = req.params.videoName; // Obtém o nome do vídeo dos parâmetros da URL
  // const videoPath = path.join('/videos', videoName); // Caminho completo para o vídeo
  const videoPath = path.resolve(__dirname, '..', '..', '..', '..', 'videos');

  fs.unlink(videoPath, async err => {
    const filename = path.resolve(videoPath, videoName);
    console.log('filename', filename);

    try {
      await fs.promises.stat(filename);
    } catch {
      return res.json({ message: 'Video not deleted.' });
    }

    await fs.promises.unlink(filename);

    return res.json({ message: 'Video deleted.' });
    // if (err) {
    //   console.error('Erro ao excluir o vídeo:', err);
    //   res.status(500).json({ error: 'Erro ao excluir o vídeo' });
    // } else {
    //   console.log('Vídeo excluído com sucesso:', videoName);
    //   res.status(200).json({ message: 'Vídeo excluído com sucesso' });
    // }
  });
});

// Rota para baixar um vídeo específico pelo seu nome
app.get('/videos/:videoName', (req, res) => {
  console.log('CHAMOU ATUALIZAR WIFI')
  // const { videoName } = req.query
  const videoName = req.params.videoName;
  const videoPath = path.resolve(__dirname, '..', '..', '..', '..', 'videos');

  console.log('VIDEO', videoName);
  const video = path.join(videoPath, videoName); // Caminho completo para o vídeo

  res.download(video, err => {
    if (err) {
      console.error('Erro ao baixar o vídeo:', err);
      res.status(500).json({ error: 'Erro ao baixar o vídeo' });
    } else {
      console.log('Vídeo enviado com sucesso:', videoName);
    }
  });
});

app.post('/configure-wifi', (req, res) => {
  const { ssid, password } = req.body;

  if (!ssid || !password) {
    return res.status(400).json({ error: 'SSID e senha são necessários' });
  }

  try {
    configureWiFi(ssid, password);

    // Aguarda alguns segundos para garantir que o NetworkManager aplique as mudanças
    setTimeout(async () => {
      const status = await checkConnectionStatus(ssid);
      if (status.connected) {
        res.json({ message: 'Conectado com sucesso', ip: status.ip });
      } else {
        res.status(500).json({ error: status.error || 'Erro desconhecido ao conectar' });
      }
    }, 5000); // Aguardar 5 segundos antes de verificar
  } catch (error: any) {
    res.status(500).json({ error: 'Erro ao configurar Wi-Fi', details: error.message });
  }
});

function configureWiFi(ssid: any, password: any) {
  console.log({ ssid, password });

  try {
    const uuid = execSync('uuidgen').toString().trim();
    const filePath = `/etc/NetworkManager/system-connections/${ssid}.nmconnection`;

    if (fs.existsSync(filePath)) {
      execSync(`sudo rm ${filePath}`);
    }

    const config = `
[connection]
id=${ssid}
uuid=${uuid}
type=wifi

[wifi]
mode=infrastructure
ssid=${ssid}
interface-name=wlan1

[wifi-security]
key-mgmt=wpa-psk
psk=${password}

[ipv4]
method=auto

[ipv6]
method=ignore
    `;

    execSync(`echo "${config}" | sudo tee ${filePath} > /dev/null`);
    execSync(`sudo chmod 600 ${filePath}`);
    execSync(`sudo nmcli connection reload`);
    execSync(`sudo nmcli connection up id ${ssid}`);
  } catch (error) {
    console.error("Erro ao configurar Wi-Fi:", error);
    throw new Error("Falha ao configurar a rede Wi-Fi.");
  }
}

function checkConnectionStatus(ssid: any) {
  try {
    // Executa o comando nmcli para verificar o estado da conexão específica
    const result = execSync(`nmcli -f GENERAL.STATE c show "${ssid}"`).toString().trim();
    console.log('RESULTADO DA VERIFICAÇÃO:', result)

    // Verifica se o estado é "activated"
    if (result.includes("activated")) {
      // Obtém o IP associado à conexão ativa
      const ipResult = execSync(`nmcli -t -f IP4.ADDRESS c show "${ssid}"`).toString().trim();
      const ip = ipResult.split('/')[0]; // Extrai apenas o IP antes do "/"
      return { connected: true, ip };
    } else {
      return { connected: false, error: 'A conexão não está ativa.' };
    }
  } catch (error) {
    console.error("Erro ao verificar o status da conexão:", error);
    return { connected: false, error: 'Erro ao verificar o status da conexão' };
  }
}

app.get('/wifi-status', async (req, res) => {
  try {
    const result = execSync(`nmcli -t -f GENERAL.STATE,GENERAL.CONNECTION dev show wlan1`).toString().trim();

    // Separar por linhas e processar cada linha
    const lines = result.split('\n');
    let state = '';
    let connection = '';

    // Iterar sobre as linhas e extrair os valores
    lines.forEach(line => {
      if (line.startsWith('GENERAL.STATE')) {
        state = line.split(':')[1].trim();
      } else if (line.startsWith('GENERAL.CONNECTION')) {
        connection = line.split(':')[1].trim();
      }
    });

    // Checar se o estado indica conexão ativa e retornar o nome da rede
    if (state === '100 (connected)' && connection) {
      res.json({
        connected: true,
        network: connection,  // Nome da rede conectada
      });
    } else {
      res.json({
        connected: false,
        message: 'Sem conexão ativa no wlan1',
      });
    }
  } catch (error) {
    console.error("Erro ao verificar status da conexão:", error);
    res.status(500).json({
      connected: false,
      error: 'Erro ao verificar status da conexão',
    });
  }
});


app.post('/disconnect-wifi', (req, res) => {
  try {
    const result = execSync(`sudo nmcli device disconnect wlan1`).toString().trim();
    res.json({
      disconnected: true,
      message: 'Desconectado da rede atual com sucesso',
    });
  } catch (error) {
    console.error("Erro ao desconectar da rede Wi-Fi:", error);
    res.status(500).json({
      disconnected: false,
      error: 'Erro ao desconectar da rede Wi-Fi',
    });
  }
});



export { serverHttp, io };
