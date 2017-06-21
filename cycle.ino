// publishjson.ino -- Spark Publishing Example 


#include "AssetTracker.h"

AssetTracker t = AssetTracker();

FuelGauge fuel;




unsigned long lastTime = 0UL;
char publishString[150];

void setup() {
     t.begin();
     t.gpsOn();
       
     Particle.function("gps", gpsPublish);
}

void loop() {
        t.updateGPS();

    unsigned long now = millis();
    //Every 15 seconds publish uptime
    if (now-lastTime>15000UL) {
        lastTime = now;
        // now is in milliseconds
       
         double lon = (t.readLonDeg());
         double lat = (t.readLatDeg());

        sprintf(publishString,"{\"Latitude\": %f, \"Longitude\": %f}",lat,lon);
        Spark.publish("Uptime",publishString);
    }
}


int gpsPublish(String command) {
    if (t.gpsFix()) {
        //Particle.publish("G", t.readLatLon(), 60, PRIVATE);

        // uncomment next line if you want a manual publish to reset delay counter
        // lastPublish = millis();
        return 1;
    } else {
      return 0;
    }
}
