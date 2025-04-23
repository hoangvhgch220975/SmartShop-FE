// ProductService.js

export async function getAllProducts() {
    const [devices, packages, combos] = await Promise.all([
      fetch("http://localhost:3333/devices").then(res => res.json()),
      fetch("http://localhost:3333/packages").then(res => res.json()),
      fetch("http://localhost:3333/combos").then(res => res.json()),
    ]);
  
    return [
      ...devices.map(p => ({ ...p, type: 'device' })),
      ...packages.map(p => ({ ...p, type: 'package' })),
      ...combos.map(p => ({ ...p, type: 'combo' }))
    ];
  }