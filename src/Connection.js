export default function Connection() {
	this.host = window.location.hostname;
	this.port = window.location.port;
	this.protocol = window.location.protocol;
	this.wsProtocol = this.protocol === "https:" ? "wss" : "ws";
	this.socket = new WebSocket(
		`${this.wsProtocol}://${this.host}:${this.port}/join`
	);

	// document.querySelector ( 'form' ).addEventListener ( 'submit', ( e ) => {
	//     e.preventDefault (); // prevents page reloading
	//     socket.send ( JSON.stringify ( {
	//         type: 'CHATMESSAGE',
	//         user: name,
	//         content: document.getElementById ( 'm' ).value
	//     } ) );
	//     document.getElementById ( 'm' ).value = '';
	//     return false;
	// } );

	this.escapeHtml = (html) => {
		const htmlEscapes = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#x27;",
			"/": "&#x2F;",
		};

		const htmlEscaper = /[&<>"'\/]/g;

		return ("" + html).replace(htmlEscaper, function (match) {
			return htmlEscapes[match];
		});
	};

	this.ping = (socket) => {
		socket.send(
			JSON.stringify({
				type: "PINGPONG",
				content: "PING",
			})
		);
	};

	this.send = (object) => {
		window.setTimeout(() => {
			this.socket.send(JSON.stringify(object));
		}, 1000);
	};

	this.insertMessage = (message) => {
		const chatLog = document.querySelector("ul");
		if (message.content === "/draw") {
			const canvas = document.createElement("canvas"),
				item = document.createElement("li"),
				name = document.createElement("em");
			name.innerHTML = `<img src="https://unavatar.now.sh/github/${escapeHtml(
				message.user
			)}" alt="Unavatar avatar">${escapeHtml(message.user)}`;
			canvas.setAttribute("width", 400);
			canvas.setAttribute("height", 300);
			canvas.itemId = message.id;
			item.classList.add(message.source);
			item.setAttribute("id", `c${message.id}`);
			item.append(name, canvas);
			chatLog.insertAdjacentElement("beforeend", item);
			if (message.source === "own") enableDrawing(canvas);
		} else {
			chatLog.insertAdjacentHTML(
				"beforeend",
				`<li id="c${message.id}" class="${message.source}">
                    <em><img src="https://unavatar.now.sh/github/${escapeHtml(
											message.user
										)}" alt="Unavatar avatar">${escapeHtml(message.user)}</em>
                    <p>${escapeHtml(message.content)}</p>
                </li>`
			);
		}
	};

	this.insertJoined = (message) => {
		const chatLog = document.querySelector("ul");
		chatLog.insertAdjacentHTML(
			"beforeend",
			`<li class="welcome">${escapeHtml(message.user)} has joined the chat</li>`
		);
	};

	this.insertLeft = (message) => {
		const chatLog = document.querySelector("ul");
		chatLog.insertAdjacentHTML(
			"beforeend",
			`<li class="welcome">${escapeHtml(message.user)} has left the chat</li>`
		);
	};

	this.renderDrawing = (message) => {
		const canvas = document.querySelector(`#c${message.canvas} canvas`);
		const ctx = canvas.getContext("2d");
		const img = new Image();
		img.onload = function () {
			ctx.drawImage(img, 0, 0); // Or at whatever offset you like
		};
		img.src = message.data;
	};

	this.echoPosition = (player) => {
		this.socket.send(
			JSON.stringify({
				type: "MOVEMENT",
				player: player,
			})
		);
	};
}
