import getOlympicData from "./olympic_data.js";

// ex 1
console.log(participatingCountries());
function participatingCountries() {
  const arr = getOlympicData();
  return arr.map(item => item.Nation);
}

// ex 2
// declaring arr globally to be used by every other function
const arr = getOlympicData();
function mostPopulatedCountries() {
  // b - a returns the population number in reverse, so it takes it from the top
  return arr.sort((a, b) => b.Population - a.Population).slice(0, 5).map(item => item.Nation);
}
console.log(mostPopulatedCountries());

// ex 3
function stillExistandBeginWithA() {
  return arr.filter(item => item.Exists === 'YES' && item.Nation[0] === 'A').map(item => item.Nation)
}
console.log(stillExistandBeginWithA());

// ex 4
function populationSum() {
  return arr.reduce((sum, item) => sum + item.Population, 0);
}
console.log(populationSum());

// ex 5
function earliestAppearance() {
  return arr.sort((a, b) => a.First_App - b.First_App).slice(0, 5).map(item => item.Nation);
}
console.log(earliestAppearance());

// ex 6
function nationAndCode() {
  const newArr = [];

  // for (let i = 0; i < arr.length; i++) {
  //   newArr.push({'nation': arr[i].Nation, 'code': arr[i].Code});
  // }

  arr.map(item => newArr.push({'nation': item.Nation, 'code': item.Code}))
  return newArr;
}
console.log(nationAndCode());

// ex 7
function mostAppearances() {
  return arr.sort((a, b) => b.Apps - a.Apps)[0].Nation;
}
console.log(mostAppearances());

// ex 8
function mostSuccessfulSport() {
  return arr.filter(item => item.MostSuccessfulSport === 'Athletics').map(item => item.Nation);
}
console.log(mostSuccessfulSport());

// ex 8.2 (there are two exercises named ex8 in the requirements sheet :) )
// i assumed smallest country to be population-wise since i did not see any land area attribute or anything related to that
function smallestCountryWithMedalWon() {
  return arr.filter(item => item.Medals > 0).sort((a, b) => a.Population - b.Population)[0].Nation;
}
console.log(smallestCountryWithMedalWon());

// ex 9
function countryPopulationObject() {
  const obj = {};
  arr.map(item => obj[item.Nation] = item.Population);
  return obj;
}
console.log(countryPopulationObject());

// ex 10
function retrieveCountriesByInitial() {
  const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  const obj = {};
  for (let letter of alphabet) {
    const filteredArr = arr.filter(item => item.Nation[0] == letter).map(item => item.Nation);
    arr.map(item => obj[letter] = filteredArr)
  }
  return obj;
}
console.log(retrieveCountriesByInitial());

// ex 11
function randomCountryPopulation() {
  const randomObj = Math.floor(Math.random() * arr.length);
  return { 'nation': arr[randomObj].Nation, 'population': arr[randomObj].Population };
}
console.log(randomCountryPopulation());

// ex 12
function moreWinterMedals() {
  return arr.filter(item => item.Population > 1000000).filter(item => item.W_Medal > item.S_Medal).map(item => item.Nation);
}
console.log(moreWinterMedals());

// ex 13
function moreMedalsThanAverage() {
  const averageMedalsPerCountry = arr.reduce((total, item) => total + item.Medals, 0) / arr.length;
  return arr.filter(item => item.Population < 5000000).filter(item => item.Medals > averageMedalsPerCountry * 0.5).map(item => item.Nation);
}
console.log(moreMedalsThanAverage());

// ex 14
function mostRecentFirstAppearance() {
  return arr.sort((a, b) => b.First_App - a.First_App)[0].Nation;
}
console.log(mostRecentFirstAppearance());

// ex 15
function oldestFirstAppearanceThatStillExists() {
  return arr.filter(item => item.Exists === 'YES').sort((a, b) => a.First_App - b.First_App)[0].Nation;
}
console.log(oldestFirstAppearanceThatStillExists());