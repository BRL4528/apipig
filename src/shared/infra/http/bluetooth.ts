import { SerialPort } from 'serialport';

export class BluetoothManager {
  private port: SerialPort | null = null;

  constructor(private address: string) { }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.port = new SerialPort({
        path: this.address,
        baudRate: 9600, // Ajuste a taxa de transmissão conforme o protocolo da balança
        autoOpen: false,
      });

      this.port.open((err) => {
        if (err) {
          return reject(`Erro ao conectar: ${err.message}`);
        }

        console.log(`Conectado à balança Bluetooth no endereço ${this.address}`);
        resolve();
      });
    });
  }

  async getWeight(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.port) {
        return reject('Não conectado à balança');
      }

      // Enviar comando para a balança
      this.port.write('GET_WEIGHT\n', (err) => {
        if (err) {
          return reject(`Erro ao enviar comando: ${err.message}`);
        }
        if (this.port) {
          this.port.once('data', (data: Buffer) => {
            resolve(data.toString());
          });
        }
      });
    });
  }

  disconnect(): void {
    if (this.port && this.port.isOpen) {
      this.port.close((err) => {
        if (err) {
          console.error(`Erro ao encerrar a conexão: ${err.message}`);
        } else {
          console.log('Conexão Bluetooth encerrada');
        }
      });
    }
  }
}
