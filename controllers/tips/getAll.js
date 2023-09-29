const TipsModel = require("../../models/Tips");

const checkQueryParams = (req, limitInt) => {
    if (
        req.query.limit &&
        req.query.latitude &&
        req.query.longitude &&
        req.query.latitudeDelta &&
        req.query.longitudeDelta &&
        !isNaN(limitInt) &&
        limitInt > 0
    ) {
        return true;
    } else {
        return false;
    }
};

const handleQueryParams = (req) => {
    const {
        limit,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
        aboutParam,
    } = req.query;
    const latInt = Number(latitude);
    const halfLatDeltaInt = Number(latitudeDelta) / 2;
    const longInt = Number(longitude);
    const halfLongDeltaInt = Number(longitudeDelta) / 2;
    const limitInt = Number(limit);

    const bottom = latInt - halfLatDeltaInt;
    const top = latInt + halfLatDeltaInt;
    const right = longInt + halfLongDeltaInt;
    const left = longInt - halfLongDeltaInt;

    return {
        aboutParam,
        limitInt,
        top,
        left,
        right,
        bottom,
    };
};

exports.getAll = (req, res) => {
    const { aboutParam, limitInt, top, left, right, bottom } =
        handleQueryParams(req);
    const locationFilter = {
        "location.latitude": { $gte: bottom, $lte: top },
        "location.longitude": { $gte: left, $lte: right },
    };
    console.log("aboutParam:");
    console.log(aboutParam);
    if (checkQueryParams(req, limitInt)) {
        let query = aboutParam
            ? TipsModel.find({ ...locationFilter, about: aboutParam })
            : TipsModel.find(locationFilter);
        query.limit(limitInt).then((tips) => res.status(200).json(tips));
        // .catch(() => res.status(500).json({ message: "Server error" }));
    } else {
        res.status(400).json({
            message: "Problem related with the params of the query",
        });
    }
};
