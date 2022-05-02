//type Attribute = {id: string} | {class: string} | {value: string};
//type Attribute = {id?: string, class?: string, value?: string};

export function html(tagName: string, attributes?: any, content?: string | HTMLElement[] | SVGSVGElement[], events?: any): HTMLElement {
	let obj = document.createElement(tagName);

	if (attributes) {
		for (const key of Object.keys(attributes)) {
			const val = attributes[key];
			if (!!key)
				obj.setAttribute(key, val);
		}
	}

	if (content) {
		if (typeof content === 'string') {
			obj.innerText = content;
		}
		else {
			for (const child of content) {
				obj.appendChild(child);
			}
		}
	}

	if (events) {
		for (const eventName of Object.keys(events)) {
			if (eventName === `onclick`)
				obj.onclick = events[eventName];
			else if (eventName === `onchange`)
				obj.onchange = events[eventName];
		}
	}

	return obj;
}
