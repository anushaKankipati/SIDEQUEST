import { useState, useEffect } from "react";

const useGoogleMapsLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const scriptId = "google-maps-api";

    // Check if the script is already added
    if (document.getElementById(scriptId)) {
      setIsLoaded(true);
      return;
    }

    // Create a global callback
    (window as any).initGoogleMaps = () => {
      setIsLoaded(true);
    };

    // Load the script
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_MAPS_KEY
    }&libraries=places,maps,marker&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      delete (window as any).initGoogleMaps;
    };
  }, []);

  return isLoaded;
};

export default useGoogleMapsLoader;
