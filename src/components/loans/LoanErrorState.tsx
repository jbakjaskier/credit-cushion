import { DbFetcherError } from "@/lib/db/models/loans";




export default function LoanErrorState({errorMessage} : DbFetcherError) {
    return (
        <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="mx-auto h-12 w-12 text-gray-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-semibold text-gray-900">
          {`Oops! An Error`}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
            {errorMessage}
        </p>
      </div>
    )
}