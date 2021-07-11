/* 

改造countries.geo.json 文件 :

在 properties属性中 加入 

中文名cname，首都capital，主要城市（英文名、中文名、经纬度）

*/

const countiesGeojson = require('./countries.geo.json');
const countriesObj = require('./countries.json');
const countriesTrans = require('./countries-trans.json');
const cities = require('./cities.json');

const fs = require('fs');

let newCountriesGeojson = { "type": "FeatureCollection", "features": [] };

const countriesGeojsonArr = countiesGeojson.features;

const countriesRecords = countriesObj.RECORDS;

for (var i of countriesGeojsonArr) {
  let newI = JSON.parse(JSON.stringify(i));
  const matchCountry = countriesRecords.find(o => o.code == i.id);
  newI.properties = {
    'name_used': i.properties.name,
    ...matchCountry
  };
  const matchCountryTrans = countriesTrans.find(o => o.iso3 == i.id);
  if (matchCountryTrans) {
    const { capital, latitude, longitude, region, subregion, phone_code } = matchCountryTrans;
    newI.properties = {
      capital, latitude, longitude, region, subregion, phone_code,
      cities: cities.RECORDS.filter(x=>x.code_full && x.code_full.startsWith(i.id)),
      ...newI.properties
    }
  }
  newCountriesGeojson.features.push(newI);
}


try {
  fs.writeFileSync('./allCountriesGeojson.json', JSON.stringify(newCountriesGeojson))
} catch (err) {
  console.error(err)
}



