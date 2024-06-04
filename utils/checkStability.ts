interface Concio {
  // Geometric properties of the concio
  dx: number;     // Thickness of the segment
  xs: number;     // x-coordinate of the midpoint of the segment
  ys: number;     // y-coordinate of the midpoint of the segment
  w: number;      // Weight of the segment
  pv: number;     // External pressure forces
  ph: number;     // External pressure forces
  ubetav: number; // Water forces at the top of the segment
  ubetah: number; // Water forces at the base of the segment
  ualpha: number; // Water forces normal to the base of the segment
  alfa: number;   // Angle at the base of the segment
  phi: number;    // Angle at the top of the segment
  hg: number;     // Height of the segment's center of gravity
  htot: number;   // Total height of the segment
  rnorm: number;  // Forces from reinforcements normal to the base of the segment
  rtan: number;   // Forces from reinforcements tangential to the base of the segment
  tnorm: number;  // Normal forces applied to the base of the segment
  ttan: number;   // Tangential forces applied to the base of the segment
  coe: number;    // Cohesion force on the segment
  beta: number;   // Angle at the top of the segment
  forfix: number; // Filtration forces in the x-direction
  forfiy: number; // Filtration forces in the y-direction
  hfix: number;   // Unused
  hfiy: number;   // Unused
  spinta: number; // Water pressure
  hspi: number;   // Water pressure moment
  tnormt: number; // Normal forces applied to the top of the segment
  ttant: number;  // Tangential forces applied to the top of the segment
}

function calculateStability(
  ubetah: number, // Water forces at the base of the segment
  ph: number,     // External pressure forces
  sismx: number,  // Seismic forces in the x-direction
  sismy: number,  // Seismic forces in the y-direction
  phir: number,   // Angle
  pah: number,    // Horizontal forces on the segment
  pav: number,    // Vertical forces on the segment
  concis: Concio[] // Array of concios representing the segments
): boolean {
  // Define variables to track resisting and driving forces
  let fresist = 0;
  let fsisx = 0;
  let spw = 0;
  let spwsot = 0;

  // Iterate over each segment (concio)
  for (const concio of concis) {
      // Destructure properties of the concio
      const { dx, xs, w, pv, ubetav, ualpha, alfa, phi, hg, htot, rnorm, rtan, tnorm, ttan, coe, beta, forfix, forfiy, hfix, hfiy, spinta, hspi, tnormt, ttant } = concio;

      // Calculate total vertical forces acting on the segment
      const vertot = w + pv + ubetav + tnorm * Math.cos(alfa) - (ualpha * Math.cos(alfa) + coe * Math.sin(alfa) + ttan * Math.sin(alfa)) - w * sismy;

      // Calculate radial forces from reinforcements
      const frin = Math.sqrt(rnorm ** 2 + rtan ** 2);

      // Calculate total radial forces acting on the segment
      const oritot = frin + ubetah + ph + tnorm * Math.sin(alfa) + coe * Math.cos(alfa) + ttan * Math.cos(alfa) - ualpha * Math.sin(alfa) - w * sismx - spinta;

      // Calculate stabilizing forces
      let f1 = (vertot - w * sismy + ubetav + pv + tnorm * Math.cos(alfa) - ttan * Math.sin(alfa) - ualpha) * Math.tan(phir) + coe * dx + ttan * Math.cos(alfa) + tnorm * Math.sin(alfa) + ph + (tnormt * Math.cos(alfa) - ttant * Math.sin(alfa)) * Math.tan(phir) + ttant * Math.cos(alfa) + tnormt * Math.sin(alfa);

      // Add the stabilizing force to the total resisting force
      fresist += f1;

      // Calculate destabilizing forces
      const f2 = w * sismx + spinta - frin;

      // Add the destabilizing force to the total seismic force
      fsisx += f2;

      // Add water forces at the base of the segment if the segment is submerged
      if (alfa >= -0.01) {
          spw += ubetah;
      }
  }

  // Add vertical water forces to the total resisting force
  fresist += pav * Math.tan(phir);

  // Check if the total resisting force is greater than or equal to the total driving force
  return fresist >= (pah + fsisx - spw - spwsot);
}

// Example usage
const isStable = calculateStability(0, 0, 0, 0, 0, 0, 0, []);
console.log(isStable);
