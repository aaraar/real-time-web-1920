window.addEventListener('load', e => {
    const preSelect = document.getElementById('preSelect');
    const hostForm = document.getElementById('host');
    const joinForm = document.getElementById('join');
    const backButtons = document.querySelectorAll('.back');
    if (document.getElementById('directLink')) {
        toggleActiveState(joinForm);
        toggleActiveState(preSelect);
    }
    toggleActiveState(hostForm);
    toggleActiveState(joinForm);
    preSelect.innerHTML = `<button id="hostButton">Host</button><button id="joinButton">Join</button>`;
    const hostButton = document.getElementById('hostButton');
    const joinButton = document.getElementById('joinButton');

    hostButton.addEventListener('click', e => {
        toggleActiveState(preSelect);
        e.preventDefault();
        toggleActiveState(hostForm);
    });
    joinButton.addEventListener('click', e => {
        toggleActiveState(preSelect);
        e.preventDefault();
        toggleActiveState(joinForm);
    });
    backButtons.forEach(backButton => {
        backButton.addEventListener('click', e => {
            e.preventDefault();
            toggleActiveState(preSelect);
            if (e.path[1].id === 'host') {
                toggleActiveState(hostForm);
            } else {
                toggleActiveState(joinForm);
            }
        });
    });
});

function toggleActiveState(element) {
    element.style.left = element.style.left === '200%' ? '50%' : '200%';
    element.style.opacity = element.style.opacity === '0' ? '1' : '0';
}
