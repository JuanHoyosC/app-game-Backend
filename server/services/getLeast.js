const getLeast = ( dates ) => {
    let menor = dates[0];
    for (let i = 0; i < dates.length; i++) {
        if(dates[i] <= menor) {
            menor = dates[i];
        }
    }
    return menor;
} 

module.exports = { getLeast }