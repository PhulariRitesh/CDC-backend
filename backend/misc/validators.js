const phoneValidator = (phone) => {
    return /^[6-9]\d{9}$/.test(phone);
}
const phoneAltValidator = (phone) => {
    if (!phone){
        return true;
    }
    return /^[6-9]\d{9}$/.test(phone);
}

const isEmailAlt = (email)=> {
    if (!email){
        return true;
    }
    return isEmail(email);
}

module.exports = {phoneValidator, isEmailAlt, phoneAltValidator};