"use server"

type UrlValidationResult = {
    isValid: true;
  }
| {
    isValid: false;
    url: string | undefined;
    errorMessage: string;
  }


//TODO: This URL must be validated with an external service 
// or Rezdy, Fareharbour APIs before proceeding to the next stage
export async function validateUrl(prevState: UrlValidationResult, formData: FormData): Promise<UrlValidationResult> {
  console.info("Validating URL")
  await delay(5000);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const url = formData.get('url')
  return {
    isValid: false,
    url: url?.toString(),
    errorMessage: `Doesn't seem to be an experience URL`
  };
}



//TODO: Should remove as this is in place to simulate loading
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}