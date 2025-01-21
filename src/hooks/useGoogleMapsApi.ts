import { useState, useEffect } from "react";

interface UseGoogleMapsApiProps {
  library: string;
}

const useGoogleMapsApi = ({ library }: UseGoogleMapsApiProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scriptId = "google-maps-api";
    if (document.getElementById(scriptId)) {
      setLoading(false);
      return;
    }

    // Create a global callback function
    (window as any).initGoogleMapsApi = () => {
      setLoading(false);
    };

    // Create a script tag to load the Google Maps API
    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      process.env.NEXT_PUBLIC_MAPS_KEY as string
    }&libraries=${library}&callback=initGoogleMapsApi`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup the global callback and remove the script
      delete (window as any).initGoogleMapsApi;
      document.head.removeChild(script);
    };
  }, [library]);

  return [loading];
};

export default useGoogleMapsApi;
