const bcryptjs = require('bcryptjs')

const saltRounds = 10;

export const hashPasswordHelper = async (plainPassword: string) => {
    try {
        return await bcryptjs.hash(plainPassword, saltRounds);
        // return plainPassword;
    }catch (error) {
        console.log(error);
    }
}

export const comparePasswordHelper = async (plainPassword: string, hashPassword: string) => {
    try {
        return await bcryptjs.compare(plainPassword, hashPassword);
        // const hashPassword = bcryptjs.hash(plainPassword, saltRounds);
        // return plainPassword === hashPassword;
    }catch (error) {
        console.log(error);
    }
}