// Description: Generate user data in JSON format.
import fs from 'fs';
import { faker } from '@faker-js/faker';

const users = Array.from({ length: 1000 }, () => ({
    id: crypto.randomUUID(),
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.number({ style: 'international' }),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    country: faker.location.country(),
    avatar: faker.image.personPortrait(),
}));

fs.writeFileSync('data/user.json', JSON.stringify({users}, null, 2));