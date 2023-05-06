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

  void getRequest() {
    this->client->println("GET "
                "https://secureboot.online/api/firmware/download/"
                "6453762dfe6016a87aba173b HTTP/1.0");
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