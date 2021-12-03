import { hashSync } from 'bcrypt';
import { address, datatype, date, internet, name, phone } from 'faker';
import { fakerBr } from 'js-brasil';

import { MobileOperator, Prisma, PrismaClient, Timezone } from '@prisma/client';

const prisma = new PrismaClient();

let countSuntech = 3;

const randTypes = () => {
  const randKeyTime = Math.floor(Math.random() * Object.keys(Timezone).length);
  const randTimezone: Timezone = Timezone[Object.keys(Timezone)[randKeyTime]];

  const randKeyMobile = Math.floor(
    Math.random() * Object.keys(MobileOperator).length,
  );
  const randMobile: MobileOperator =
    MobileOperator[Object.keys(MobileOperator)[randKeyMobile]];

  return {
    randTimezone,
    randMobile,
  };
};

const choose = datatype.boolean();

const adapterData: Prisma.DeviceCreateInput[] = [
  {
    code: 1,
    description: choose ? 'ST310' : 'GT06',
    model: choose ? 'SUNTECH' : 'GT06',
    equipmentNumber: '511009943',
    phone: '85987884378',
    mobileOperator: randTypes().randMobile,
    chipNumber: '85987884378',
    timezone: randTypes().randTimezone,
    id: datatype.uuid(),
  },
  {
    code: 2,
    description: 'GT06',
    model: 'GT06',
    equipmentNumber: '866968030810130',
    phone: '85987884378',
    mobileOperator: randTypes().randMobile,
    chipNumber: '85987884379',
    timezone: randTypes().randTimezone,
    id: datatype.uuid(),
  },
];

for (let i = 0; i < 100; i++) {
  const choose = datatype.boolean();
  adapterData.push({
    code: countSuntech++,
    description: choose ? 'ST310' : 'GT06',
    model: choose ? 'SUNTECH' : 'GT06',
    equipmentNumber: `${datatype.number(999999999999999)}`,
    phone: phone.phoneNumber('859########'),
    mobileOperator: randTypes().randMobile,
    chipNumber: phone.phoneNumber('859########'),
    timezone: randTypes().randTimezone,
    id: datatype.uuid(),
  });
}

const locationPackages: Prisma.LocationCreateInput[] = [];

for (let i = 0; i < 2000; i++) {
  const random = Math.floor(Math.random() * 102);
  locationPackages.push({
    cellId: `${datatype.number(9999999999)}`,
    course: `${datatype.number(9999999999)}`,
    latitude: parseFloat(address.latitude(1, -50)),
    longitude: parseFloat(address.longitude(-40, -70)),
    fixTime: date.recent(),
    satellite: datatype.number(999),
    speed: datatype.number(250),
    serverTime: date.recent(),
    lac: datatype.number(999),
    mcc: datatype.number(999),
    mnc: datatype.number(999),
    device: {
      connect: {
        id: adapterData[random].id,
      },
    },
  });
}

const statusPackage: Prisma.StatusCreateInput[] = [];

for (let i = 0; i < 2000; i++) {
  const random = Math.floor(Math.random() * 102);
  const ioNumber = Math.floor(Math.random() * 63)
    .toString(2)
    .padStart(6, '0');
  statusPackage.push({
    battery: datatype.number(100),
    blocked: datatype.boolean(),
    ignition: datatype.boolean(),
    valid: datatype.boolean(),
    charge: datatype.boolean(),
    rssi: datatype.number(10),
    device: {
      connect: {
        id: adapterData[random].id,
      },
    },
    info: {
      create: {
        archive: datatype.boolean(),
        hourMeter: datatype.number(99999),
        io: ioNumber,
        mode: datatype.boolean() ? 1 : 2,
        odometer: datatype.number(999999),
        power: datatype.number(30),
        serial: datatype.number(99999),
      },
    },
  });
}

const pass = Array(7)
  .fill(0)
  .map((element, index) => index + 1)
  .join('');

const salt = Number(process.env.SALT_NUMBER);

console.log(process.env.SALT_NUMBER);

const users: Prisma.UserCreateInput[] = [
  {
    name: 'David França',
    password: hashSync(pass, salt),
    username: 'david.franca',
    role: 'ADMIN',
  },
  {
    name: `${name.firstName()} ${name.lastName()}`,
    password: internet.password(10, true),
    username: internet.userName(),
    role: 'USER',
  },
];

const customers: Prisma.CustomerCreateInput[] = [];

for (let i = 0; i < 500; i++) {
  customers.push({
    id: datatype.uuid(),
    cellPhone: fakerBr.telefone().replace(/[^0-9]/g, ''),
    cep: fakerBr.cep(),
    city: fakerBr.pessoa().endereco.cidade,
    cpfOrCnpj: fakerBr.pessoa().cpf,
    district: fakerBr.pessoa().endereco.bairro,
    fullName: fakerBr.pessoa().nome,
    number: String(fakerBr.pessoa().endereco.numero),
    state: fakerBr.pessoa().endereco.estadoSigla,
    street: `Rua ${fakerBr.pessoa().endereco.logradouro}`,
    complement: fakerBr.pessoa().endereco.complemento,
    typeOfAddress: 'Outros',
  });
}

const branches: Prisma.BranchCreateInput[] = [];

for (let i = 0; i < 5; i++) {
  const random = Math.floor(Math.random() * 200);
  branches.push({
    customer: { connect: { id: customers[random].id } },
    name: fakerBr.empresa().nome,
    id: datatype.uuid(),
  });
}

const vehicles: Prisma.VehicleCreateInput[] = [];

for (let i = 0; i < 1500; i++) {
  const randomBranches = Math.floor(Math.random() * 5);
  const randomCustomer = Math.floor(Math.random() * 500);
  const randomDevice = Math.floor(Math.random() * 100);
  vehicles.push({
    branch: { connect: { id: branches[randomBranches].id } },
    customer: { connect: { id: customers[randomCustomer].id } },
    licensePlate: fakerBr.veiculo().placa,
    chassi: fakerBr.veiculo().chassi.replace(/[^0-9]/g, ''),
    brand: fakerBr.veiculo().marca,
    model: fakerBr.veiculo().modelo.substr(0, 29),
    renavam: fakerBr.renavam().replace(/[^0-9]/g, ''),
    color: fakerBr.veiculo().cor,
    year: 2021,
    type: 'Carro',
    device: { connect: { id: adapterData[randomDevice].id } },
  });
}

export async function main() {
  // Prisma create query to seed models in database
  console.log(`Start seeding ...`);

  for (const a of adapterData) {
    const adapter = await prisma.device.create({
      data: a,
    });
    console.log(`Created device with id: ${adapter.id}`);
  }

  for (const b of locationPackages) {
    const location = await prisma.location.create({
      data: b,
    });
    console.log(`Created location with id: ${location.id}`);
  }

  for (const c of users) {
    const user = await prisma.user.create({
      data: c,
    });
    console.log(`Created user with id: ${user.id}`);
  }

  for (const d of statusPackage) {
    const status = await prisma.status.create({
      data: d,
    });
    console.log(`Created status with id: ${status.id}`);
  }

  for (const e of customers) {
    const customer = await prisma.customer.create({
      data: e,
    });
    console.log(`Created customer with id: ${customer.id}`);
  }

  for (const f of branches) {
    const branch = await prisma.branch.create({
      data: f,
    });
    console.log(`Created branch with id: ${branch.id}`);
  }

  for (const g of vehicles) {
    const vehicle = await prisma.vehicle.create({
      data: g,
    });
    console.log(`Created vehicle with id: ${vehicle.id}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
