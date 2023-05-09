#include "Application.h"
#include <Arduino.h>

void appInitialize() {
  pinMode(LED_BUILTIN, OUTPUT);
  Serial.println("Application initialized.");
}

void appStart() {
  delay(1000);
  digitalWrite(LED_BUILTIN, HIGH);
  Serial.println("Application is executing...");
  delay(1000);
  digitalWrite(LED_BUILTIN, LOW);
}