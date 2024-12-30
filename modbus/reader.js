'use strict';

const Modbus = require('jsmodbus');
const net = require('net');
const DEFAULT_REGISTERS = require('./register.json');

const UNIT_ID = 85;
const PORT = 502;

function dec2bin(dec) {
  return (dec >>> 0).toString(2);
}

class ModbusReader {

  port = null;
  host = null;

  socket = null;
  client = null;

  constructor(host, port = PORT) {
    this.host = host;
    this.port = port || PORT;
  }

  async readOnce(registers = DEFAULT_REGISTERS) {
    return new Promise((resolve, reject) => {
      const socket = new net.Socket();
      const client = new Modbus.client.TCP(socket, UNIT_ID);

      socket.on('error', reject);

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      socket.on('connect', async () => {
        const result = {};

        try {
          for (const reg of registers) {
            // eslint-disable-next-line radix
            const res = await client.readHoldingRegisters(parseInt(reg.register), reg.len);
            let val = null;

            switch (reg.type) {
              case 'string':
                val = res.response.body.valuesAsBuffer.toString().replace(/\0/ig, '');
                break;

              case 'uint16be':
                val = res.response.body.valuesAsBuffer.readUint16BE();
                break;

              case 'int16be':
                val = res.response.body.valuesAsBuffer.readInt16BE();
                break;

              case 'uint32be':
                val = res.response.body.valuesAsBuffer.readUint32BE();
                break;

              case 'int32be':
                val = res.response.body.valuesAsBuffer.readInt32BE();
                break;

              default:
                reject(new Error('Unkonw type ' || reg.type));
            }

            result[reg.register] = {
              name: reg.name_en,
              unit: reg.unit,
            };

            if (reg.type === 'string') {
              result[reg.register].value = val;
            }

            if (reg.frontend_type === 'bits') {
              const bitstr = dec2bin(val).padStart(reg.len * 16, '0');

              result[reg.register].value = bitstr;
              result[reg.register].value_string = reg.bits.map((e, i) => {
                return bitstr[bitstr.length - i - 1] === '1' ? e : null;
              }).filter((e) => e).join(',');
            } else if (reg.frontend_type === 'enum') {
              const enumVal = reg.enum.find((e) => e.value === val);
              result[reg.register].value = val;
              result[reg.register].value_name = enumVal ? enumVal.name_en : val.toString();
            } else {
              result[reg.register].value = val * (reg.factor ?? 1);
            }
          }

          resolve(result);
        } finally {
          socket.destroy();
        }
      });

      const options = {
        host: this.host,
        port: this.port,
      };

      socket.connect(options);
    });
  }

}

module.exports = ModbusReader;
