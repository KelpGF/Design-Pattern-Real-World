interface PostHttpRequest {
	Run(url: string, data: any): Promise<any>;
}

class DefaultService {
	constructor(private postHttpRequest: PostHttpRequest) {}

	async Execute(input) {
		return this.postHttpRequest.Run('https://jsonplaceholder.typicode.com/posts', input);
	}
}

class DefaultPostHttpRequestAdapter implements PostHttpRequest {
	async Run(url: string, data: any): Promise<any> {
		return fetch(url, {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		}).then((response) => response.json());
	}
}

// Retry behavior don't belong to the use case
class WrongService {
	constructor(private postHttpRequest: PostHttpRequest) {}

	async Execute(input) {
		let count = 0;

		for (let i = 0; i < 3; i++) {
			try {
				this.postHttpRequest.Run('https://jsonplaceholder.typicode.com/posts', input);
			} catch (error) {
				count++;

				if (count === 3) {
					throw error;
				}
			}
		}
	}
}

// Any post request will be retried 3 times. It's unnecessary to have this behavior in each post request
class WrongHttpRequestAdapter implements PostHttpRequest {
	async Run(url: string, data: any): Promise<any> {
		let count = 0;

		for (let i = 0; i < 3; i++) {
			try {
				const result = fetch(url, {
					method: 'POST',
					body: JSON.stringify(data),
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
				}).then((response) => response.json());

				return result;
			} catch (error) {
				count++;

				if (count === 3) {
					throw error;
				}
			}
		}
	}
}
