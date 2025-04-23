// ProductService.js

export async function getAllProducts() {
    const [devices, packages, combos] = await Promise.all([
      fetch("https://smartshop-be.onrender.com/devices").then(res => res.json()),
      fetch("https://smartshop-be.onrender.com/packages").then(res => res.json()),
      fetch("https://smartshop-be.onrender.com/combos").then(res => res.json()),
    ]);
  
    return [
      ...devices.map(p => ({ ...p, type: 'device' })),
      ...packages.map(p => ({ ...p, type: 'package' })),
      ...combos.map(p => ({ ...p, type: 'combo' }))
    ];
  }