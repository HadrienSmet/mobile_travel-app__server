const TipsModel = require("../../models/Tips");

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

    const locationFilter = {
        "location.latitude": { $gte: bottom, $lte: top },
        "location.longitude": { $gte: left, $lte: right },
    };

    return {
        aboutParam,
        limitInt,
        locationFilter,
    };
};

const checkQueryParams = (req) => {
    const { limit, latitude, longitude, latitudeDelta, longitudeDelta } =
        req.query;
    if (
        limit &&
        latitude &&
        longitude &&
        latitudeDelta &&
        longitudeDelta &&
        !isNaN(Number(limit)) &&
        Number(limit) > 0
    ) {
        return true;
    } else {
        return false;
    }
};

exports.getAll = (req, res) => {
    if (checkQueryParams(req)) {
        const { aboutParam, limitInt, locationFilter } = handleQueryParams(req);
        const queryFilter = aboutParam
            ? { ...locationFilter, about: aboutParam }
            : locationFilter;
        TipsModel.find(queryFilter)
            .limit(limitInt)
            .then((tips) => res.status(200).json(tips));
    } else {
        res.status(400).json({
            message: "Bad request - query params required",
        });
    }
};
