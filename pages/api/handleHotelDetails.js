import CONST from "../../redux-toolkit/consts";

// export const handleHotels = async (req,res) => {
export default async function handleHotelDetails(req, res) {
    const hotelCode = req.body.hotelCode;
    const url = `${CONST.illusionUrl}details`;
    const method = 'POST';
    const hotelDetailsBody = {
        "profile": {
            "password":"Tr!3@sUrEDe@L2023",
            "code":"TreasureDealQR",
            "tokenNumber":"0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
        },
        "SearchCriteria": {
            // "StartDate": formatDate(startDate),
            // "EndDate": formatDate(endDate),
            // "StartDate": 20230520,
            // "EndDate": 20230529,
            "HotelCode": hotelCode,
            // "IncludeRateDetails": "Y"
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