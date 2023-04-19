export const MapMarker = ({lng,lat,...props}) => {
    return (
        <div className={'td_map_marker d-flex align-items-center justify-content-center'}>
            {lat && lng &&<span className={'icon-map-pin'}/>}
        </div>
    )
}