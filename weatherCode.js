export function weatherCode(weatherDescription) {
    let description;

    if (weatherDescription === 0) {
        description = "☀️ Klar himmel"; 
    } else if (weatherDescription >= 1 && weatherDescription <= 3) {
        description = "☁️ Molnig"; 
    } else if (weatherDescription === 45 || weatherDescription === 48) {
        description = "🌫️ Dimma"; 
    } else if (weatherDescription === 51 || weatherDescription === 53 || weatherDescription === 55) {
        description = "🌧️ Duggregn"; 
    } else if (weatherDescription === 61 || weatherDescription === 63 ||weatherDescription === 65) {
        description = "🌧️ Regn"; 
    } else if (weatherDescription === 71 || weatherDescription === 73 || weatherDescription === 75) {
        description = "🌨️ Snö"; 
    } else if (weatherDescription === 95 || weatherDescription === 96 || weatherDescription === 99) {
        description = "🌩️ Blixt och dunder";
    } else {
        return null;
    }

    return description;

}