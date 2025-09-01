import { Helmet } from "@dr.pogodin/react-helmet";
import { AlertCircle } from "lucide-react";

function NotFound() {
  return (
    <>
        <Helmet>
          <title>Page Not Found - MyChat</title>
        </Helmet>
        <div className="h-140 w-90 flex items-center justify-center bg-background rounded-2xl transition-colors duration-3000 shadow-lg ">
          <div className="max-w-md w-full space-y-8 p-8">
            <div className="text-center">
              <AlertCircle className="mx-auto h-16 w-16 text-red-500" />
              <h2 className="mt-4 text-3xl font-bold text-black/90">Page Not Found</h2>
              <p className="mt-2 text-gray-600">The page you are looking for does not exist.</p>
            </div>
          </div>
        </div>
      </>
  );
}

export default NotFound;
