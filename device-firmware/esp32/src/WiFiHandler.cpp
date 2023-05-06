#include <WiFi.h>
#include <Arduino.h>
#include <stdint.h>

void connectWifi(const char *ssid, const char *password) {
  Serial.print("Attempting to connect to SSID: ");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(1000);
  }

  Serial.print("Connected to ");
  Serial.println(ssid);
}