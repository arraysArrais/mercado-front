const baseUrl = import.meta.env.VITE_API_URL;

const request = async(method: string, endpoint: string, params: any, token: string | null = null) =>{
    method = method.toLowerCase();
    let fullUrl = baseUrl+endpoint;
    let body = null;

    if(method === 'get'){
        let queryString = new URLSearchParams(params).toString();
        fullUrl += '?'+queryString;
    }
    else{
        body = JSON.stringify(params);
    }

    let headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    } as any;

    if(token){
        headers['Authorization'] = 'Bearer '+token
    }

    let req = await fetch(fullUrl, {method, headers, body});
    return await req.json();
}

export default() => {
    return{
        getToken: () =>{
            return localStorage.getItem('token');
        },
        validateToken: async () =>{
            let result = await request('post', '/api/auth/verify', {}, localStorage.getItem('token'))
            return (result.message === 'Autorizado') ? true : false;
        },
        login: async (email: string, password: string) => {
            let req = await request('post', '/api/auth/login', {email, password});
            if(req.access_token){
                localStorage.setItem('token', req.access_token)
            }
            return req
        }
    };
}