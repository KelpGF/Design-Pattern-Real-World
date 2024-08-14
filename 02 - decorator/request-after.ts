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


function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

type RetryOptions = {
	maxRetries: number;
	defaultDelayInSeconds: number;
	jitter: boolean;
	exponential: boolean;
};
class PostHttpRequestRetryDecorator implements PostHttpRequest {
	private retryCount = 0;

	constructor(private postHttpRequest: PostHttpRequest, private retryOptions: RetryOptions) {}

	private get defaultDelay(): number {
		return this.retryOptions.defaultDelayInSeconds;
	}

	private get isExponential(): boolean {
		return this.retryOptions.exponential;
	}

	private get maxRetries(): number {
		return this.retryOptions.maxRetries;
	}

	private get withJitter(): boolean {
		return this.retryOptions.jitter;
	}

	private get delayInSeconds(): number {
		let delay = this.defaultDelay;

		if (this.isExponential) {
			delay **= this.retryCount + 1;
		}

		if (this.withJitter) {
			delay += Math.random();
		}

		return delay;
	}

	private get shouldRetry(): boolean {
		return this.retryCount < this.maxRetries;
	}

	async Run(url: string, data: any): Promise<any> {
		try {
			const response = await this.postHttpRequest.Run(url, data);

			return response;
		} catch (error) {
			if (this.shouldRetry) {
				await sleep(this.delayInSeconds * 1000);
				this.retryCount++;

				return this.Run(url, data);
			}

			throw error;
		}
	}
}

const postHttpRequest = new DefaultPostHttpRequestAdapter();
const postHttpRequestWithRetryThreeTimesWithTwoSecondsDelayExponential = new PostHttpRequestRetryDecorator(postHttpRequest, {
	maxRetries: 3,
	defaultDelayInSeconds: 2,
	jitter: false,
	exponential: true,
});

const service = new DefaultService(postHttpRequestWithRetryThreeTimesWithTwoSecondsDelayExponential);
