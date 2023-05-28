import GoogleMapReact from 'google-map-react';
import {MapMarker} from "../MapMarker";
import {useEffect, useState} from "react";
import {googleMapsApi} from "../../redux-toolkit/consts";
import Geocode from "react-geocode";

export const Map = ({defaultZoom=11,defaultCenter={lat:25.195730, lng:55.290798},defaultMarkerPosition,setAddressLocation,setMapDescription,...props}) => {
    const [markerPosition,setMarkerPosition] = useState({
        lat: (defaultMarkerPosition && defaultMarkerPosition.lat) || null,
        lng: (defaultMarkerPosition && (defaultMarkerPosition.long || defaultMarkerPosition.lng)) || null,
    })
    Geocode.setApiKey(googleMapsApi);

    const handleChange = (e) => {
        const {lat,lng} = e;
        setMarkerPosition({
            lat,
            lng
        })
    }
    useEffect(()=>{
        if (markerPosition.lat) {
            Geocode.fromLatLng(markerPosition.lat, markerPosition.lng).then(
                (response) => {
                    const address = response.results[0].formatted_address;
                    setMapDescription(address);
                },
            );
        }
        setAddressLocation(markerPosition);
    },[markerPosition])
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
            >
                {markerPosition.lat!==0 && markerPosition.lng!==0 && <MapMarker lat={markerPosition.lat} lng={markerPosition.lng}/>}
            </GoogleMapReact>
        </div>
    )
}