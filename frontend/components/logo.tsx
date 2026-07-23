import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export function MainLogo() {
  return (
    <div className="">
      <Link className="flex gap-2 items-center cursor-pointer" href="/">
        <FontAwesomeIcon
          icon={faChartColumn}
          className="text-green-700 w-5 h-5"
        />
        <h1 className="text-[14px] font-medium text-black">Khal-FinTrack</h1>
      </Link>
    </div>
  );
}
