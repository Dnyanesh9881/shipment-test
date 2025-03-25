 export const locationsByState = {
    "Meghalaya": {
      "6393126c865ec3abed90bc27": [25.530009648762853, 90.8591667000106],
      "639310eb865ec3abed90bc1f": [25.970128750000608, 90.41011400454289],
      "639311e2865ec3abed90bc23": [25.45279714240047, 90.7127885290625],
      "639312ff865ec3abed90bc2b": [25.57566372263245, 90.49134440018842],
      "63930f82865ec3abed90bc1b": [25.917101231771113, 90.64956864386703],
      "64d0895c3ea096f727fb9121": [25.6999217824048, 90.445203276064],
      "64d094523cb3ee07cf92adc8": [25.644668890726, 90.6084918281938],
      "64d095163cb3ee07cf92add7": [25.7075145734913, 90.1878214380614],
      "6614b482eedca0a1a5df9bf0": [25.5601115, 90.715946],
      "661b551073054244262980ff": [25.9322873, 90.6721245],
      "6690e358349f682b7dfe0137": [25.962165, 90.511317],
      "66c83f5d3aad3df7ce7e4500": [25.5670277, 90.4415141],
      "6787698ec375be45b3e3794e": [25.594661, 90.166452],
      "6788c2b9c375be45b3e38714": [25.626259, 90.445402],
      "678a227ec375be45b3e3980e": [25.535899, 90.242656],
      "678dfac0c375be45b3e3c08b": [25.819446, 90.445406],
      "678f44e6c375be45b3e3d819": [25.745786, 90.401962],
      "67909842c375be45b3e3f884": [25.555228, 90.19927],
      "6791e05ec375be45b3e401d7": [25.790083, 90.335008],
      "67974547035ca46302637a97": [25.5584479, 90.3575036]
    },
    "Uttarakhand": {
      "6616786d0ea790d0f3e7ad3a": [30.3528965, 78.3899621],
      "661678a20ea790d0f3e7ad5d": [30.3806791, 78.4370814],
      "661678d20ea790d0f3e7ad77": [30.2285239, 78.3516853],
      "661678f50ea790d0f3e7ad91": [30.104028, 78.298427],
      "669c98e27a1379a4b26f5b62": [30.063709, 78.379074]
    },
    "Assam": {
      "6683bd9be33e3fe878d5a67a": [26.080055, 91.279368],
      "6704eeda5f92d448b03abb6b": [26.132629, 91.3039673],
      "6704ef7b5f92d448b03abbbf": [26.234472, 91.449194]
    },
    "Punjab": {
      "669a28e8772df389cfe3bb97": [30.927770614624023, 76.99905395507812],
      "66ab8f7c4c0251c8aa50c964": [31.2869895, 76.7812124],
      "66ab92e54c0251c8aa50c9b9": [30.9276248, 76.9986677]
    },
    "Haryana": {
      "66e80616c4748f2ca7b91946": [28.384133, 76.970108]
    }
  };
  
 export  const hubInfo = {
    "63932c7ab1cab628335ae969": [
      "6393126c865ec3abed90bc27",
      "639310eb865ec3abed90bc1f",
      "639311e2865ec3abed90bc23",
      "639312ff865ec3abed90bc2b",
      "63930f82865ec3abed90bc1b",
      "64d0895c3ea096f727fb9121",
      "64d094523cb3ee07cf92adc8",
      "64d095163cb3ee07cf92add7",
      "6614b482eedca0a1a5df9bf0",
      "661b551073054244262980ff",
      "6690e358349f682b7dfe0137",
      "66c83f5d3aad3df7ce7e4500",
      "6787698ec375be45b3e3794e",
      "6788c2b9c375be45b3e38714",
      "678a227ec375be45b3e3980e",
      "678dfac0c375be45b3e3c08b",
      "678f44e6c375be45b3e3d819",
      "67909842c375be45b3e3f884",
      "6791e05ec375be45b3e401d7",
      "67974547035ca46302637a97"
    ],
    "65e6e60c9c75b119083c9530": [
      "6616786d0ea790d0f3e7ad3a",
      "661678a20ea790d0f3e7ad5d",
      "661678d20ea790d0f3e7ad77",
      "661678f50ea790d0f3e7ad91",
      "669c98e27a1379a4b26f5b62"
    ],
    "65f15b99a46eccde40b1d966": [
      "6683bd9be33e3fe878d5a67a",
      "6704eeda5f92d448b03abb6b",
      "6704ef7b5f92d448b03abbbf"
    ],
    "65e06baa3e4ce03cdb92f18e": [
      "669a28e8772df389cfe3bb97",
      "66ab8f7c4c0251c8aa50c964",
      "66ab92e54c0251c8aa50c9b9"
    ],
    "65eac3286a599653eac38d62": [
      "66e80616c4748f2ca7b91946"
    ]
  };
  
 export  function findHUb(id, hubData=hubInfo) {
    let node = null;
    for (const hub in hubData) {
      node = hubData[hub].find((data) => data === id);
      if (node) {
        console.log(hub);
        return hub;
      }
    }
    if (!node) {
      console.log("No match found");
    }
    return null
  }
  
//    findHUb("66ab8f7c4c0251c8aa50c964", hubInfo);
  
  export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const toRadians = (deg) => (deg * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
  
  export function findNearestLocation(stateName, latitude, longitude, data=locationsByState) {
    const stateLocations = data[stateName];
    if (!stateLocations) {
      console.error(`State "${stateName}" not found.`);
      return null;
    }
  
    let nearestId = null;
    let minDistance = Number.MAX_VALUE;
  
    for (const mongoId in stateLocations) {
      const [lat, lon] = stateLocations[mongoId];
      const distance = haversineDistance(latitude, longitude, lat, lon);
      if (distance < minDistance) {
        minDistance = distance;
        nearestId = mongoId;
      }
    }
  
    if (minDistance < 12) {
      return nearestId;
    } else {
      console.log(`No location within 10km. Nearest is ${minDistance.toFixed(2)} km away.`);
      return null;
    }
  }
  
  
  const state = "Meghalaya";
  const refLatitude = 25.594661;
  const refLongitude = 90.066452;
  const nearestMongoId = findNearestLocation(state, refLatitude, refLongitude, locationsByState);
  
  console.log("Nearest MongoDB ID:", nearestMongoId);