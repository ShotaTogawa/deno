import * as log from 'https://deno.land/std/log/mod.ts';
import * as _ from 'https://deno.land/x/lodash@4.17.15-es/lodash.js';

interface Launch {
  flightNumber: number;
  mission: string;
  rocket: string;
  customers: Array<string>
}

// Mapはorder collection
const launches = new Map<number, Launch>();

export const downloadLanuchData =
    async () => {
  log.info('Downloading launch data')
  const response = await fetch('https://api.spacexdata.com/v3/launches', {
    method: 'GET',
  })

  if (!response.ok) {
    log.warning('error happned');
    throw new Error('lanuch data dawnload failed')
  }
  const lanuchData = await response.json();
  for (const launch of lanuchData) {
    const payloads = launch['rocket']['second_stage']['payloads'];
    const customers = _.flatMap(payloads, (payload: any) => {
      return payload['customers'];
    });
    const flightData = {
      flightNumber: launch['flight_number'],
      mission: launch['mission_name'],
      rocket: launch['rocket']['rocket_name'],
      customers
    };

    launches.set(lanuchData.flightNumber, lanuchData);
    log.info(JSON.stringify(flightData))
  }
}

const postRequest =
    async () => {
  const response = await fetch('https://reqres.in/api/users', {
    method: 'POST',
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify({name: 'Elon Musk', job: 'billionaire'})
  })
  const body = await response.json();
  return body;
}

if (import.meta.main) {
  await downloadLanuchData();
  log.info(JSON.stringify(import.meta));
  log.info(`Downloaded data for ${launches.size}`);
}