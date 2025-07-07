import React, { useState } from "react";
import { BoltIcon } from "../../../icons";

interface LocationData {
    street: string;
    city: string;
}

interface FetchLocationButtonProps {
    onLocationFetched: (location: LocationData) => void;
}

const FetchLocationButton: React.FC<FetchLocationButtonProps> = ({ onLocationFetched }) => {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await response.json();
                    const address = data?.address;

                    //   const city = address?.city || address?.town || address?.village || "";
                    //   const street = [address?.road, address?.neighbourhood].filter(Boolean).join(" ");

                    const city = `${address?.county}, ${address?.state_district}`
                    const street = `${address?.village ? address?.village : ""}, ${address?.postcode}`

                    onLocationFetched({ city, street });
                } catch (error) {
                    console.error("Error fetching location:", error);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation error:", error.message);
                setLoading(false);
            }
        );
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={loading}
            className="text-sm px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
        >
            {/* {loading ? "Fetching..." : "Fetch Location"} */}

            {loading ? (
                <>
                    <span className="hidden md:inline">Fetching...</span>
                    <span className="md:hidden animate-pulse">...</span>
                </>
            ) : (
                <>
                    <BoltIcon className="md:hidden" />
                    <span className="hidden md:inline">Fetch Location</span>
                </>
            )}
        </button>
    );
};

export default FetchLocationButton;