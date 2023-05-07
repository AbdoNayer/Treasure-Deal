import GoogleMapReact from 'google-map-react';
import {MapMarker} from "../MapMarker";
import {useEffect, useState} from "react";
import {googleMapsApi} from "../../redux-toolkit/consts";

export const Map = ({defaultZoom=11,defaultCenter={lat:25.195730, lng:55.290798},defaultMarkerPosition,setAddressLocation,...props}) => {
    const [markerPosition,setMarkerPosition] = useState({
        lat: (defaultMarkerPosition && defaultMarkerPosition.lat) || null,
        lng: (defaultMarkerPosition && (defaultMarkerPosition.long || defaultMarkerPosition.lng)) || null,
    })

    const handleChange = (e) => {
        console.log(e);
        const {lat,lng} = e;
        setMarkerPosition({
            lat,
            lng
        })
    }
    useEffect(()=>{
        setAddressLocation(markerPosition);
    },[markerPosition])
    const handleApiLoaded = ({map,maps}) => {
        console.log('map', map);
        console.log('maps', maps);
        const Geocoder = new maps.Geocoder();
        console.log('geo', Geocoder)

    };
    return (
        <div  style={{ height: '100%', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: googleMapsApi }}
                defaultCenter={defaultCenter}
                defaultZoom={defaultZoom}
                onClick={e=> handleChange(e)}
                // onClick={e=> console.log(e)}
                // onChange={e=> console.log(e)}
                options={{fullscreenControl:false}}
                onGoogleApiLoaded={handleApiLoaded}
                yesIWantToUseGoogleMapApiInternals
            >
                {markerPosition.lat!==0 && markerPosition.lng!==0 && <MapMarker lat={markerPosition.lat} lng={markerPosition.lng}/>}
            </GoogleMapReact>
        </div>
    )
}