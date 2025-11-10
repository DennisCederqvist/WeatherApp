export async function weatherCode() {
    let weatherDesciption = 0;
    let description;

    if (weatherDesciption === 0) {
        description = "☀️ Klar himmel"; 
    } else if (weatherDesciption >= 1 && weatherDesciption <= 3) {
        description = "☁️ Molnig"; 
    } else if (weatherDesciption === 45 || weatherDesciption === 48) {
        description = "🌫️ Dimma"; 
    } else if (weatherDesciption === 51 || weatherDesciption === 53 || weatherDesciption === 55) {
        description = "🌧️ Duggregn"; 
    } else if (weatherDesciption === 61 || weatherDesciption === 63 ||weatherDesciption === 65) {
        description = "🌧️ Regn"; 
    } else if (weatherDesciption === 71 || weatherDesciption === 73 || weatherDesciption === 75) {
        description = "🌨️ Snö"; 
    } else if (weatherDesciption === 95 || weatherDesciption === 96 || weatherDesciption === 99) {
        description = "🌩️ Blixt och dunder";
    } else {
        return null;
    }

    return "weatherCode()"

}