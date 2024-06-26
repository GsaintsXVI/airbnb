/* eslint-disable react/prop-types */
export default function PlaceImg({place,index=0,className=null}){
    if(!place?.photos?.length){
        return null
    }
    if(!className){
        className="object-cover aspect-square"
    }
    return (
        <img className={className} src={'http://localhost:4000/uploads/' + place.photos[index]} alt={place.title} />
    )
}