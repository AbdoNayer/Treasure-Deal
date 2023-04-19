import GoogleMapReact from 'google-map-react';
import {MapMarker} from "../MapMarker";
import {useEffect, useState} from "react";

export const Map = ({defaultZoom=11,defaultCenter={lat:25.195730, lng:55.290798},defaultMarkerPosition,setAddressLocation,...props}) => {
    const [markerPosition,setMarkerPosition] = useState({
        lat: (defaultMarkerPosition && defaultMarkerPosition.lat) || null,
        lng: (defaultMarkerPosition && (defaultMarkerPosition.long || defaultMarkerPosition.lng)) || null,
    })

    const handleChange = (e) => {
        const {lat,lng} = e;
        setMarkerPosition({
            lat,
            lng
        })
    }
    useEffect(()=>{
        setAddressLocation(markerPosition);
    },[markerPosition])
    const handleApiLoaded = (map, maps) => {
        console.log(map);
        const Geocoder = new maps.Geocoder();

    };
    return (
        <div  style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "" }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                onClick={e=> handleChange(e)}
                // onClick={e=> console.log(e)}
                onChange={e=> console.log(e)}
                options={{fullscreenControl:false}}
                onGoogleApiLoaded={({map, maps}) => handleApiLoaded(map, maps)}
                yesIWantToUseGoogleMapApiInternals
            >
                {markerPosition.lat!==0 && markerPosition.lng!==0 && <MapMarker lat={markerPosition.lat} lng={markerPosition.lng}/>}
            </GoogleMapReact>
        </div>
    )
}