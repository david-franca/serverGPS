export enum PositionKeys {
  KEY_ORIGINAL = 'raw',
  KEY_INDEX = 'index',
  KEY_HDOP = 'hdop',
  KEY_VDOP = 'vdop',
  KEY_PDOP = 'pdop',
  KEY_SATELLITES = 'sat', // in use
  KEY_SATELLITES_VISIBLE = 'satVisible',
  KEY_RSSI = 'rssi',
  KEY_GPS = 'gps',
  KEY_ROAMING = 'roaming',
  KEY_EVENT = 'event',
  KEY_ALARM = 'alarm',
  KEY_STATUS = 'status',
  KEY_ODOMETER = 'odometer', // meters
  KEY_ODOMETER_SERVICE = 'serviceOdometer', // meters
  KEY_ODOMETER_TRIP = 'tripOdometer', // meters
  KEY_HOURS = 'hours',
  KEY_STEPS = 'steps',
  KEY_HEART_RATE = 'heartRate',
  KEY_INPUT = 'input',
  KEY_OUTPUT = 'output',
  KEY_IMAGE = 'image',
  KEY_VIDEO = 'video',
  KEY_AUDIO = 'audio',

  // The units for the below four KEYs currently vary.
  // The preferred units of measure are specified in the comment for each.
  KEY_POWER = 'power', // volts
  KEY_BATTERY = 'battery', // volts
  KEY_BATTERY_LEVEL = 'batteryLevel', // percentage
  KEY_FUEL_LEVEL = 'fuel', // liters
  KEY_FUEL_USED = 'fuelUsed', // liters
  KEY_FUEL_CONSUMPTION = 'fuelConsumption', // liters/hour

  KEY_VERSION_FW = 'versionFw',
  KEY_VERSION_HW = 'versionHw',
  KEY_TYPE = 'type',
  KEY_IGNITION = 'ignition',
  KEY_FLAGS = 'flags',
  KEY_ANTENNA = 'antenna',
  KEY_CHARGE = 'charge',
  KEY_IP = 'ip',
  KEY_ARCHIVE = 'archive',
  KEY_DISTANCE = 'distance', // meters
  KEY_TOTAL_DISTANCE = 'totalDistance', // meters
  KEY_RPM = 'rpm',
  KEY_VIN = 'vin',
  KEY_APPROXIMATE = 'approximate',
  KEY_THROTTLE = 'throttle',
  KEY_MOTION = 'motion',
  KEY_ARMED = 'armed',
  KEY_GEOFENCE = 'geofence',
  KEY_ACCELERATION = 'acceleration',
  KEY_DEVICE_TEMP = 'deviceTemp', // celsius
  KEY_COOLANT_TEMP = 'coolantTemp', // celsius
  KEY_ENGINE_LOAD = 'engineLoad',
  KEY_OPERATOR = 'operator',
  KEY_COMMAND = 'command',
  KEY_BLOCKED = 'blocked',
  KEY_DOOR = 'door',
  KEY_AXLE_WEIGHT = 'axleWeight',
  KEY_G_SENSOR = 'gSensor',
  KEY_ICCID = 'iccid',
  KEY_PHONE = 'phone',
  KEY_SPEED_LIMIT = 'speedLimit',

  KEY_DTCS = 'dtcs',
  KEY_OBD_SPEED = 'obdSpeed', // knots
  KEY_OBD_ODOMETER = 'obdOdometer', // meters

  KEY_RESULT = 'result',

  KEY_DRIVER_UNIQUE_ID = 'driverUniqueId',

  // Start with 1 not 0
  PREFIX_TEMP = 'temp',
  PREFIX_ADC = 'adc',
  PREFIX_IO = 'io',
  PREFIX_COUNT = 'count',
  PREFIX_IN = 'in',
  PREFIX_OUT = 'out',

  ALARM_GENERAL = 'general',
  ALARM_SOS = 'sos',
  ALARM_VIBRATION = 'vibration',
  ALARM_MOVEMENT = 'movement',
  ALARM_LOW_SPEED = 'lowspeed',
  ALARM_OVERSPEED = 'overspeed',
  ALARM_FALL_DOWN = 'fallDown',
  ALARM_LOW_POWER = 'lowPower',
  ALARM_LOW_BATTERY = 'lowBattery',
  ALARM_FAULT = 'fault',
  ALARM_POWER_OFF = 'powerOff',
  ALARM_POWER_ON = 'powerOn',
  ALARM_DOOR = 'door',
  ALARM_LOCK = 'lock',
  ALARM_UNLOCK = 'unlock',
  ALARM_GEOFENCE = 'geofence',
  ALARM_GEOFENCE_ENTER = 'geofenceEnter',
  ALARM_GEOFENCE_EXIT = 'geofenceExit',
  ALARM_GPS_ANTENNA_CUT = 'gpsAntennaCut',
  ALARM_ACCIDENT = 'accident',
  ALARM_TOW = 'tow',
  ALARM_IDLE = 'idle',
  ALARM_HIGH_RPM = 'highRpm',
  ALARM_ACCELERATION = 'hardAcceleration',
  ALARM_BRAKING = 'hardBraking',
  ALARM_CORNERING = 'hardCornering',
  ALARM_LANE_CHANGE = 'laneChange',
  ALARM_FATIGUE_DRIVING = 'fatigueDriving',
  ALARM_POWER_CUT = 'powerCut',
  ALARM_POWER_RESTORED = 'powerRestored',
  ALARM_JAMMING = 'jamming',
  ALARM_TEMPERATURE = 'temperature',
  ALARM_PARKING = 'parking',
  ALARM_SHOCK = 'shock',
  ALARM_BONNET = 'bonnet',
  ALARM_FOOT_BRAKE = 'footBrake',
  ALARM_FUEL_LEAK = 'fuelLeak',
  ALARM_TAMPERING = 'tampering',
  ALARM_REMOVING = 'removing',
}
