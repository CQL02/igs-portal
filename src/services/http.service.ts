export class HttpService {
    static async post(url: string, data: any, queryParams?: Record<string, any>) {
        try {
            if (queryParams) {
                const queryString = new URLSearchParams(queryParams).toString();
                url += `?${queryString}`;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`${errorMessage.message}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error in POST request:', error);
            throw error;
        }
    }

    static async get(url: string, queryParams?: Record<string, any>) {
        try {
            if (queryParams) {
                const queryString = Object.entries(queryParams)
                    .map(([key, value]) => {
                        if (Array.isArray(value)) {
                            return value.map((item) => `${encodeURIComponent(key)}=${encodeURIComponent(item)}`).join('&');
                        }
                        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
                    })
                    .join('&');
                url += `?${queryString}`;
            }

            const response = await fetch(url,  {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                let errorMessage;
                try {
                    errorMessage = await response.json();
                } catch {
                    errorMessage = { message: `HTTP error! Status: ${response.status}` };
                }
                throw new Error(errorMessage.message || `HTTP error! Status: ${response.status}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error in GET request:', error);
            throw error;
        }
    }

    static async put(url: string, data: any, queryParams?: Record<string, any>) {
        try {
            if (queryParams) {
                const queryString = new URLSearchParams(queryParams).toString();
                url += `?${queryString}`;
            }

            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`${errorMessage.message}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error in PUT request:', error);
            throw error;
        }
    }

    static async delete(url: string, queryParams?: Record<string, any>) {
        try {
            if (queryParams) {
                const queryString = new URLSearchParams(queryParams).toString();
                url += `?${queryString}`;
            }
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`${errorMessage.message}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error in DELETE request:', error);
            throw error;
        }
    }

    static async patch(url: string, data: any, queryParams?: Record<string, string>) {
        try {
            if (queryParams) {
                const queryString = new URLSearchParams(queryParams).toString();
                url += `?${queryString}`;
            }

            const response = await fetch(url, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(`${errorMessage.message}`);
            }
            return response.json();
        } catch (error) {
            console.error('Error in PATCH request:', error);
            throw error;
        }
    }
}