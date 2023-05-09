#pragma once

#include <ArduinoJson.h>
#include <FS.h>
#include <HTTPClient.h>
#include <LittleFS.h>
#include <Update.h>
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

  const char * checkNewFirmware(const char *currentVersion, const char *preSharedKey) {
    HTTPClient httpClient;
    char url[strlen("https://secureboot.online/api/firmware/latest/"
                    "esp32?currentVersion=") +
             strlen(currentVersion) + strlen("&preSharedKey=") + strlen(preSharedKey) + strlen(" HTTP/1.0")];

    strcpy(
        url,
        "https://secureboot.online/api/firmware/latest/esp32?currentVersion=");
    strcat(url, currentVersion);
    strcat(url, "&preSharedKey=");
    strcat(url, preSharedKey);
    strcat(url, " HTTP/1.0\n");
    const char *latestVersion;

    if (httpClient.begin(*this->client, url)) {
      Serial.printf("[HTTPS] GET %s\n", url);
      int httpCode = httpClient.GET();
      if (httpCode == HTTP_CODE_OK) {
        Serial.printf("[HTTPS] GET... code: %d\n", httpCode);
        String payload = httpClient.getString();
        StaticJsonDocument<512> doc;
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return "error";
        }
        latestVersion = doc["firmwareVersion"];
        Serial.printf("Latest firmware ver: %s\n", latestVersion);
      } else {
        latestVersion = "latest";
      }
    } else {
      latestVersion = "error";
    }
    httpClient.end();
    this->client->stop();
    return latestVersion;
  }

  void downloadFirmware(const char * latestVersion, const char *preSharedKey) {
    HTTPClient httpClient;

    char url[strlen("https://secureboot.online/api/firmware/download/esp32?latestVersion=") +
          strlen(latestVersion) + strlen("&preSharedKey=") + strlen(preSharedKey) + strlen(" HTTP/1.0")];

    strcpy(url, "https://secureboot.online/api/firmware/download/esp32?latestVersion=");
    strcat(url, latestVersion);
    strcat(url, "&preSharedKey=");
    strcat(url, preSharedKey);
    strcat(url, " HTTP/1.0\n");

    if (httpClient.begin(*this->client, url)) {
      Serial.printf("[HTTPS] GET %s\n", url);
      int httpCode = httpClient.GET();
      if (httpCode > 0) {
        Serial.printf("[HTTPS] GET... code: %d\n", httpCode);

        if (!LittleFS.begin(true)) {
          Serial.println("An Error has occurred while mounting LittleFS");
          return;
        }
        File file = LittleFS.open("/firmware.bin", "w");
        if (!file) {
          Serial.println("Failed to open file for writing");
          return;
        }

        int length = httpClient.getSize();
        uint8_t buff[128] = {0};
        auto stream = httpClient.getStreamPtr();

        Serial.println("Writing firmware to flash:");
        while (httpClient.connected() && (length > 0 || length == -1)) {
          int c =
              stream->readBytes(buff, std::min((size_t)length, sizeof(buff)));
          Serial.printf("readBytes: %d\n", c);
          Serial.printf("length: %d\n", length);
          if (!c) {
            Serial.println("Read timeout!");
            ESP.restart();
          }
          size_t bytesWritten = file.write(buff, c);
          if (bytesWritten == 0) {
            Serial.println("could not write to the file");
            file.close();
            LittleFS.end();
            return;
          }
          if (length > 0) {
            length -= c;
          }
          delay(1);
        }

        file.close();
        LittleFS.end();
        delay(3000);
      } else {
        Serial.printf("[HTTP] GET... failed, error: %s\n",
                      httpClient.errorToString(httpCode).c_str());
      }
      httpClient.end();

      if (!LittleFS.begin()) {
        Serial.println("An Error has occurred while mounting SPIFFS");
        return;
      }

      File file = LittleFS.open("/firmware.bin");

      if (!file) {
        Serial.println("Failed to open file for reading");
        return;
      }

      Serial.println("Starting update..");

      size_t fileSize = file.size();

      if (!Update.begin(fileSize)) {
        Serial.println("Cannot do the update");
        return;
      };

      Update.writeStream(file);

      if (Update.end()) {
        Serial.println("Successful update");
      } else {
        Serial.println("Error Occurred: " + String(Update.getError()));
        return;
      }

      file.close();

      Serial.println("Reset in 4 seconds...");
      delay(4000);
      ESP.restart();
    } else {
      Serial.println("Unable to connect to OTA server");
    }
  }

  void updateDevice(const char *deviceId, const char *preSharedKey) {
    HTTPClient httpClient;

    char url[strlen("https://secureboot.online/api/devices/update-device/") + strlen(deviceId) +
          strlen("?preSharedKey=") + strlen(preSharedKey) + strlen(" HTTP/1.0")];

    strcpy(url, "https://secureboot.online/api/devices/update-device/");
    strcat(url, deviceId);
    strcat(url, "?preSharedKey=");
    strcat(url, preSharedKey);
    strcat(url, " HTTP/1.0\n");

    if (httpClient.begin(*this->client, url)) {
      Serial.printf("[HTTPS] PUT %s\n", url);
      String put = "";
      StaticJsonDocument<192> doc;

      doc["deviceId"] = deviceId;
      doc["preSharedKey"] = preSharedKey;
      doc["provisioned"] = true;

      serializeJson(doc, put);
      int httpCode = httpClient.PUT(put);
      if (httpCode == HTTP_CODE_OK) {
        Serial.printf("[HTTPS] PUT... code: %d\n", httpCode);
        String payload = httpClient.getString();
        StaticJsonDocument<512> doc;
        DeserializationError error = deserializeJson(doc, payload);
        if (error) {
          Serial.print(F("deserializeJson() failed: "));
          Serial.println(error.c_str());
          return;
        }
      } else {
        Serial.println("Error sending request");
      }
    } else {
      Serial.println("Error connecting to server.");
    }
    httpClient.end();
    this->client->stop();
  }
};