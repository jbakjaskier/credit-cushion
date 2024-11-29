"use server"
import { redirect } from 'next/navigation'


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
  await delay(5000);
  
  const url = formData.get('url')

  if(url?.toString() === `https://validUrl.com`) {
    redirect('/experiences/create-waiver/testExperienceId')
  } else {
    return {
      isValid: false,
      url: url?.toString(),
      errorMessage: `Doesn't seem to be an experience URL`
    };
  }
}



//TODO: Should remove as this is in place to simulate loading
function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}