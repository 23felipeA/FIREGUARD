#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <SoftwareSerial.h>

// === LCD 16x2 I2C === // SDA -> A4 / SCL -> A5
LiquidCrystal_I2C lcd(0x27, 16, 2);

// PORTAS
#define LED_VERDE 5
#define LED_AZUL 4
#define LED_AMARELO 3
#define LED_VERMELHO 2

#define MQ2_ANALOG A2
#define BUZZER 9

// Leds
const char* MSG_STATUSGAS[4] = {"AR LIMPO", "GAS BAIXO", "GAS MEDIO", "!!! PERIGO !!!"};
int LED_PORTA[4] = {LED_VERDE, LED_AZUL, LED_AMARELO, LED_VERMELHO};

// Média da leitura // MQ-2 (0 - 1023) -> (0 - (num_nivel =*4)-1)
#define NUM_LEITURAS 10
int num_nivel = 230;
int idx;
int soma = 0;
int media = 0;

// buzzer e delay
int rept_apitos = 0;
int delay_leitura = 25;
int delay_loop = 200;

// Controle do LCD
String statusGas = "";
String ultimoStatus = "";
int ultimoValor = -1;

void setup(){
  Serial.begin(9600);

  // LCD
  lcd.init();
  lcd.backlight();

  lcd.setCursor(0,0);
  lcd.print("Detector MQ-2");
  lcd.setCursor(0,1);
  lcd.print("Inicializando");
  delay(2000);

  lcd.clear();

  // LEDs
  pinMode(LED_VERDE, OUTPUT);
  pinMode(LED_AZUL, OUTPUT);
  pinMode(LED_AMARELO, OUTPUT);
  pinMode(LED_VERMELHO, OUTPUT);

  // Buzzer
  pinMode(BUZZER, OUTPUT);
}

// FUNÇÃO LEDS e BUZZER
void leds_buzzer(int valor){
  valor = valor >= num_nivel*4 ? (num_nivel*4)-1 : valor;
  idx = valor / num_nivel;

  statusGas = "";

  for (int i = 0; i < 4; i++){
    if (i != idx){
      digitalWrite(LED_PORTA[i], LOW);
    }
    else {
      digitalWrite(LED_PORTA[i], HIGH);
      statusGas = MSG_STATUSGAS[i];
      }
    }

  rept_apitos = idx == 3 ? 1 : (rept_apitos - 1);
  digitalWrite(BUZZER, rept_apitos > 0 ? HIGH : LOW);
}

// FUNÇÃO LCD
void atualizarLCD(String status, int valor){
  if(status != ultimoStatus || valor != ultimoValor){
    lcd.setCursor(0,0);
    lcd.print("                ");
    lcd.setCursor(0,0);
    lcd.print(status);

    lcd.setCursor(0,1);
    lcd.print("Nivel:          ");
    lcd.setCursor(7,1);
    lcd.print(valor);

    ultimoStatus = status;
    ultimoValor = valor;
  }
}

void loop(){
  // Média
  for (int leitura = 0; leitura<NUM_LEITURAS; leitura++){
    soma += analogRead(MQ2_ANALOG);
    delay(delay_leitura);
  }
  media = soma / NUM_LEITURAS;
  soma = 0;

  // LEDS e BUZZER
  leds_buzzer(media);

  // LCD
  atualizarLCD(statusGas, media);

  Serial.print(" ; Nivel: ");
  Serial.print(media);
  Serial.print(" | ");
  Serial.println(statusGas);

  delay(delay_loop);
}