function calcMinLat(lat, elevation) {
    // Assume top of aurora is at 80 km, and calculating in northern hemisphere
    // lat += 90;
    elevation += 6371;

    // Convert top of aurora oval to cartesian coords
    const Px = elevation * Math.cos(lat*(Math.PI / 180));
    const Py = elevation * Math.sin(lat*(Math.PI / 180));

    // Define center and radius of earth
    const Cx = 0, Cy = 0;
    const r = 6371;

    // Calculate tangent points on earth's surface
    const dx = Px - Cx
    const dy = Py - Cy;
    const dxr = -dy
    const dyr = dx;
    const d = Math.sqrt((dx**2) + (dy**2));

    if (d >= r) {
        const rho = r / d;
        const ad = rho**2;
        const bd = rho * Math.sqrt(1 - (rho**2));

        const T2x = Cx + (ad * dx) - (bd * dxr);
        const T2y = Cy + (ad * dy) - (bd * dyr);

        const min_lat = -((180 / Math.PI) * Math.atan(T2x / T2y)) + 90;

        return [min_lat, T2x, T2y, Px, Py];
    }

    return [];
}

const calculateButton = document.getElementById("calculateButton");
calculateButton.addEventListener("click", () => {
    const latitudeInput = document.getElementById("latitude");
    const latitude = parseFloat(latitudeInput.value);

    const result = calcMinLat(latitude, 80); // Calculate with 80 km elevation
    const bottomLat = result[0].toFixed(1);

    const result2 = calcMinLat(latitude, 400); // Calculate with 400 km elevation
    const topLat = result2[0].toFixed(1);

    document.getElementById("bottomLat").textContent = bottomLat + 'N';
    document.getElementById("topLat").textContent = topLat + 'N';
});
