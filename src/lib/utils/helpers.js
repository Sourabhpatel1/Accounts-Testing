export const post = async (url, body) => {
    try {

        const res = await fetch(url, {
            method : "POST",
            body : JSON.stringify(body),
            headers : {
                'Content-Type' : 'application/json',
                'Access-Control-Allow-Origins' : 'https://svelte-kit-production-2c2e.up.railway.app',
            }
        })
        if (res.ok) {
            return  {
                'status' : true,
                'response' :  await res.json()
            }
        } else {
            return {
                'status' : false,
                'response' :  await res.json()
            }
        }
    } catch (err) {
        console.log(err)
        return {
            'status' : false,
            'response' :  { detail : "Unknown Error"}
        }
    }
};
export const emptyObj = (obj) => {
    Object.keys(obj).forEach(k=>{
        if (typeof obj[k]==='object') {
            return emptyObj(obj[k]);
        }
        obj[k] = '';
    });
    return obj
};
export const keepNumeric = (e)=>{
    let numbers = ['0','1','2','3','4','5','6','7','8','9', 'Backspace', '.', 'Tab', 'ArrowLeft', 'ArrowRight']
    if (!numbers.includes(e.key)) {
        e.preventDefault()
    }
    if (e.target.value.includes('.') && e.key === '.') {
        e.preventDefault()
    }
};
export const checkEmpty = (obj, exclude_key) => {
    let errObj = {}
    for (let key in obj) {
        if (exclude_key !== key) {
            if ((!obj[key] || obj[key] === "") && obj[key] !== 0) {
              errObj[key] = true;
            }
        }
    }
    return errObj
};
export const validateEmail = (email) => {
    let re = /\S+@\S+\.\S+/;
    if (!re.test(email)) {
        return false;
    }
    return true;
};
export const validatePhone = (phone) => {
    if (isNaN(phone) || phone.length < 10) {
        return false;
    }
    return true;
};
export const validatePin = (pin) => {
    if (isNaN(pin) || pin.length < 5) {
        return false;
    }
    return true;
};
export const validateGst = (gst) => {
    let re = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);
    if (gst === 'N/A') {
        return true;
    }
    if (!re.test(gst)) {
        return false;
    }
    return true;
};