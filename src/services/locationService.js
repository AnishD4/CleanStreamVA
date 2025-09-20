// Location service for geolocation and proximity calculations
export class LocationService {
  constructor() {
    this.userLocation = null;
    this.watchId = null;
  }

  // Get user's current location
  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
          resolve(this.userLocation);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }

  // Watch user's location for changes
  watchLocation(callback) {
    if (!navigator.geolocation) {
      throw new Error('Geolocation is not supported by this browser');
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        callback(this.userLocation);
      },
      (error) => {
        console.error('Location watch error:', error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // 1 minute
      }
    );
  }

  // Stop watching location
  stopWatching() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Calculate distance between two points in miles
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }

  // Find nearby water bodies within specified radius (in miles)
  findNearbyWaterBodies(waterBodies, userLat, userLng, radiusMiles = 10) {
    return waterBodies
      .map(waterBody => ({
        ...waterBody,
        distance: this.calculateDistance(userLat, userLng, waterBody.coords[0], waterBody.coords[1])
      }))
      .filter(waterBody => waterBody.distance <= radiusMiles)
      .sort((a, b) => a.distance - b.distance);
  }

  // Get activity recommendations based on water status
  getActivityRecommendations(status) {
    const recommendations = {
      safe: {
        swimming: { allowed: true, message: "Swimming is safe and recommended" },
        boating: { allowed: true, message: "Boating is safe" },
        fishing: { allowed: true, message: "Fishing is safe" },
        kayaking: { allowed: true, message: "Kayaking and paddling are safe" },
        wading: { allowed: true, message: "Wading is safe" }
      },
      caution: {
        swimming: { allowed: false, message: "Swimming not recommended - monitor conditions" },
        boating: { allowed: true, message: "Boating is generally safe" },
        fishing: { allowed: true, message: "Fishing is safe" },
        kayaking: { allowed: true, message: "Kayaking is safe" },
        wading: { allowed: false, message: "Avoid wading - conditions may be unsafe" }
      },
      warning: {
        swimming: { allowed: false, message: "Swimming is not recommended" },
        boating: { allowed: true, message: "Boating is safe but avoid contact with water" },
        fishing: { allowed: true, message: "Fishing is safe but avoid contact with water" },
        kayaking: { allowed: false, message: "Kayaking not recommended" },
        wading: { allowed: false, message: "Wading is not recommended" }
      },
      unsafe: {
        swimming: { allowed: false, message: "Swimming is prohibited" },
        boating: { allowed: false, message: "Boating is not recommended" },
        fishing: { allowed: false, message: "Fishing is not recommended" },
        kayaking: { allowed: false, message: "Kayaking is prohibited" },
        wading: { allowed: false, message: "Wading is prohibited" }
      }
    };

    return recommendations[status] || recommendations.safe;
  }

  // Get safety tips based on water status
  getSafetyTips(status) {
    const tips = {
      safe: [
        "Always swim with a buddy",
        "Check weather conditions before going out",
        "Wear appropriate safety gear"
      ],
      caution: [
        "Avoid contact with water if possible",
        "Monitor conditions closely",
        "Consider postponing water activities"
      ],
      warning: [
        "Avoid all water contact",
        "Keep pets away from water",
        "Do not drink or use water for cooking"
      ],
      unsafe: [
        "Stay away from water completely",
        "Do not allow children or pets near water",
        "Contact local authorities if you see people in water"
      ]
    };

    return tips[status] || tips.safe;
  }
}

export const locationService = new LocationService();
