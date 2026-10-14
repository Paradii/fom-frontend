const EARTH_RADIUS = 6371000;

export const PIN_LIMIT_METERS = 200;

const toRadian = (degree) => {
  return (degree * Math.PI) / 180;
};

export const getDistanceMeters = (from, to) => {
  const dLat = toRadian(to.lat - from.lat);
  const dLng = toRadian(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadian(from.lat)) *
      Math.cos(toRadian(to.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(EARTH_RADIUS * c);
};

export const getPosition = (onDone) => {
  if (!navigator.geolocation) {
    onDone(null);
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (position) => {
      onDone({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    },
    () => onDone(null),
    { timeout: 5000 },
  );
};
