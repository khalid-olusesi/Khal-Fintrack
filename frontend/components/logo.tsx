import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";

export function MainLogo() {
  return (
    <div className="flex gap-2 items-center">
      <FontAwesomeIcon
        icon={faChartColumn}
        className="text-green-700 w-4 h-4"
      />
      <h1 className="text-[12px] font-medium text-black">Khal-FinTrack</h1>
    </div>
  );
}
