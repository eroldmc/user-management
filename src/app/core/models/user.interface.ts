/**
 * User Interface
 * @export
 * @interface User
 * @param {number} id
 * @param {number} uuid
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} email
 * @param {string} phone
 * @param {string} address
 * @param {string} city
 * @param {string} country
 * @param {string} avatar
*/

export interface User {
    id: string;
    uuid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    avatar: string;
}

export class User {
    id: string;
    uuid: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    avatar: string;
    fullname: string;

    constructor(data: Partial<User>) {
        this.id = data.id ?? '';
        this.uuid = data.uuid ?? '';
        this.firstname = data.firstname ?? '';
        this.lastname = data.lastname ?? '';
        this.email = data.email ?? '';
        this.phone = data.phone ?? '';
        this.address = data.address ?? '';
        this.city = data.city ?? '';
        this.country = data.country ?? '';
        this.avatar = data.avatar ?? '';
        this.fullname = `${this.lastname} ${this.firstname}`;
    }
}
