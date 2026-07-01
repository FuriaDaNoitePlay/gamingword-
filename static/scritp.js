// CONTADOR DE VENDIDOS
function atualizarContador() {
    const vendidos = document.querySelectorAll('.numero-card[data-vendido="True"]').length;
    const contador = document.getElementById('contador');
    if (contador) {
        contador.textContent = `💰 Vendidos: ${vendidos}/50`;
    }
}

// COMPRAR NÚMERO
function comprar(numero) {
    const modal = document.getElementById('modal');
    document.getElementById('numero-modal').textContent = numero;
    document.getElementById('nome-comprador').dataset.numero = numero;
    modal.classList.add('show');
}

function fecharModal() {
    document.getElementById('modal').classList.remove('show');
}

function confirmarCompra() {
    const nome = document.getElementById('nome-comprador').value.trim();
    const numero = document.getElementById('nome-comprador').dataset.numero;
    
    if (!nome) {
        alert('⚠️ Digite seu nickname gamer!');
        return;
    }
    
    fetch('/comprar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({numero: numero, comprador: nome})
    })
    .then(res => res.json())
    .then(data => {
        alert(data.mensagem);
        if (data.sucesso) {
            location.reload();
        }
    })
    .catch(err => {
        alert('❌ Erro ao comprar. Tente novamente!');
    });
}

// FECHAR MODAL CLICANDO FORA
document.getElementById('modal')?.addEventListener('click', function(e) {
    if (e.target === this) fecharModal();
});

// SORTEAR GANHADOR
function sortear() {
    const btn = document.getElementById('btn-sortear');
    const resultado = document.getElementById('resultado-sorteio');
    
    btn.disabled = true;
    btn.textContent = '🎰 GIRANDO...';
    resultado.textContent = '🌀 Girando a roleta gamer...';
    
    let giros = 0;
    const interval = setInterval(() => {
        const numeros = document.querySelectorAll('.tabela-vendas tbody tr');
        if (numeros.length > 0) {
            const random = Math.floor(Math.random() * numeros.length);
            numeros.forEach((row, i) => {
                row.style.background = i === random ? 'rgba(255, 0, 255, 0.2)' : 'transparent';
                row.style.transition = 'background 0.1s';
            });
        }
        giros++;
        if (giros > 25) {
            clearInterval(interval);
            realizarSorteio();
        }
    }, 100);
}

function realizarSorteio() {
    fetch('/sortear', {
        method: 'POST'
    })
    .then(res => res.json())
    .then(data => {
        const resultado = document.getElementById('resultado-sorteio');
        if (data.sucesso) {
            resultado.innerHTML = `
                🎉 <span style="color: #ff00ff;">NÚMERO SORTEADO:</span> 
                <span style="font-size: 2em; color: #00ffff;">#${data.ganhador}</span>
                <br>
                🏆 <span style="color: #ffd700;">GANHADOR:</span> 
                <span style="font-size: 1.3em; color: #ff00ff;">${data.comprador}</span>
                <br>
                <span style="font-size: 3em;">${data.icone}</span>
            `;
            resultado.style.animation = 'neonGlow 0.5s ease 3';
        } else {
            resultado.textContent = '❌ ' + data.mensagem;
        }
        const btn = document.getElementById('btn-sortear');
        btn.disabled = false;
        btn.textContent = '🎰 GIRAR RODA GAMER';
    })
    .catch(err => {
        alert('❌ Erro no sorteio!');
        const btn = document.getElementById('btn-sortear');
        btn.disabled = false;
        btn.textContent = '🎰 GIRAR RODA GAMER';
    });
}

// RESETAR RIFA
function resetarRifa() {
    if (confirm('⚠️ TEM CERTEZA? Isso vai apagar todos os dados da rifa!')) {
        fetch('/resetar', {
            method: 'POST'
        })
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem);
            if (data.sucesso) location.reload();
        });
    }
}

// ATUALIZAR CONTADOR AO CARREGAR
document.addEventListener('DOMContentLoaded', atualizarContador);
