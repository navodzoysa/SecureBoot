#pragma once

#include <WiFiClientSecure.h>

class HTTPSHandler {
private:
  WiFiClientSecure *client;

public:
  HTTPSHandler(WiFiClientSecure *client) { this->client = client; }

  void initializeHttpsClient(const char *root_ca) {
    this->client->setCACert(root_ca);
  }

  bool connectHttpsClient(const char *server) {
    Serial.println("\nStarting connection to server...");
    if (this->client->connect(server, 443)) {
      Serial.println("Connected to server!");
      return true;
    }
    Serial.println("Connection failed!");
    return false;
  }

  void checkNewFirmware(const char *firmwareVersion) {
    this->client->printf("GET https://secureboot.online/api/firmware/latest/esp32?currentVersion=%s HTTP/1.0\n", firmwareVersion);
    this->client->println("Host: secureboot.online");
    this->client->println("Connection: close");
    this->client->println();
    while (this->client->connected()) {
      String line = this->client->readStringUntil('\n');
      if (line == "\r") {
        Serial.println("headers received");
        break;
      }
    }

    while (this->client->available()) {
      char c = this->client->read();
      Serial.write(c);
    }
    this->client->stop();
  }
  void postRequest();
  void putRequest();
};