

module.exports.generatePass = () => {
    const randomness = 6;
    const baseLength = 14;
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@%&_?";

    let password = "";
    const length = baseLength + Math.floor(Math.random() * randomness);

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    return password;
};

module.exports.generateUserid = ()  =>{
    const now = new Date();
   
    const userid = [now.getFullYear().toString().slice(2),now.getMonth(),now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds(),Math.floor(100*Math.random())].join("");
    

    return userid;
}

module.exports.generateLinkID = () => {
    const randomness = 6;
    const baseLength = 5;
    const milli = new Date().getTime()
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let random = "";
    const length = baseLength + Math.floor(Math.random() * randomness);

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        random += charset[randomIndex];
    }

    return [random, milli];
}


