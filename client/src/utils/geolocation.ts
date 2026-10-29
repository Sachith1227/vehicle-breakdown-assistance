// =====================================================
// BEST-ACCURACY GEOLOCATION
// =====================================================
// The first GPS fix is often coarse (Wi-Fi / IP based).
// Watch the position for a few seconds and keep the most
// accurate reading, stopping early once it is good enough.

const GOOD_ENOUGH_METERS = 50;
const MAX_WAIT_MS = 5000;

export const getBestPosition = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
) => {
  let best: GeolocationPosition | null = null;
  let finished = false;

  const finish = () => {
    if (finished) return;
    finished = true;

    navigator.geolocation.clearWatch(watchId);
    clearTimeout(timer);

    if (best) onSuccess(best);
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (
        !best ||
        position.coords.accuracy < best.coords.accuracy
      ) {
        best = position;
      }

      if (position.coords.accuracy <= GOOD_ENOUGH_METERS) {
        finish();
      }
    },

    (error) => {
      // Keep a reading we already have instead of failing
      if (best) {
        finish();
        return;
      }

      finished = true;
      navigator.geolocation.clearWatch(watchId);
      clearTimeout(timer);
      onError(error);
    },

    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0,
    }
  );

  const timer = setTimeout(finish, MAX_WAIT_MS);
};
