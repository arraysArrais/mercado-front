const baseUrl = import.meta.env.VITE_API_URL;

const request = async (method: string, endpoint: string, params: any, token: string | null = null) => {
    method = method.toLowerCase();
    let fullUrl = baseUrl + endpoint;
    let body = null;

    if (method === 'get') {
        let queryString = new URLSearchParams(params).toString();
        fullUrl += '?' + queryString;
    }
    else {
        body = JSON.stringify(params);
    }

    method = method.toUpperCase();
    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    } as any;

    if (token) {
        headers['Authorization'] = 'Bearer ' + token
    }

    let req = await fetch(fullUrl, { method, headers, body });
    return await req.json();
}

export default () => {
    return {
        getItemByCodigo: async (codigo: string) => {
            codigo = codigo.replace("'", ""); 
            return request('get', `/item`, {codigo}, localStorage.getItem('token'))
        },
        sendTransaction: async (sale: any) => {
            console.log("sale: ", sale)
            return request('post', `/transaction`, sale, localStorage.getItem('token'))
        },
        listTransaction: async () =>{
            return request('get', `/transaction`, {}, localStorage.getItem('token'))
        }
    }
}