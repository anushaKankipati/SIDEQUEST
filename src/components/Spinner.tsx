import { Audio } from "react-loader-spinner";


const Spinner = () => {
  return (
    <Audio
      height="80"
      width="80"
      color="#00BF63"
      ariaLabel="loading"
    />
  );
};

export default Spinner;