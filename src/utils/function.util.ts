export const bufferToHexString = (buffer: Buffer): string => {
  let str = '';
  for (let i = 0; i < buffer.length; i++) {
    if (buffer[i] < 16) {
      str += '0';
    }
    str += buffer[i].toString(16);
  }
  return str;
};

/**
 * This routine calculates the distance between two points (given the
 * latitude/longitude of those points).
 * Definitions: South latitudes are negative, east longitudes are positive
 * @param lat1 Latitude of point 1 (in decimal degrees)
 * @param lat2 Latitude of point 2 (in decimal degrees)
 * @param lon1 Longitude of point 1 (in decimal degrees)
 * @param lon2 Longitude of point 2 (in decimal degrees)
 * @returns distance in meters.
 */
export function distanceBetweenCoordinates(
  lat1: number,
  lat2: number,
  lon1: number,
  lon2: number,
): number {
  if ([lat1, lat2, lon1, lon2].includes(0)) {
    return 0;
  }
  if (lat1 === lat2 && lon1 === lon2) {
    return 0;
  }

  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}
