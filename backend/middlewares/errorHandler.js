module.exports.errorHandler = (error) => {
    
    console.log(error.message,error.code);
    console.log(error.errors);
    console.log(error.kind);


    let message = "Some error occured";
    // errors = {title: "", body:""};

    // Checking duplicate key
    if (error.code == 11000){
        // if (error.keyPattern.title == 1){
        //     errors["title"] = "This blog title already exists";
        // } 
        for (let key in error.keyPattern) {
            message = "The " +key + " already exists"
        }
    }
    // if (error.message.includes("blog validation failed")) {
    //     Object.values(error.errors).forEach(({ properties }) => {
    //         errors[properties.path] = properties.message;
    //     });
    // }


    // Checking correct value for enum
    if (error.message.includes("validation failed")){
        Object.values(error.errors).forEach(({properties}) => {
            if (properties.type == "enum"){
                message = "The value for " + properties.path + " is incorrect";
            } else if (properties.type == "user defined") {
                message = properties.message;
            } else if (properties.type == "required"){
                message = "Field " + properties.path + " is required";
            }
        })
    }

    if (error.message.includes("Cast to ")){
       
            message = "Invalid " + error.kind + " for "+error.path;
       
    }


    
    // if (error.message.includes("comment validation failed")) {
    //     Object.values(error.errors).forEach(({ properties }) => {
    //         errors[properties.path] = properties.message;
    //     });
    // }
    // return errors;
    console.log(message);
    return message


}

