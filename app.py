from flask import Flask, render_template, request, jsonify
import json
import random

app = Flask(__name__)

# ÍCONES GAMERS PARA CADA NÚMERO
ICONES_GAMER = ["🎮", "🕹️", "🎯", "🏆", "⭐", "🔥", "💀", "👾", "🤖", "⚡", "🌀", "🎲", "♟️", "🎧", "📺"]

# CARREGAR DADOS
def carregar_dados():
    try:
        with open('dados.json', 'r') as f:
            return json.load(f)
    except:
        return {str(i): {"vendido": False, "comprador": "", "icone": random.choice(ICONES_GAMER)} for i in range(1, 51)}

# SALVAR DADOS
def salvar_dados(dados):
    with open('dados.json', 'w') as f:
        json.dump(dados, f, indent=4)

# PÁGINA PRINCIPAL
@app.route('/')
def index():
    dados = carregar_dados()
    return render_template('index.html', numeros=dados)

# PAINEL ADMIN
@app.route('/admin')
def admin():
    dados = carregar_dados()
    return render_template('admin.html', numeros=dados)

# COMPRAR NÚMERO
@app.route('/comprar', methods=['POST'])
def comprar():
    dados = carregar_dados()
    numero = request.json['numero']
    comprador = request.json['comprador']
    
    if not dados[numero]['vendido']:
        dados[numero]['vendido'] = True
        dados[numero]['comprador'] = comprador
        salvar_dados(dados)
        return jsonify({"sucesso": True, "mensagem": f"🎮 Número {numero} garantido para {comprador}!"})
    return jsonify({"sucesso": False, "mensagem": "⚠️ Esse número já foi vendido!"})

# SORTEAR GANHADOR
@app.route('/sortear', methods=['POST'])
def sortear():
    dados = carregar_dados()
    numeros_vendidos = [n for n, info in dados.items() if info['vendido']]
    
    if not numeros_vendidos:
        return jsonify({"sucesso": False, "mensagem": "❌ Nenhum número vendido ainda!"})
    
    ganhador = random.choice(numeros_vendidos)
    return jsonify({
        "sucesso": True, 
        "ganhador": ganhador, 
        "comprador": dados[ganhador]['comprador'],
        "icone": dados[ganhador]['icone']
    })

# RESETAR RIFA
@app.route('/resetar', methods=['POST'])
def resetar():
    dados = {str(i): {"vendido": False, "comprador": "", "icone": random.choice(ICONES_GAMER)} for i in range(1, 51)}
    salvar_dados(dados)
    return jsonify({"sucesso": True, "mensagem": "🔄 Rifa resetada com sucesso!"})

# RODAR SERVIDOR
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
