import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 24, className = "" }) => {
  return (
    <Loader2 
      size={size} 
      className={`animate-spin text-primary ${className}`} 
    />
  );
};

export default Spinner;
