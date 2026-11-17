// Wait for an initial reading, then briefly refine its accuracy.
const GOOD_ENOUGH_METERS = 50;
const MAX_WAIT_MS = 15000;
const REFINE_WAIT_MS = 5000;

export const getBestPosition = (
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
) => {
  let best: GeolocationPosition | null = null;
  let finished = false;
  let watchId: number | undefined;
  let refinementTimer: ReturnType<typeof setTimeout> | undefined;
  let deadlineTimer: ReturnType<typeof setTimeout> | undefined;

  const finish = (error?: GeolocationPositionError) => {
    if (finished) return;
    finished = true;
    if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);
    clearTimeout(deadlineTimer);
    clearTimeout(refinementTimer);

    if (best) {
      onSuccess(best);
    } else {
      onError(error ?? {
        code: 3,
        message: "Getting your location took too long. Please try again.",
        PERMISSION_DENIED: 1,
        POSITION_UNAVAILABLE: 2,
        TIMEOUT: 3,
      });
    }
  };

  deadlineTimer = setTimeout(() => finish(), MAX_WAIT_MS);
  watchId = navigator.geolocation.watchPosition(
    (position) => {
      if (finished) return;
      if (!best) {
        refinementTimer = setTimeout(() => finish(), REFINE_WAIT_MS);
      }
      if (!best || position.coords.accuracy < best.coords.accuracy) {
        best = position;
      }
      if (position.coords.accuracy <= GOOD_ENOUGH_METERS) finish();
    },
    (error) => finish(error),
    {
      enableHighAccuracy: true,
      timeout: MAX_WAIT_MS,
      maximumAge: 0,
    }
  );

  // Also clean up if a provider invokes a callback during registration.
  if (finished) navigator.geolocation.clearWatch(watchId);
};
