import CONST from "../../redux-toolkit/consts";

// export const handleHotels = async (req,res) => {
export default async function handleHotelSearchDetails(req, res) {
    const hotelCode = req.body.hotelCode;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const nationality = req.body.nationality;
    const roomConfiguration = req.body.roomConfiguration;
    const url = `${CONST.illusionUrlWithHotels}search`;
    const method = 'POST';
    const hotelDetailsBody = {
        "profile": {
            "password":"Tr!3@sUrEDe@L2023",
            "code":"TreasureDealQR",
            "tokenNumber":"0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
        },
        "SearchCriteria": {
            "HotelCode": hotelCode,
            "StartDate": startDate,
            "EndDate": endDate,
            "Nationality" : nationality,
            "IncludeOnRequest":"N",
            "GroupByRooms": "Y",
            "RoomConfiguration": {
                "Room": [
                    {
                        "Adult":[
                            {"Age":25}
                        ],
                        "Child":[]
                    }
                ]
            }
        }
    }
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelDetailsBody),
    }

    try {
        const response = await fetch(url,options);
        const data = await response.json();

        return res.end(JSON.stringify(data))
    } catch (e) {
        console.log(e);
        return res.end(JSON.stringify(e.message))
    }
}