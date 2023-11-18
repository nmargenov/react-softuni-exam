const requester = async (method, url, data) =>{
    const options = {}
    if(method!=="GET"){
        options.method=method;
        options.headers={
            'Content-Type':'application/json'
        }
        if(data){
            options.body=JSON.stringify(data);
        }
    }
    const token = localStorage.getItem('authToken');
    if(token){
        options.headers={
            ...options.headers,
            'x-authorization':token
        }
    }
    
    const request = await fetch(url,options);
    if(!request.ok){
        throw new Error('Error');
    }
    const response = await request.json();
    return response;
}

export const get = requester.bind(null,"GET");
export const post = requester.bind(null,"POST");
export const del = requester.bind(null,"DELETE");
export const put = requester.bind(null,"PUT");
export const patch = requester.bind(null,"PATCH");