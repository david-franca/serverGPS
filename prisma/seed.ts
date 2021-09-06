import { hashSync } from 'bcrypt';
import { address, datatype, date, internet, name, phone } from 'faker';

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
