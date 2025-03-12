// Description: Generate user data in JSON format.
import fs from 'fs';
import { faker } from '@faker-js/faker';

const USERS_FILE = 'data/users.json';
const DEFAULT_COUNT = 1000;

const userCount = process.argv[2] ? parseInt(process.argv[2], 10) : DEFAULT_COUNT;


const generateUsers = (count) => {
    const users = Array.from({ length: count }, (_, index) => ({
        id: index,
        uuid: crypto.randomUUID(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        email: faker.internet.email(),
        phone: faker.phone.number({ style: 'international' }),
        address: faker.location.streetAddress(),
        city: faker.location.city(),
        country: faker.location.country(),
        avatar: faker.image.personPortrait(),
    }));
    return { users };
}

const users = generateUsers(userCount);
if(!fs.existsSync('data')) {
    fs.mkdirSync('data');
}
fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
console.log(`✅ ${userCount} utilisateurs générés et sauvegardés dans ${USERS_FILE}`);