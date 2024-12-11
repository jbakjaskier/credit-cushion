import clientPromise from "./mongodb";




export async function createCustomerInteraction() {
    const client = await clientPromise;
    const customerCollection = client.db("clear-cushion").collection("customers");
    
    





}