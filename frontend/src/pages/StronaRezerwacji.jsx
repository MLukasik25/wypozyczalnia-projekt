import { useParams } from "react-router-dom";
import NowaRezerwacja from "../components/klient/NowaRezerwacja";

const StronaRezerwacji = () => {
  const { nrRej } = useParams();

  return (
    <div className="container">
      <NowaRezerwacja preselectedNrRej={nrRej} />
    </div>
  );
};

export default StronaRezerwacji;
