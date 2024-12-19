import { GoogleGenerativeAI } from "@google/generative-ai";


const apiKey = process.env.GOOGLE_GEMINI_API_KEY as string; // your api key

declare global {
  // eslint-disable-next-line no-var
  var _genAi: Promise<GoogleGenerativeAI>;
}

class GoogleGenAiSingleton {
  private static _instance: GoogleGenAiSingleton;
  private client: GoogleGenerativeAI;
  
  private constructor() {
    this.client = new GoogleGenerativeAI(apiKey);
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new GoogleGenAiSingleton();
    }
    return this._instance.client;
  }
}
const genAiInstance = GoogleGenAiSingleton.instance;

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default genAiInstance;
