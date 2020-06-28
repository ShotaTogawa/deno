// standard libraryを指すパス
import {parse} from 'https://deno.land/std/encoding/csv.ts';
import {BufReader} from 'https://deno.land/std/io/bufio.ts';
import {join} from 'https://deno.land/std/path/mod.ts';

// third pairtyはesのversionをimportする
import * as _ from 'https://raw.githubusercontent.com/lodash/lodash/es/lodash.js'

// mod.tsの意味
// convention: just a file name coming from Rust
// natural entry import of deno.

const readFile =
    async () => {
  const path = join('text_files', 'hello.txt');
  const data = await Deno.readTextFile(path);

  console.log(data)
}

const readDirSync =
    async () => {
  for await (const dirEntry of Deno.readDir('/')) {
    console.log(dirEntry.name);
  }
}


interface Planet {
  [key: string]: string|number
}

const loadPlanetsData =
    async () => {
  const path = join('.', 'kepler_exoplanets_nasa.csv');
  const file = await Deno.open(path);
  const bufReader = new BufReader(file);

  const results = await parse(bufReader, {header: true, comment: '#'});

  // we need to make sure we call Deno.close() after every Deno.open().
  Deno.close(file.rid)

  const planets = (results as Array<Planet>).filter(result => {
    const stellarMass = result['koi_smass'];
    const plantaryRadius = result['koi_prad'];
    const stellrRadius = result['koi_srad'];
    return result['koi_disposition'] === 'CONFIRMED' && plantaryRadius > 0.5 &&
        plantaryRadius < 1.5 && stellarMass > 0.78 && stellarMass < 1.04 &&
        stellrRadius > 0.99 && stellrRadius < 1.01;
  })

  return planets.map((result) => {return _.pick(result, [
                       'koi_prod', 'koi_smass', 'koi_srad', 'kepler_name',
                       'koi_count', 'koi_steff'
                     ])})
}

const newEarths =
    await loadPlanetsData();

for (const planet of newEarths) {
  console.log(planet)
}
console.log(`${newEarths.length} habitable planets found!`);