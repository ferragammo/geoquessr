export const calculateDistanceBeetweenCoords = (coord1, coord2) => {
    return getDistanceFromLatLonInKm(coord1[0], coord1[1], coord2[0], coord2[1])
}

export const calculateCenterBeetweenCoords = (coord1, coord2) => {
    const centerLat = (coord1[0] + coord2[0]) / 2;
    const centerLon = (coord1[1] + coord2[1]) / 2;
    return [centerLat, centerLon];
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return roundToTwoDecimals(d);
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  const roundToTwoDecimals = (num) => {
    return +(Math.round(num + "e+2") + "e-2");
  };

  