/**
 * http://en.wikipedia.org/wiki/Great-circle_distance 
 */
function degreeToMeter(p1, p2)
{
	var lat1 = toRad(p1.lat);
	var lng1 = toRad(p1.lng);
	var lat2 = toRad(p2.lat);
	var lng2 = toRad(p2.lng);
	
	return 6371000 * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(Math.abs(lng2-lng1)));
};

/**
 * Rad to Degree 
 * @param {Object} angle
 */
function toDegree(angle)
{
	return angle * (180/Math.PI);
};

/**
 * Degree to Rad 
 * @param {Object} angle
 */
function toRad(angle)
{
	return angle * (Math.PI/180);
};