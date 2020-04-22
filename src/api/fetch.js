import axios from 'axios'

export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error.data)
        })
    })
}
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios.defaults.withCredentials = true
        axios.post(url, params).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error.data)
        })
    })
}
export function postByJSON(url, params) {
    // let paramStr = '?'
    // Object.keys(params).map((item) => {
    //     paramStr += item + '=' + params[item] + '&'
    // })
    return new Promise((resolve, reject) => {
        axios.post(url + params).then(res => {
            resolve(res.data);
        }).catch(error => {
            reject(error.data)
        })
    })
}