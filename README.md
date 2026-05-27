# FIREGUARD

FIREGUARD é um sistema de prevenção a incêndio desenvolvido para monitorar a concentração de gás em tempo real por meio do sensor MQ-2, medindo os níveis em PPM. Quando a concentração atinge níveis críticos, o sistema dispara um alarme sonoro (buzzer) e sinaliza visualmente através de quatro LEDs indicadores de nível. Os dados são exibidos em um dashboard desktop em tempo real, comunicando a placa Arduino Nano com o computador via porta serial.

## Tecnologias

- **Arduino Nano** - leitura do sensor e controle dos LEDs e buzzer
- **Sensor MQ-2** - detecção de gás e fumaça em PPM
- **LCD 16x2 I2C (TELA LED)** - mostra os dados por uma tela led
- **C++ (Arduino IDE)** - firmware gravado na placa
- **Electron** - aplicação desktop multiplataforma
- **Node.js** - processo principal da aplicação
- **SerialPort** - comunicação serial entre Arduino e o computador
- **HTML/CSS/JavaScript** - interface do dashboard

## Pré-requisitos

- Node.js 18+ (https://nodejs.org)
- Arduino com o código carregado e conectavel via USB

## instalação

1. Clicar a primeira vez em "FIREGUARD.bat" com conexão a Internet
2. Esperar dowload da pasta "node_modules" ser feita na pasta "FIREGUARD"
3. Verifique se no CMD que foi aberto automaticamente, se ele terminou a execução do comando
4. Verifique se existe arquivos no "node_modules", e se existe conteúdo dentro do "package-lock.json"

## Como usar

1. Conecte o Arduino via USB
2. Clicar no atalho "FIREGUARD.bat"
3. Clique em **ATUALIZAR PORTAS**
4. Selecione a porta COM (Windows: `COM3`, `COM4`... / Linux/Mac: `/dev/ttyUSB0`, `/dev/cu.usbserial...`)
5. Clique em **CONECTAR**

## Funcionalidades

| Nível   | Faixa ADC | Cor      |
|---------|-----------|----------|
| Seguro  | < 230     | Verde    |
| Alerta  | 230–459   | Azul     |
| Perigo  | 460–689   | Amarelo  |
| Crítico | ≥ 690     | Vermelho |

- **Gauge radial** com valor atual em tempo real
- **Gráfico histórico** dos últimos 2 minutos ou 267 pontos
- **Estatísticas** de sessão: mínimo, máximo, média, total de leituras
- **Banner de alerta** quando nível for crítico (≥ 600)
- **Log** de eventos na barra lateral

## Estrutura

- `firmware/` — código da placa Arduino (`.ino`)
- `app/` — aplicação desktop Electron

```
FIREGUARD/
├── firmware/
│   └── fireguard/
│       └── fireguard.ino   ← código gravado na placa Arduino Nano
├── app/
│   ├── src/
│   │   ├── main.js         ← processo principal (Electron + SerialPort)
│   │   ├── preload.js      ← bridge segura IPC ↔ renderer
│   │   ├── index.html      ← dashboard visual
│   │   └── style.css       ← estilo da página
│   ├── node_modules/       ← dependências instaladas pelo npm, não enviada ao repositório
│   │   └── ...
│   ├── package-lock.json   ← versões exatas dos pacotes, gerado automaticamente pelo npm
│   ├── package.json        ← configuração do projeto: nome, versão, scripts e dependências
│   └── FIREGUARD.bat       ← roda "npm install" se necessário e inicia o app com "npm start"
└── .gitignore              ← define o que não será enviado ao repositório
```