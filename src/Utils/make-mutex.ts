export const makeMutex = () => {
	let task = Promise.resolve() as Promise<any>
	let taskIsRunning = false
	return {
		mutex<T>(code: () => Promise<T> | T): Promise<T> {
			const newTask = task
				.then(() => {
					taskIsRunning = true
					return code()
				})
				.finally(() => {
					taskIsRunning = false
				})
			task = newTask.catch(() => {})
			return newTask
		},
		get isRunning() {
			return taskIsRunning
		}
	}
}
