export default function Connection(code) {
	this.players = [];
	const chatLog = document.getElementById("messages");
	this.playerList = document.querySelector('.playerInfo ul');
	this.host = window.location.hostname;
	this.port = window.location.port;
	this.protocol = window.location.protocol;
	this.wsProtocol = this.protocol === "https:" ? "wss" : "ws";
	this.socket = new WebSocket(
		`${this.wsProtocol}://${this.host}:${this.port}/join/${code}`
	);

	document.getElementById('send').addEventListener('click', e => {
		e.preventDefault();
		this.send({
			type: "MESSAGE",
			content: document.getElementById('m').value
		}, 0);
		document.getElementById('m').value = '';
	})

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

	this.updatePlayers = () => {
		while (this.playerList.firstChild) this.playerList.removeChild(this.playerList.firstChild);
		const me = document.createElement('li');
		me.innerText = `${document.getElementById('playerName').value} (me)`
		this.playerList.insertAdjacentElement('afterbegin', me);
		this.players.forEach(player => {
			if (!player.me) {
				const el = document.createElement('li');
				el.innerText = player.name;
				this.playerList.insertAdjacentElement('beforeend', el);
			}
		})
	}

	this.ping = (socket) => {
		socket.send(
			JSON.stringify({
				type: "PINGPONG",
				content: "PING",
			})
		);
	};

	this.send = (object, delay = 1000) => {
		window.setTimeout(() => {
			this.socket.send(JSON.stringify(object));
		}, delay);
	};


	this.insertMessage = (message) => {
		chatLog.insertAdjacentHTML(
				"beforeend",
				`<li id="c${message.id}" class="${message.source}">
                    <em><img src="https://unavatar.now.sh/github/${escapeHtml(
											message.user
										)}" alt="Unavatar avatar">${escapeHtml(message.user)}: </em>
                    <p>${escapeHtml(message.content)}</p>
                </li>`
			);
		this.updateScroll();
	};

	this.insertJoined = (message) => {
		chatLog.insertAdjacentHTML(
			"beforeend",
			`<li class="welcome">${escapeHtml(message.user)} has joined the chat</li>`
		);
		this.updateScroll();
	};

	this.insertLeft = (message) => {
		chatLog.insertAdjacentHTML(
			"beforeend",
			`<li class="welcome">${escapeHtml(message.user)} has left the chat</li>`
		);
		this.updateScroll();
	};

	this.updateScroll = () => {
		chatLog.scrollTop = chatLog.scrollHeight;
	}

	this.echoPosition = (player) => {
		this.socket.send(
			JSON.stringify({
				type: "MOVEMENT",
				player: {
					position: player.position
				},
			})
		);
	};
}
	function escapeHtml ( html ) {
		const htmlEscapes = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#x27;',
			'/': '&#x2F;'
		};

		const htmlEscaper = /[&<>"'\/]/g;

		return ( '' + html ).replace ( htmlEscaper, function ( match ) {
			return htmlEscapes[ match ];
		} );
	}
