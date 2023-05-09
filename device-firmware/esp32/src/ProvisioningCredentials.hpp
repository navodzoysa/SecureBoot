#pragma once
#include <Preferences.h>

class ProvisioningCredentials {
private:
  Preferences *preferences;

public:
  ProvisioningCredentials(Preferences *preferences) {
    this->preferences = preferences;
  }

  void initializePreferences() {
    this->preferences->begin("credentials", false);
    unsigned int counter = this->preferences->getUInt("counter", 0);
    counter++;
    Serial.printf("Current counter value: %u\n", counter);
    this->preferences->putUInt("counter", counter);
  }

  void beginPreferences() {
    this->preferences->begin("credentials", false);
  }

  void closePreferences() {
    this->preferences->end();
  }

  void setCredentials(String savedPreSharedKey, bool isProvisioned, const char *preSharedKey) {
    savedPreSharedKey = this->preferences->getString("preSharedKey");
    isProvisioned = this->preferences->getBool("isProvisioned");
    Serial.printf("savedPreSharedKey - %s\n", savedPreSharedKey.c_str());
    Serial.printf("isProvisionedDevice - %d\n", isProvisioned);
    if (savedPreSharedKey == "" && !isProvisioned) {
        Serial.println("Device not provisioned!");
        this->preferences->putString("preSharedKey", preSharedKey);
        this->preferences->putBool("isProvisioned", true);
        Serial.println("Device credentials saved.");
    }
  }

  String getPreSharedKey() {
    return this->preferences->getString("preSharedKey");
  }

  bool isProvisionedDevice() {
    return this->preferences->getBool("isProvisioned");
  }
};