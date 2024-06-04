// Constants

const maxTie = 100, maxRin = 500, maxSli = 500;

let blk35a = {
  yrin: Array(maxRin).fill(0),
  rottu: Array(maxRin).fill(0),
  ies: Array(maxRin).fill(0)
};

let blk35b = {
  pull: Array(maxRin).fill(0),
};

// Define the arrays
let forfix = Array(maxSli).fill(0);
let forfiy = Array(maxSli).fill(0);
let hfix = Array(maxSli).fill(0);
let hfiy = Array(maxSli).fill(0);

let xtie = Array(maxTie).fill(0);
let ytie = Array(maxTie).fill(0);
let tload = Array(maxTie).fill(0);
let inclin = Array(maxTie).fill(0);
let itct = Array(maxTie).fill(0);

// Main function
export function verificascorrimento(
  nrinf: number,
  rinfs: { yrin: number, ies: number, rottu: number, pull: number }[],
  nties: number,
  ties: { xtie: number, ytie: number, tload: number, inclin: number, itct: number }[],
  nconci: number,
  concis: { forfix: number, forfiy: number }[],
  hsconti: number,
  scontis: { hfix: number, hfiy: number }[]
) {
  let pamaxi = -99999;
  let pamax = -99999;
  let fsmin = 99999;
  let kk1 = -1;
  let kk = 1;

  
    if (nrinf > 0) {
      for (let irr = 0; irr < nrinf; irr++) {
        blk35a.yrin[irr] = rinfs[irr].yrin;
        blk35a.ies[irr] = rinfs[irr].ies;
        blk35a.rottu[irr] = rinfs[irr].rottu;
        blk35b.pull[irr] = rinfs[irr].pull;
      }
    }

    if (nties > 0) {
      for (let j = 0; j < nties; j++) {
        xtie[j] = ties[j].xtie;
        ytie[j] = ties[j].ytie;
        tload[j] = ties[j].tload;
        inclin[j] = ties[j].inclin;
        itct[j] = ties[j].itct;
      }
    }

    if (nconci > 0) {
      for (let j = 0; j < nconci; j++) {
        forfix[j] = concis[j].forfix;
        forfiy[j] = concis[j].forfiy;
      }
    }

    if (hsconti > 0) {
      for (let j = 0; j < hsconti; j++) {
        hfix[j] = scontis[j].hfix;
        hfiy[j] = scontis[j].hfiy;
      }
    }

    

  return {
    pamaxi,
    pamax,
    fsmin,
    kk1,
    kk,
    blk35a,
    blk35b
  };
}

interface Reinforcement {
  xrin: number;
  yrin: number;
  ies: number;
  rottu: number;
  pull: number;
}

interface Tie {
  xtie: number;
  ytie: number;
  tload: number;
  inclin: number;
  itct: number;
}

interface Concio {
  dx: number;
  xs: number;
  ys: number;
  w: number;
  pv: number;
  ph: number;
  ubetav: number;
  ubetah: number;
  ualpha: number;
  alfa: number;
  phi: number;
  hg: number;
  htot: number;
  rnorm: number;
  rtan: number;
  tnorm: number;
  ttan: number;
  coe: number;
  beta: number;
  forfix: number;
  forfiy: number;
  hfix: number;
  hfiy: number;
  spinta: number;
  hspi: number;
  tnormt: number;
  ttant: number;
}

function calculateStability(ubetah: number, ph: number, sismx: number, sismy: number, phir: number, pah: number, pav: number, concis: Concio[]): boolean {
  let fresist = 0;
  let fsisx = 0;
  let spw = 0;
  let spwsot = 0;
  let fcarx1 = 0;

  for (const concio of concis) {
      const { dx, xs, w, pv, ubetav, ualpha, alfa, phi, hg, htot, rnorm, rtan, tnorm, ttan, coe, beta, forfix, forfiy, hfix, hfiy, spinta, hspi, tnormt, ttant } = concio;

      const vertot = w + pv + ubetav + tnorm * Math.cos(alfa) - (ualpha * Math.cos(alfa) + coe * Math.sin(alfa) + ttan * Math.sin(alfa)) - w * sismy;
      const frin = Math.sqrt(rnorm ** 2 + rtan ** 2);
      const oritot = frin + ubetah + ph + tnorm * Math.sin(alfa) + coe * Math.cos(alfa) + ttan * Math.cos(alfa) - ualpha * Math.sin(alfa) - w * sismx - spinta;

      let f1 = (vertot - w *   + ubetav + pv + tnorm * Math.cos(alfa) - ttan * Math.sin(alfa) - ualpha) * Math.tan(phir) + coe * dx + ttan * Math.cos(alfa) + tnorm * Math.sin(alfa) + ph + (tnormt * Math.cos(alfa) - ttant * Math.sin(alfa)) * Math.tan(phir) + ttant * Math.cos(alfa) + tnormt * Math.sin(alfa);

      fresist += f1;

      const f2 = w * sismx + spinta - frin;
      fsisx += f2;

      if (alfa >= -0.01) {
        spw += ubetah;
      }
  }

  fresist += pav * Math.tan(phir);

  return fresist >= (pah + fsisx - spw - spwsot);
}

// Example usage
const isStable = calculateStability(10, 53, 88, 1, 0, 11, 1, []);
console.log(isStable);


// Call the function with meaningful parameters
// Number of soil reinforcement inputs
const nrinf = 2; // Example with 2 soil reinforcement inputs

// Soil reinforcement data
const rinfs = [
  { yrin: 10, ies: 1, rottu: 5, pull: 3 }, // 
  // yrin: 10 (depth or location identifier),
  // ies: 1 (whether this reinforcement is effective, 1 for yes, 0 for no),
  // rottu: 5 (rotational resistance or strength value),
  // pull: 3 (pull-out resistance value)
  
  { yrin: 20, ies: 0, rottu: 8, pull: 6 }
  // yrin: 20 (another depth/location),
  // ies: 0 (not effective),
  // rottu: 8 (higher rotational resistance),
  // pull: 6 (higher pull-out resistance)
];

// Number of ties
// const nties = 2; // Example with 2 ties

// // Tie data (elements used to tie back the structure or soil)
// const ties = [
//   { xtie: 5, ytie: 15, tload: 200, inclin: 30, itct: 1 },
//   // xtie: 5 (horizontal position of tie),
//   // ytie: 15 (vertical position of tie),
//   // tload: 200 (tensile load in the tie),
//   // inclin: 30 (inclination angle in degrees),
//   // itct: 1 (identifier or type of tie)

//   { xtie: 10, ytie: 25, tload: 250, inclin: 45, itct: 2 }
//   // xtie: 10 (different horizontal position),
//   // ytie: 25 (different vertical position),
//   // tload: 250 (higher tensile load),
//   // inclin: 45 (different inclination),
//   // itct: 2 (different tie type)
// ];

// // Number of concentrated forces
// const nconci = 2; // Example with 2 concentrated forces

// // Concentrated force data (forces applied at specific points)
// const concis = [
//   { forfix: 300, forfiy: 400 },
//   // forfix: 300 (horizontal component of the force),
//   // forfiy: 400 (vertical component of the force)

//   { forfix: 500, forfiy: 600 }
//   // forfix: 500 (higher horizontal force),
//   // forfiy: 600 (higher vertical force)
// ];

// // Number of surface contours or interfaces
// const hsconti = 2; // Example with 2 surface contours

// // Surface contour data (forces at the soil-structure interface)
// const scontis = [
//   { hfix: 700, hfiy: 800 },
//   // hfix: 700 (horizontal fixity or resistance),
//   // hfiy: 800 (vertical fixity or resistance)

//   { hfix: 900, hfiy: 1000 }
//   // hfix: 900 (higher horizontal resistance),
//   // hfiy: 1000 (higher vertical resistance)
// ];

// // Calling the function with the provided data
// const result = verificascorrimento(
//   nrinf,
//   rinfs,
//   nties,
//   ties,
//   nconci,
//   concis,
//   hsconti,
//   scontis
// );

// console.log(result);
