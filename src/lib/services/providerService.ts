"use server";

const SIMULATED_DELAY = 1500; // 1.5 seconds

export async function getProviders() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

  return [
    { id: 1, name: "Test Bank" },
    { id: 2, name: "Still Test Bank" },
    { id: 3, name: "Test Bank 3" },
    { id: 4, name: "Test Bank 4" },
  ];
}
