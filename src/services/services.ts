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
            return request('get', `/item`, { codigo }, localStorage.getItem('token'))
        },
        getItemByid: async (id: any) => {
            return request('get', `/item/${id}`, {}, localStorage.getItem('token'))
        },
        sendTransaction: async (payload: any) => {
            return request('post', `/transaction`, payload, localStorage.getItem('token'))
        },
        listTransaction: async () => {
            return request('get', `/transaction`, {}, localStorage.getItem('token'))
        },
        createCategory: async (payload: any) => {
            return request('post', `/category`, payload, localStorage.getItem('token'))
        },
        getCategories: async () => {
            return request('get', `/category`, {}, localStorage.getItem('token'))
        },
        getCategory: async (id: number) => {
            return request('get', `/category/${id}`, {}, localStorage.getItem('token'))
        },
        deleteCategory: async (id: number) => {
            return request('DELETE', `/category/${id}`, {}, localStorage.getItem('token'))
        },
        updateCategory: async (payload: any, id: number) => {
            return request('PATCH', `/category/${id}`, payload, localStorage.getItem('token'))
        },
        createProduct: async (payload: any) => {
            return request('POST', `/item`, payload, localStorage.getItem('token'))
        },
        getProducts: async () => {
            return request('get', `/item`, {scope:'completeScope'}, localStorage.getItem('token'))
        },
        deleteProduct: async(id: any) => {
            return request('DELETE', `/item/${id}`, {}, localStorage.getItem('token'))
        },
        updateProduct: async (payload: any, id: number) => {
            return request('PATCH', `/item/${id}`, payload, localStorage.getItem('token'))
        },
    }
}