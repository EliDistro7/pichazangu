import { Loader2 } from "lucide-react";


// components/LoadingSpinner.js
const LoadingSpinner = ({ isVisible }) => (
    isVisible && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <Loader2 className="text-white animate-spin" size={48} />
      </div>
    )
  );
  
  export default LoadingSpinner;