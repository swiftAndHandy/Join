
async function postData(path = "", data = {}) {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJason = await response.json();
}

async function deleteData(path = "") {
    let response = await fetch(BASE_URL + path + '.json', {
        method: "DELETE",

    });
    return responseToJason = await response.json();
}

async function putData(path = "", data = {}) {
    const encodedPath = encodeURIComponent(path);
    let response = await fetch(BASE_URL + encodedPath + '.json', {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    });
    return responseToJason = await response.json();
}