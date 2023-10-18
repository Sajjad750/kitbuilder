const crypto = require('crypto');

const algorithm = 'aes-256-cbc';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwuqmzy'; // must be 32 characters

const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // initialization vector
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

module.exports = {
    encrypt,
    decrypt
};
