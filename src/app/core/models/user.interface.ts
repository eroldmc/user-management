/**
 * User Interface
 * @export
 * @interface User
 * @param {number} id
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
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    avatar: string;
}