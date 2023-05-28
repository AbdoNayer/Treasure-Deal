import CONST from "../../redux-toolkit/consts";

// export const handleHotels = async (req,res) => {
export default async function handleHotels(req, res) {
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize;
    const countryCode = req.body.countryCode;
    const url = `${CONST.illusionUrl}hotellist?pageNumber=${pageNumber}&pageSize=${pageSize}&countryCode=${countryCode}`;
    const method = 'POST';
    const hotelsBody = {
        "profile": {
            "password":"Tr!3@sUrEDe@L2023",
            "code":"TreasureDealQR",
            "tokenNumber":"0ccd04b3-3bf2-4680-a64e-6a894316a1d2"
        }
    }
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(hotelsBody),
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