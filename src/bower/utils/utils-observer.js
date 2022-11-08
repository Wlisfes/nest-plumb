export class Observer {
	constructor() {
		this.listener = new Map()
	}

	emit(type, parameter) {
		const handlers = this.listener.get(type)
		if (handlers && handlers.length > 0) {
			handlers.map(handler => {
				handler(parameter)
			})
		}
	}

	once(type, handler) {
		const done = this.on(type, parameter => {
			handler(parameter)
			done()
		})
	}

	on(type, handler) {
		const handlers = this.listener.get(type)
		if (handlers) {
			handlers.push(handler)
		} else {
			this.listener.set(type, [handler])
		}
		return () => {
			this.off(type, handler)
		}
	}

	off(type, handler) {
		const handlers = this.listener.get(type)
		if (handlers) {
			if (handler) {
				handlers.splice(handlers.indexOf(handler) >>> 0, 1)
			} else {
				this.listener.set(type, [])
			}
		}
	}

	clear() {
		return this.listener.clear()
	}
}
