function hexToRGBA(hex, alpha) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');

        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }

        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    return 'rgba(0,0,0,1)';
}

function getRGBAValues(string) {
    let cleaned = string.substring(string.indexOf('(') + 1, string.length - 1);
    let split = cleaned.split(',');

    let intValues = [];

    for (let index in split) {
        intValues.push(parseInt(split[index]));
    }

    return intValues;
}

function randomColor() {
    let hexString = '0123456789abcdef';
    let hexCode = '#';

    for (let i = 0; i < 6; i++) {
        hexCode += hexString[Math.floor(Math.random() * hexString.length)];
    }

    return hexCode;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function checkWin() {
    let paletteSortChildrens = document.querySelector('.palette_sort').children;
    let winCombination = [];
    
    for (let i = 0; i < paletteSortChildrens.length; i++) {
        winCombination.push(paletteSortChildrens[i].dataset.id);
    }
    return winCombination.toString() == ['0,1,2,3,4'].toString();
}

function saveProgress() {
    let score = Number(localStorage.getItem('progress')) ?? 0;
    ++score;
    localStorage.setItem('progress', score);

    return score;
}

function createParticle(partColor) {
    const item = document.createElement('div');
    item.className = 'palette_particle';
    item.style.backgroundColor = partColor.rgba;
    item.dataset.id = partColor.id;
    item.dataset.pos = partColor.pos;

    item.addEventListener('click', function(e) {
        if (e.target.dataset.pos == 'out') {
            document.querySelector('.palette_sort').appendChild(e.target);
            e.target.dataset.pos = 'in';
        } else if (e.target.dataset.pos == 'in') {
            document.querySelector('.palette_unsort').appendChild(e.target);
            e.target.dataset.pos = 'out';
        } 

        if (checkWin()) {
            let score = saveProgress();
            document.querySelector('.score').textContent = 'Очки: ' + Number(localStorage.getItem('progress')) ?? 0;
            setTimeout(() => {
                alert('Вы победили!');
                window.location.reload();
            }, 300);
        } 
    });
    return item;
}


let rgbaValues = getRGBAValues(hexToRGBA(randomColor(), 1.0));
let paletteParticles = [];
let alphaChannel = 0.0;

for (let i = 0; i < 5; i++) {
    paletteParticles.push({
        id: i,
        rgba: 'rgba(' + rgbaValues[0] + ',' + rgbaValues[1] + ',' + rgbaValues[2] + ',' + (rgbaValues[3] - alphaChannel).toFixed(1) + ')',
        pos: 'out'
    });
    alphaChannel = alphaChannel + 0.2;
}

shuffle(paletteParticles);

for (let j = paletteParticles.length - 1; j >= 0; j--) {
    document.querySelector('.score').textContent = 'Очки: ' + Number(localStorage.getItem('progress')) ?? 0;
    document.querySelector('.palette_unsort').appendChild( createParticle(paletteParticles[j]));
}



